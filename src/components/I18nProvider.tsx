'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

type Locale = 'en' | 'zh';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const LOCALE_KEY = 'yahoo_locale';

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : undefined;
}

// Inline messages to avoid async loading complexity
import enMessages from '../../messages/en.json';
import zhMessages from '../../messages/zh.json';

const messages: Record<Locale, Record<string, unknown>> = {
  en: enMessages as Record<string, unknown>,
  zh: zhMessages as Record<string, unknown>,
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (saved === 'en' || saved === 'zh') {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let value = getNestedValue(messages[locale], key);
      if (value === undefined) {
        // Fallback to English
        value = getNestedValue(messages.en, key);
      }
      if (value === undefined) return key;

      // Replace params like {minutes}, {author}
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          value = value!.replace(`{${paramKey}}`, String(paramValue));
        });
      }
      return value;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export type { Locale };
