// src/components/LanguageSwitcher.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const handleChangeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    };

    return (
        <div className="d-flex gap-2 p-2">
            <button onClick={() => handleChangeLanguage("en")} className="btn btn-sm btn-outline-primary">
                English
            </button>
            <button onClick={() => handleChangeLanguage("hi")} className="btn btn-sm btn-outline-success">
                हिंदी
            </button>
            <button onClick={() => handleChangeLanguage("ar")} className="btn btn-sm btn-outline-danger">
                عربى
            </button>
        </div>
    );
};

export default LanguageSwitcher;
