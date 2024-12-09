import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fr } from '@/locales/fr';
import { en } from '@/locales/en';

type Language = 'fr' | 'en';

interface LanguageState {
  currentLanguage: Language;
  translations: typeof fr;
  setLanguage: (language: Language) => void;
  setInitialLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: 'fr',
      translations: fr,
      setLanguage: (language) => {
        const translations = language === 'fr' ? fr : en;
        document.documentElement.lang = language;
        set({ currentLanguage: language, translations });
      },
      setInitialLanguage: () => {
        const browserLanguage = navigator.language.startsWith('fr') ? 'fr' : 'en';
        const translations = browserLanguage === 'fr' ? fr : en;
        document.documentElement.lang = browserLanguage;
        set({ currentLanguage: browserLanguage, translations });
      },
    }),
    {
      name: 'language-storage',
    }
  )
);