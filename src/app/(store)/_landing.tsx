import Link from "next/link";
import { Wrench, Shield, Award, Star, ChevronRight, Users, CheckCircle2, Clock, Phone, Anchor, Car, Factory, Cog, ArrowRight } from "lucide-react";
import { VehicleFinderHeroSearch } from "@/components/store/vehicle-finder-card";
import { TrustBar } from "@/components/store/trust-bar";
import { MakesGrid } from "@/components/store/makes-grid";
import { TikTokFeed } from "@/components/store/tiktok-feed";
import { SERVER_API_URL, type VehicleMake, type BlogPostListItem } from "@/lib/api";
import { type Locale, getT } from "@/i18n/translations";

const API = SERVER_API_URL;
const BACKEND = SERVER_API_URL;

interface HomepageConfig {
  heroTagline: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroDescription: string;
  stats: { value: string; label: string }[];
  applicationsVisible: boolean;
  applicationsTagline: string;
  applicationsTitle: string;
  applicationsSubtitle: string;
  applications: { title: string; desc: string; href: string }[];
  whyTagline: string;
  whyTitle: string;
  whyItems: { title: string; desc: string }[];
  ctaTitle: string;
  ctaDescription: string;
  ctaPhone: string;
}

interface Banner { id: string; text: string; link: string; active: boolean; bgColor: string }

interface FaqCategory { category: string; items: { q: string; a: string }[] }

async function fetchVehicleMakes(): Promise<VehicleMake[]> {
  try {
    const res = await fetch(`${API}/api/v1/vehicles/makes`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json.data || [];
  } catch { return []; }
}

async function getSiteContent<T>(key: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${BACKEND}/api/v1/site-content/${key}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    const json = await res.json();
    return JSON.parse(json.data.value) as T;
  } catch { return fallback; }
}

const APPLICATION_ICONS = [Car, Anchor, Factory];
const APPLICATION_ACCENT_CLASSES = ["app-card-auto", "app-card-marine", "app-card-indus"];
const WHY_ICONS = [Wrench, Shield, Award, Users, Star, Cog];

export async function LandingPage({ locale }: { locale: Locale }) {
  const t = getT(locale);

  const [vehicleMakes, hc, banners, faqCategories, latestPosts] = await Promise.all([
    fetchVehicleMakes(),
    getSiteContent<HomepageConfig>("homepage", {
      heroTagline: "SPECIALISTE TURBO DEPUIS 2010",
      heroTitle: "Votre expert",
      heroTitleHighlight: "turbocompresseur",
      heroDescription: "",
      stats: [],
      applicationsVisible: true,
      applicationsTagline: "",
      applicationsTitle: "",
      applicationsSubtitle: "",
      applications: [],
      whyTagline: "",
      whyTitle: "",
      whyItems: [],
      ctaTitle: "",
      ctaDescription: "",
      ctaPhone: "",
    }),
    getSiteContent<Banner[]>("banners", []),
    getSiteContent<FaqCategory[]>("faq", []),
    fetch(`${API}/api/v1/blog?pageSize=3`, { cache: "no-store" })
      .then(r => r.json()).then(j => j.data?.items ?? []).catch(() => []),
  ]);

  const activeBanners = banners.filter(b => b.active && b.text);

  const applications = hc.applications && hc.applications.length > 0 ? hc.applications : t.applications.items;
  const whyItems = hc.whyItems && hc.whyItems.length > 0 ? hc.whyItems : t.why.items;

  const flatFaqItems = faqCategories.flatMap(cat => cat.items).slice(0, 5);
  const faqItems = flatFaqItems.length > 0 ? flatFaqItems : t.faq.items;

  return (
    <>
      {/* Promo banners */}
      {activeBanners.map(banner => (
        <div key={banner.id} className="text-center text-white text-sm font-medium py-2 px-4" style={{ backgroundColor: banner.bgColor }}>
          {banner.link ? <Link href={banner.link} className="hover:underline">{banner.text}</Link> : banner.text}
        </div>
      ))}

      {/* ── HERO — Blended white-to-orange gradient ───────────────────── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #ffffff 0%, #fff7f2 30%, #fde4d0 60%, #F06030 85%, #C84010 100%)" }}
      >
        {/* Decorative rings */}
        <div className="absolute top-10 right-10 w-80 h-80 rounded-full border border-white/20 pointer-events-none" />
        <div className="absolute top-24 right-24 w-52 h-52 rounded-full border border-white/15 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border border-[#E85D26]/10 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 lg:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-center">

            {/* ── Left: tagline + title + trust + CTA ── */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="inline-block w-8 h-0.5 bg-[#E85D26] rounded-full" />
                <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-[#E85D26]">
                  {hc.heroTagline}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black text-[#0A0A0A] tracking-tight leading-[1.07] mb-5">
                {hc.heroTitle}
                <br />
                <span className="text-[#E85D26]">{hc.heroTitleHighlight}</span>
              </h1>

              <p className="text-base text-gray-600 mb-8 max-w-lg leading-relaxed">
                {hc.heroDescription}
              </p>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-x-5 gap-y-2.5 mb-8">
                {[
                  { icon: CheckCircle2, text: t.hero.trust.warranty },
                  { icon: Clock, text: t.hero.trust.delivery },
                  { icon: Shield, text: t.hero.trust.payment },
                  { icon: Award, text: t.hero.trust.workshop },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-1.5 text-sm text-gray-600">
                    <item.icon className="h-3.5 w-3.5 text-[#E85D26] shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/produits"
                  className="inline-flex items-center h-11 px-6 font-bold rounded-lg text-sm text-white transition-all hover:shadow-xl hover:shadow-[#E85D26]/40 active:scale-[0.98]"
                  style={{ background: "linear-gradient(180deg,#FF7A45 0%,#E85D26 100%)" }}
                >
                  {t.hero.cta.viewTurbos}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center h-11 px-6 border border-gray-300 bg-white/70 text-gray-700 font-semibold rounded-lg text-sm transition-all hover:border-[#E85D26] hover:text-[#E85D26] backdrop-blur-sm"
                >
                  <Phone className="h-4 w-4 mr-2 text-[#E85D26]" />
                  {t.hero.cta.contact}
                </Link>
              </div>
            </div>

            {/* ── Right: vertical vehicle search card ── */}
            <div className="w-full">
              <VehicleFinderHeroSearch locale={locale} />
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS — Orange banner below hero ─────────────────────────────── */}
      {hc.stats.length > 0 && (
        <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #F06030 0%, #CC4010 100%)" }}>
          {/* Decorative ring */}
          <div className="absolute -top-16 right-20 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -bottom-12 left-10 w-48 h-48 rounded-full border border-white/10 pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {hc.stats.map((stat) => (
                <div key={stat.label} className="rounded-xl p-5 bg-white/15 border border-white/20 backdrop-blur-sm">
                  <p className="text-2xl sm:text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-white/80 mt-1 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/produits"
                className="inline-flex items-center h-11 px-7 font-bold rounded-xl text-sm bg-white text-[#E85D26] hover:bg-orange-50 transition-colors shadow-md"
              >
                {t.hero.cta.viewTurbos}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center h-11 px-7 font-semibold rounded-xl text-sm border-2 border-white/40 text-white hover:bg-white/10 transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                {t.hero.cta.contact}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST BAR — White ─────────────────────────────────────────────── */}
      <TrustBar />

      {/* ── APPLICATIONS — White, colored accent cards ────────────────────── */}
      {hc.applicationsVisible !== false && (
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#E85D26] mb-3">
                {hc.applicationsTagline || t.applications.tagline}
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] tracking-tight mb-3">
                {hc.applicationsTitle || t.applications.title}
              </h2>
              <p className="text-[#6B6B6B]">
                {hc.applicationsSubtitle || t.applications.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {applications.map((app, idx) => {
                const Icon = APPLICATION_ICONS[idx] ?? Car;
                const accentClass = APPLICATION_ACCENT_CLASSES[idx] ?? "app-card-auto";
                return (
                  <Link
                    key={app.title}
                    href={app.href}
                    className={`group relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accentClass}`}
                  >
                    <div className="app-card-line absolute top-0 left-8 right-8 h-0.5 rounded-b-full opacity-70" />
                    <div className="app-card-icon w-14 h-14 rounded-xl flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 app-card-icon-svg" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">{app.title}</h3>
                    <p className="text-sm text-[#6B6B6B] leading-relaxed mb-5">{app.desc}</p>
                    <span className="app-card-link inline-flex items-center gap-1.5 text-sm font-bold">
                      {t.applications.discover}
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── MAKES GRID — Warm muted bg ────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "var(--ts-canvas)" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#E85D26] mb-3">{t.makesGrid.tagline}</p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] tracking-tight mb-2">
              {t.makesGrid.title}
            </h2>
            <p className="text-[#6B6B6B]">{t.makesGrid.subtitle}</p>
          </div>
          <MakesGrid makes={vehicleMakes} />
        </div>
      </section>

      {/* ── WHY CHOOSE US — White ─────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-[rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#E85D26] mb-3">
              {hc.whyTagline || t.why.tagline}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] tracking-tight">
              {hc.whyTitle || t.why.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyItems.map((item, idx) => {
              const Icon = WHY_ICONS[idx] ?? Wrench;
              const accent = idx % 2 === 0 ? "#E85D26" : "#1A3A5C";
              return (
                <div
                  key={item.title}
                  className="group p-7 rounded-2xl border border-[rgba(0,0,0,0.07)] bg-white hover:border-[rgba(232,93,38,0.25)] hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${accent}12`, border: `1px solid ${accent}20` }}>
                    <Icon className="h-5 w-5" style={{ color: accent }} />
                  </div>
                  <h3 className="text-base font-bold text-[#0A0A0A] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BRAND PARTNERS — Warm canvas ──────────────────────────────────── */}
      <section className="py-12 border-t border-[rgba(0,0,0,0.06)]" style={{ backgroundColor: "var(--ts-canvas)" }}>
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-[10px] font-bold text-[#A0A0A0] uppercase tracking-[0.2em] mb-8">
            {t.partners}
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

      {/* ── BLOG ARTICLES ───────────────────────────────────────────────── */}
      {latestPosts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#E85D26] mb-2">{t.blog.tagline}</p>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A0A] tracking-tight">{t.blog.title}</h2>
              </div>
              <Link href="/articles" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#E85D26] hover:underline">
                {t.blog.viewAll} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {latestPosts.map((post: BlogPostListItem) => (
                <Link key={post.id} href={`/articles/${post.slug}`} className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className="h-40 bg-gradient-to-br from-[#E85D26]/10 to-[#1A3A5C]/10 overflow-hidden">
                    {post.featuredImageUrl
                      ? <img src={post.featuredImageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center"><span className="text-3xl font-black text-[#E85D26]/20">TS</span></div>
                    }
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-[#0A0A0A] mb-1 line-clamp-2 group-hover:text-[#E85D26] transition-colors">{post.title}</h3>
                    <p className="text-xs text-[#6B6B6B] line-clamp-2 flex-1">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="sm:hidden mt-6 text-center">
              <Link href="/articles" className="text-sm font-semibold text-[#E85D26] hover:underline">{t.blog.viewAll} →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-[rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

            {/* Left — sticky heading */}
            <div className="lg:col-span-2 lg:sticky lg:top-24">
              <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#E85D26] mb-3">{t.faq.tagline}</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] tracking-tight leading-tight mb-4">
                {t.faq.title.split("\n").map((line, i) => (
                  <span key={i}>{line}{i < t.faq.title.split("\n").length - 1 && <br />}</span>
                ))}
              </h2>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-8">
                {t.faq.subtitle}
              </p>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E85D26] hover:bg-[#d44f1e] text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-[rgba(232,93,38,0.25)]"
              >
                {t.faq.viewAll}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right — accordion */}
            <div className="lg:col-span-3 space-y-3">
              {faqItems.map((faq, idx) => (
                <details key={faq.q} className="group rounded-2xl border border-[rgba(0,0,0,0.08)] bg-[#FAFAF8] overflow-hidden hover:border-[rgba(232,93,38,0.25)] transition-colors">
                  <summary className="flex items-center gap-4 px-6 py-5 cursor-pointer list-none select-none">
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-[rgba(232,93,38,0.1)] text-[#E85D26] text-xs font-black flex items-center justify-center">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-[#0A0A0A]">{faq.q}</span>
                    <span className="shrink-0 w-7 h-7 rounded-full border border-[rgba(0,0,0,0.1)] group-open:border-[#E85D26] group-open:bg-[rgba(232,93,38,0.08)] flex items-center justify-center transition-colors">
                      <ChevronRight className="h-3.5 w-3.5 text-[#E85D26] group-open:rotate-90 transition-transform" />
                    </span>
                  </summary>
                  <div className="px-6 pb-5 pl-[4.25rem]">
                    <p className="text-sm text-[#6B6B6B] leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>

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
                {t.cta.contact}
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
