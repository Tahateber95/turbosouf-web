/**
 * Product image placeholder.
 * Shows a real turbo product photo when no product image is available,
 * with category/brand/condition overlays.
 */

interface ProductIllustrationProps {
  categoryName?: string | null;
  brandName?: string | null;
  sku?: string;
  condition?: string;
  size?: "sm" | "md" | "lg";
}

const CATEGORY_IMAGES: Record<string, string> = {
  turbocompresseurs: "/images/turbo-default.jpg",
  injecteurs: "/images/turbo-product.jpg",
  "pompes-hp": "/images/turbo-product.jpg",
};

const DEFAULT_IMAGE = "/images/turbo-default.jpg";

function getCategorySlug(categoryName: string | null | undefined): string {
  if (!categoryName) return "";
  return categoryName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function conditionLabel(condition?: string) {
  switch (condition) {
    case "Refurbished":
      return { label: "Reconditionne", cls: "bg-[var(--ts-primary-500)] text-white" };
    case "New":
      return { label: "Neuf", cls: "bg-emerald-500 text-white" };
    case "ExchangeStandard":
      return { label: "Echange Std", cls: "bg-amber-500 text-white" };
    default:
      return null;
  }
}

export function ProductIllustration({
  categoryName,
  brandName,
  sku,
  condition,
  size = "md",
}: ProductIllustrationProps) {
  const slug = getCategorySlug(categoryName);
  const imageSrc = CATEGORY_IMAGES[slug] || DEFAULT_IMAGE;
  const badge = conditionLabel(condition);

  return (
    <div className="relative aspect-square bg-gray-100 overflow-hidden group">
      {/* Real product photo */}
      <img
        src={imageSrc}
        alt={categoryName || "Produit"}
        className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Category label */}
      {categoryName && (
        <div className="absolute top-2 left-2">
          <span className="inline-block px-1.5 py-0.5 rounded bg-black/60 text-white text-[8px] font-bold tracking-wider uppercase backdrop-blur-sm">
            {categoryName}
          </span>
        </div>
      )}

      {/* Condition badge */}
      {badge && (
        <div className="absolute top-2 right-2">
          <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-semibold ${badge.cls}`}>
            {badge.label}
          </span>
        </div>
      )}

      {/* Bottom info */}
      {(brandName || sku) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-2.5 pb-2 pt-6">
          <div className="flex items-end justify-between">
            {brandName && (
              <span className="text-white text-[9px] font-bold uppercase tracking-wider">
                {brandName}
              </span>
            )}
            {sku && (
              <span className="text-white/60 text-[8px] font-mono">
                {sku}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
