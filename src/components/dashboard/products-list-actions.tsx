"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminDeleteProduct, adminGetProductsList } from "@/lib/admin-api";
import { StatusBadge } from "@/components/dashboard/status-badge";
import type { Category, ProductListItem } from "@/lib/api";

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

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

interface ProductsTableProps {
  initialProducts: ProductListItem[];
}

export function ProductsTable({ initialProducts }: ProductsTableProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductListItem[]>(initialProducts);

  const buildApiParams = () => {
    const p = new URLSearchParams();
    p.set("PageSize", "25");
    const page = searchParams.get("page");
    if (page) p.set("Page", page);
    const search = searchParams.get("search");
    if (search) p.set("Search", search);
    const category = searchParams.get("category");
    if (category) p.set("CategorySlug", category);
    const stock = searchParams.get("stock");
    if (stock === "low") p.set("LowStock", "true");
    if (stock === "out") p.set("OutOfStock", "true");
    return p;
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Supprimer "${productName}" ? Cette action est irréversible.`)) return;
    // Optimistic removal so the UI feels instant
    const snapshot = products;
    setProducts(prev => prev.filter(p => p.id !== productId));
    try {
      await adminDeleteProduct(productId);
      // Re-fetch from the dedicated admin endpoint to get the ground truth from the API.
      // The admin-list endpoint always excludes IsDeleted products, so the deleted
      // product will not appear regardless of any IsActive flag.
      const fresh = await adminGetProductsList(buildApiParams());
      setProducts(fresh.items);
      toast.success("Produit supprimé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
      setProducts(snapshot);
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-8 text-center text-gray-500">Aucun produit trouvé.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
              <th className="px-5 py-3 font-medium">Produit</th>
              <th className="px-5 py-3 font-medium">Réf. turbo</th>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Marque</th>
              <th className="px-5 py-3 font-medium text-right">Prix HT</th>
              <th className="px-5 py-3 font-medium text-right">Stock</th>
              <th className="px-5 py-3 font-medium">État</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <ProductRow key={p.id} product={p} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductRow({
  product: p,
  onDelete,
}: {
  product: ProductListItem;
  onDelete: (id: string, name: string) => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleClick = async () => {
    setDeleting(true);
    await onDelete(p.id, p.name);
    setDeleting(false);
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-3">
        <div className="font-medium text-gray-900">{p.name}</div>
        {p.vehicleSummary && <div className="text-[11px] text-gray-400 mt-0.5">{p.vehicleSummary}</div>}
      </td>
      <td className="px-5 py-3 font-mono text-xs font-semibold text-[var(--ts-primary-500)]">{p.oemReference ?? "—"}</td>
      <td className="px-5 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
      <td className="px-5 py-3 text-gray-600">{p.brandName ?? "—"}</td>
      <td className="px-5 py-3 text-right font-semibold">{formatPrice(p.priceHT)}</td>
      <td className="px-5 py-3 text-right">
        <span className={`font-semibold ${p.stockQuantity <= 5 ? "text-red-600" : "text-gray-900"}`}>
          {p.stockQuantity}
        </span>
      </td>
      <td className="px-5 py-3">
        {p.isFeatured && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Mis en avant
          </span>
        )}
        <StatusBadge status={p.condition === "Refurbished" ? "Reconditionne" : p.condition === "New" ? "Neuf" : "Echange Std"} />
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-3 justify-end">
          <Link
            href={`/dashboard/produits/${p.slug}`}
            className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline"
          >
            Modifier
          </Link>
          <button onClick={handleClick} disabled={deleting} className="text-red-500 hover:text-red-700 disabled:opacity-50">
            {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </td>
    </tr>
  );
}

// Keep for backward compat (unused but exported)
interface DeleteProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${productName}" ? Cette action est irréversible.`)) return;
    setDeleting(true);
    try {
      await adminDeleteProduct(productId);
      toast.success("Produit supprimé");
      router.refresh();
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
