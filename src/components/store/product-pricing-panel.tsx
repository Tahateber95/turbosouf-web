"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PdpAddToCart } from "@/components/store/pdp-add-to-cart";
import type { ProductDetail, ProductVariant, ProductAddOn } from "@/lib/api";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

const CONDITION_LABELS: Record<string, string> = {
  Refurbished: "Reconditionné",
  New: "Neuf",
  ExchangeStandard: "Échange Standard",
  NewAdaptable: "Neuf Adaptable",
  NewOriginal: "Neuf d'Origine",
};

interface ConditionOption {
  condition: string;
  priceHT: number;
  tvaRate: number;
  priceTTC: number;
  salePriceHT: number | null;
  depositAmount: number | null;
  stockQuantity: number;
}

interface Props {
  product: ProductDetail;
  addOns: ProductAddOn[];
}

export function ProductPricingPanel({ product, addOns }: Props) {
  // Build list of all options: primary first, then variants
  const allOptions: ConditionOption[] = [
    {
      condition: product.condition,
      priceHT: product.priceHT,
      tvaRate: product.tvaRate,
      priceTTC: product.priceTTC,
      salePriceHT: product.salePriceHT,
      depositAmount: product.depositAmount,
      stockQuantity: product.stockQuantity,
    },
    ...(product.variants || []).map((v: ProductVariant) => ({
      condition: v.condition,
      priceHT: v.priceHT,
      tvaRate: v.tvaRate,
      priceTTC: v.priceTTC,
      salePriceHT: v.salePriceHT,
      depositAmount: v.depositAmount,
      stockQuantity: v.stockQuantity,
    })),
  ];

  const [selectedCondition, setSelectedCondition] = useState(product.condition);
  const active = allOptions.find(o => o.condition === selectedCondition) ?? allOptions[0];
  const installmentPrice = (active.priceTTC / 3).toFixed(2);

  return (
    <>
      {/* Condition + stock badges */}
      <div className="flex items-center gap-2 mb-2">
        {active.stockQuantity > 0 ? (
          <Badge className="bg-emerald-100 text-emerald-700 text-xs">En stock</Badge>
        ) : (
          <Badge variant="destructive" className="text-xs">Rupture</Badge>
        )}
      </div>

      {/* Condition switcher */}
      {allOptions.length > 1 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">État</p>
          <div className="flex flex-wrap gap-2">
            {allOptions.map((opt) => (
              <button
                key={opt.condition}
                type="button"
                onClick={() => setSelectedCondition(opt.condition)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  selectedCondition === opt.condition
                    ? "bg-[var(--ts-primary-500)] border-[var(--ts-primary-500)] text-white"
                    : "border-gray-200 text-gray-600 hover:border-[var(--ts-primary-500)] hover:text-[var(--ts-primary-500)]"
                }`}
              >
                {CONDITION_LABELS[opt.condition] ?? opt.condition}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price block */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <div className="flex items-end gap-3 mb-2">
          <span className="text-3xl font-black text-[var(--ts-primary-900)]">
            {formatPrice(active.priceTTC)}
          </span>
          <span className="text-sm text-gray-400 mb-1">TTC</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          {formatPrice(active.priceHT)} HT | TVA {active.tvaRate}%
        </p>

        {active.depositAmount && active.depositAmount > 0 && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-100 mb-3">
            <RotateCcw className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700">
              <span className="font-semibold">+{formatPrice(active.depositAmount)} de consigne</span> — remboursée au retour de votre ancienne pièce
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 mb-4">
          ou <span className="font-semibold text-[var(--ts-primary-500)]">3x {installmentPrice} EUR</span> sans frais avec Alma
        </p>

        <PdpAddToCart
          productId={product.id}
          name={product.name}
          sku={product.sku}
          primaryImageUrl={product.primaryImageUrl}
          priceHT={active.priceHT}
          priceTTC={active.priceTTC}
          depositAmount={active.depositAmount}
          stockQuantity={active.stockQuantity}
          addOns={addOns}
        />
      </div>
    </>
  );
}
