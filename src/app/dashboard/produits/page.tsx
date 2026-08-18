import Link from "next/link";
import { Plus } from "lucide-react";
import { SERVER_API_URL, type Category } from "@/lib/api";
import { DashboardProductsFilters, ProductsTable } from "@/components/dashboard/products-list-actions";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  let categories: Category[] = [];

  try {
    const categoriesRes = await fetch(`${SERVER_API_URL}/api/v1/categories`, { cache: "no-store" }).then(r => r.json());
    categories = categoriesRes.data || [];
  } catch {
    // fallback to empty
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Produits</h1>
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

      {/* Table — fetches from admin endpoint client-side (includes drafts) */}
      <ProductsTable />
    </div>
  );
}
