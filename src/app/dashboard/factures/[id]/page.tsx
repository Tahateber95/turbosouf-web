"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowLeft, FileText, Download, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { adminGetInvoice, adminUpdateInvoiceStatus, downloadInvoicePdf } from "@/lib/admin-api";
import type { InvoiceDetail } from "@/lib/api";

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const STATUS_TRANSITIONS: Record<string, { label: string; next: string; color: string }[]> = {
  Draft: [{ label: "Marquer envoyée", next: "Sent", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" }],
  Sent: [
    { label: "Marquer payée", next: "Paid", color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
    { label: "Annuler", next: "Void", color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" },
  ],
  Paid: [],
  Void: [],
};

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    adminGetInvoice(id)
      .then(setInvoice)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Erreur"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDownloadPdf() {
    if (!invoice) return;
    setDownloading(true);
    try {
      await downloadInvoicePdf(id, invoice.invoiceNumber);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erreur lors du téléchargement");
    } finally {
      setDownloading(false);
    }
  }

  async function handleStatusChange(next: string) {
    if (!invoice) return;
    setUpdating(true);
    try {
      await adminUpdateInvoiceStatus(id, next);
      setInvoice((prev) =>
        prev
          ? { ...prev, status: next, paidAt: next === "Paid" ? new Date().toISOString() : prev.paidAt }
          : prev
      );
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-100 rounded w-48" />
        <div className="h-40 bg-gray-100 rounded" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error ?? "Facture introuvable"}</p>
        <button onClick={() => router.back()} className="text-sm text-[var(--ts-primary-500)] hover:underline">
          ← Retour
        </button>
      </div>
    );
  }

  const transitions = STATUS_TRANSITIONS[invoice.status] ?? [];

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Link href="/dashboard/factures" className="hover:text-gray-600">Factures</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-600 font-medium">{invoice.invoiceNumber}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900">{invoice.invoiceNumber}</h1>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {invoice.type === "CreditNote" ? "Avoir" : "Facture"} — émise le {formatDate(invoice.issuedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 h-9 px-4 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            PDF
          </button>
          {transitions.map((t) => (
            <button
              key={t.next}
              onClick={() => handleStatusChange(t.next)}
              disabled={updating}
              className={`inline-flex items-center h-9 px-4 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 ${t.color}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lines */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice lines */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Lignes de facturation</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
                    <th className="px-5 py-2.5 font-medium">Description</th>
                    <th className="px-5 py-2.5 font-medium text-right">Qté</th>
                    <th className="px-5 py-2.5 font-medium text-right">P.U. HT</th>
                    <th className="px-5 py-2.5 font-medium text-right">TVA</th>
                    <th className="px-5 py-2.5 font-medium text-right">Total HT</th>
                    <th className="px-5 py-2.5 font-medium text-right">Total TTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {invoice.lines.map((line) => (
                    <tr key={line.id} className="hover:bg-gray-50/30">
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-gray-900 whitespace-pre-line">{line.description}</p>
                          {line.articleCode && (
                            <p className="text-[10px] text-gray-400 font-mono">{line.articleCode}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right text-gray-600">{line.quantity}</td>
                      <td className="px-5 py-3 text-right text-gray-600">{formatPrice(line.unitPriceHT)}</td>
                      <td className="px-5 py-3 text-right text-gray-500 text-xs">{line.tvaRate}%</td>
                      <td className="px-5 py-3 text-right text-gray-600">{formatPrice(line.lineTotalHT)}</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900">{formatPrice(line.lineTotalTTC)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="px-5 py-4 border-t border-gray-100 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total HT</span>
                <span>{formatPrice(invoice.amountHT)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>TVA</span>
                <span>{formatPrice(invoice.amountTVA)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-1 border-t border-gray-100">
                <span>Total TTC</span>
                <span>{formatPrice(invoice.amountTTC)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Meta */}
        <div className="space-y-4">
          {/* Info card */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Informations</h3>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Numéro</span>
                <span className="font-mono font-semibold text-gray-900">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Type</span>
                <span className="text-gray-900">{invoice.type === "CreditNote" ? "Avoir" : "Facture"}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Statut</span>
                <StatusBadge status={invoice.status} />
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Émise le</span>
                <span className="text-gray-900">{formatDate(invoice.issuedAt)}</span>
              </div>
              {invoice.dueAt && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Échéance</span>
                  <span className="text-gray-900">{formatDate(invoice.dueAt)}</span>
                </div>
              )}
              {invoice.paidAt && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Payée le</span>
                  <span className="text-emerald-700 font-medium">{formatDate(invoice.paidAt)}</span>
                </div>
              )}
              {invoice.sageInvoiceId && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Sage ID</span>
                  <span className="font-mono text-xs text-gray-900">{invoice.sageInvoiceId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order link */}
          {invoice.orderNumber && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Commande liée</h3>
              <Link
                href={`/dashboard/commandes/${invoice.orderId}`}
                className="font-mono text-sm text-[var(--ts-primary-500)] hover:underline"
              >
                {invoice.orderNumber}
              </Link>
            </div>
          )}

          {/* Client */}
          {(invoice.customerName || invoice.billingAddress) && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Client</h3>
              {invoice.customerName && (
                <p className="text-sm font-medium text-gray-900">{invoice.customerName}</p>
              )}
              {invoice.customerEmail && (
                <p className="text-xs text-gray-500">{invoice.customerEmail}</p>
              )}
              {invoice.billingAddress && (
                <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap font-sans leading-relaxed">
                  {invoice.billingAddress}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
