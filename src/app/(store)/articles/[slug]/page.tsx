import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, Tag, ChevronRight, ArrowLeft } from "lucide-react";
import { SERVER_API_URL, type BlogPostDetail } from "@/lib/api";

const API = SERVER_API_URL;

async function getPost(slug: string): Promise<BlogPostDetail | null> {
  try {
    const res = await fetch(`${API}/api/v1/blog/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch { return null; }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Featured image */}
      {post.featuredImageUrl && (
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-[#0A0A0A]">
          <img src={post.featuredImageUrl} alt={post.title} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/articles" className="hover:text-gray-600">Articles</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600 font-medium truncate max-w-[200px]">{post.title}</span>
        </nav>

        <article className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10">
          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.split(",").map(t => (
                <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E85D26]/10 text-[11px] font-semibold text-[#E85D26]">
                  <Tag className="h-3 w-3" />{t.trim()}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A0A0A] tracking-tight mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#A0A0A0] mb-6 pb-6 border-b border-gray-100">
            {post.author && <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{post.author}</span>}
            {post.publishedAt && <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(post.publishedAt)}</span>}
          </div>

          <p className="text-lg text-[#6B6B6B] font-medium mb-8 leading-relaxed">{post.excerpt}</p>

          {/<[a-z][\s\S]*>/i.test(post.content) ? (
            // HTML from the rich-text editor — explicit selectors (same as editor preview)
            <div
              className="text-sm text-[#3A3A3A] leading-relaxed
                [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-[#0A0A0A] [&_h2]:mt-8 [&_h2]:mb-3
                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#0A0A0A] [&_h3]:mt-6 [&_h3]:mb-2
                [&_p]:mb-4 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                [&_li]:mb-1.5
                [&_strong]:font-bold [&_strong]:text-[#0A0A0A]
                [&_em]:italic
                [&_a]:text-[#E85D26] [&_a]:underline
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#E85D26] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-4
                [&_hr]:border-gray-200 [&_hr]:my-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            // Plain text seeded directly into DB — convert newlines to paragraphs
            <div className="text-sm text-[#3A3A3A] leading-relaxed space-y-4">
              {post.content
                .split(/\n{2,}/)
                .map((block) => block.trim())
                .filter(Boolean)
                .map((block, i) => (
                  <p key={i} style={{ whiteSpace: "pre-line" }}>{block}</p>
                ))}
            </div>
          )}
        </article>

        <div className="mt-8">
          <Link href="/articles" className="inline-flex items-center gap-2 text-sm font-semibold text-[#E85D26] hover:underline">
            <ArrowLeft className="h-4 w-4" /> Retour aux articles
          </Link>
        </div>
      </div>
    </div>
  );
}
