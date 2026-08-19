import Link from "next/link";
import { Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductIllustration } from "@/components/store/product-illustration";
import type { ProductListItem } from "@/lib/api";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

function conditionStyle(condition: string): string {
  switch (condition) {
    case "ExchangeStandard":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Refurbished":
      return "bg-[#E85D26]/10 text-[#E85D26] border-[#E85D26]/25";
    case "NewAdaptable":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "NewOriginal":
      return "bg-violet-50 text-violet-700 border-violet-200";
    case "CartoucheChra":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
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
          <div className="aspect-square bg-white relative overflow-hidden">
            <img
              src={product.primaryImageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="relative">
            <ProductIllustration
              categoryName={product.categoryName}
              brandName={product.brandName}
              sku={product.sku}
              condition={product.condition}
              size="sm"
            />
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 max-w-[55%]">
          {hasDiscount && (
            <Badge className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm">
              -{discountPercent}%
            </Badge>
          )}
          {product.conditionLabel && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm border truncate ${conditionStyle(product.condition)}`}>
              {product.conditionLabel}
            </span>
          )}
        </div>

        {/* Brand badge — top right */}
        {product.brandName && (
          <div className="absolute top-2.5 right-2.5 max-w-[40%]">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-black/70 text-white backdrop-blur-sm shadow-sm truncate">
              {product.brandName}
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
        {/* Brand + Reference */}
        <div className="flex items-center gap-1.5 mb-1">
          {product.brandName && (
            <span className="text-[10px] font-bold text-[var(--ts-primary-500)] uppercase tracking-wider">
              {product.brandName}
            </span>
          )}
          {product.brandName && product.oemReference && (
            <span className="text-gray-300">|</span>
          )}
          {product.oemReference && (
            <span className="text-[10px] font-mono text-gray-400">
              {product.oemReference}
            </span>
          )}
        </div>

        {/* Product name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-[var(--ts-primary-500)] transition-colors mb-1">
          {product.name}
        </h3>

        {/* Vehicle compatibility */}
        {product.vehicleSummary && (
          <p className="text-[11px] text-gray-500 mb-2 line-clamp-1">
            {product.vehicleSummary}
          </p>
        )}

        {!product.vehicleSummary && product.shortDescription && (
          <p className="text-[11px] text-gray-500 mb-2 line-clamp-1">
            {product.shortDescription}
          </p>
        )}

        {/* Price section */}
        <div className="flex items-end justify-between gap-2 mt-auto">
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
                <span className="text-[9px] text-[var(--ts-primary-500)] font-semibold bg-[var(--ts-primary-500)]/5 px-1.5 py-0.5 rounded">
                  3x {(displayPrice / 3).toFixed(0)}€ sans frais
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

        {/* Out-of-stock contact CTA (all conditions except Refurbished) */}
        {product.stockQuantity <= 0 && product.condition !== "Refurbished" && (
          <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[var(--ts-primary-500)]">
            <Phone className="h-3 w-3 shrink-0" />
            Contacter pour une solution rapide
          </div>
        )}
      </div>
    </Link>
  );
}
