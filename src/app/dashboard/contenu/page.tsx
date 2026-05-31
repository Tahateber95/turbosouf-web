import Link from "next/link";
import { FileEdit, Image, HelpCircle, Megaphone, Plus } from "lucide-react";

const CMS_SECTIONS = [
  { icon: FileEdit, label: "Pages", desc: "Gérer les pages statiques (CGV, mentions, etc.)", count: 5, href: "#" },
  { icon: Megaphone, label: "Blog", desc: "Articles et actualités", count: 3, href: "#" },
  { icon: HelpCircle, label: "FAQ", desc: "Questions fréquentes", count: 10, href: "#" },
  { icon: Image, label: "Bannières", desc: "Bannières promotionnelles", count: 2, href: "#" },
];

export default function ContentPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Contenu</h1>
          <p className="text-sm text-gray-500">Gestion du contenu du site</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CMS_SECTIONS.map((section) => (
          <div key={section.label} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-gray-200 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-lg bg-[var(--ts-primary-500)]/10 flex items-center justify-center">
                <section.icon className="h-5 w-5 text-[var(--ts-primary-500)]" />
              </div>
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {section.count}
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">{section.label}</h3>
            <p className="text-sm text-gray-500 mb-4">{section.desc}</p>
            <div className="flex gap-2">
              <button className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline">
                Gérer →
              </button>
              <button className="text-xs font-medium text-gray-400 hover:text-gray-600">
                + Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
