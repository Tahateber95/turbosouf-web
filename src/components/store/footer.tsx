import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface FooterConfig {
  description: string;
  phone: string;
  email: string;
  address: string;
}

async function getFooterConfig(): Promise<FooterConfig> {
  try {
    const res = await fetch(`${BACKEND}/api/v1/site-content/footer`, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return JSON.parse(json.data.value) as FooterConfig;
  } catch {
    return {
      description: "Specialiste en turbocompresseurs neufs et reconditionnes pour automobile, marine et industriel. Garantie 2 ans, prix competitifs.",
      phone: "+33 7 49 79 05 55",
      email: "turbosouf.idf@gmail.com",
      address: "Strasbourg, France",
    };
  }
}

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

export async function Footer() {
  const config = await getFooterConfig();

  return (
    <footer style={{ backgroundColor: "#0F1923" }} className="text-white/60">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:py-18">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <img src="/logo.png" alt="TurboSouf" className="w-9 h-9 rounded-full object-contain" />
              <span className="text-lg font-black text-white">TurboSouf</span>
            </div>
            <p className="text-sm leading-relaxed text-white/45 mb-5">
              {config.description}
            </p>
            <div className="space-y-2.5 text-sm">
              <a href={`tel:${config.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-white/55 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-[#E85D26] shrink-0" />
                {config.phone}
              </a>
              <a href={`mailto:${config.email}`} className="flex items-center gap-2 text-white/55 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-[#E85D26] shrink-0" />
                {config.email}
              </a>
              <p className="flex items-center gap-2 text-white/55">
                <MapPin className="h-4 w-4 text-[#E85D26] shrink-0" />
                {config.address}
              </p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.14em] mb-5">
              Nos Turbos
            </h3>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.14em] mb-5">
              Informations
            </h3>
            <ul className="space-y-3">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} TurboSouf. Tous droits reserves.</p>
          <div className="flex items-center gap-5">
            <span>Paiement securise</span>
            <span>Garantie 2 ans</span>
            <span>Livraison 24-48h</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
