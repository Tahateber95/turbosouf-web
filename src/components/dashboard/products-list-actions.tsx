"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Trash2, Loader2, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { adminDeleteProduct, adminGetProductsList, adminSetProductVisibility } from "@/lib/admin-api";
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

const PAGE_SIZE = 25;

export function ProductsTable() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get("page") ?? "1");

  const buildApiParams = () => {
    const p = new URLSearchParams();
    p.set("PageSize", String(PAGE_SIZE));
    p.set("Page", String(currentPage));
    p.set("IncludeInactive", "true");
    const search = searchParams.get("search");
    if (search) p.set("Search", search);
    const category = searchParams.get("category");
    if (category) p.set("CategorySlug", category);
    const stock = searchParams.get("stock");
    if (stock === "low") p.set("LowStock", "true");
    if (stock === "out") p.set("OutOfStock", "true");
    return p;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await adminGetProductsList(buildApiParams());
      setProducts(result.items);
      setTotalCount(result.totalCount);
    } catch {
      // redirectToLogin is called internally if 401
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Supprimer "${productName}" ? Cette action est irréversible.`)) return;
    const snapshot = products;
    setProducts(prev => prev.filter(p => p.id !== productId));
    try {
      await adminDeleteProduct(productId);
      const fresh = await adminGetProductsList(buildApiParams());
      setProducts(fresh.items);
      setTotalCount(fresh.totalCount);
      toast.success("Produit supprimé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
      setProducts(snapshot);
    }
  };

  const handleToggleVisibility = async (productId: string, currentIsActive: boolean) => {
    const newIsActive = !currentIsActive;
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isActive: newIsActive } : p));
    try {
      await adminSetProductVisibility(productId, newIsActive);
      toast.success(newIsActive ? "Produit publié" : "Produit mis en brouillon");
    } catch (err) {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, isActive: currentIsActive } : p));
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const buildPageUrl = (page: number) => {
    const p = new URLSearchParams(searchParams.toString());
    if (page > 1) p.set("page", String(page)); else p.delete("page");
    const qs = p.toString();
    return `/dashboard/produits${qs ? `?${qs}` : ""}`;
  };

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500">{loading ? "Chargement…" : `${totalCount} produit${totalCount !== 1 ? "s" : ""} au total`}</div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="px-5 py-8 flex items-center justify-center text-gray-400 gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
          </div>
        ) : products.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-500">Aucun produit trouvé.</div>
        ) : (
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
                  <ProductRow key={p.id} product={p} onDelete={handleDelete} onToggleVisibility={handleToggleVisibility} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Link
              href={buildPageUrl(currentPage - 1)}
              className={`h-9 w-9 flex items-center justify-center rounded-lg border text-sm transition-colors ${
                currentPage <= 1
                  ? "border-gray-100 text-gray-300 pointer-events-none"
                  : "border-gray-200 text-gray-600 hover:border-[var(--ts-primary-500)] hover:text-[var(--ts-primary-500)]"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="h-9 w-9 flex items-center justify-center text-sm text-gray-400">…</span>
                ) : (
                  <Link
                    key={p}
                    href={buildPageUrl(p as number)}
                    className={`h-9 w-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                      p === currentPage
                        ? "bg-[var(--ts-primary-500)] border-[var(--ts-primary-500)] text-white"
                        : "border-gray-200 text-gray-600 hover:border-[var(--ts-primary-500)] hover:text-[var(--ts-primary-500)]"
                    }`}
                  >
                    {p}
                  </Link>
                )
              )}

            <Link
              href={buildPageUrl(currentPage + 1)}
              className={`h-9 w-9 flex items-center justify-center rounded-lg border text-sm transition-colors ${
                currentPage >= totalPages
                  ? "border-gray-100 text-gray-300 pointer-events-none"
                  : "border-gray-200 text-gray-600 hover:border-[var(--ts-primary-500)] hover:text-[var(--ts-primary-500)]"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            Page {currentPage} sur {totalPages} · {totalCount} produits
          </p>
        </>
      )}
    </div>
  );
}

function ProductRow({
  product: p,
  onDelete,
  onToggleVisibility,
}: {
  product: ProductListItem;
  onDelete: (id: string, name: string) => Promise<void>;
  onToggleVisibility: (id: string, currentIsActive: boolean) => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(p.id, p.name);
    setDeleting(false);
  };

  const handleToggle = async () => {
    setToggling(true);
    await onToggleVisibility(p.id, p.isActive);
    setToggling(false);
  };

  return (
    <tr className={`hover:bg-gray-50/50 transition-colors ${!p.isActive ? "opacity-60" : ""}`}>
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
        <div className="flex flex-wrap items-center gap-1">
          {!p.isActive && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
              Brouillon
            </span>
          )}
          {p.isFeatured && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Mis en avant
            </span>
          )}
          <StatusBadge status={p.conditionLabel || p.condition} />
        </div>
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={handleToggle}
            disabled={toggling}
            title={p.isActive ? "Mettre en brouillon" : "Publier"}
            className={`text-xs font-medium px-2 py-1 rounded-md border transition-colors disabled:opacity-50 ${
              p.isActive
                ? "border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                : "border-green-200 text-green-600 hover:border-green-400 hover:bg-green-50"
            }`}
          >
            {toggling ? <Loader2 className="h-3 w-3 animate-spin" /> : p.isActive ? "Brouillon" : "Publier"}
          </button>
          <Link
            href={`/dashboard/produits/${p.slug}`}
            className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline"
          >
            Modifier
          </Link>
          <Link
            href={`/dashboard/produits/nouveau?from=${p.slug}`}
            title="Dupliquer ce produit"
            className="text-gray-400 hover:text-[var(--ts-primary-500)] transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
          </Link>
          <button onClick={handleDelete} disabled={deleting} className="text-red-500 hover:text-red-700 disabled:opacity-50">
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
