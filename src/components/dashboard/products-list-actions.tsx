"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminDeleteProduct } from "@/lib/admin-api";
import type { Category } from "@/lib/api";

interface FiltersProps {
  categories: Category[];
  activeSearch: string;
  activeCategory: string;
  activeStock: string;
}

export function DashboardProductsFilters({ categories, activeSearch, activeCategory, activeStock }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(activeSearch);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", search.trim());
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, SKU, référence..."
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
        />
      </form>
      <select
        value={activeCategory}
        onChange={(e) => updateFilter("category", e.target.value)}
        className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white"
      >
        <option value="">Toutes catégories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>{c.name}</option>
        ))}
      </select>
      <select
        value={activeStock}
        onChange={(e) => updateFilter("stock", e.target.value)}
        className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white"
      >
        <option value="">Tout stock</option>
        <option value="low">Stock faible</option>
        <option value="out">Rupture</option>
      </select>
    </div>
  );
}

interface DeleteProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${productName}" ? Cette action est irréversible.`)) return;
    setDeleting(true);
    try {
      await adminDeleteProduct(productId);
      toast.success("Produit supprimé");
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
      setDeleting(false);
    }
  };

  return (
    <button onClick={handleDelete} disabled={deleting} className="text-red-500 hover:text-red-700 disabled:opacity-50">
      {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
    </button>
  );
}
