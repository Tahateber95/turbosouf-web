"use client";

import Link from "next/link";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";
import { useCartContext } from "@/lib/cart-context";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, itemCount, subtotalTTC, totalDeposit } = useCartContext();

  const shipping = subtotalTTC >= 150 ? 0 : 6.9;
  const shippingTTC = shipping * 1.2;
  const grandTotal = subtotalTTC + totalDeposit + shippingTTC;

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
          <p className="text-sm text-gray-500 mb-6">Parcourez notre catalogue pour trouver vos pièces.</p>
          <Link href="/produits" className="inline-flex items-center gap-2 h-11 px-6 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white font-semibold rounded-lg transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voir les produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-[var(--ts-primary-900)] tracking-tight flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Mon Panier
            <span className="text-base font-normal text-gray-400">({itemCount} article{itemCount > 1 ? "s" : ""})</span>
          </h1>
          <button onClick={clearCart} className="text-xs text-red-500 hover:text-red-700 hover:underline">
            Vider le panier
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-xs text-gray-400 font-mono">{item.sku}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 py-1 text-sm font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{formatPrice(item.priceTTC * item.quantity)}</p>
                  <p className="text-[10px] text-gray-400">{formatPrice(item.priceHT * item.quantity)} HT</p>
                  {item.depositAmount && item.depositAmount > 0 && (
                    <p className="text-[10px] text-amber-600 mt-1">+{formatPrice(item.depositAmount * item.quantity)} consigne</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Récapitulatif</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sous-total TTC</span>
                  <span className="font-medium">{formatPrice(subtotalTTC)}</span>
                </div>
                {totalDeposit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-amber-600">Consigne</span>
                    <span className="font-medium text-amber-600">{formatPrice(totalDeposit)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Livraison</span>
                  <span className="font-medium">{shipping === 0 ? <span className="text-emerald-600">Gratuite</span> : formatPrice(shippingTTC)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-base">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-black text-[var(--ts-primary-900)]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <Link href="/commande" className="flex items-center justify-center w-full mt-5 h-11 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white font-semibold rounded-lg transition-colors">
                Commander <ArrowRight className="h-4 w-4 ml-1" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Paiement 100% sécurisé
              </div>

              {subtotalTTC > 0 && subtotalTTC < 150 && (
                <p className="mt-3 text-xs text-center text-gray-500">
                  Plus que <span className="font-semibold text-[var(--ts-primary-500)]">{formatPrice(150 - subtotalTTC)}</span> pour la livraison gratuite !
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
