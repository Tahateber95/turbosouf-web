"use client";

import { useState } from "react";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useCartContext } from "@/lib/cart-context";
import type { CartAddOn } from "@/lib/hooks/use-cart";

interface AddToCartProps {
  product: {
    productId: string;
    name: string;
    sku: string;
    imageUrl: string | null;
    priceHT: number;
    priceTTC: number;
    depositAmount: number | null;
    stockQuantity: number;
    selectedAddOns?: CartAddOn[];
  };
  showQuantity?: boolean;
  className?: string;
}

export function AddToCartButton({ product, showQuantity = false, className = "" }: AddToCartProps) {
  const { addItem, items } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i.productId === product.productId);
  const maxQty = product.stockQuantity - (inCart?.quantity || 0);

  const handleAdd = () => {
    if (maxQty <= 0) return;
    addItem({ ...product, selectedAddOns: product.selectedAddOns ?? [] }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setQuantity(1);
  };

  if (product.stockQuantity <= 0) {
    return (
      <button disabled className={`flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed ${className}`}>
        Rupture de stock
      </button>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {showQuantity && (
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-2.5 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="px-3 py-2 text-sm font-semibold min-w-[2.5rem] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
            className="px-2.5 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <button
        onClick={handleAdd}
        disabled={added || maxQty <= 0}
        className={`flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-lg text-sm font-semibold transition-all ${
          added
            ? "bg-emerald-500 text-white"
            : "bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white active:scale-[0.98]"
        }`}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" />
            Ajouté !
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            Ajouter au panier
          </>
        )}
      </button>
    </div>
  );
}
