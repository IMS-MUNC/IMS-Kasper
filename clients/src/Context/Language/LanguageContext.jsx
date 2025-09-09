// src/context/LanguageContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

const defaultLang = localStorage.getItem("language") || "en";

const translations = {
    en: {
        welcome: "Welcome",
        language: "Language",
        english: "English",
        hindi: "Hindi",
    },
    hi: {
        welcome: "स्वागत है",
        language: "भाषा",
        english: "अंग्रेज़ी",
        hindi: "हिंदी",
    },
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(defaultLang);

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    const switchLanguage = (lang) => {
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider
            value={{ language, switchLanguage, t: translations[language] }}
        >
            {children}
        </LanguageContext.Provider>
    );
};
