import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ru' | 'be';

interface Translations {
  [key: string]: {
    [key: string]: any;
  };
}

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (section: string, key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const loadTranslations = async (lang: Language): Promise<Translations> => {
  try {
    const response = await fetch(`/i18n/${lang}.json?_t=${Date.now()}`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${lang}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to load translations:', error);
    return {};
  }
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'ru', 'be'].includes(savedLang)) {
      console.log('Restoring language from localStorage:', savedLang);
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    loadTranslations(language).then(setTranslations);
    localStorage.setItem('language', language);
  }, [language]);

  const t = (section: string, key: string): string => {
    try {
      return translations[section]?.[key] || key;
    } catch {
      return key;
    }
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
