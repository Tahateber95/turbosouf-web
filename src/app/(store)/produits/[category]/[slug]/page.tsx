import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Package, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { PdpAddToCart } from "@/components/store/pdp-add-to-cart";
import { ProductImageGallery } from "@/components/store/product-image-gallery";
import { SERVER_API_URL, type ProductDetail } from "@/lib/api";

const API = SERVER_API_URL;

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

function conditionLabel(condition: string): string {
  switch (condition) {
    case "Refurbished": return "Reconditionne";
    case "New": return "Neuf";
    case "ExchangeStandard": return "Echange Standard";
    default: return condition;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  let product: ProductDetail | null = null;

  try {
    const res = await fetch(`${API}/api/v1/products/${slug}`, { next: { revalidate: 30 } });
    if (res.ok) {
      const json = await res.json();
      product = json.data || null;
    }
  } catch {
    // fallback to null
  }

  if (!product) {
    notFound();
  }

  const installmentPrice = (product.priceTTC / 3).toFixed(2);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/produits" className="hover:text-gray-600">Produits</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/produits/${category}`} className="hover:text-gray-600 capitalize">
            {category.replace(/-/g, " ")}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <div className="space-y-3">
            <ProductImageGallery
              images={product.images || []}
              productName={product.name}
              categoryName={product.categoryName}
              brandName={product.brandName}
              sku={product.sku}
              condition={product.condition}
            />

            {/* Key info strip (no images case) */}
            {(!product.images || product.images.length === 0) && (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white rounded-lg border border-gray-100 p-3 text-center">
                  <p className="text-xs font-bold text-gray-900">{product.sku}</p>
                  <p className="text-[9px] text-gray-400 uppercase">Référence</p>
                </div>
                {product.oemReference && (
                  <div className="bg-white rounded-lg border border-gray-100 p-3 text-center">
                    <p className="text-xs font-bold text-gray-900">{product.oemReference}</p>
                    <p className="text-[9px] text-gray-400 uppercase">OEM</p>
                  </div>
                )}
                <div className="bg-white rounded-lg border border-gray-100 p-3 text-center">
                  <p className="text-xs font-bold text-emerald-600">
                    {product.stockQuantity > 0 ? `${product.stockQuantity} dispo` : "Rupture"}
                  </p>
                  <p className="text-[9px] text-gray-400 uppercase">Stock</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">{conditionLabel(product.condition)}</Badge>
              {product.stockQuantity > 0 ? (
                <Badge className="bg-emerald-100 text-emerald-700 text-xs">En stock</Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">Rupture</Badge>
              )}
            </div>

            {product.brandName && (
              <p className="text-xs font-semibold text-[var(--ts-primary-500)] uppercase tracking-wider mb-1">
                {product.brandName}
              </p>
            )}

            <h1 className="text-2xl sm:text-3xl font-black text-[var(--ts-primary-900)] tracking-tight mb-1">
              {product.name}
            </h1>

            <p className="text-sm text-gray-500 mb-1">
              Ref: <span className="font-mono text-gray-600">{product.sku}</span>
              {product.oemReference && (
                <> | OEM: <span className="font-mono text-gray-600">{product.oemReference}</span></>
              )}
            </p>
            <p className="text-sm text-gray-500 mb-6">{product.shortDescription}</p>

            {/* Price block */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-black text-[var(--ts-primary-900)]">
                  {formatPrice(product.priceTTC)}
                </span>
                <span className="text-sm text-gray-400 mb-1">TTC</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                {formatPrice(product.priceHT)} HT | TVA {product.tvaRate}%
              </p>

              {product.depositAmount && product.depositAmount > 0 && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-100 mb-3">
                  <RotateCcw className="h-4 w-4 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-700">
                    <span className="font-semibold">+{formatPrice(product.depositAmount)} de consigne</span> — remboursee au retour de votre ancienne piece
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-500 mb-4">
                ou <span className="font-semibold text-[var(--ts-primary-500)]">3x {installmentPrice} EUR</span> sans frais avec Alma
              </p>

              {/* Add to cart */}
              <PdpAddToCart
                productId={product.id}
                name={product.name}
                sku={product.sku}
                primaryImageUrl={product.primaryImageUrl}
                priceHT={product.priceHT}
                priceTTC={product.priceTTC}
                depositAmount={product.depositAmount}
                stockQuantity={product.stockQuantity}
                addOns={product.addOns}
              />
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Truck, text: "Livraison 24-48h" },
                { icon: ShieldCheck, text: "Garantie 2 ans" },
                { icon: Package, text: "Retour 14 jours" },
              ].map((item) => (
                <div key={item.text} className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50">
                  <item.icon className="h-5 w-5 text-[var(--ts-primary-500)] mb-1" />
                  <span className="text-[10px] font-medium text-gray-600">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Specs table */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Caracteristiques</h3>
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  {product.attributes.map((attr, i) => (
                    <div key={attr.key} className={`flex text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                      <span className="w-1/3 px-4 py-2.5 font-medium text-gray-600">{attr.key}</span>
                      <span className="flex-1 px-4 py-2.5 text-gray-900">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compatible vehicles */}
            {product.compatibleVehicles && product.compatibleVehicles.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Vehicules compatibles</h3>
                <div className="space-y-2">
                  {product.compatibleVehicles.map((v, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 text-sm">
                      <div className="w-8 h-8 rounded-full bg-[var(--ts-primary-500)]/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-[var(--ts-primary-500)]">
                          {v.makeName.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{v.makeName} {v.modelName}</span>
                        <span className="text-gray-500"> — {v.engineName}</span>
                      </div>
                      <Badge variant="outline" className="ml-auto text-[10px]">{v.fuelType}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12 bg-white rounded-xl border border-gray-100 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Description detaillee</h2>
            <div
              className="prose prose-sm prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
