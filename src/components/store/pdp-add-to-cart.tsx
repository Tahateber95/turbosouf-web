"use client";

import { AddToCartButton } from "@/components/store/add-to-cart-button";

interface PdpAddToCartProps {
  productId: string;
  name: string;
  sku: string;
  primaryImageUrl: string | null;
  priceHT: number;
  priceTTC: number;
  depositAmount: number | null;
  stockQuantity: number;
}

export function PdpAddToCart(props: PdpAddToCartProps) {
  return (
    <AddToCartButton
      product={{
        productId: props.productId,
        name: props.name,
        sku: props.sku,
        imageUrl: props.primaryImageUrl,
        priceHT: props.priceHT,
        priceTTC: props.priceTTC,
        depositAmount: props.depositAmount,
        stockQuantity: props.stockQuantity,
      }}
      showQuantity
      className="w-full"
    />
  );
}
