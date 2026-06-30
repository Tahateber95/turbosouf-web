import { SERVER_API_URL, type Category, type Brand } from "@/lib/api";
import { CatalogueClient } from "@/components/dashboard/catalogue-client";

export default async function CataloguePage() {
  let categories: Category[] = [];
  let brands: Brand[] = [];

  try {
    const [catRes, brandRes] = await Promise.all([
      fetch(`${SERVER_API_URL}/api/v1/categories`, { next: { revalidate: 0 } }).then(r => r.json()),
      fetch(`${SERVER_API_URL}/api/v1/brands`, { next: { revalidate: 0 } }).then(r => r.json()),
    ]);
    categories = catRes.data || [];
    brands = brandRes.data || [];
  } catch {
    // fallback to empty
  }

  return <CatalogueClient initialCategories={categories} initialBrands={brands} />;
}
