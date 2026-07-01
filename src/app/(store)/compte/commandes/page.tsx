"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getMyOrders } from "@/lib/api";
import type { OrderListItem } from "@/lib/api";

function formatPrice(n: number) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n); }
function formatDate(iso: string) { return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); }

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  Pending:   { label: "En attente",   color: "bg-amber-100 text-amber-700" },
  Confirmed: { label: "Confirmée",    color: "bg-blue-100 text-blue-700" },
  Preparing: { label: "En préparation", color: "bg-purple-100 text-purple-700" },
  Shipped:   { label: "Expédiée",     color: "bg-indigo-100 text-indigo-700" },
  Delivered: { label: "Livrée",       color: "bg-emerald-100 text-emerald-700" },
  Cancelled: { label: "Annulée",      color: "bg-red-100 text-red-700" },
};

export default function MyOrdersPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/connexion?redirect=/compte/commandes");
    }
  }, [isLoading, token, router]);

  useEffect(() => {
    if (!token) return;
    getMyOrders(token)
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [token]);

  if (isLoading || (loading && !error)) {
    return (
      <div className="bg-[var(--ts-canvas)] min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--ts-primary-500)]" />
      </div>
    );
  }

  return (
    <div className="bg-[var(--ts-canvas)] min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/compte" className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-black text-[var(--ts-navy-700)]">Mes commandes</h1>
        </div>

        {error && (
          <div className="py-8 text-center text-sm text-red-500">{error}</div>
        )}

        {!error && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-1">Aucune commande pour l&apos;instant</p>
            <p className="text-sm text-gray-400 mb-5">Vos futures commandes apparaîtront ici.</p>
            <Link href="/produits" className="inline-flex items-center gap-2 h-10 px-5 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors">
              Voir les produits
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {orders.map((order) => {
            const s = STATUS_LABELS[order.status] ?? { label: order.status, color: "bg-gray-100 text-gray-600" };
            return (
              <Link
                key={order.id}
                href={`/compte/commandes/${order.id}`}
                className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm hover:border-gray-200 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--ts-primary-500)]/10 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-[var(--ts-primary-500)]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 font-mono">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)} · {order.itemCount} article{order.itemCount > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatPrice(order.totalTTC)}</p>
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[var(--ts-primary-500)] transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
