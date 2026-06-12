import Link from "next/link";
import { Home, HelpCircle, Image } from "lucide-react";

const CMS_SECTIONS = [
  { icon: Home, label: "Page d'accueil", desc: "Texte du hero, statistiques, bandeau CTA", href: "/dashboard/contenu/homepage" },
  { icon: HelpCircle, label: "FAQ", desc: "Questions frequentes par categorie", href: "/dashboard/contenu/faq" },
  { icon: Image, label: "Bannieres", desc: "Bannieres promotionnelles en haut du site", href: "/dashboard/contenu/banners" },
];

export default function ContentPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Contenu</h1>
        <p className="text-sm text-gray-500">Gestion du contenu du site</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CMS_SECTIONS.map((section) => (
          <Link key={section.label} href={section.href} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-gray-200 transition-all group block">
            <div className="w-11 h-11 rounded-lg bg-[var(--ts-primary-500)]/10 flex items-center justify-center mb-4">
              <section.icon className="h-5 w-5 text-[var(--ts-primary-500)]" />
            </div>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-[var(--ts-primary-500)] transition-colors mb-1">{section.label}</h3>
            <p className="text-sm text-gray-500">{section.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
