import Link from "next/link";
import { Wrench, Shield, Award, Star, ChevronRight, Users, CheckCircle2, Clock, Phone, Anchor, Car, Factory, Cog, ArrowRight } from "lucide-react";
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
    getConfig<HomepageConfig>("homepage-config.json", {
      heroTagline: "SPECIALISTE TURBO DEPUIS 2010",
      heroTitle: "Votre expert",
      heroTitleHighlight: "turbocompresseur",
      heroDescription: "",
      stats: [],
      ctaTitle: "",
      ctaDescription: "",
      ctaPhone: "",
    }),
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

      {/* ── HERO — Warm cream mesh gradient ───────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: [
            "radial-gradient(ellipse 70% 60% at 8% 60%, rgba(232,93,38,0.13) 0%, transparent 65%)",
            "radial-gradient(ellipse 55% 65% at 88% 20%, rgba(26,58,92,0.07) 0%, transparent 60%)",
            "radial-gradient(ellipse 40% 40% at 50% 110%, rgba(232,93,38,0.06) 0%, transparent 60%)",
            "#F8F7F4",
          ].join(", "),
        }}
      >
        {/* Blueprint crosshatch texture */}
        <div className="absolute inset-0 bg-blueprint opacity-100 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: Copy */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-6 animate-fade-up">
                <span className="inline-block w-8 h-0.5 bg-[#E85D26] rounded-full" />
                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#E85D26]">
                  {hc.heroTagline}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-black text-[#0A0A0A] tracking-tight leading-[1.07] mb-6 animate-fade-up">
                {hc.heroTitle}
                <br />
                <span className="text-[#E85D26]">{hc.heroTitleHighlight}</span>
              </h1>

              <p className="text-lg text-[#6B6B6B] mb-9 max-w-lg leading-relaxed animate-fade-up-delay">
                {hc.heroDescription}
              </p>

              <div className="flex flex-wrap gap-3 mb-10 animate-fade-up-delay">
                <Link
                  href="/produits"
                  className="inline-flex items-center h-13 px-7 font-bold rounded-lg text-base text-white transition-all hover:shadow-xl hover:shadow-[#E85D26]/25 active:scale-[0.98]"
                  style={{ background: "linear-gradient(180deg,#FF7A45 0%,#E85D26 100%)" }}
                >
                  Voir nos turbos
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center h-13 px-7 bg-white text-[#3A3A3A] font-semibold rounded-lg text-base transition-all border border-[rgba(0,0,0,0.12)] shadow-sm hover:border-[rgba(0,0,0,0.20)] hover:shadow-md"
                >
                  <Phone className="h-4 w-4 mr-2 text-[#E85D26]" />
                  Nous contacter
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 animate-fade-up-delay-2">
                {[
                  { icon: CheckCircle2, text: "Garantie 2 ans" },
                  { icon: Clock, text: "Livraison 24-48h" },
                  { icon: Shield, text: "Paiement securise" },
                  { icon: Award, text: "Atelier certifie" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                    <item.icon className="h-4 w-4 text-[#E85D26] shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Turbo image */}
            <div className="relative hidden lg:flex items-center justify-center animate-fade-up-delay">
              <div className="relative w-[440px] h-[440px]">
                {/* Warm glow circle */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#E85D26]/12 via-[#F7941D]/8 to-transparent blur-2xl" />
                {/* Rings */}
                <div className="absolute inset-4 rounded-full border border-[#E85D26]/10" />
                <div className="absolute inset-10 rounded-full border border-[#E85D26]/6" />

                <img
                  src="/images/turbo-default.jpg"
                  alt="Turbocompresseur"
                  className="relative w-full h-full object-contain p-6 drop-shadow-xl"
                />

                {/* Floating badges — glass style on light */}
                <div className="absolute top-10 right-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg shadow-black/8 px-4 py-2.5 border border-white animate-bounce-slow">
                  <p className="text-xs font-bold text-[#E85D26]">Garantie 2 ans</p>
                </div>
                <div className="absolute bottom-14 -left-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg shadow-black/8 px-4 py-2.5 border border-white animate-bounce-slow" style={{ animationDelay: "1.2s" }}>
                  <p className="text-xs font-bold text-[#1A3A5C]">-50% vs neuf</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          {hc.stats.length > 0 && (
            <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up-delay-2">
              {hc.stats.map((stat) => (
                <div key={stat.label} className="rounded-xl p-5 bg-white border border-[rgba(0,0,0,0.08)] shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-2xl sm:text-3xl font-black text-[#E85D26]">{stat.value}</p>
                  <p className="text-xs text-[#6B6B6B] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TRUST BAR — White ─────────────────────────────────────────────── */}
      <TrustBar />

      {/* ── APPLICATIONS — White, colored accent cards ────────────────────── */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#E85D26] mb-3">Nos domaines</p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] tracking-tight mb-3">
              Turbos pour toutes les applications
            </h2>
            <p className="text-[#6B6B6B]">Automobile, marine, industriel — on couvre tout</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Car,
                title: "Automobile",
                desc: "Voitures, utilitaires, poids lourds. Toutes marques, tous modeles. Turbo neuf ou reconditionne.",
                href: "/produits?application=automobile",
                accentClass: "app-card-auto",
              },
              {
                icon: Anchor,
                title: "Marine",
                desc: "Bateaux, yachts, navires de croisiere. Turbos marins adaptes aux conditions extremes.",
                href: "/produits?application=marine",
                accentClass: "app-card-marine",
              },
              {
                icon: Factory,
                title: "Industriel",
                desc: "Groupes electrogenes, engins de chantier, machines agricoles. Solutions sur mesure.",
                href: "/produits?application=industriel",
                accentClass: "app-card-indus",
              },
            ].map((app) => (
              <Link
                key={app.title}
                href={app.href}
                className={`group relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${app.accentClass}`}
              >
                {/* Top accent line */}
                <div className="app-card-line absolute top-0 left-8 right-8 h-0.5 rounded-b-full opacity-70" />

                <div className="app-card-icon w-14 h-14 rounded-xl flex items-center justify-center mb-5">
                  <app.icon className="h-7 w-7 app-card-icon-svg" />
                </div>
                <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">{app.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed mb-5">{app.desc}</p>
                <span className="app-card-link inline-flex items-center gap-1.5 text-sm font-bold">
                  Decouvrir
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── VEHICLE FINDER — dark stays ───────────────────────────────────── */}
      <VehicleFinder />

      {/* ── MAKES GRID — Warm muted bg ────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "var(--ts-canvas)" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#E85D26] mb-3">Par marque</p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] tracking-tight mb-2">
              Trouvez votre turbo par marque
            </h2>
            <p className="text-[#6B6B6B]">Selectionnez votre marque pour voir les turbos compatibles</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {vehicleMakes.map((make) => (
              <Link
                key={make.id}
                href={`/produits?make=${make.slug}`}
                className="group flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-[rgba(0,0,0,0.07)] hover:border-[rgba(232,93,38,0.35)] hover:shadow-lg hover:shadow-[rgba(232,93,38,0.08)] transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-[#F8F7F4] group-hover:bg-[rgba(232,93,38,0.06)] flex items-center justify-center mb-2 transition-colors p-2">
                  <MakeLogo name={make.name} logoUrl={make.logoUrl} className="w-full h-full" />
                </div>
                <span className="text-xs font-semibold text-[#3A3A3A] group-hover:text-[#E85D26] transition-colors">{make.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US — White ─────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-[rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#E85D26] mb-3">Notre difference</p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] tracking-tight">
              Pourquoi TurboSouf ?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Wrench, title: "Atelier integre", desc: "Reconditionnement professionnel dans notre propre atelier. Chaque turbo est teste sur banc d'essai et calibre avant expedition.", accent: "#E85D26" },
              { icon: Shield, title: "Garantie 2 ans", desc: "Tous nos turbos reconditionnes sont couverts par une garantie de 2 ans pieces et main-d'oeuvre.", accent: "#1A3A5C" },
              { icon: Award, title: "Prix competitifs", desc: "Jusqu'a 50% d'economie par rapport au neuf, sans compromis sur la qualite. Paiement en 3x/4x sans frais.", accent: "#E85D26" },
              { icon: Users, title: "Conseil expert", desc: "Notre equipe de specialistes vous accompagne pour trouver le bon turbo compatible avec votre vehicule ou application.", accent: "#1A3A5C" },
              { icon: Star, title: "Multi-applications", desc: "Automobile, marine, industriel — nous couvrons toutes les applications avec des turbos adaptes a chaque usage.", accent: "#E85D26" },
              { icon: Cog, title: "Reconditionnement", desc: "Confiez-nous votre turbo, on le remet a neuf. Diagnostic, reparation et test complet en atelier.", accent: "#1A3A5C" },
            ].map((item) => (
              <div
                key={item.title}
                className="group p-7 rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white hover:border-[rgba(232,93,38,0.25)] hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              >
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${item.accent}12`, border: `1px solid ${item.accent}20` }}>
                  <item.icon className="h-5 w-5" style={{ color: item.accent }} />
                </div>
                <h3 className="text-base font-bold text-[#0A0A0A] mb-2">{item.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND PARTNERS — Warm canvas ──────────────────────────────────── */}
      <section className="py-12 border-t border-[rgba(0,0,0,0.06)]" style={{ backgroundColor: "var(--ts-canvas)" }}>
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-[10px] font-bold text-[#A0A0A0] uppercase tracking-[0.2em] mb-8">
            Nos marques partenaires
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-14">
            {[
              { name: "Garrett", src: "/images/brand-garrett.png" },
              { name: "BorgWarner", src: "/images/brand-borgwarner.png" },
              { name: "Continental", src: "/images/brand-continental.png" },
              { name: "Holset", src: "/images/brand-holset.png" },
              { name: "IHI Turbo", src: "/images/brand-ihi.png" },
              { name: "Mitsubishi", src: "/images/brand-mitsubishi.png" },
              { name: "Toyota", src: "/images/brand-toyota.png" },
            ].map((brand) => (
              <div key={brand.name} className="flex items-center justify-center grayscale opacity-35 hover:grayscale-0 hover:opacity-90 transition-all duration-300" title={brand.name}>
                <img src={brand.src} alt={brand.name} className="h-8 lg:h-10 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIKTOK FEED ──────────────────────────────────────────────────── */}
      <TikTokFeed />

      {/* ── FAQ — Warm muted ──────────────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "var(--ts-muted)" }}>
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#E85D26] mb-3">FAQ</p>
            <h2 className="text-2xl font-black text-[#0A0A0A]">
              Questions frequentes
            </h2>
          </div>
          <div className="space-y-2.5">
            {[
              { q: "Quelle est la garantie sur les turbos reconditionnes ?", a: "Tous nos turbos reconditionnes sont garantis 2 ans, pieces et main-d'oeuvre." },
              { q: "Qu'est-ce que la consigne ?", a: "La consigne est un montant remboursable que vous payez a l'achat d'un turbo en echange standard. Renvoyez votre ancien turbo et nous vous remboursons la consigne." },
              { q: "Quels sont les delais de livraison ?", a: "Livraison standard en 2-3 jours ouvres. Express en 24h. Gratuite des 150 euros." },
              { q: "Faites-vous les turbos pour bateaux et industriel ?", a: "Oui, nous couvrons toutes les applications : automobile, marine (bateaux, yachts) et industriel (groupes electrogenes, engins de chantier)." },
              { q: "Puis-je faire reconditionner mon propre turbo ?", a: "Absolument. Envoyez-nous votre turbo, nous le diagnostiquons et le remettons a neuf dans notre atelier. Devis gratuit." },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-[rgba(0,0,0,0.08)] bg-white overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-[#0A0A0A] hover:bg-[#FAFAF8] transition-colors list-none">
                  {faq.q}
                  <ChevronRight className="h-4 w-4 text-[#E85D26] group-open:rotate-90 transition-transform shrink-0 ml-3" />
                </summary>
                <p className="px-5 pb-5 text-sm text-[#6B6B6B] leading-relaxed border-t border-[rgba(0,0,0,0.05)] pt-3">{faq.a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/faq" className="text-sm font-bold text-[#E85D26] hover:underline">
              Voir toutes les FAQ →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA — Orange gradient ─────────────────────────────────────────── */}
      {(hc.ctaTitle || hc.ctaDescription) && (
        <section className="py-16" style={{ background: "linear-gradient(135deg, #E85D26 0%, #F7941D 100%)" }}>
          <div className="mx-auto max-w-7xl px-4 text-center">
            {hc.ctaTitle && <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">{hc.ctaTitle}</h2>}
            {hc.ctaDescription && <p className="text-white/80 mb-8 max-w-xl mx-auto">{hc.ctaDescription}</p>}
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center h-12 px-7 bg-white text-[#E85D26] font-bold rounded-lg transition-all hover:shadow-xl hover:shadow-black/20"
              >
                Nous contacter
              </Link>
              {hc.ctaPhone && (
                <a href={`tel:${hc.ctaPhone.replace(/\s/g, "")}`} className="inline-flex items-center h-12 px-7 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-lg transition-colors">
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
