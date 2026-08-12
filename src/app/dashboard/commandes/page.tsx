"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2, Search, RotateCcw } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { adminGetOrders } from "@/lib/admin-api";
import type { OrderListItem } from "@/lib/api";

const PAGE_SIZE = 25;

function formatPrice(n: number) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n); }
function formatDate(iso: string) { return new Date(iso).toLocaleDateString("fr-FR"); }

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback((p: number, s: string, st: string) => {
    setLoading(true);
    setError(null);
    adminGetOrders(p, PAGE_SIZE, s, st)
      .then((data) => {
        setOrders(data.items);
        setTotalCount(data.totalCount);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  // Debounced search — reset to page 1 on filter change
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1, search, status); }, 300);
    return () => clearTimeout(t);
  }, [search, status, load]);

  // Reload when page changes (without resetting page)
  useEffect(() => { load(page, search, status); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Commandes</h1>
          <p className="text-sm text-gray-500">{totalCount} commandes</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="N° de commande, client..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="">Tous statuts</option>
          <option value="Pending">En attente</option>
          <option value="Confirmed">Confirmée</option>
          <option value="Processing">En traitement</option>
          <option value="Shipped">Expédiée</option>
          <option value="Delivered">Livrée</option>
          <option value="Cancelled">Annulée</option>
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement...
        </div>
      )}

      {error && (
        <div className="py-8 text-center text-sm text-red-500">{error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
                    <th className="px-5 py-3 font-medium">Commande</th>
                    <th className="px-5 py-3 font-medium">Client</th>
                    <th className="px-5 py-3 font-medium text-center">Articles</th>
                    <th className="px-5 py-3 font-medium text-right">Total TTC</th>
                    <th className="px-5 py-3 font-medium">Statut</th>
                    <th className="px-5 py-3 font-medium">Paiement</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/commandes/${o.id}`} className="font-mono text-xs font-semibold text-[var(--ts-primary-500)] hover:underline">
                            {o.orderNumber}
                          </Link>
                          {o.hasExchangeStandardItems && (
                            <span title="Reprise en attente" className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                              <RotateCcw className="h-2.5 w-2.5" />
                              Reprise
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{o.customerName}</p>
                        <p className="text-xs text-gray-400">{o.customerEmail}</p>
                      </td>
                      <td className="px-5 py-3 text-center text-gray-600">{o.itemCount}</td>
                      <td className="px-5 py-3 text-right font-semibold">{formatPrice(o.totalTTC)}</td>
                      <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-5 py-3"><StatusBadge status={o.paymentStatus} /></td>
                      <td className="px-5 py-3 text-gray-500">{formatDate(o.createdAt)}</td>
                      <td className="px-5 py-3">
                        <Link href={`/dashboard/commandes/${o.id}`} className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline">
                          Détails
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-8 text-center text-gray-500">Aucune commande trouvée.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className={`h-9 w-9 flex items-center justify-center rounded-lg border text-sm transition-colors ${
                  page <= 1
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-600 hover:border-[var(--ts-primary-500)] hover:text-[var(--ts-primary-500)]"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`e-${i}`} className="h-9 w-9 flex items-center justify-center text-sm text-gray-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`h-9 w-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-[var(--ts-primary-500)] border-[var(--ts-primary-500)] text-white"
                          : "border-gray-200 text-gray-600 hover:border-[var(--ts-primary-500)] hover:text-[var(--ts-primary-500)]"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className={`h-9 w-9 flex items-center justify-center rounded-lg border text-sm transition-colors ${
                  page >= totalPages
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-600 hover:border-[var(--ts-primary-500)] hover:text-[var(--ts-primary-500)]"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <p className="text-center text-xs text-gray-400 mt-3">
              Page {page} sur {totalPages} · {totalCount} commandes
            </p>
          )}
        </>
      )}
    </div>
  );
}
