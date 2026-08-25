/**
 * Product image placeholder.
 * Shows turbo product photo with blended background when no product image is available.
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
const RENOVATION_IMAGE = "https://i.postimg.cc/cJSGrqBq/REN-TURBO.png";

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
      return { label: "Je rénove", cls: "bg-[var(--ts-primary-500)] text-white" };
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
}: ProductIllustrationProps) {
  const slug = getCategorySlug(categoryName);
  const imageSrc = condition === "Refurbished" ? RENOVATION_IMAGE : (CATEGORY_IMAGES[slug] || DEFAULT_IMAGE);
  const badge = conditionLabel(condition);

  return (
    <div className="relative aspect-square bg-white overflow-hidden group">
      <img
        src={imageSrc}
        alt={categoryName || "Produit"}
        className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Bottom info */}
      {(brandName || sku) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-100 to-transparent px-2.5 pb-2 pt-6 z-10">
          <div className="flex items-end justify-between">
            {brandName && (
              <span className="text-gray-700 text-[9px] font-bold uppercase tracking-wider">
                {brandName}
              </span>
            )}
            {sku && (
              <span className="text-gray-400 text-[8px] font-mono">
                {sku}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
