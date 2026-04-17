import { useTranslation } from 'react-i18next';

/**
 * Hook para gestionar el idioma de la aplicación.
 * Wrapper sobre react-i18next que expone una API simple.
 *
 * Uso:
 *   const { language, toggleLanguage, isSpanish } = useLanguage();
 */
export const useLanguage = () => {
  const { i18n } = useTranslation();

  const language = i18n.language?.startsWith('es') ? 'es' : 'en';
  const isSpanish = language === 'es';

  const setLanguage = (lang: 'es' | 'en') => {
    void i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const toggleLanguage = () => {
    setLanguage(isSpanish ? 'en' : 'es');
  };

  return {
    language,
    isSpanish,
    setLanguage,
    toggleLanguage,
  };
};
