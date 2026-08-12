"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, AlertTriangle, RotateCcw } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { type OrderDetail } from "@/lib/api";
import { adminGetOrder, adminRefundOrder } from "@/lib/admin-api";
import { OrderStatusUpdater } from "@/components/dashboard/order-status-updater";
import { ShipmentPanel } from "@/components/dashboard/shipment-panel";
import { ReturnPanel } from "@/components/dashboard/return-panel";

function formatPrice(n: number) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n); }
function formatDate(iso: string) { return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }); }

interface Props {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refunding, setRefunding] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);

  const loadOrder = () => {
    setLoading(true);
    adminGetOrder(id)
      .then(setOrder)
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur de chargement"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrder(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefund = async () => {
    if (!order) return;
    const confirmed = window.confirm(
      `Rembourser cette commande ?\n\nMontant : ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(order.totalTTC)}\n\nCette action est irréversible.`
    );
    if (!confirmed) return;
    setRefunding(true);
    setRefundError(null);
    try {
      await adminRefundOrder(id);
      window.location.reload();
    } catch (err) {
      setRefundError(err instanceof Error ? err.message : "Échec du remboursement.");
    } finally {
      setRefunding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-12 text-center text-sm text-red-500">{error || "Commande introuvable."}</div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/commandes" className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900">Commande {order.orderNumber}</h1>
          <p className="text-sm text-gray-500">Créée le {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.paymentStatus} />
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Refund info banner */}
      {order.paymentStatus === "Refunded" && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-purple-50 border border-purple-100 text-sm text-purple-800">
          <RotateCcw className="h-4 w-4 shrink-0" />
          <span>Commande remboursée — {formatPrice(order.totalTTC)}</span>
        </div>
      )}

      {/* Refund error */}
      {refundError && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {refundError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-900">Articles ({order.items.length})</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
                  <th className="px-5 py-2 font-medium">Produit</th>
                  <th className="px-5 py-2 font-medium">SKU</th>
                  <th className="px-5 py-2 font-medium text-center">Qté</th>
                  <th className="px-5 py-2 font-medium text-right">Prix unit. HT</th>
                  <th className="px-5 py-2 font-medium text-right">Total TTC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-3 font-medium text-gray-900">{item.productName}</td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{item.productSku}</td>
                    <td className="px-5 py-3 text-center text-gray-600">{item.quantity}</td>
                    <td className="px-5 py-3 text-right text-gray-600">{formatPrice(item.unitPriceHT)}</td>
                    <td className="px-5 py-3 text-right font-semibold">{formatPrice(item.totalTTC)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-4 border-t border-gray-100 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sous-total HT</span>
                <span className="font-medium">{formatPrice(order.totalHT)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">TVA</span>
                <span className="font-medium">{formatPrice(order.totalTVA)}</span>
              </div>
              {order.shippingCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Livraison</span>
                  <span className="font-medium">{formatPrice(order.shippingCost)}</span>
                </div>
              )}
              {order.depositTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Consigne</span>
                  <span className="font-medium">{formatPrice(order.depositTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                <span>Total TTC</span>
                <span>{formatPrice(order.totalTTC)}</span>
              </div>
            </div>
          </div>

          {/* Customer note */}
          {order.customerNote && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-2">Note du client</h2>
              <p className="text-sm text-gray-600">{order.customerNote}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />

          <ShipmentPanel orderNumber={order.orderNumber} orderStatus={order.status} />

          {order.hasExchangeStandardItems && (
            <ReturnPanel order={order} onReturnConfirmed={loadOrder} />
          )}

          {order.paymentStatus === "Paid" && order.status !== "Refunded" && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Remboursement</h2>
              <p className="text-xs text-gray-500 mb-3">Remboursement intégral via Stripe. Le stock sera restauré automatiquement.</p>
              <button
                onClick={handleRefund}
                disabled={refunding}
                className="w-full h-10 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {refunding ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                {refunding ? "Remboursement..." : "Rembourser la commande"}
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Client</h2>
            <div className="space-y-1.5 text-sm">
              <p className="font-medium text-gray-900">{order.customerName}</p>
              <p className="text-gray-500">{order.customerEmail}</p>
              {order.customerPhone && <p className="text-gray-500">{order.customerPhone}</p>}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Adresse de livraison</h2>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              {order.shippingAddress.street2 && <p>{order.shippingAddress.street2}</p>}
              <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
              {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
            </div>
          </div>

          {order.billingAddress && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Adresse de facturation</h2>
              <div className="text-sm text-gray-600 space-y-0.5">
                <p className="font-medium text-gray-900">{order.billingAddress.fullName}</p>
                {order.billingAddress.companyName && <p className="font-medium">{order.billingAddress.companyName}</p>}
                <p>{order.billingAddress.street}</p>
                <p>{order.billingAddress.postalCode} {order.billingAddress.city}</p>
                {order.billingAddress.siret && <p className="text-xs text-gray-400">SIRET: {order.billingAddress.siret}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
