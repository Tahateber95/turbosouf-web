"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { adminGetBlogPosts, adminDeleteBlogPost } from "@/lib/admin-api";
import type { BlogPostListItem } from "@/lib/api";

function StatusBadge({ status }: { status: string }) {
  const isPublished = status === "Published";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
      isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
    }`}>
      {isPublished ? "Publie" : "Brouillon"}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function ArticlesListPage() {
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    adminGetBlogPosts()
      .then(data => setPosts(data.items))
      .catch(() => toast.error("Erreur lors du chargement des articles"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer l'article "${title}" ?`)) return;
    setDeletingId(id);
    try {
      await adminDeleteBlogPost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      toast.success("Article supprime");
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/contenu" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Articles</h1>
            <p className="text-sm text-gray-500">Blog et actualites du site</p>
          </div>
        </div>
        <Link
          href="/dashboard/contenu/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(180deg,#FF7A45 0%,#E85D26 100%)" }}
        >
          <Plus className="h-4 w-4" />
          Nouvel article
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">
          Aucun article. <Link href="/dashboard/contenu/articles/new" className="text-[#E85D26] font-semibold hover:underline">Creer le premier</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Titre</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Auteur</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900 line-clamp-1">{post.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{post.excerpt}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{post.author ?? "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={post.status} /></td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                    {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/dashboard/contenu/articles/${post.id}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#E85D26] transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deletingId === post.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Supprimer"
                      >
                        {deletingId === post.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
