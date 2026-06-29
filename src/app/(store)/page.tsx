import Link from "next/link";
import { Wrench, Shield, Award, Star, ChevronRight, Users, CheckCircle2, Clock, Phone, Anchor, Car, Factory, Cog } from "lucide-react";
import { VehicleFinder } from "@/components/store/vehicle-finder";
import { TrustBar } from "@/components/store/trust-bar";
import { MakeLogo } from "@/components/store/make-logo";
import { TikTokFeed } from "@/components/store/tiktok-feed";
import { SERVER_API_URL, type VehicleMake } from "@/lib/api";
import { readFile } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

const API = SERVER_API_URL;

interface HomepageConfig {
  heroTagline: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroDescription: string;
  stats: { value: string; label: string }[];
  ctaTitle: string;
  ctaDescription: string;
  ctaPhone: string;
}

interface Banner { id: string; text: string; link: string; active: boolean; bgColor: string }

async function fetchVehicleMakes(): Promise<VehicleMake[]> {
  try {
    const res = await fetch(`${API}/api/v1/vehicles/makes`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json.data || [];
  } catch { return []; }
}

async function getConfig<T>(file: string, fallback: T): Promise<T> {
  try {
    const data = await readFile(join(process.cwd(), "src/data", file), "utf-8");
    return JSON.parse(data);
  } catch { return fallback; }
}

export default async function HomePage() {
  const [vehicleMakes, hc, banners] = await Promise.all([
    fetchVehicleMakes(),
    getConfig<HomepageConfig>("homepage-config.json", { heroTagline: "SPECIALISTE TURBO DEPUIS 2010", heroTitle: "Votre expert", heroTitleHighlight: "turbocompresseur", heroDescription: "", stats: [], ctaTitle: "", ctaDescription: "", ctaPhone: "" }),
    getConfig<Banner[]>("banners-config.json", []),
  ]);

  const activeBanners = banners.filter(b => b.active && b.text);

  return (
    <>
      {/* Promo banners */}
      {activeBanners.map(banner => (
        <div key={banner.id} className="text-center text-white text-sm font-medium py-2 px-4" style={{ backgroundColor: banner.bgColor }}>
          {banner.link ? <Link href={banner.link} className="hover:underline">{banner.text}</Link> : banner.text}
        </div>
      ))}

      {/* Hero — Light, clean, turbo-focused */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/40 to-amber-50/30">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[var(--ts-primary-500)]/[0.04] blur-[120px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[var(--ts-accent-500)]/[0.05] blur-[100px] translate-y-1/3 -translate-x-1/4" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <div className="flex items-center gap-3 mb-6 animate-fade-up">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ts-primary-500)]/10 border border-[var(--ts-primary-500)]/20 text-[var(--ts-primary-500)] text-xs font-bold tracking-wide">
                  <Cog className="h-3.5 w-3.5" />
                  {hc.heroTagline}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-gray-900 tracking-tight leading-[1.1] mb-6 animate-fade-up">
                {hc.heroTitle}
                <br />
                <span className="text-[var(--ts-primary-500)]">{hc.heroTitleHighlight}</span>
              </h1>

              <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed animate-fade-up-delay">
                {hc.heroDescription}
              </p>

              <div className="flex flex-wrap gap-3 mb-10 animate-fade-up-delay">
                <Link
                  href="/produits"
                  className="inline-flex items-center h-13 px-7 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-400)] text-white font-bold rounded-xl text-base transition-all hover:shadow-lg hover:shadow-[var(--ts-primary-500)]/20 active:scale-[0.98]"
                >
                  Voir nos turbos
                  <ChevronRight className="h-5 w-5 ml-1.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center h-13 px-7 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-base transition-all border border-gray-200 shadow-sm"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Nous contacter
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3 animate-fade-up-delay-2">
                {[
                  { icon: CheckCircle2, text: "Garantie 2 ans" },
                  { icon: Clock, text: "Livraison 24-48h" },
                  { icon: Shield, text: "Paiement securise" },
                  { icon: Award, text: "Atelier certifie" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-sm text-gray-500">
                    <item.icon className="h-4 w-4 text-[var(--ts-primary-500)]" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Turbo image */}
            <div className="relative hidden lg:flex items-center justify-center animate-fade-up-delay">
              <div className="relative w-[440px] h-[440px]">
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[var(--ts-primary-500)]/8 to-[var(--ts-accent-500)]/12 blur-sm" />
                <div className="absolute inset-4 rounded-full border border-[var(--ts-primary-500)]/5" />
                <img
                  src="/images/turbo-default.jpg"
                  alt="Turbocompresseur"
                  className="relative w-full h-full object-contain p-6 drop-shadow-xl rounded-3xl"
                />
                <div className="absolute top-8 right-4 bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-100 animate-bounce-slow">
                  <p className="text-xs font-bold text-[var(--ts-primary-500)]">Garantie 2 ans</p>
                </div>
                <div className="absolute bottom-12 left-0 bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-100 animate-bounce-slow" style={{ animationDelay: "1s" }}>
                  <p className="text-xs font-bold text-gray-700">-50% vs neuf</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          {hc.stats.length > 0 && (
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up-delay-2">
            {hc.stats.map((stat) => (
              <div key={stat.label} className="rounded-xl p-5 bg-white border border-gray-100 shadow-sm">
                <p className="text-2xl sm:text-3xl font-black text-[var(--ts-primary-500)]">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      <TrustBar />

      {/* Applications — What we cover */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
              Turbos pour toutes les applications
            </h2>
            <p className="text-gray-500">Automobile, marine, industriel — on couvre tout</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Car,
                title: "Automobile",
                desc: "Voitures, utilitaires, poids lourds. Toutes marques, tous modeles. Turbo neuf ou reconditionne.",
                href: "/produits?application=automobile",
              },
              {
                icon: Anchor,
                title: "Marine",
                desc: "Bateaux, yachts, navires de croisiere. Turbos marins adaptes aux conditions extremes.",
                href: "/produits?application=marine",
              },
              {
                icon: Factory,
                title: "Industriel",
                desc: "Groupes electrogenes, engins de chantier, machines agricoles. Solutions sur mesure.",
                href: "/produits?application=industriel",
              },
            ].map((app) => (
              <Link
                key={app.title}
                href={app.href}
                className="group relative rounded-2xl p-8 bg-gray-50 border border-gray-100 hover:border-[var(--ts-primary-500)]/30 hover:shadow-lg hover:shadow-[var(--ts-primary-500)]/5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-[var(--ts-primary-500)]/10 flex items-center justify-center mb-5 group-hover:bg-[var(--ts-primary-500)] group-hover:text-white transition-all">
                  <app.icon className="h-7 w-7 text-[var(--ts-primary-500)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{app.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{app.desc}</p>
                <span className="inline-flex items-center text-sm font-semibold text-[var(--ts-primary-500)] group-hover:gap-2 transition-all">
                  Decouvrir <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Finder */}
      <VehicleFinder />

      {/* Vehicle Makes Grid */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
              Trouvez votre turbo par marque
            </h2>
            <p className="text-gray-500">Selectionnez votre marque pour voir les turbos compatibles</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {vehicleMakes.map((make) => (
              <Link
                key={make.id}
                href={`/produits?make=${make.slug}`}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[var(--ts-primary-500)]/40 hover:shadow-md hover:bg-white transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-white group-hover:bg-[var(--ts-primary-500)]/10 flex items-center justify-center mb-2 transition-colors border border-gray-100 group-hover:border-[var(--ts-primary-500)]/20 p-2">
                  <MakeLogo name={make.name} logoUrl={make.logoUrl} className="w-full h-full" />
                </div>
                <span className="text-xs font-medium text-gray-700">{make.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
              Pourquoi TurboSouf ?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Wrench, title: "Atelier integre", desc: "Reconditionnement professionnel dans notre propre atelier. Chaque turbo est teste sur banc d'essai et calibre avant expedition." },
              { icon: Shield, title: "Garantie 2 ans", desc: "Tous nos turbos reconditionnes sont couverts par une garantie de 2 ans pieces et main-d'oeuvre." },
              { icon: Award, title: "Prix competitifs", desc: "Jusqu'a 50% d'economie par rapport au neuf, sans compromis sur la qualite. Paiement en 3x/4x sans frais." },
              { icon: Users, title: "Conseil expert", desc: "Notre equipe de specialistes vous accompagne pour trouver le bon turbo compatible avec votre vehicule ou application." },
              { icon: Star, title: "Multi-applications", desc: "Automobile, marine, industriel — nous couvrons toutes les applications avec des turbos adaptes a chaque usage." },
              { icon: Cog, title: "Reconditionnement", desc: "Confiez-nous votre turbo, on le remet a neuf. Diagnostic, reparation et test complet en atelier." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all">
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

      {/* Brand Partners */}
      <section className="py-12 bg-white border-t border-gray-100">
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
              <div key={brand.name} className="flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300" title={brand.name}>
                <img src={brand.src} alt={brand.name} className="h-8 lg:h-10 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TikTok Feed */}
      <TikTokFeed />

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">
            Questions frequentes
          </h2>
          <div className="space-y-3">
            {[
              { q: "Quelle est la garantie sur les turbos reconditionnes ?", a: "Tous nos turbos reconditionnes sont garantis 2 ans, pieces et main-d'oeuvre." },
              { q: "Qu'est-ce que la consigne ?", a: "La consigne est un montant remboursable que vous payez a l'achat d'un turbo en echange standard. Renvoyez votre ancien turbo et nous vous remboursons la consigne." },
              { q: "Quels sont les delais de livraison ?", a: "Livraison standard en 2-3 jours ouvres. Express en 24h. Gratuite des 150 euros." },
              { q: "Faites-vous les turbos pour bateaux et industriel ?", a: "Oui, nous couvrons toutes les applications : automobile, marine (bateaux, yachts) et industriel (groupes electrogenes, engins de chantier)." },
              { q: "Puis-je faire reconditionner mon propre turbo ?", a: "Absolument. Envoyez-nous votre turbo, nous le diagnostiquons et le remettons a neuf dans notre atelier. Devis gratuit." },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-gray-200 bg-white overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                  {faq.q}
                  <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
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
      {(hc.ctaTitle || hc.ctaDescription) && (
      <section className="bg-gradient-to-r from-[var(--ts-primary-500)] to-[var(--ts-accent-500)] py-14">
        <div className="mx-auto max-w-7xl px-4 text-center">
          {hc.ctaTitle && <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">{hc.ctaTitle}</h2>}
          {hc.ctaDescription && <p className="text-white/80 mb-6">{hc.ctaDescription}</p>}
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex items-center h-12 px-6 bg-white text-[var(--ts-primary-500)] font-bold rounded-xl transition-colors hover:bg-gray-50 shadow-lg">
              Nous contacter
            </Link>
            {hc.ctaPhone && (
            <a href={`tel:${hc.ctaPhone.replace(/\s/g, "")}`} className="inline-flex items-center h-12 px-6 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-colors">
              {hc.ctaPhone}
            </a>
            )}
          </div>
        </div>
      </section>
      )}
    </>
  );
}
