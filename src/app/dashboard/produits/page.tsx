import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { SERVER_API_URL, type ProductListItem, type Category } from "@/lib/api";

function formatPrice(n: number) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n); }

export default async function ProductsPage() {
  let products: ProductListItem[] = [];
  let totalCount = 0;
  let categories: Category[] = [];

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${SERVER_API_URL}/api/v1/products?PageSize=50`, { next: { revalidate: 30 } }).then(r => r.json()),
      fetch(`${SERVER_API_URL}/api/v1/categories`, { next: { revalidate: 60 } }).then(r => r.json()),
    ]);
    products = productsRes.data?.items || [];
    totalCount = productsRes.data?.totalCount || 0;
    categories = categoriesRes.data || [];
  } catch {
    // fallback to empty
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Produits</h1>
          <p className="text-sm text-gray-500">{totalCount} produits au total</p>
        </div>
        <Link
          href="/dashboard/produits/nouveau"
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouveau produit
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, SKU, référence..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
          />
        </div>
        <select className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white">
          <option value="">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white">
          <option value="">Tout stock</option>
          <option>En stock</option>
          <option>Stock faible</option>
          <option>Rupture</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
                <th className="px-5 py-3 font-medium">Produit</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Catégorie</th>
                <th className="px-5 py-3 font-medium">Marque</th>
                <th className="px-5 py-3 font-medium text-right">Prix HT</th>
                <th className="px-5 py-3 font-medium text-right">Stock</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
                  <td className="px-5 py-3 text-gray-600">{p.categoryName ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-600">{p.brandName ?? "—"}</td>
                  <td className="px-5 py-3 text-right font-semibold">{formatPrice(p.priceHT)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`font-semibold ${p.stockQuantity <= 5 ? "text-red-600" : "text-gray-900"}`}>
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={p.isFeatured ? "Active" : "Inactive"} />
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/dashboard/produits/${p.slug}`}
                      className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-500">Aucun produit trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
