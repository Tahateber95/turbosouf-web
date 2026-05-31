import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { SERVER_API_URL, type ProductListItem, type PagedResult, type Category, type Brand } from "@/lib/api";

const API = SERVER_API_URL;

export default async function ProductsPage() {
  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    fetch(`${API}/api/v1/products?PageSize=12`, { next: { revalidate: 30 } }).then(r => r.json()).catch(() => ({ data: { items: [], totalCount: 0 } })),
    fetch(`${API}/api/v1/categories`, { next: { revalidate: 60 } }).then(r => r.json()).catch(() => ({ data: [] })),
    fetch(`${API}/api/v1/brands`, { next: { revalidate: 60 } }).then(r => r.json()).catch(() => ({ data: [] })),
  ]);

  const products: ProductListItem[] = productsRes.data?.items || [];
  const totalCount: number = productsRes.data?.totalCount || 0;
  const categories: Category[] = (categoriesRes.data || []).filter((c: Category) => c.isActive);
  const brands: Brand[] = (brandsRes.data || []).filter((b: Brand) => b.isActive);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-600">Accueil</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Tous les produits</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--ts-primary-900)] tracking-tight">
            Tous les produits
          </h1>
          <p className="text-sm text-gray-500 mt-1">{totalCount} resultats</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
              </h3>

              {/* Category filter */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Categorie</p>
                <div className="space-y-1.5">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[var(--ts-primary-500)]">
                      <input type="checkbox" className="rounded border-gray-300 text-[var(--ts-primary-500)] focus:ring-[var(--ts-primary-500)]" />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand filter */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Marque</p>
                <div className="space-y-1.5">
                  {brands.map((brand) => (
                    <label key={brand.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[var(--ts-primary-500)]">
                      <input type="checkbox" className="rounded border-gray-300 text-[var(--ts-primary-500)] focus:ring-[var(--ts-primary-500)]" />
                      {brand.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition filter */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Etat</p>
                <div className="space-y-1.5">
                  {[{ l: "Reconditionne", v: "Refurbished" }, { l: "Neuf", v: "New" }, { l: "Echange standard", v: "ExchangeStandard" }].map((cond) => (
                    <label key={cond.v} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[var(--ts-primary-500)]">
                      <input type="radio" name="condition" className="text-[var(--ts-primary-500)] focus:ring-[var(--ts-primary-500)]" />
                      {cond.l}
                    </label>
                  ))}
                </div>
              </div>

              {/* In stock */}
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-[var(--ts-primary-500)] focus:ring-[var(--ts-primary-500)]" />
                En stock uniquement
              </label>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <select className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]">
                  <option>Plus recents</option>
                  <option>Prix croissant</option>
                  <option>Prix decroissant</option>
                  <option>Nom A-Z</option>
                  <option>Populaires</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun produit trouve.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
