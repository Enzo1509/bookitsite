import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addDays, isAfter } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Service } from '@/types/business';
import { useBookingStore } from '@/store/bookingStore';
import { useTranslation } from '@/hooks/useTranslation';

interface BookingCalendarProps {
  businessId: string;
  selectedService: Service;
  onSelectDateTime: (date: string, time: string) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  businessId,
  selectedService,
  onSelectDateTime,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { t, currentLanguage } = useTranslation();
  const {
    selectedDate,
    selectedTime,
    setSelectedDate,
    setSelectedTime,
    getAvailableSlots,
  } = useBookingStore();

  const dateLocale = currentLanguage === 'fr' ? fr : enUS;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDay = monthStart.getDay();
  const previousDays = Array.from({ length: startDay === 0 ? 6 : startDay - 1 }, (_, i) =>
    addDays(monthStart, -(i + 1))
  ).reverse();

  const endDay = monthEnd.getDay();
  const nextDays = Array.from({ length: endDay === 0 ? 0 : 7 - endDay }, (_, i) =>
    addDays(monthEnd, i + 1)
  );

  const allDays = [...previousDays, ...daysInMonth, ...nextDays];
  const today = new Date();

  const handleDateSelect = (date: Date) => {
    if (isAfter(date, today) || isSameDay(date, today)) {
      setSelectedDate(format(date, 'yyyy-MM-dd'));
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSelectDateTime(selectedDate, time);
    }
  };

  const timeSlots = selectedDate
    ? getAvailableSlots(selectedDate, businessId)
    : [];

  const weekDays = currentLanguage === 'fr' 
    ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-white rounded-xl">
      {selectedService && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <h3 className="font-medium text-lg mb-2">{selectedService.name}</h3>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{selectedService.duration} {t.common.duration}</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-medium">
            {format(currentDate, 'MMMM yyyy', { locale: dateLocale })}
          </h3>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
          {allDays.map((date, index) => {
            const isSelected = selectedDate === format(date, 'yyyy-MM-dd');
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isPast = date < today && !isSameDay(date, today);
            const isCurrentDay = isToday(date);

            return (
              <button
                key={index}
                onClick={() => !isPast && handleDateSelect(date)}
                disabled={isPast}
                className={cn(
                  'relative h-12 rounded-lg transition-all duration-200',
                  {
                    'bg-blue-600 text-white shadow-lg scale-105': isSelected,
                    'hover:bg-gray-100': !isSelected && !isPast && isCurrentMonth,
                    'text-gray-400': !isCurrentMonth || isPast,
                    'cursor-not-allowed opacity-50': isPast,
                    'ring-2 ring-blue-200': isCurrentDay && !isSelected,
                  }
                )}
              >
                <span className={cn(
                  'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
                  {
                    'font-bold': isCurrentDay || isSelected,
                  }
                )}>
                  {format(date, 'd')}
                </span>
                {isCurrentDay && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            {t.business.availableSlots} {format(new Date(selectedDate), 'dd MMMM yyyy', { locale: dateLocale })}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                disabled={!slot.available}
                onClick={() => handleTimeSelect(slot.time)}
                className={cn(
                  'py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200',
                  slot.available
                    ? selectedTime === slot.time
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-gray-100 hover:bg-gray-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;