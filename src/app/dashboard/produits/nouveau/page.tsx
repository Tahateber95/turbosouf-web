import Link from "next/link";
import { ChevronLeft, Copy } from "lucide-react";
import { ProductForm } from "@/components/dashboard/product-form";
import { SERVER_API_URL, type Category, type Brand, type VehicleMake, type ProductDetail } from "@/lib/api";

const API = SERVER_API_URL;

interface Props {
  searchParams: Promise<{ from?: string }>;
}

export default async function NewProductPage({ searchParams }: Props) {
  const { from } = await searchParams;

  const [categoriesRes, brandsRes, makesRes, sourceRes] = await Promise.all([
    fetch(`${API}/api/v1/categories`, { next: { revalidate: 60 } }).then(r => r.json()).catch(() => ({ data: [] })),
    fetch(`${API}/api/v1/brands`, { next: { revalidate: 60 } }).then(r => r.json()).catch(() => ({ data: [] })),
    fetch(`${API}/api/v1/vehicles/makes`, { next: { revalidate: 60 } }).then(r => r.json()).catch(() => ({ data: [] })),
    from
      ? fetch(`${API}/api/v1/products/${from}`, { cache: "no-store" }).then(r => r.json()).catch(() => null)
      : Promise.resolve(null),
  ]);

  const categories: Category[] = categoriesRes.data || [];
  const brands: Brand[] = brandsRes.data || [];
  const makes: VehicleMake[] = makesRes.data || [];
  const sourceProduct: ProductDetail | null = sourceRes?.data ?? null;

  const isDuplicate = !!sourceProduct;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/produits" className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div>
          {isDuplicate ? (
            <>
              <div className="flex items-center gap-2">
                <Copy className="h-5 w-5 text-[var(--ts-primary-500)]" />
                <h1 className="text-2xl font-black text-gray-900">Dupliquer le produit</h1>
              </div>
              <p className="text-sm text-gray-500">Copie de : {sourceProduct!.name} · {sourceProduct!.sku}</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-gray-900">Nouveau produit</h1>
              <p className="text-sm text-gray-500">Créer un nouveau turbo dans le catalogue</p>
            </>
          )}
        </div>
      </div>
      <ProductForm
        mode={isDuplicate ? "duplicate" : "create"}
        product={sourceProduct ?? undefined}
        categories={categories}
        brands={brands}
        makes={makes}
      />
    </div>
  );
}
