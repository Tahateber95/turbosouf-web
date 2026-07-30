import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { SERVER_API_URL, type ProductListItem, type Category, type Brand } from "@/lib/api";
import { StoreFilters } from "@/components/store/store-filters";

const API = SERVER_API_URL;

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  // Build API query string — param names must match backend ProductFilterRequest
  const apiParams = new URLSearchParams();
  apiParams.set("PageSize", "24");

  if (params.search) apiParams.set("Search", String(params.search));
  if (params.engineId) apiParams.set("VehicleEngineId", String(params.engineId));
  if (params.make) apiParams.set("MakeSlug", String(params.make));
  if (params.category) apiParams.set("CategorySlug", String(params.category));
  if (params.brand) apiParams.set("BrandId", String(params.brand));
  if (params.condition) apiParams.set("Condition", String(params.condition));
  if (params.inStock === "true") apiParams.set("InStock", "true");
  if (params.sort) apiParams.set("Sort", String(params.sort));
  if (params.page) apiParams.set("Page", String(params.page));

  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    fetch(`${API}/api/v1/products?${apiParams}`, { cache: "no-store" }).then(r => r.json()).catch(() => ({ data: { items: [], totalCount: 0 } })),
    fetch(`${API}/api/v1/categories`, { cache: "no-store" }).then(r => r.json()).catch(() => ({ data: [] })),
    fetch(`${API}/api/v1/brands`, { cache: "no-store" }).then(r => r.json()).catch(() => ({ data: [] })),
  ]);

  const products: ProductListItem[] = productsRes.data?.items || [];
  const totalCount: number = productsRes.data?.totalCount || 0;
  const categories: Category[] = (categoriesRes.data || []).filter((c: Category) => c.isActive);
  const brands: Brand[] = (brandsRes.data || []).filter((b: Brand) => b.isActive);

  const PAGE_SIZE = 24;
  const currentPage = params.page ? parseInt(String(params.page)) : 1;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const buildPageUrl = (page: number) => {
    const p = new URLSearchParams();
    if (params.search) p.set("search", String(params.search));
    if (params.engineId) p.set("engineId", String(params.engineId));
    if (params.make) p.set("make", String(params.make));
    if (params.category) p.set("category", String(params.category));
    if (params.brand) p.set("brand", String(params.brand));
    if (params.condition) p.set("condition", String(params.condition));
    if (params.inStock === "true") p.set("inStock", "true");
    if (params.sort) p.set("sort", String(params.sort));
    if (page > 1) p.set("page", String(page));
    const qs = p.toString();
    return `/produits${qs ? `?${qs}` : ""}`;
  };

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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
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
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="h-9 w-9 flex items-center justify-center text-sm text-gray-400">…</span>
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
            )}

            {totalPages > 1 && (
              <p className="text-center text-xs text-gray-400 mt-3">
                Page {currentPage} sur {totalPages} · {totalCount} produits
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
