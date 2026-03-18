import Link from 'next/link';

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Help", href: "/help" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer role="contentinfo" className="mt-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav aria-label="Footer navigation">
          <ul
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            role="list"
          >
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-yahoo-purple transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-4 text-center text-xs text-gray-400">
          © 2026 Yahoo. All rights reserved. (Demo site — not affiliated with Yahoo Inc.)
        </p>
      </div>
    </footer>
  );
}
