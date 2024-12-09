import React, { useEffect, useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, Check, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

const ProfessionalBookingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { bookings, loadBusinessBookings, updateStatus } = useBookingStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { t, currentLanguage } = useTranslation();

  useEffect(() => {
    if (user?.businessId) {
      loadBusinessBookings(user.businessId);
    }
  }, [user?.businessId, loadBusinessBookings]);

  const dateLocale = currentLanguage === 'fr' ? fr : enUS;
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDay = monthStart.getDay();
  const previousDays = Array.from({ length: startDay === 0 ? 6 : startDay - 1 }, (_, i) =>
    new Date(monthStart.getTime() - (i + 1) * 24 * 60 * 60 * 1000)
  ).reverse();

  const endDay = monthEnd.getDay();
  const nextDays = Array.from({ length: endDay === 0 ? 0 : 7 - endDay }, (_, i) =>
    new Date(monthEnd.getTime() + (i + 1) * 24 * 60 * 60 * 1000)
  );

  const allDays = [...previousDays, ...daysInMonth, ...nextDays];
  const weekDays = currentLanguage === 'fr' 
    ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const filteredBookings = bookings
    .filter(booking => booking.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleStatusUpdate = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateStatus(bookingId, status);
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.filter(booking => booking.date === dateStr);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">{t.professional.bookings.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
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
            </div>

            <div className="p-6">
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500 mb-2"
                  >
                    {day}
                  </div>
                ))}
                {allDays.map((date, index) => {
                  const isSelected = selectedDate === format(date, 'yyyy-MM-dd');
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  const isCurrentDay = isToday(date);
                  const dayBookings = getBookingsForDate(date);
                  const hasBookings = dayBookings.length > 0;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(format(date, 'yyyy-MM-dd'))}
                      className={cn(
                        'relative h-12 rounded-lg transition-all duration-200',
                        {
                          'bg-blue-600 text-white shadow-md': isSelected,
                          'hover:bg-gray-100': !isSelected && isCurrentMonth,
                          'text-gray-400': !isCurrentMonth,
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
                      {hasBookings && !isSelected && (
                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="sticky top-0 z-10 bg-white border-b p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <h3 className="font-medium">
                  {format(new Date(selectedDate), 'EEEE d MMMM yyyy', { locale: dateLocale })}
                </h3>
              </div>
            </div>

            <div className="divide-y">
              {filteredBookings.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  {t.professional.bookings.noBookings}
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-medium">{booking.time}</span>
                        <span className="text-gray-500">•</span>
                        <span className="font-medium">{booking.customerName}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {booking.service.name} - {booking.service.duration} {t.common.duration}
                        <span className="mx-2">•</span>
                        {formatPrice(booking.service.price)}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {booking.customerEmail}
                      </div>
                    </div>

                    {booking.status === 'pending' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          title={t.common.confirm}
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title={t.common.cancel}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    )}

                    {booking.status === 'confirmed' && (
                      <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                        {t.professional.bookings.status.confirmed}
                      </span>
                    )}

                    {booking.status === 'cancelled' && (
                      <span className="px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">
                        {t.professional.bookings.status.cancelled}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalBookingsPage;