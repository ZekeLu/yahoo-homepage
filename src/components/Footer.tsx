'use client';

import Link from 'next/link';
import { useI18n } from '@/components/I18nProvider';

const footerLinks = [
  { labelKey: "footer.about", href: "/about" },
  { labelKey: "footer.help", href: "/help" },
  { labelKey: "footer.terms", href: "/terms" },
  { labelKey: "footer.privacy", href: "/privacy" },
];

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer role="contentinfo" className="mt-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav aria-label="Footer navigation">
          <ul
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            role="list"
          >
            {footerLinks.map((link) => (
              <li key={link.labelKey}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-yahoo-purple transition-colors"
                >
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-4 text-center text-xs text-gray-400">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
}
