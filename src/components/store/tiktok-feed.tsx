import Link from "next/link";
import { fetchLatestTikTokVideos } from "@/lib/tiktok";

const TIKTOK_USERNAME = "turbosouf_rosnysousbois";

export async function TikTokFeed() {
  const videos = await fetchLatestTikTokVideos(TIKTOK_USERNAME, 6);

  if (!videos.length) return null;

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
            Suivez-nous sur TikTok
          </h2>
          <p className="text-gray-500">
            Nos dernières vidéos turbo directement depuis notre atelier
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {videos.map((video) => (
            <div
              key={video.id}
              className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] shadow-md hover:shadow-xl transition-shadow"
            >
              <iframe
                src={`https://www.tiktok.com/embed/v2/${video.id}`}
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={video.desc || "TikTok video"}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href={`https://www.tiktok.com/@${TIKTOK_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-11 px-6 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05Z" />
            </svg>
            Voir toutes nos vidéos
          </Link>
        </div>
      </div>
    </section>
  );
}
