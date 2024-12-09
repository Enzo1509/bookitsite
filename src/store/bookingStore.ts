import { create } from 'zustand';
import type { Booking, TimeSlot } from '@/types/booking';
import * as db from '@/lib/db';

interface BookingState {
  bookings: Booking[];
  selectedDate: string | null;
  selectedTime: string | null;
  loadBusinessBookings: (businessId: string) => Promise<void>;
  loadUserBookings: (userId: string) => Promise<void>;
  createBooking: (booking: Omit<Booking, 'id' | 'status'>) => Promise<void>;
  updateStatus: (bookingId: string, status: 'confirmed' | 'cancelled') => Promise<void>;
  getAvailableSlots: (date: string, businessId: string) => TimeSlot[];
  setSelectedDate: (date: string | null) => void;
  setSelectedTime: (time: string | null) => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  selectedDate: null,
  selectedTime: null,

  loadBusinessBookings: async (businessId: string) => {
    try {
      const bookings = await db.getBookingsByBusiness(businessId);
      set({ bookings });
    } catch (error) {
      console.error('Failed to load bookings:', error);
      throw error;
    }
  },

  loadUserBookings: async (userId: string) => {
    try {
      const bookings = await db.getBookingsByUser(userId);
      set({ bookings });
    } catch (error) {
      console.error('Failed to load bookings:', error);
      throw error;
    }
  },

  createBooking: async (bookingData) => {
    try {
      const booking: Booking = {
        ...bookingData,
        id: crypto.randomUUID(),
        status: 'pending',
      };
      
      await db.createBooking(booking);
      
      set(state => ({
        bookings: [...state.bookings, booking],
        selectedDate: null,
        selectedTime: null,
      }));
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  },

  updateStatus: async (bookingId: string, status) => {
    try {
      await db.updateBookingStatus(bookingId, status);
      set(state => ({
        bookings: state.bookings.map(b =>
          b.id === bookingId ? { ...b, status } : b
        ),
      }));
    } catch (error) {
      console.error('Failed to update booking status:', error);
      throw error;
    }
  },

  getAvailableSlots: (date: string, businessId: string) => {
    const { bookings } = get();
    const businessBookings = bookings.filter(b => 
      b.businessId === businessId && 
      b.status !== 'cancelled'
    );
    return db.generateTimeSlots(date, businessBookings);
  },

  setSelectedDate: (date) => set({ selectedDate: date, selectedTime: null }),
  setSelectedTime: (time) => set({ selectedTime: time }),
}));