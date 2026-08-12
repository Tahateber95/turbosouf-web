"use client";

import { RotateCcw, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PdpAddToCart } from "@/components/store/pdp-add-to-cart";
import type { ProductDetail, ProductAddOn } from "@/lib/api";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

interface Props {
  product: ProductDetail;
  addOns: ProductAddOn[];
}

export function ProductPricingPanel({ product, addOns }: Props) {
  const inStock = product.stockQuantity > 0;
  const installment = (product.priceTTC / 3).toFixed(2);
  const hasDiscount = product.salePriceHT && product.salePriceHT < product.priceHT;

  return (
    <div className="space-y-4">
      {/* Condition badge */}
      {product.conditionLabel && (
        <div>
          <Badge variant="outline" className="text-xs font-semibold text-[var(--ts-primary-600)] border-[var(--ts-primary-200)] bg-[var(--ts-primary-500)]/5">
            {product.conditionLabel}
          </Badge>
        </div>
      )}

      {/* Stock status */}
      <div>
        {inStock ? (
          <Badge className="bg-emerald-100 text-emerald-700 text-xs border-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
            En stock — {product.stockQuantity} disponible{product.stockQuantity > 1 ? "s" : ""}
          </Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-500 text-xs border-0">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5 inline-block" />
            Rupture de stock
          </Badge>
        )}
      </div>

      {/* Price */}
      <div>
        {hasDiscount ? (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">
              {formatPrice((product.salePriceHT! * (1 + product.tvaRate / 100)))}
            </span>
            <span className="text-xs text-gray-400">TTC</span>
            <span className="text-lg text-gray-400 line-through">{formatPrice(product.priceTTC)}</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{formatPrice(product.priceTTC)}</span>
            <span className="text-xs text-gray-400">TTC</span>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-0.5">
          {formatPrice(product.priceHT)} HT · TVA {product.tvaRate}%
        </p>
      </div>

      {/* Consigne */}
      {product.depositAmount && product.depositAmount > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
          <RotateCcw className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            <span className="font-semibold">+{formatPrice(product.depositAmount)}</span> de consigne remboursée à la reprise de votre ancienne pièce
          </p>
        </div>
      )}

      {/* Alma installment */}
      <p className="text-sm text-gray-500">
        ou <span className="font-semibold text-[#E85D26]">3× {installment} €</span> sans frais avec Alma
      </p>

      {/* Return instructions — Échange Standard only */}
      {product.condition === "ExchangeStandard" && product.returnInstructions && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-700 mb-1">Instructions de retour</p>
            <p className="text-sm text-blue-700 whitespace-pre-line">{product.returnInstructions}</p>
          </div>
        </div>
      )}

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
        addOns={addOns}
        conditionLabel={product.conditionLabel}
      />
    </div>
  );
}
