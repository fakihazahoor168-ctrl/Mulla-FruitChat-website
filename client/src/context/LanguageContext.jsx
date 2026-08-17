import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../translations/en.json';
import urTranslations from '../translations/ur.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Get saved language or default to English
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('mulla_lang') || 'en';
  });

  const [translations, setTranslations] = useState(language === 'ur' ? urTranslations : enTranslations);

  useEffect(() => {
    localStorage.setItem('mulla_lang', language);
    const resolvedTrans = language === 'ur' ? urTranslations : enTranslations;
    setTranslations(resolvedTrans);
    
    // Set HTML dir attribute
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Update fonts on body
    if (language === 'ur') {
      document.body.classList.remove('font-poppins');
      document.body.classList.add('font-urdu');
    } else {
      document.body.classList.remove('font-urdu');
      document.body.classList.add('font-poppins');
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  // Simple translation helper t("key") or t("categories.Pizza")
  const t = (path) => {
    const keys = path.split('.');
    let current = translations;
    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback to English if translation missing
        let enFallback = enTranslations;
        for (const fallbackKey of keys) {
          if (enFallback[fallbackKey] === undefined) return path;
          enFallback = enFallback[fallbackKey];
        }
        return enFallback;
      }
      current = current[key];
    }
    return current;
  };

  const isRtl = language === 'ur';

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
