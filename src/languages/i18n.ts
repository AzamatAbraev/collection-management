import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "../locales/en/translation.json";
import uzTranslations from "../locales/uz/translation.json";
import ruTranslations from "../locales/ru/translation.json";

const storedLanguage = localStorage.getItem("LANGUAGE") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations,
    },
    uz: {
      translation: uzTranslations,
    },
    ru: {
      translation: ruTranslations,
    },
  },
  lng: storedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
