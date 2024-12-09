import React from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Service } from '@/types/business';
import BookingCalendar from './BookingCalendar';
import Button from '../ui/Button';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/hooks/useTranslation';

const bookingSchema = z.object({
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Invalid email'),
});

type BookingForm = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  businessId: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  service,
  businessId,
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { createBooking, selectedDate, selectedTime } = useBookingStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: user?.name || '',
      customerEmail: user?.email || '',
    },
  });

  const handleDateTimeSelect = (date: string, time: string) => {
    // Cette fonction est appelée quand l'utilisateur sélectionne une date et une heure
    console.log('Selected date and time:', date, time);
  };

  const onSubmit = async (data: BookingForm) => {
    if (!selectedDate || !selectedTime || !user) return;

    try {
      await createBooking({
        businessId,
        userId: user.id,
        serviceId: service.id,
        service,
        date: selectedDate,
        time: selectedTime,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
      });
      onClose();
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t.booking.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <BookingCalendar
            businessId={businessId}
            selectedService={service}
            onSelectDateTime={handleDateTimeSelect}
          />

          {selectedDate && selectedTime && (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t.booking.name}
                </label>
                <input
                  type="text"
                  {...register('customerName')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t.booking.email}
                </label>
                <input
                  type="email"
                  {...register('customerEmail')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.customerEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerEmail.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t.booking.processing : t.booking.confirm}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;