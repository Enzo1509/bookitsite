import { openDB } from 'idb';
import type { Business } from '@/types/business';
import type { User } from '@/types/auth';
import type { Booking, TimeSlot } from '@/types/booking';
import { initialBusinesses } from './initialData';
import { initialUsers } from './auth';

const DB_NAME = 'book-it-db';
const DB_VERSION = 1;

let dbInstance: any = null;

export async function initDB() {
  if (dbInstance) return dbInstance;

  try {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Create stores with indexes if they don't exist
        if (!db.objectStoreNames.contains('users')) {
          const usersStore = db.createObjectStore('users', { keyPath: 'id' });
          usersStore.createIndex('by-email', 'email', { unique: true });
          
          // Add initial users in a transaction
          const userStore = transaction.objectStore('users');
          for (const user of initialUsers) {
            userStore.add(user);
          }
        }

        if (!db.objectStoreNames.contains('businesses')) {
          const businessStore = db.createObjectStore('businesses', { keyPath: 'id' });
          
          // Add initial businesses in a transaction
          const store = transaction.objectStore('businesses');
          for (const business of initialBusinesses) {
            store.add(business);
          }
        }

        if (!db.objectStoreNames.contains('bookings')) {
          db.createObjectStore('bookings', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('favorites')) {
          db.createObjectStore('favorites', { keyPath: ['userId', 'businessId'] });
        }
      },
    });

    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// User operations
export async function createUser(user: User): Promise<User> {
  const db = await initDB();
  await db.add('users', user);
  return user;
}

export async function getAllUsers(): Promise<User[]> {
  const db = await initDB();
  return db.getAll('users');
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const db = await initDB();
  const users = await db.getAllFromIndex('users', 'by-email', email);
  return users[0];
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const db = await initDB();
  const user = await db.get('users', id);
  const updatedUser = { ...user, ...updates };
  await db.put('users', updatedUser);
  return updatedUser;
}

export async function deleteUser(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('users', id);
}

// Business operations
export async function getAllBusinesses(): Promise<Business[]> {
  const db = await initDB();
  return db.getAll('businesses');
}

export async function updateBusiness(id: string, business: Business): Promise<Business> {
  const db = await initDB();
  await db.put('businesses', business);
  return business;
}

export async function deleteBusiness(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('businesses', id);
}

// Booking operations
export async function createBooking(booking: Booking): Promise<void> {
  const db = await initDB();
  await db.add('bookings', booking);
}

export async function getBookingsByBusiness(businessId: string): Promise<Booking[]> {
  const db = await initDB();
  const bookings = await db.getAll('bookings');
  return bookings.filter(b => b.businessId === businessId);
}

export async function getBookingsByUser(userId: string): Promise<Booking[]> {
  const db = await initDB();
  const bookings = await db.getAll('bookings');
  return bookings.filter(b => b.userId === userId);
}

export async function updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled'): Promise<void> {
  const db = await initDB();
  const booking = await db.get('bookings', bookingId);
  if (booking) {
    booking.status = status;
    await db.put('bookings', booking);
  }
}

// Favorites operations
export async function addToFavorites(userId: string, businessId: string): Promise<void> {
  const db = await initDB();
  await db.put('favorites', { userId, businessId });
}

export async function removeFromFavorites(userId: string, businessId: string): Promise<void> {
  const db = await initDB();
  await db.delete('favorites', [userId, businessId]);
}

export async function getFavorites(userId: string): Promise<Business[]> {
  const db = await initDB();
  const favorites = await db.getAll('favorites');
  const userFavorites = favorites.filter(fav => fav.userId === userId);
  const businesses = await getAllBusinesses();
  return businesses.filter(business => 
    userFavorites.some(fav => fav.businessId === business.id)
  );
}

export async function isFavorite(userId: string, businessId: string): Promise<boolean> {
  const db = await initDB();
  const favorite = await db.get('favorites', [userId, businessId]);
  return !!favorite;
}

// Time slot generation
export function generateTimeSlots(date: string, bookings: Booking[]): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 19;

  for (let hour = startHour; hour < endHour; hour++) {
    for (const minutes of ['00', '30']) {
      const time = `${hour}:${minutes}`;
      const isBooked = bookings.some(
        booking => booking.date === date && booking.time === time
      );

      slots.push({
        id: crypto.randomUUID(),
        date,
        time,
        available: !isBooked,
      });
    }
  }

  return slots;
}