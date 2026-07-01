"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getMyOrderById } from "@/lib/api";
import type { OrderDetail } from "@/lib/api";

function formatPrice(n: number) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n); }
function formatDate(iso: string) { return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }); }

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  Pending:   { label: "En attente",      color: "bg-amber-100 text-amber-700" },
  Confirmed: { label: "Confirmée",       color: "bg-blue-100 text-blue-700" },
  Preparing: { label: "En préparation",  color: "bg-purple-100 text-purple-700" },
  Shipped:   { label: "Expédiée",        color: "bg-indigo-100 text-indigo-700" },
  Delivered: { label: "Livrée",          color: "bg-emerald-100 text-emerald-700" },
  Cancelled: { label: "Annulée",         color: "bg-red-100 text-red-700" },
};

interface Props { params: Promise<{ id: string }> }

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !token) router.push("/connexion?redirect=/compte/commandes");
  }, [isLoading, token, router]);

  useEffect(() => {
    if (!token) return;
    getMyOrderById(id, token)
      .then(setOrder)
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur"))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (isLoading || loading) {
    return (
      <div className="bg-[var(--ts-canvas)] min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--ts-primary-500)]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-[var(--ts-canvas)] min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error || "Commande introuvable."}</p>
          <Link href="/compte/commandes" className="text-sm text-[var(--ts-primary-500)] hover:underline">← Retour</Link>
        </div>
      </div>
    );
  }

  const s = STATUS_LABELS[order.status] ?? { label: order.status, color: "bg-gray-100 text-gray-600" };

  return (
    <div className="bg-[var(--ts-canvas)] min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/compte/commandes" className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-black text-[var(--ts-navy-700)] font-mono">{order.orderNumber}</h1>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.color}`}>{s.label}</span>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <Package className="h-4 w-4 text-[var(--ts-primary-500)]" />
            <h2 className="text-sm font-bold text-gray-900">Articles ({order.items.length})</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                  <p className="text-xs text-gray-400 font-mono">{item.productSku} · Qté: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{formatPrice(item.totalTTC)}</p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-gray-100 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Sous-total HT</span><span>{formatPrice(order.totalHT)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>TVA</span><span>{formatPrice(order.totalTVA)}</span>
            </div>
            {order.shippingCost > 0 && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Livraison</span><span>{formatPrice(order.shippingCost)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
              <span>Total TTC</span><span>{formatPrice(order.totalTTC)}</span>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Adresse de livraison</h2>
          <div className="text-sm text-gray-600 space-y-0.5">
            <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            {order.shippingAddress.street2 && <p>{order.shippingAddress.street2}</p>}
            <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
