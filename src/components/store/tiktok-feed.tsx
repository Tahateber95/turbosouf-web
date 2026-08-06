import Link from "next/link";

const TIKTOK_USERNAME = "turbosouf_rosnysousbois";

const VIDEOS = [
  "7456849764714351874",
  "7417868756405243169",
  "7365155722969091361",
  "7654572395876961568",
  "7652363525909679393",
  "7643091411922930977",
];

const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05Z" />
  </svg>
);

export function TikTokFeed() {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0f0f0f 0%, #1a1a2e 60%, #0f0f0f 100%)" }}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E85D26] opacity-[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#69C9D0] opacity-[0.05] rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-semibold mb-4">
              <TikTokIcon />
              @{TIKTOK_USERNAME}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Suivez-nous sur<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #69C9D0, #EE1D52)" }}>
                TikTok
              </span>
            </h2>
            <p className="text-white/50 text-sm mt-2">
              Nos dernières vidéos turbo directement depuis notre atelier
            </p>
          </div>

          <Link
            href={`https://www.tiktok.com/@${TIKTOK_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold text-white border border-white/20 hover:bg-white/10 transition-colors"
          >
            <TikTokIcon />
            Voir toutes nos vidéos
          </Link>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {VIDEOS.map((id, i) => (
            <div
              key={id}
              className="relative rounded-2xl overflow-hidden bg-[#1a1a1a] aspect-[9/16] ring-1 ring-white/10 hover:ring-[#EE1D52]/50 hover:shadow-2xl hover:shadow-[#EE1D52]/10 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <iframe
                src={`https://www.tiktok.com/embed/v2/${id}`}
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={`TikTok video ${id}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <Link
            href={`https://www.tiktok.com/@${TIKTOK_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 h-12 px-7 rounded-2xl text-sm font-bold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #EE1D52 0%, #69C9D0 100%)" }}
          >
            <TikTokIcon />
            Suivre @{TIKTOK_USERNAME}
          </Link>
          <div className="flex-1 h-px bg-white/10" />
        </div>
      </div>
    </section>
  );
}
