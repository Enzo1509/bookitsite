import type { User } from '@/types/auth';

const AUTH_STORAGE_KEY = 'auth-storage';

export function saveToStorage(data: { users: User[]; currentUser: User | null }) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save auth data:', error);
  }
}

export function loadFromStorage(): { users: User[]; currentUser: User | null } | null {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load auth data:', error);
    return null;
  }
}

export function clearStorage() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear auth data:', error);
  }
}