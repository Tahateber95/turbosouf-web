import Link from "next/link";
import { Wrench, Zap, Trophy, Settings, BarChart2, ChevronRight, ShieldCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const SERVICES = [
  {
    icon: Wrench,
    name: "Turbo en échange standard",
    description: "Échangez votre turbo défaillant contre un turbo reconditionné testé sur banc d'essai. Solution économique avec garantie 2 ans pièces et main d'œuvre.",
    price: "À partir de 180€",
    warranty: "Garantie 2 ans",
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: Zap,
    name: "Réparation turbo 24h",
    description: "Votre turbo réparé en 24h chrono dans notre atelier. Démontage, diagnostic, remplacement des pièces usées, équilibrage dynamique et test complet.",
    price: "À partir de 180€",
    warranty: "Garantie 2 ans",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    icon: Trophy,
    name: "Turbo de compétition & hybride",
    description: "Préparation et réparation de turbos haute performance pour la compétition ou les applications hybrides. Pièces haut de gamme, réglages spécifiques.",
    price: "À partir de 400€",
    warranty: "Sans garantie",
    color: "from-orange-500 to-red-600",
  },
  {
    icon: Settings,
    name: "Réglage actuateur / wastegate",
    description: "Réglage précis de l'actuateur ou de la wastegate pour restaurer les performances de votre turbo. Intervention rapide avec test de pression.",
    price: "50 à 80€",
    warranty: "Sans garantie",
    color: "from-purple-500 to-purple-700",
  },
  {
    icon: BarChart2,
    name: "Équilibrage CHRA",
    description: "Équilibrage dynamique du CHRA (cartouche centrale) sur banc spécialisé pour éliminer les vibrations et prolonger la durée de vie du turbo.",
    price: "À partir de 80€",
    warranty: "Sans garantie",
    color: "from-slate-500 to-slate-700",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--ts-primary-900)] to-[var(--ts-primary-700)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-gray-200">Accueil</Link>
            <span>/</span>
            <span className="text-gray-200">Services Atelier</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            Services Atelier
          </h1>
          <p className="text-gray-300 max-w-xl">
            Notre atelier spécialisé prend en charge le reconditionnement et la réparation de vos pièces automobiles avec des équipements professionnels.
          </p>
        </div>
      </div>

      {/* Services grid */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {SERVICES.map((service) => (
            <div key={service.name} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className={`bg-gradient-to-br ${service.color} p-6 text-white`}>
                <service.icon className="h-10 w-10 mb-3" />
                <h3 className="text-lg font-bold leading-snug">{service.name}</h3>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{service.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className={`h-3.5 w-3.5 ${service.warranty === "Garantie 2 ans" ? "text-emerald-500" : "text-gray-400"}`} />
                    {service.warranty}
                  </span>
                </div>
                <div className="flex flex-col gap-3 mt-auto">
                  <span className="text-base font-bold text-[var(--ts-primary-900)] whitespace-nowrap">{service.price}</span>
                  <Button variant="outline" size="sm" className="text-xs w-full justify-between">
                    Demander un devis
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-7xl px-4 pb-12">
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Besoin d&apos;un rendez-vous ?</h2>
          <p className="text-sm text-gray-500 mb-5">Appelez-nous ou envoyez un message pour planifier votre intervention.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex items-center h-11 px-6 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white font-semibold rounded-lg transition-colors">
              Prendre rendez-vous
            </Link>
            <a href="tel:+33123456789" className="inline-flex items-center h-11 px-6 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              +33 1 23 45 67 89
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
