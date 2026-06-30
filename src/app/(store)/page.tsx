import Link from "next/link";
import { Wrench, Shield, Award, Star, ChevronRight, Users, CheckCircle2, Clock, Phone, Anchor, Car, Factory, Cog, Zap } from "lucide-react";
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

      {/* ── HERO — Dark with orange fire glow ─────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#08090d]">
        {/* Ambient glow orbs */}
        <div className="absolute top-[-10%] right-[5%] w-[700px] h-[700px] rounded-full bg-[#E85D26]/[0.18] blur-[160px] animate-pulse-glow pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[0%] w-[500px] h-[500px] rounded-full bg-[#F7941D]/[0.12] blur-[130px] animate-pulse-glow-slow pointer-events-none" />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#E85D26]/[0.07] blur-[100px] pointer-events-none" />

        {/* Dot grid */}
        <div className="absolute inset-0 bg-dot-grid opacity-100 pointer-events-none" />
        {/* Vignette edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#08090d_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <div className="flex items-center gap-3 mb-7 animate-fade-up">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E85D26]/15 border border-[#E85D26]/30 text-[#F07A3A] text-xs font-bold tracking-widest uppercase">
                  <Zap className="h-3 w-3" />
                  {hc.heroTagline}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black text-white tracking-tight leading-[1.08] mb-6 animate-fade-up">
                {hc.heroTitle}
                <br />
                <span className="bg-gradient-to-r from-[#E85D26] via-[#F07A3A] to-[#F7941D] bg-clip-text text-transparent">
                  {hc.heroTitleHighlight}
                </span>
              </h1>

              <p className="text-lg text-white/50 mb-9 max-w-lg leading-relaxed animate-fade-up-delay">
                {hc.heroDescription}
              </p>

              <div className="flex flex-wrap gap-3 mb-10 animate-fade-up-delay">
                <Link
                  href="/produits"
                  className="inline-flex items-center h-13 px-7 bg-gradient-to-r from-[#E85D26] to-[#F7941D] hover:from-[#F07A3A] hover:to-[#F7941D] text-white font-bold rounded-xl text-base transition-all hover:shadow-2xl hover:shadow-[#E85D26]/30 active:scale-[0.98]"
                >
                  Voir nos turbos
                  <ChevronRight className="h-5 w-5 ml-1.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center h-13 px-7 bg-white/8 hover:bg-white/12 text-white font-semibold rounded-xl text-base transition-all border border-white/15 backdrop-blur-sm"
                >
                  <Phone className="h-4 w-4 mr-2 text-[#F07A3A]" />
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
                  <div key={item.text} className="flex items-center gap-2 text-sm text-white/50">
                    <item.icon className="h-4 w-4 text-[#E85D26]" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Turbo image */}
            <div className="relative hidden lg:flex items-center justify-center animate-fade-up-delay">
              <div className="relative w-[440px] h-[440px]">
                {/* Glow behind image */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E85D26]/25 to-[#F7941D]/20 blur-[60px]" />
                {/* Ring decoration */}
                <div className="absolute inset-6 rounded-full border border-[#E85D26]/15" />
                <div className="absolute inset-12 rounded-full border border-[#E85D26]/8" />
                <img
                  src="/images/turbo-default.jpg"
                  alt="Turbocompresseur"
                  className="relative w-full h-full object-contain p-6 drop-shadow-2xl"
                />
                {/* Floating badges */}
                <div className="absolute top-8 right-0 bg-[#1a1b20] border border-white/10 rounded-xl shadow-xl px-3.5 py-2.5 backdrop-blur-sm animate-bounce-slow">
                  <p className="text-xs font-bold text-[#F07A3A]">Garantie 2 ans</p>
                </div>
                <div className="absolute bottom-12 -left-4 bg-[#1a1b20] border border-white/10 rounded-xl shadow-xl px-3.5 py-2.5 backdrop-blur-sm animate-bounce-slow" style={{ animationDelay: "1s" }}>
                  <p className="text-xs font-bold text-white">-50% vs neuf</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          {hc.stats.length > 0 && (
            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up-delay-2">
              {hc.stats.map((stat) => (
                <div key={stat.label} className="rounded-xl p-5 bg-white/5 border border-white/10 backdrop-blur-sm hover:border-[#E85D26]/30 transition-colors">
                  <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#E85D26] to-[#F7941D] bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      <TrustBar />

      {/* ── APPLICATIONS — Dark cards ──────────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden bg-[#0b0c11]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#E85D26]/[0.08] blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-line-grid opacity-100 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
              Turbos pour toutes les applications
            </h2>
            <p className="text-white/40">Automobile, marine, industriel — on couvre tout</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Car,
                title: "Automobile",
                desc: "Voitures, utilitaires, poids lourds. Toutes marques, tous modeles. Turbo neuf ou reconditionne.",
                href: "/produits?application=automobile",
                color: "#E85D26",
              },
              {
                icon: Anchor,
                title: "Marine",
                desc: "Bateaux, yachts, navires de croisiere. Turbos marins adaptes aux conditions extremes.",
                href: "/produits?application=marine",
                color: "#3B82F6",
              },
              {
                icon: Factory,
                title: "Industriel",
                desc: "Groupes electrogenes, engins de chantier, machines agricoles. Solutions sur mesure.",
                href: "/produits?application=industriel",
                color: "#8B5CF6",
              },
            ].map((app) => (
              <Link
                key={app.title}
                href={app.href}
                className="group relative rounded-2xl p-8 bg-white/5 border border-white/8 hover:border-white/20 hover:bg-white/8 transition-all duration-300 overflow-hidden"
              >
                {/* Card glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" style={{ background: `radial-gradient(circle at 50% 0%, ${app.color}15 0%, transparent 70%)` }} />
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all" style={{ backgroundColor: `${app.color}20`, border: `1px solid ${app.color}30` }}>
                  <app.icon className="h-7 w-7 transition-colors" style={{ color: app.color }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{app.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed mb-5">{app.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold transition-all" style={{ color: app.color }}>
                  Decouvrir <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* Vehicle Finder */}
      <VehicleFinder />

      {/* ── MAKES GRID — Light ────────────────────────────────────────────── */}
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
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[var(--ts-primary-500)]/40 hover:shadow-lg hover:shadow-[var(--ts-primary-500)]/5 hover:bg-white transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 transition-colors border border-gray-100 group-hover:border-[var(--ts-primary-500)]/20 p-2">
                  <MakeLogo name={make.name} logoUrl={make.logoUrl} className="w-full h-full" />
                </div>
                <span className="text-xs font-medium text-gray-700">{make.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US — Dark ──────────────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden bg-[#08090d]">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#F7941D]/[0.1] blur-[140px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#E85D26]/[0.08] blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
              Pourquoi TurboSouf ?
            </h2>
            <p className="text-white/40">L&apos;expertise qui fait la difference</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Wrench, title: "Atelier integre", desc: "Reconditionnement professionnel dans notre propre atelier. Chaque turbo est teste sur banc d'essai et calibre avant expedition.", color: "#E85D26" },
              { icon: Shield, title: "Garantie 2 ans", desc: "Tous nos turbos reconditionnes sont couverts par une garantie de 2 ans pieces et main-d'oeuvre.", color: "#22C55E" },
              { icon: Award, title: "Prix competitifs", desc: "Jusqu'a 50% d'economie par rapport au neuf, sans compromis sur la qualite. Paiement en 3x/4x sans frais.", color: "#F7941D" },
              { icon: Users, title: "Conseil expert", desc: "Notre equipe de specialistes vous accompagne pour trouver le bon turbo compatible avec votre vehicule ou application.", color: "#3B82F6" },
              { icon: Star, title: "Multi-applications", desc: "Automobile, marine, industriel — nous couvrons toutes les applications avec des turbos adaptes a chaque usage.", color: "#A855F7" },
              { icon: Cog, title: "Reconditionnement", desc: "Confiez-nous votre turbo, on le remet a neuf. Diagnostic, reparation et test complet en atelier.", color: "#E85D26" },
            ].map((item) => (
              <div key={item.title} className="group relative p-6 rounded-xl bg-white/[0.04] border border-white/8 hover:border-white/16 hover:bg-white/[0.07] transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" style={{ background: `radial-gradient(circle at 20% 20%, ${item.color}12 0%, transparent 60%)` }} />
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 relative" style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}30` }}>
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ── BRAND PARTNERS — Light ────────────────────────────────────────── */}
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

      {/* ── FAQ — Light ───────────────────────────────────────────────────── */}
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

      {/* ── CTA — Gradient ───────────────────────────────────────────────── */}
      {(hc.ctaTitle || hc.ctaDescription) && (
        <section className="relative overflow-hidden bg-[#08090d] py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E85D26]/20 via-transparent to-[#F7941D]/15 pointer-events-none" />
          <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-4 text-center">
            {hc.ctaTitle && <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">{hc.ctaTitle}</h2>}
            {hc.ctaDescription && <p className="text-white/50 mb-8 max-w-xl mx-auto">{hc.ctaDescription}</p>}
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="inline-flex items-center h-12 px-7 bg-gradient-to-r from-[#E85D26] to-[#F7941D] text-white font-bold rounded-xl transition-all hover:shadow-2xl hover:shadow-[#E85D26]/30">
                Nous contacter
              </Link>
              {hc.ctaPhone && (
                <a href={`tel:${hc.ctaPhone.replace(/\s/g, "")}`} className="inline-flex items-center h-12 px-7 bg-white/8 border border-white/15 text-white hover:bg-white/12 font-semibold rounded-xl transition-colors backdrop-blur-sm">
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
