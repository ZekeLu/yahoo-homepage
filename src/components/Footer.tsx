const footerLinks = [
  { label: "About", href: "#" },
  { label: "Help", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
];

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav aria-label="Footer navigation">
          <ul
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            role="list"
          >
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-yahoo-purple transition-colors"
                >
                  {link.label}
                </a>
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
