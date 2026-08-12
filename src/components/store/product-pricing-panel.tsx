"use client";

import { RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PdpAddToCart } from "@/components/store/pdp-add-to-cart";
import type { ProductDetail, ProductVariant, ProductAddOn } from "@/lib/api";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

interface ConditionOption {
  condition: string;
  conditionLabel: string;
  conditionSortOrder: number;
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
  // Build sorted list: primary + variants, ordered by conditionSortOrder
  const allOptions: ConditionOption[] = [
    {
      condition: product.condition,
      conditionLabel: product.conditionLabel || product.condition,
      conditionSortOrder: product.conditionSortOrder ?? 999,
      priceHT: product.priceHT,
      tvaRate: product.tvaRate,
      priceTTC: product.priceTTC,
      salePriceHT: product.salePriceHT,
      depositAmount: product.depositAmount,
      stockQuantity: product.stockQuantity,
    },
    ...(product.variants || []).map((v: ProductVariant) => ({
      condition: v.condition,
      conditionLabel: v.conditionLabel || v.condition,
      conditionSortOrder: v.conditionSortOrder,
      priceHT: v.priceHT,
      tvaRate: v.tvaRate,
      priceTTC: v.priceTTC,
      salePriceHT: v.salePriceHT,
      depositAmount: v.depositAmount,
      stockQuantity: v.stockQuantity,
    })),
  ].sort((a, b) => a.conditionSortOrder - b.conditionSortOrder);

  return (
    <div className="grid grid-cols-2 gap-4">
      {allOptions.map((opt) => {
        const inStock = opt.stockQuantity > 0;
        const installment = (opt.priceTTC / 3).toFixed(2);

        return (
          <div
            key={opt.condition}
            className={`flex flex-col rounded-2xl border-2 bg-white p-5 transition-colors ${
              inStock
                ? "border-gray-100 hover:border-[#E85D26]"
                : "border-gray-100 opacity-60"
            }`}
          >
            {/* Stock badge */}
            <div className="mb-3">
              {inStock ? (
                <Badge className="bg-emerald-100 text-emerald-700 text-xs border-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
                  En stock
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-500 text-xs border-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5 inline-block" />
                  Rupture
                </Badge>
              )}
            </div>

            {/* Condition title — most prominent element */}
            <p className="text-sm font-black text-gray-900 uppercase tracking-wide mb-4 leading-tight">
              {opt.conditionLabel}
            </p>

            {/* Price */}
            <div className="mb-1">
              <span className="text-2xl font-black text-gray-900">
                {formatPrice(opt.priceTTC)}
              </span>
              <span className="text-xs text-gray-400 ml-1">TTC</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              {formatPrice(opt.priceHT)} HT · TVA {opt.tvaRate}%
            </p>

            {/* Consigne */}
            {opt.depositAmount && opt.depositAmount > 0 && (
              <div className="flex items-start gap-1.5 p-2 rounded-lg bg-amber-50 border border-amber-100 mb-3">
                <RotateCcw className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 leading-tight">
                  <span className="font-semibold">+{formatPrice(opt.depositAmount)}</span> consigne remboursée
                </p>
              </div>
            )}

            {/* Alma installment */}
            <p className="text-[11px] text-gray-400 mb-4">
              ou <span className="font-semibold text-[#E85D26]">3× {installment} €</span> sans frais
            </p>

            {/* Push CTA to bottom */}
            <div className="mt-auto">
              <PdpAddToCart
                productId={product.id}
                name={product.name}
                sku={product.sku}
                primaryImageUrl={product.primaryImageUrl}
                priceHT={opt.priceHT}
                priceTTC={opt.priceTTC}
                depositAmount={opt.depositAmount}
                stockQuantity={opt.stockQuantity}
                addOns={addOns}
                conditionLabel={opt.conditionLabel}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
