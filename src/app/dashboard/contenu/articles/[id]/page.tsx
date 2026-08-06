"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminGetBlogPosts, adminUpdateBlogPost, type UpdateBlogPostRequest } from "@/lib/admin-api";
import type { BlogPostListItem } from "@/lib/api";
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<BlogPostListItem | null>(null);
  const [form, setForm] = useState<UpdateBlogPostRequest>({
    title: "",
    excerpt: "",
    content: "",
    featuredImageUrl: "",
    author: "",
    status: "Draft",
    tags: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminGetBlogPosts(1, 200)
      .then(data => {
        const found = data.items.find(p => p.id === id);
        if (!found) {
          toast.error("Article introuvable");
          router.push("/dashboard/contenu/articles");
          return;
        }
        setPost(found);
        // For full content we need to fetch by slug using public endpoint
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://89.117.54.131:5280"}/api/v1/blog/${found.slug}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("turbosouf_token") ?? ""}` },
        })
          .then(r => r.json())
          .then(json => {
            const detail = json.data;
            if (detail) {
              setForm({
                title: detail.title,
                excerpt: detail.excerpt,
                content: detail.content,
                featuredImageUrl: detail.featuredImageUrl ?? "",
                author: detail.author ?? "",
                status: detail.status,
                tags: detail.tags ?? "",
              });
            }
          })
          .catch(() => {
            setForm({
              title: found.title,
              excerpt: found.excerpt,
              content: "",
              featuredImageUrl: found.featuredImageUrl ?? "",
              author: found.author ?? "",
              status: found.status,
              tags: found.tags ?? "",
            });
          });
      })
      .catch(() => toast.error("Erreur lors du chargement"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const set = (field: keyof UpdateBlogPostRequest, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      toast.error("Titre, extrait et contenu sont obligatoires");
      return;
    }
    setSaving(true);
    try {
      await adminUpdateBlogPost(id, {
        ...form,
        featuredImageUrl: form.featuredImageUrl?.trim() || null,
        author: form.author?.trim() || null,
        tags: form.tags?.trim() || null,
      });
      toast.success("Article mis a jour");
      router.push("/dashboard/contenu/articles");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la mise a jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/contenu/articles" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Modifier l&apos;article</h1>
          <p className="text-sm text-gray-500 line-clamp-1">{post?.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Contenu</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Titre *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              placeholder="Titre de l'article"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D26]/30 focus:border-[#E85D26]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Extrait *</label>
            <textarea
              value={form.excerpt}
              onChange={e => set("excerpt", e.target.value)}
              placeholder="Courte description de l'article"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D26]/30 focus:border-[#E85D26] resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contenu *</label>
            <RichTextEditor
              value={form.content}
              onChange={v => set("content", v)}
              placeholder="Rédigez le contenu de l'article..."
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Informations</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">URL image a la une</label>
            <input
              type="text"
              value={form.featuredImageUrl ?? ""}
              onChange={e => set("featuredImageUrl", e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D26]/30 focus:border-[#E85D26]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Auteur</label>
              <input
                type="text"
                value={form.author ?? ""}
                onChange={e => set("author", e.target.value)}
                placeholder="Nom de l'auteur"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D26]/30 focus:border-[#E85D26]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                value={form.tags ?? ""}
                onChange={e => set("tags", e.target.value)}
                placeholder="Turbo, Automobile, Conseil"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D26]/30 focus:border-[#E85D26]"
              />
              <p className="text-xs text-gray-400 mt-1">Separes par des virgules</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Statut</label>
            <select
              value={form.status}
              onChange={e => set("status", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D26]/30 focus:border-[#E85D26] bg-white"
            >
              <option value="Draft">Brouillon</option>
              <option value="Published">Publie</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{ background: "linear-gradient(180deg,#FF7A45 0%,#E85D26 100%)" }}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Enregistrer
          </button>
          <Link href="/dashboard/contenu/articles" className="text-sm text-gray-500 hover:text-gray-700">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
