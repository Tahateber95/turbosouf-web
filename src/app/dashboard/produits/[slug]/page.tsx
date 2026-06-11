import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/dashboard/product-form";
import { SERVER_API_URL, type ProductDetail, type Category, type Brand, type VehicleMake } from "@/lib/api";

const API = SERVER_API_URL;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params;

  let product: ProductDetail | null = null;

  try {
    const res = await fetch(`${API}/api/v1/products/${slug}`, { next: { revalidate: 0 } });
    if (res.ok) {
      const json = await res.json();
      product = json.data;
    }
  } catch {
    // fallback
  }

  if (!product) notFound();

  const [categoriesRes, brandsRes, makesRes] = await Promise.all([
    fetch(`${API}/api/v1/categories`, { next: { revalidate: 60 } }).then(r => r.json()).catch(() => ({ data: [] })),
    fetch(`${API}/api/v1/brands`, { next: { revalidate: 60 } }).then(r => r.json()).catch(() => ({ data: [] })),
    fetch(`${API}/api/v1/vehicles/makes`, { next: { revalidate: 60 } }).then(r => r.json()).catch(() => ({ data: [] })),
  ]);

  const categories: Category[] = categoriesRes.data || [];
  const brands: Brand[] = brandsRes.data || [];
  const makes: VehicleMake[] = makesRes.data || [];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/produits" className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Modifier le produit</h1>
          <p className="text-sm text-gray-500">{product.name} · {product.sku}</p>
        </div>
      </div>
      <ProductForm mode="edit" product={product} categories={categories} brands={brands} makes={makes} />
    </div>
  );
}
