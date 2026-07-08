"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { ProductIllustration } from "@/components/store/product-illustration";
import type { ProductImage } from "@/lib/api";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  categoryName: string | null;
  brandName: string | null;
  sku: string;
  condition: string;
}

export function ProductImageGallery({
  images,
  productName,
  categoryName,
  brandName,
  sku,
  condition,
}: ProductImageGalleryProps) {
  const primaryIndex = images.findIndex((img) => img.isPrimary);
  const [activeIdx, setActiveIdx] = useState(primaryIndex >= 0 ? primaryIndex : 0);
  const activeImage = images[activeIdx];

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {images.length > 0 ? (
          <div className="aspect-square relative bg-gray-50">
            <img
              key={activeImage.url}
              src={activeImage.url}
              alt={activeImage.altText || productName}
              className="w-full h-full object-contain p-6 transition-opacity duration-150"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 text-white text-[10px] font-medium px-2 py-1 rounded-full backdrop-blur-sm">
              <Camera className="h-3 w-3" />
              {activeIdx + 1} / {images.length}
            </div>
          </div>
        ) : (
          <ProductIllustration
            categoryName={categoryName}
            brandName={brandName}
            sku={sku}
            condition={condition}
            size="lg"
          />
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`w-20 h-20 rounded-lg border-2 overflow-hidden shrink-0 bg-gray-50 transition-colors ${
                i === activeIdx
                  ? "border-[var(--ts-primary-500)]"
                  : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <img
                src={img.url}
                alt={img.altText || `Vue ${i + 1}`}
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
