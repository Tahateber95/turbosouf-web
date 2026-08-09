import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { SERVER_API_URL, type ProductListItem, type Category } from "@/lib/api";
import { DashboardProductsFilters, ProductsTable } from "@/components/dashboard/products-list-actions";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  let products: ProductListItem[] = [];
  let totalCount = 0;
  let categories: Category[] = [];

  const PAGE_SIZE = 25;
  const currentPage = params.page ? parseInt(String(params.page)) : 1;

  const apiParams = new URLSearchParams();
  apiParams.set("PageSize", String(PAGE_SIZE));
  apiParams.set("Page", String(currentPage));
  if (params.search) apiParams.set("Search", String(params.search));
  if (params.category) apiParams.set("CategorySlug", String(params.category));
  if (params.stock === "low") apiParams.set("LowStock", "true");
  if (params.stock === "out") apiParams.set("OutOfStock", "true");

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${SERVER_API_URL}/api/v1/products?${apiParams}`, { cache: "no-store" }).then(r => r.json()),
      fetch(`${SERVER_API_URL}/api/v1/categories`, { cache: "no-store" }).then(r => r.json()),
    ]);
    products = productsRes.data?.items || [];
    totalCount = productsRes.data?.totalCount || 0;
    categories = categoriesRes.data || [];
  } catch {
    // fallback to empty
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const buildPageUrl = (page: number) => {
    const p = new URLSearchParams();
    if (params.search) p.set("search", String(params.search));
    if (params.category) p.set("category", String(params.category));
    if (params.stock) p.set("stock", String(params.stock));
    if (page > 1) p.set("page", String(page));
    const qs = p.toString();
    return `/dashboard/produits${qs ? `?${qs}` : ""}`;
  };

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

      {/* Filters - client component */}
      <DashboardProductsFilters
        categories={categories}
        activeSearch={params.search ? String(params.search) : ""}
        activeCategory={params.category ? String(params.category) : ""}
        activeStock={params.stock ? String(params.stock) : ""}
      />

      {/* Table */}
      <ProductsTable initialProducts={products} />

      {totalPages > 1 && (
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
      )}

      {totalPages > 1 && (
        <p className="text-center text-xs text-gray-400 mt-3">
          Page {currentPage} sur {totalPages} · {totalCount} produits
        </p>
      )}
    </div>
  );
}
