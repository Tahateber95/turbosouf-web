import Link from "next/link";
import { Calendar, User, Tag, ArrowRight } from "lucide-react";
import { SERVER_API_URL, type BlogPostListItem } from "@/lib/api";

const API = SERVER_API_URL;

async function getPosts(): Promise<BlogPostListItem[]> {
  try {
    const res = await fetch(`${API}/api/v1/blog?pageSize=50`, { cache: "no-store" });
    const json = await res.json();
    return json.data?.items ?? [];
  } catch { return []; }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function ArticlesPage() {
  const posts = await getPosts();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#E85D26] mb-3">BLOG</p>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A0A0A] tracking-tight mb-3">Nos Articles</h1>
          <p className="text-[#6B6B6B] max-w-xl mx-auto">Conseils, actualites et guides techniques sur les turbocompresseurs.</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Aucun article publie pour le moment.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link key={post.id} href={`/articles/${post.slug}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-[#E85D26]/10 to-[#1A3A5C]/10 overflow-hidden">
                  {post.featuredImageUrl ? (
                    <img src={post.featuredImageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-black text-[#E85D26]/20">TS</span>
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  {post.tags && (
                    <div className="flex items-center gap-1 mb-2">
                      <Tag className="h-3 w-3 text-[#E85D26]" />
                      <span className="text-[11px] font-semibold text-[#E85D26] uppercase tracking-wide">{post.tags.split(",")[0].trim()}</span>
                    </div>
                  )}
                  <h2 className="text-base font-bold text-[#0A0A0A] mb-2 line-clamp-2 group-hover:text-[#E85D26] transition-colors">{post.title}</h2>
                  <p className="text-sm text-[#6B6B6B] line-clamp-3 flex-1 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-[#A0A0A0] pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      {post.author && (
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>
                      )}
                      {post.publishedAt && (
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(post.publishedAt)}</span>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#E85D26] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
