// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";

// import en from "./locales/en.json";
// import hi from "./locales/hi.json"; // Example: Hindi

// i18n
//   .use(LanguageDetector) // Detect language from browser or localStorage
//   .use(initReactI18next)
//   .init({
//     resources: {
//       en: { translation: en },
//       hi: { translation: hi },
//     },


//     fallbackLng: "en", // Default language
//     interpolation: {
//       escapeValue: false,
//     },
//   });

// export default i18n;


// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./utils/translations/en.json";
import hi from "./utils/translations/hi.json";
import ar from "./utils/translations/ar.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ar: { translation: ar },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
