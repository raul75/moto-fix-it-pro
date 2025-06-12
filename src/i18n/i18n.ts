
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language files
import translationES from './locales/es.json';
import translationEN from './locales/en.json';
import translationIT from './locales/it.json';

// the translations
const resources = {
  es: {
    translation: translationES
  },
  en: {
    translation: translationEN
  },
  it: {
    translation: translationIT
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'it', // Italian as default language
    debug: false,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;
