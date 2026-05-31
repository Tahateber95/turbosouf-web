import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ProductIllustration } from "@/components/store/product-illustration";
import type { ProductListItem } from "@/lib/api";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

function getCategorySlug(name: string | null | undefined): string {
  if (!name) return "all";
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductCard({ product }: { product: ProductListItem }) {
  const hasDiscount = product.salePriceHT && product.salePriceHT < product.priceHT;
  const displayPrice = hasDiscount
    ? product.salePriceHT! * 1.2
    : product.priceTTC;
  const originalPrice = hasDiscount ? product.priceTTC : null;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.salePriceHT! / product.priceHT) * 100)
    : 0;

  return (
    <Link
      href={`/produits/${getCategorySlug(product.categoryName)}/${product.slug}`}
      className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300"
    >
      {/* Image area */}
      <div className="relative overflow-hidden">
        {product.primaryImageUrl ? (
          <div className="aspect-square bg-gray-50 relative overflow-hidden">
            <img
              src={product.primaryImageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay badges for real images */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {hasDiscount && (
                <Badge className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 shadow-sm">
                  -{discountPercent}%
                </Badge>
              )}
              {product.condition === "Refurbished" && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 shadow-sm">
                  Reconditionné
                </Badge>
              )}
              {product.condition === "ExchangeStandard" && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 bg-white shadow-sm">
                  Échange Std
                </Badge>
              )}
            </div>
          </div>
        ) : (
          /* Rich category-aware illustration when no image */
          <div className="relative">
            <ProductIllustration
              categoryName={product.categoryName}
              brandName={product.brandName}
              sku={product.sku}
              condition={product.condition}
              size="sm"
            />
            {/* Discount overlay on illustration */}
            {hasDiscount && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 shadow-lg">
                  -{discountPercent}%
                </Badge>
              </div>
            )}
            {/* Hover hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white text-xs font-semibold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                Voir le produit
              </span>
            </div>
          </div>
        )}

        {/* Out of stock overlay */}
        {product.stockQuantity <= 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-500 bg-white/80 px-3 py-1 rounded-full">
              Rupture de stock
            </span>
          </div>
        )}

        {/* Stock indicator */}
        {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
          <div className="absolute bottom-2 right-2">
            <span className="text-[9px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded shadow-sm">
              Plus que {product.stockQuantity} en stock
            </span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-3 sm:p-4">
        {/* Brand + Category */}
        <div className="flex items-center gap-1.5 mb-1.5">
          {product.brandName && (
            <span className="text-[10px] font-bold text-[var(--ts-primary-500)] uppercase tracking-wider">
              {product.brandName}
            </span>
          )}
          {product.brandName && product.categoryName && (
            <span className="text-gray-300">·</span>
          )}
          {product.categoryName && (
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">
              {product.categoryName}
            </span>
          )}
        </div>

        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-[var(--ts-primary-500)] transition-colors mb-1.5">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-1 mb-3">{product.shortDescription}</p>

        {/* Price section */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[var(--ts-primary-900)]">
                {formatPrice(displayPrice)}
              </span>
              {originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-gray-400">TTC</span>
              {displayPrice >= 50 && (
                <span className="text-[9px] text-[var(--ts-primary-500)] font-medium">
                  ou {(displayPrice / 3).toFixed(0)}€ x3
                </span>
              )}
            </div>
          </div>
          {product.depositAmount && product.depositAmount > 0 && (
            <span className="text-[9px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 whitespace-nowrap">
              +{formatPrice(product.depositAmount)} consigne
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
