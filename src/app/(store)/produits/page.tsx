import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { SERVER_API_URL, type ProductListItem, type Category, type Brand } from "@/lib/api";
import { StoreFilters } from "@/components/store/store-filters";

const API = SERVER_API_URL;

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  // Build API query string from search params
  const apiParams = new URLSearchParams();
  apiParams.set("PageSize", "24");

  if (params.search) apiParams.set("Search", String(params.search));
  if (params.engineId) apiParams.set("EngineId", String(params.engineId));
  if (params.make) apiParams.set("Make", String(params.make));
  if (params.application) apiParams.set("Application", String(params.application));
  if (params.category) apiParams.set("Category", String(params.category));
  if (params.brand) apiParams.set("Brand", String(params.brand));
  if (params.condition) apiParams.set("Condition", String(params.condition));
  if (params.inStock === "true") apiParams.set("InStock", "true");
  if (params.sort) apiParams.set("SortBy", String(params.sort));
  if (params.page) apiParams.set("Page", String(params.page));

  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    fetch(`${API}/api/v1/products?${apiParams}`, { next: { revalidate: 30 } }).then(r => r.json()).catch(() => ({ data: { items: [], totalCount: 0 } })),
    fetch(`${API}/api/v1/categories`, { next: { revalidate: 60 } }).then(r => r.json()).catch(() => ({ data: [] })),
    fetch(`${API}/api/v1/brands`, { next: { revalidate: 60 } }).then(r => r.json()).catch(() => ({ data: [] })),
  ]);

  const products: ProductListItem[] = productsRes.data?.items || [];
  const totalCount: number = productsRes.data?.totalCount || 0;
  const categories: Category[] = (categoriesRes.data || []).filter((c: Category) => c.isActive);
  const brands: Brand[] = (brandsRes.data || []).filter((b: Brand) => b.isActive);

  // Derive page title from active filters
  let pageTitle = "Tous les produits";
  if (params.search) pageTitle = `Résultats pour "${params.search}"`;
  else if (params.make) pageTitle = `Produits pour ${String(params.make).replace(/-/g, " ")}`;
  else if (params.application) pageTitle = `${String(params.application)}`;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-600">Accueil</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Produits</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--ts-primary-900)] tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{totalCount} résultats</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filters - client component */}
          <StoreFilters
            categories={categories}
            brands={brands}
            activeCategory={params.category ? String(params.category) : undefined}
            activeBrand={params.brand ? String(params.brand) : undefined}
            activeCondition={params.condition ? String(params.condition) : undefined}
            activeInStock={params.inStock === "true"}
            activeSort={params.sort ? String(params.sort) : undefined}
          />

          {/* Product grid */}
          <div className="flex-1">
            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun produit trouvé.</p>
                {(params.search || params.category || params.brand || params.condition) && (
                  <Link href="/produits" className="text-sm text-[var(--ts-primary-500)] hover:underline mt-2 inline-block">
                    Effacer les filtres
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
