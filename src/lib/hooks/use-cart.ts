"use client";

import { useState, useCallback, useEffect } from "react";

export interface CartAddOn {
  id: string;
  name: string;
  priceHT: number;
  tvaRate: number;
  priceTTC: number;
}

export interface CartItem {
  productId: string;
  name: string;
  sku: string;
  imageUrl: string | null;
  priceHT: number;
  priceTTC: number;
  depositAmount: number | null;
  quantity: number;
  stockQuantity: number;
  selectedAddOns: CartAddOn[];
}

interface CartState {
  items: CartItem[];
}

const CART_KEY = "turbosouf_cart";

function loadCart(): CartState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function saveCart(state: CartState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(state));
}

export function useCart() {
  const [cart, setCart] = useState<CartState>({ items: [] });

  useEffect(() => {
    setCart(loadCart());
  }, []);

  const persist = useCallback((newCart: CartState) => {
    setCart(newCart);
    saveCart(newCart);
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setCart((prev) => {
        const existing = prev.items.find((i) => i.productId === item.productId);
        let newItems;
        if (existing) {
          newItems = prev.items.map((i) =>
            i.productId === item.productId
              ? {
                  ...i,
                  quantity: Math.min(i.quantity + quantity, i.stockQuantity),
                  selectedAddOns: item.selectedAddOns,
                }
              : i
          );
        } else {
          newItems = [...prev.items, { ...item, quantity }];
        }
        const newCart = { items: newItems };
        saveCart(newCart);
        return newCart;
      });
    },
    []
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => {
      const newItems =
        quantity <= 0
          ? prev.items.filter((i) => i.productId !== productId)
          : prev.items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.min(quantity, i.stockQuantity) }
                : i
            );
      const newCart = { items: newItems };
      saveCart(newCart);
      return newCart;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((prev) => {
      const newCart = { items: prev.items.filter((i) => i.productId !== productId) };
      saveCart(newCart);
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist({ items: [] });
  }, [persist]);

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  const subtotalHT = cart.items.reduce((sum, i) => {
    const addOnsHT = i.selectedAddOns.reduce((a, ao) => a + ao.priceHT, 0);
    return sum + (i.priceHT + addOnsHT) * i.quantity;
  }, 0);

  const subtotalTTC = cart.items.reduce((sum, i) => {
    const addOnsTTC = i.selectedAddOns.reduce((a, ao) => a + ao.priceTTC, 0);
    return sum + (i.priceTTC + addOnsTTC) * i.quantity;
  }, 0);

  const totalDeposit = cart.items.reduce(
    (sum, i) => sum + (i.depositAmount || 0) * i.quantity,
    0
  );

  return {
    items: cart.items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount,
    subtotalHT,
    subtotalTTC,
    totalDeposit,
  };
}
