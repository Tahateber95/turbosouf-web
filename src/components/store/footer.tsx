import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const PRODUCT_LINKS = [
  { href: "/produits", label: "Tous nos turbos" },
  { href: "/produits?application=automobile", label: "Turbos automobile" },
  { href: "/produits?application=marine", label: "Turbos marine" },
  { href: "/produits?application=industriel", label: "Turbos industriel" },
  { href: "/services", label: "Reconditionnement" },
];

const INFO_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/cgv", label: "CGV" },
  { href: "/mentions-legales", label: "Mentions Legales" },
  { href: "/politique-confidentialite", label: "Confidentialite" },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="TurboSouf" className="w-8 h-8 rounded-full object-contain" />
              <span className="text-lg font-black text-gray-900">TurboSouf</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-4">
              Specialiste en turbocompresseurs neufs et reconditionnes pour automobile, marine et industriel.
              Garantie 2 ans, prix competitifs.
            </p>
            <div className="space-y-2 text-sm">
              <a href="tel:+33123456789" className="flex items-center gap-2 hover:text-[var(--ts-primary-500)] transition-colors">
                <Phone className="h-4 w-4 text-[var(--ts-primary-500)]" />
                +33 1 23 45 67 89
              </a>
              <a href="mailto:contact@turbosouf.com" className="flex items-center gap-2 hover:text-[var(--ts-primary-500)] transition-colors">
                <Mail className="h-4 w-4 text-[var(--ts-primary-500)]" />
                contact@turbosouf.com
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--ts-primary-500)]" />
                Strasbourg, France
              </p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Nos Turbos
            </h3>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-[var(--ts-primary-500)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Informations
            </h3>
            <ul className="space-y-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-[var(--ts-primary-500)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Recevez nos offres et promotions en avant-premiere.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 h-10 px-3 rounded-lg bg-white border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-[var(--ts-primary-500)] text-white text-sm font-medium hover:bg-[var(--ts-primary-400)] transition-colors"
              >
                OK
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} TurboSouf. Tous droits reserves.</p>
          <div className="flex items-center gap-4">
            <span>Paiement securise</span>
            <span>Garantie 2 ans</span>
            <span>Livraison 24-48h</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
