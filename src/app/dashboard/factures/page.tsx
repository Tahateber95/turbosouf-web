"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, RefreshCw, FileText, CheckCircle2, AlertCircle, Clock, ChevronLeft, ChevronRight, Eye, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { adminGetInvoices, adminDeleteInvoice, adminGenerateInvoiceFromOrder } from "@/lib/admin-api";
import type { InvoiceListItem } from "@/lib/api";

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function InvoicesPage() {
  const [items, setItems] = useState<InvoiceListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetInvoices(page, pageSize, search, typeFilter, statusFilter);
      setItems(data.items);
      setTotalCount(data.totalCount);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, statusFilter]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const stats = {
    paid: items.filter((i) => i.status === "Paid").length,
    sent: items.filter((i) => i.status === "Sent").length,
    draft: items.filter((i) => i.status === "Draft").length,
    total: totalCount,
  };

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette facture brouillon ?")) return;
    try {
      await adminDeleteInvoice(id);
      load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erreur");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Factures</h1>
          <p className="text-sm text-gray-500">Gestion des factures et avoirs</p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: CheckCircle2, label: "Payées", value: String(stats.paid), color: "text-emerald-600 bg-emerald-50" },
          { icon: Clock, label: "Envoyées", value: String(stats.sent), color: "text-amber-600 bg-amber-50" },
          { icon: AlertCircle, label: "Brouillons", value: String(stats.draft), color: "text-red-600 bg-red-50" },
          { icon: FileText, label: "Total", value: String(stats.total), color: "text-blue-600 bg-blue-50" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="N° facture, client..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="">Tous types</option>
          <option value="Invoice">Facture</option>
          <option value="CreditNote">Avoir</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="">Tous statuts</option>
          <option value="Draft">Brouillon</option>
          <option value="Sent">Envoyée</option>
          <option value="Paid">Payée</option>
          <option value="Void">Annulée</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 border-b border-red-100">{error}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
                <th className="px-5 py-3 font-medium">N° Facture</th>
                <th className="px-5 py-3 font-medium">Commande</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium text-right">HT</th>
                <th className="px-5 py-3 font-medium text-right">TTC</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-400 text-sm">
                    Aucune facture trouvée
                  </td>
                </tr>
              ) : (
                items.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-gray-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-5 py-3">
                      {inv.orderNumber ? (
                        <Link
                          href={`/dashboard/commandes/${inv.id}`}
                          className="font-mono text-xs text-[var(--ts-primary-500)] hover:underline"
                        >
                          {inv.orderNumber}
                        </Link>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-900">{inv.customerName ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium ${
                          inv.type === "CreditNote" ? "text-red-600" : "text-gray-600"
                        }`}
                      >
                        {inv.type === "CreditNote" ? "Avoir" : "Facture"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-600 text-xs">
                      {formatPrice(inv.amountHT)}
                    </td>
                    <td
                      className={`px-5 py-3 text-right font-semibold ${
                        inv.amountTTC < 0 ? "text-red-600" : ""
                      }`}
                    >
                      {formatPrice(inv.amountTTC)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{formatDate(inv.issuedAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/dashboard/factures/${inv.id}`}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                          title="Voir"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {inv.status === "Draft" && (
                          <button
                            onClick={() => handleDelete(inv.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} sur {totalCount} factures
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-gray-600 px-2">
                Page {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
