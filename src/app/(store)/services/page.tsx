import Link from "next/link";
import { Wrench, Search, Cog, ChevronRight, Clock, ShieldCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const SERVICES = [
  {
    icon: Wrench,
    name: "Reconditionnement Turbo",
    description: "Reconditionnement complet de votre turbocompresseur dans notre atelier. Démontage, inspection, remplacement des pièces d'usure, équilibrage dynamique et test sur banc d'essai.",
    price: "À partir de 350€",
    duration: "3-5 jours",
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: Search,
    name: "Diagnostic Turbo",
    description: "Diagnostic complet de votre turbocompresseur avec rapport détaillé. Identification des causes de panne et recommandations de réparation.",
    price: "50€",
    duration: "1 jour",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    icon: Cog,
    name: "Réparation Mécanique",
    description: "Service de réparation mécanique générale. Remplacement de pièces, remise en état, mise au point moteur.",
    price: "Sur devis",
    duration: "Variable",
    color: "from-purple-500 to-purple-700",
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div key={service.name} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`bg-gradient-to-br ${service.color} p-6 text-white`}>
                <service.icon className="h-10 w-10 mb-3" />
                <h3 className="text-xl font-bold">{service.name}</h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Garantie 2 ans
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[var(--ts-primary-500)]" />
                    {service.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[var(--ts-primary-900)]">{service.price}</span>
                  <Button variant="outline" size="sm" className="text-xs">
                    Demander un devis
                    <ChevronRight className="h-3 w-3 ml-1" />
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
