'use client';

import { useI18n, type Locale } from '@/components/I18nProvider';

export default function LocaleSwitcher() {
  const { locale, setLocale, t } = useI18n();

  const options: { value: Locale; label: string }[] = [
    { value: 'en', label: t('locale.en') },
    { value: 'zh', label: t('locale.zh') },
  ];

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="rounded-md bg-yahoo-purple-dark px-2 py-1 text-xs text-white border border-white/20 hover:border-white/40 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-yahoo-purple-light"
      aria-label={t('locale.switchTo')}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
