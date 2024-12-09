import type { Service } from './business';

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

export interface Booking {
  id: string;
  businessId: string;
  userId: string;
  serviceId: string;
  service: Service;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  customerName: string;
  customerEmail: string;
}