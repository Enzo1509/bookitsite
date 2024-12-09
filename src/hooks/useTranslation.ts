import { useLanguageStore } from '@/store/languageStore';

export function useTranslation() {
  const { translations: t, currentLanguage } = useLanguageStore();
  
  return {
    t,
    currentLanguage,
  };
}