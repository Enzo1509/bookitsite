import { initDB } from './db';
import { useAuthStore } from '@/store/authStore';
import { useBusinessStore } from '@/store/businessStore';
import { useLanguageStore } from '@/store/languageStore';

let isInitialized = false;

export async function initializeSystem() {
  if (isInitialized) return;

  try {
    // Initialize database first
    await initDB();

    // Initialize stores in sequence
    const authStore = useAuthStore.getState();
    const businessStore = useBusinessStore.getState();
    const languageStore = useLanguageStore.getState();

    await Promise.all([
      authStore.loadUsers(),
      businessStore.loadBusinesses(),
    ]);

    // Set initial language
    languageStore.setInitialLanguage();

    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize system:', error);
    throw error;
  }
}

export function isSystemInitialized(): boolean {
  return isInitialized;
}