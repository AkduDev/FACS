import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { translations, TranslationDict } from './translations';

interface ThemeLangContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  lang: 'es' | 'en';
  setLang: (lang: 'es' | 'en') => void;
  t: TranslationDict;
}

const ThemeLangContext = createContext<ThemeLangContextType | undefined>(undefined);

export function ThemeLangProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('fcas_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [lang, setLangState] = useState<'es' | 'en'>(() => {
    const saved = localStorage.getItem('fcas_lang');
    return (saved === 'es' || saved === 'en') ? saved : 'es';
  });

  // Apply theme class to html/document element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('fcas_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setLang = (newLang: 'es' | 'en') => {
    setLangState(newLang);
    localStorage.setItem('fcas_lang', newLang);
  };

  const t = translations[lang];

  const value = useMemo(
    () => ({ theme, toggleTheme, lang, setLang, t }),
    [theme, toggleTheme, lang, setLang, t]
  );

  return (
    <ThemeLangContext.Provider value={value}>
      {children}
    </ThemeLangContext.Provider>
  );
}

export function useThemeLang() {
  const context = useContext(ThemeLangContext);
  if (context === undefined) {
    throw new Error('useThemeLang must be used within a ThemeLangProvider');
  }
  return context;
}
