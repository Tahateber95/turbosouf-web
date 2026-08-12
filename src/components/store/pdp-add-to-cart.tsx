"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import type { ProductAddOn } from "@/lib/api";
import type { CartAddOn } from "@/lib/hooks/use-cart";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

interface PdpAddToCartProps {
  productId: string;
  name: string;
  sku: string;
  primaryImageUrl: string | null;
  priceHT: number;
  priceTTC: number;
  depositAmount: number | null;
  stockQuantity: number;
  addOns?: ProductAddOn[];
  conditionLabel?: string;
}

export function PdpAddToCart({
  productId,
  name,
  sku,
  primaryImageUrl,
  priceHT,
  priceTTC,
  depositAmount,
  stockQuantity,
  addOns = [],
}: PdpAddToCartProps) {
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<Set<string>>(new Set());

  const activeAddOns = addOns.filter((a) => a.isActive);

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedAddOns: CartAddOn[] = activeAddOns
    .filter((a) => selectedAddOnIds.has(a.id))
    .map((a) => ({
      id: a.id,
      name: a.name,
      priceHT: a.priceHT,
      tvaRate: a.tvaRate,
      priceTTC: a.priceTTC,
    }));

  return (
    <div className="space-y-4">
      {/* Add-on options */}
      {activeAddOns.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-2">Options additionnelles</p>
          <div className="space-y-2">
            {activeAddOns.map((addOn) => {
              const checked = selectedAddOnIds.has(addOn.id);
              return (
                <label
                  key={addOn.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none ${
                    checked
                      ? "border-[var(--ts-primary-500)] bg-[var(--ts-primary-500)]/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAddOn(addOn.id)}
                    className="mt-0.5 rounded border-gray-300 text-[var(--ts-primary-500)] focus:ring-[var(--ts-primary-500)] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{addOn.name}</p>
                    {addOn.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{addOn.description}</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-[var(--ts-primary-600)] shrink-0">
                    +{formatPrice(addOn.priceTTC)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <AddToCartButton
        product={{
          productId,
          name,
          sku,
          imageUrl: primaryImageUrl,
          priceHT,
          priceTTC,
          depositAmount,
          stockQuantity,
          selectedAddOns,
        }}
        showQuantity
        className="w-full"
      />
    </div>
  );
}
