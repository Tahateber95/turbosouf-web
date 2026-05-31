import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const CATEGORIES = [
  { href: "/produits/turbocompresseurs", label: "Turbocompresseurs" },
  { href: "/produits/injecteurs", label: "Injecteurs" },
  { href: "/produits/pompes-hp", label: "Pompes HP" },
  { href: "/produits/freinage", label: "Freinage" },
  { href: "/produits/huiles-additifs", label: "Huiles & Additifs" },
];

const INFO_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/services", label: "Nos Services" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

const LEGAL_LINKS = [
  { href: "/cgv", label: "CGV" },
  { href: "/mentions-legales", label: "Mentions Légales" },
  { href: "/politique-confidentialite", label: "Confidentialité" },
];

export function Footer() {
  return (
    <footer className="bg-[var(--ts-primary-900)] text-gray-300">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="TurboSouf" className="w-8 h-8 rounded-full object-contain" />
              <span className="text-lg font-black text-white">TurboSouf</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-4">
              Spécialiste en pièces automobiles reconditionnées. Turbos, injecteurs, pompes HP
              — qualité professionnelle, prix compétitifs, garantie 2 ans.
            </p>
            <div className="space-y-2 text-sm">
              <a href="tel:+33123456789" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-[var(--ts-primary-500)]" />
                +33 1 23 45 67 89
              </a>
              <a href="mailto:contact@turbosouf.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-[var(--ts-primary-500)]" />
                contact@turbosouf.com
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--ts-primary-500)]" />
                Strasbourg, France
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Nos Produits
            </h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Informations
            </h3>
            <ul className="space-y-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Recevez nos offres et promotions en avant-première.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 h-10 px-3 rounded-lg bg-white/10 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-[var(--ts-accent-500)] text-white text-sm font-medium hover:bg-[var(--ts-accent-600)] transition-colors"
              >
                OK
              </button>
            </form>
            <p className="text-[10px] text-gray-500 mt-2">
              En vous inscrivant, vous acceptez notre politique de confidentialité.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} TurboSouf. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span>Paiement sécurisé</span>
            <span>Garantie 2 ans</span>
            <span>Livraison 24-48h</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
