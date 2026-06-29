export interface TikTokVideo {
  id: string;
  desc: string;
}

export async function fetchLatestTikTokVideos(username: string, count = 6): Promise<TikTokVideo[]> {
  try {
    const res = await fetch(`https://www.tiktok.com/@${username}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const html = await res.text();

    // TikTok embeds its state in a JSON script tag
    const match = html.match(
      /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__[^"]*" type="application\/json">([^<]+)<\/script>/
    );
    if (!match) return [];

    const data = JSON.parse(match[1]);
    const scope = data?.__DEFAULT_SCOPE__;
    if (!scope) return [];

    // Try known keys where the video list can live
    const candidates = [
      scope["webapp.user-detail"]?.itemList,
      scope["webapp.video-detail"]?.itemList,
    ];

    let items: { id: string; desc?: string }[] = [];
    for (const c of candidates) {
      if (Array.isArray(c) && c.length > 0) {
        items = c;
        break;
      }
    }

    if (!items.length) return [];

    return items.slice(0, count).map((item) => ({
      id: String(item.id),
      desc: item.desc ?? "",
    }));
  } catch {
    return [];
  }
}
