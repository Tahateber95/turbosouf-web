import { ProductCard } from "@/components/store/product-card";
import Link from "next/link";
import type { ProductListItem } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://89.117.54.131:5280";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryName = decodeURIComponent(category).replace(/-/g, " ");

  let products: ProductListItem[] = [];
  let totalCount = 0;

  try {
    const res = await fetch(
      `${API}/api/v1/products?CategorySlug=${encodeURIComponent(category)}&PageSize=12`,
      { next: { revalidate: 30 } }
    );
    const json = await res.json();
    products = json.data?.items || [];
    totalCount = json.data?.totalCount || 0;
  } catch {
    // fallback to empty
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-600">Accueil</Link>
            <span>/</span>
            <Link href="/produits" className="hover:text-gray-600">Produits</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium capitalize">{categoryName}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--ts-primary-900)] tracking-tight capitalize">
            {categoryName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{totalCount} resultats</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun produit trouve dans cette categorie.</p>
          </div>
        )}
      </div>
    </div>
  );
}
