import Link from "next/link";
import { Store, Truck, CreditCard, Users, Database, Mail, Phone } from "lucide-react";

const SETTINGS_SECTIONS = [
  { icon: Phone, label: "Informations de contact", desc: "Telephone, email, adresse, horaires", href: "/dashboard/parametres/contact" },
  { icon: Store, label: "Informations boutique", desc: "Nom, SIRET, mentions legales", href: "#" },
  { icon: Truck, label: "Livraison", desc: "Methodes de livraison et tarifs", href: "/dashboard/parametres/livraison" },
  { icon: CreditCard, label: "Paiement", desc: "Configuration Stripe, PayPal, Alma", href: "#" },
  { icon: Database, label: "Sage", desc: "Connexion et parametres de synchronisation", href: "#" },
  { icon: Mail, label: "Emails", desc: "Templates d'emails transactionnels", href: "#" },
  { icon: Users, label: "Utilisateurs", desc: "Gestion des comptes administrateurs", href: "#" },
];

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500">Configuration de votre plateforme</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SETTINGS_SECTIONS.map((section) => (
          <Link key={section.label} href={section.href} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--ts-primary-500)]/10 flex items-center justify-center shrink-0">
                <section.icon className="h-5 w-5 text-[var(--ts-primary-500)]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-[var(--ts-primary-500)] transition-colors">
                  {section.label}
                </h3>
                <p className="text-xs text-gray-500">{section.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
