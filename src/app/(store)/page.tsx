import Link from "next/link";
import { Wrench, Zap, Shield, Award, Star, ChevronRight, Package, Users, CheckCircle2, Clock, Sparkles, Phone } from "lucide-react";
import { VehicleFinder } from "@/components/store/vehicle-finder";
import { TrustBar } from "@/components/store/trust-bar";
import type { Category, Brand, VehicleMake } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const GRADIENT_COLORS = [
  "from-blue-500 to-blue-700",
  "from-emerald-500 to-emerald-700",
  "from-purple-500 to-purple-700",
  "from-red-500 to-red-700",
  "from-amber-500 to-amber-700",
  "from-cyan-500 to-cyan-700",
  "from-pink-500 to-pink-700",
  "from-indigo-500 to-indigo-700",
];

const CATEGORY_ICONS = [Zap, Package, Wrench, Shield, Star, Award, Users];

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API}/api/v1/categories`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json.data || [];
  } catch { return []; }
}

async function fetchBrands(): Promise<Brand[]> {
  try {
    const res = await fetch(`${API}/api/v1/brands`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json.data || [];
  } catch { return []; }
}

async function fetchVehicleMakes(): Promise<VehicleMake[]> {
  try {
    const res = await fetch(`${API}/api/v1/vehicles/makes`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json.data || [];
  } catch { return []; }
}

const STATS = [
  { value: "15+", label: "Annees d'experience" },
  { value: "2000+", label: "References en stock" },
  { value: "4.8/5", label: "Satisfaction client" },
  { value: "50%", label: "D'economie vs neuf" },
];

export default async function HomePage() {
  const [categories, brands, vehicleMakes] = await Promise.all([
    fetchCategories(),
    fetchBrands(),
    fetchVehicleMakes(),
  ]);

  const activeCategories = categories.filter((c) => c.isActive);

  return (
    <>
      {/* Hero — Turbo-focused */}
      <section className="relative min-h-[600px] lg:min-h-[700px] bg-[#0a0e17] overflow-hidden">
        {/* Background: real turbo image + overlays */}
        <div className="absolute inset-0">
          {/* Real turbo image as background — right side */}
          <img
            src="/images/turbo-default.jpg"
            alt=""
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-auto max-h-[110%] object-contain opacity-30 lg:opacity-50 pointer-events-none select-none"
          />

          {/* Gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e17] via-[#0a0e17]/98 via-60% to-[#0a0e17]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-[#0a0e17]/70" />

          {/* Orange accent glow behind turbo */}
          <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#E85D26]/15 blur-[150px]" />
          <div className="absolute bottom-[10%] right-[30%] w-[300px] h-[300px] rounded-full bg-[#F7941D]/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 lg:py-24 flex flex-col justify-center min-h-[600px] lg:min-h-[700px]">
          <div className="max-w-2xl">
            {/* Trust badge */}
            <div className="flex items-center gap-3 mb-6 animate-fade-up">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ts-accent-500)]/15 border border-[var(--ts-accent-500)]/25 text-[var(--ts-accent-500)] text-xs font-bold tracking-wide">
                <Sparkles className="h-3.5 w-3.5" />
                EXPERT TURBO DEPUIS 2010
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black text-white tracking-tight leading-[1.08] mb-6 animate-fade-up">
              Renovation &amp;
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--ts-accent-500)] to-amber-300">
                reparation
              </span>
              <br />
              de turbo auto
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-lg leading-relaxed animate-fade-up-delay">
              Vous recherchez des professionnels dont la specialite est la mise a neuf de turbo ?
              Comptez sur la reactivite et le professionnalisme de notre equipe.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-10 animate-fade-up-delay">
              <Link
                href="/produits/turbocompresseurs"
                className="inline-flex items-center h-13 px-7 bg-[var(--ts-accent-500)] hover:bg-[var(--ts-accent-600)] text-white font-bold rounded-xl text-base transition-all hover:shadow-lg hover:shadow-[var(--ts-accent-500)]/25 active:scale-[0.98]"
              >
                Voir nos turbos
                <ChevronRight className="h-5 w-5 ml-1.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center h-13 px-7 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-base transition-all border border-white/10 backdrop-blur-sm"
              >
                <Phone className="h-4 w-4 mr-2" />
                Nous contacter
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 animate-fade-up-delay-2">
              {[
                { icon: CheckCircle2, text: "Garantie 2 ans" },
                { icon: Clock, text: "Livraison 24-48h" },
                { icon: Shield, text: "Paiement securise" },
                { icon: Award, text: "Atelier certifie" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-sm text-gray-400">
                  <item.icon className="h-4 w-4 text-emerald-400" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up-delay-2">
            {[
              { value: "15+", label: "Annees d'expertise", accent: false },
              { value: "2000+", label: "Turbos reconditionnes", accent: true },
              { value: "98%", label: "Clients satisfaits", accent: false },
              { value: "-50%", label: "vs prix du neuf", accent: true },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl p-4 border transition-all ${
                  stat.accent
                    ? "bg-[var(--ts-accent-500)]/10 border-[var(--ts-accent-500)]/20"
                    : "bg-white/[0.03] border-white/[0.06]"
                }`}
              >
                <p className={`text-2xl sm:text-3xl font-black ${stat.accent ? "text-[var(--ts-accent-500)]" : "text-white"}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      <TrustBar />

      {/* Vehicle Finder */}
      <VehicleFinder />

      {/* Category Tiles */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--ts-primary-900)] tracking-tight mb-2">
              Nos categories
            </h2>
            <p className="text-gray-500">Trouvez rapidement la piece qu&apos;il vous faut</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {activeCategories.map((cat, index) => {
              const gradientClass = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
              const IconComponent = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
              return (
                <Link
                  key={cat.id}
                  href={`/produits/${cat.slug}`}
                  className={`group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${gradientClass} text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <IconComponent className="h-20 w-20" strokeWidth={1} />
                  </div>
                  <div className="relative">
                    <IconComponent className="h-8 w-8 mb-3" />
                    <h3 className="text-lg font-bold mb-1">{cat.name}</h3>
                    <p className="text-sm text-white/70">{cat.productCount} references</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vehicle Makes Grid */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--ts-primary-900)] tracking-tight mb-2">
              Pieces par vehicule
            </h2>
            <p className="text-gray-500">Selectionnez votre marque pour voir les pieces compatibles</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {vehicleMakes.map((make) => (
              <Link
                key={make.id}
                href={`/produits?make=${make.slug}`}
                className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 hover:border-[var(--ts-primary-500)] hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-[var(--ts-primary-500)]/10 flex items-center justify-center mb-2 transition-colors">
                  <span className="text-sm font-bold text-gray-600 group-hover:text-[var(--ts-primary-500)]">
                    {make.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-700">{make.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--ts-primary-900)] tracking-tight mb-2">
              Pourquoi TurboSouf ?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Wrench, title: "Atelier integre", desc: "Reconditionnement professionnel dans notre propre atelier. Chaque piece est testee et calibree avant expedition." },
              { icon: Shield, title: "Garantie 2 ans", desc: "Toutes nos pieces reconditionnees sont couvertes par une garantie de 2 ans pieces et main-d'oeuvre." },
              { icon: Award, title: "Prix competitifs", desc: "Jusqu'a 50% d'economie par rapport au neuf, sans compromis sur la qualite. Paiement en 3x/4x sans frais." },
              { icon: Users, title: "Conseil expert", desc: "Notre equipe de specialistes vous accompagne pour trouver la bonne piece compatible avec votre vehicule." },
              { icon: Package, title: "Stock permanent", desc: "Plus de 2000 references en stock. Expedition sous 24-48h pour les pieces disponibles." },
              { icon: Star, title: "4.8/5 avis clients", desc: "94% de nos clients sont satisfaits. Consultez les avis verifies de notre communaute." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-lg bg-[var(--ts-primary-500)]/10 flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-[var(--ts-primary-500)]" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Partners — with real logos */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
            Nos marques partenaires
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {[
              { name: "Garrett", src: "/images/brand-garrett.png" },
              { name: "BorgWarner", src: "/images/brand-borgwarner.png" },
              { name: "Continental", src: "/images/brand-continental.png" },
              { name: "Holset", src: "/images/brand-holset.png" },
              { name: "IHI Turbo", src: "/images/brand-ihi.png" },
              { name: "Mitsubishi", src: "/images/brand-mitsubishi.png" },
              { name: "Toyota", src: "/images/brand-toyota.png" },
            ].map((brand) => (
              <div key={brand.name} className="flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" title={brand.name}>
                <img src={brand.src} alt={brand.name} className="h-8 lg:h-10 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-black text-[var(--ts-primary-900)] text-center mb-8">
            Questions frequentes
          </h2>
          <div className="space-y-3">
            {[
              { q: "Quelle est la garantie sur les pieces reconditionnees ?", a: "Toutes nos pieces reconditionnees sont garanties 2 ans." },
              { q: "Qu'est-ce que la consigne ?", a: "La consigne est un montant remboursable que vous payez a l'achat d'une piece en echange standard. Renvoyez votre ancienne piece pour etre rembourse." },
              { q: "Quels sont les delais de livraison ?", a: "Livraison standard en 2-3 jours ouvres. Express en 24h. Gratuite des 150 euros." },
              { q: "Comment trouver la bonne piece ?", a: "Utilisez notre recherche par plaque d'immatriculation ou selectionnez votre marque, modele et motorisation." },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-gray-100 overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                  {faq.q}
                  <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/faq" className="text-sm font-medium text-[var(--ts-primary-500)] hover:underline">
              Voir toutes les FAQ →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[var(--ts-primary-900)] to-[var(--ts-primary-700)] py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Besoin d&apos;un devis ou d&apos;un conseil ?
          </h2>
          <p className="text-gray-400 mb-6">Nos experts sont disponibles du lundi au vendredi, 9h-18h.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex items-center h-12 px-6 bg-[var(--ts-accent-500)] hover:bg-[var(--ts-accent-600)] text-white font-semibold rounded-xl transition-colors">
              Nous contacter
            </Link>
            <a href="tel:+33123456789" className="inline-flex items-center h-12 px-6 border border-white/20 text-white hover:bg-white/10 rounded-xl transition-colors">
              +33 1 23 45 67 89
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
