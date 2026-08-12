"use client";

import { useState } from "react";
import { RotateCcw, Download, RefreshCw, CheckCircle2, Clock, AlertTriangle, Loader2, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { adminConfirmReturn, adminRegenerateReturnLabel, adminDownloadReturnLabel } from "@/lib/admin-api";
import type { OrderDetail } from "@/lib/api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

interface Props {
  order: OrderDetail;
  onReturnConfirmed: () => void;
}

type ReturnStatus = "NotRequired" | "Created" | "Printed" | "Collected" | "Delivered" | "Cancelled" | "Failed";

function statusLabel(s: ReturnStatus | string): string {
  switch (s) {
    case "NotRequired": return "Non requis";
    case "Created":     return "Étiquette générée";
    case "Printed":     return "Imprimée";
    case "Collected":   return "Déposée";
    case "Delivered":   return "Reprise reçue";
    case "Cancelled":   return "Annulée";
    case "Failed":      return "Échec génération";
    default:            return s;
  }
}

function StatusIndicator({ status }: { status: string }) {
  if (status === "Delivered") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {statusLabel(status)}
      </span>
    );
  }
  if (status === "Failed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
        <AlertTriangle className="h-3.5 w-3.5" />
        {statusLabel(status)}
      </span>
    );
  }
  if (status === "Created" || status === "Printed" || status === "Collected") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <Clock className="h-3.5 w-3.5" />
        {statusLabel(status)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
      {statusLabel(status)}
    </span>
  );
}

export function ReturnPanel({ order, onReturnConfirmed }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const rs = order.returnShipment;
  const isRefunded = !!order.depositRefundedAt;
  const isReceived = !!rs?.returnReceivedAt;
  const hasLabel = rs?.hasReturnLabel ?? false;
  const labelFailed = rs?.returnStatus === "Failed";

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await adminDownloadReturnLabel(order.id, order.orderNumber);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Téléchargement impossible");
    } finally {
      setDownloading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!window.confirm("Régénérer l'étiquette de retour ? Un nouveau skybill sera créé et l'email renvoyé au client.")) return;
    setRegenerating(true);
    try {
      await adminRegenerateReturnLabel(order.id);
      toast.success("Étiquette régénérée — email envoyé au client");
      onReturnConfirmed(); // refresh parent
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la régénération");
    } finally {
      setRegenerating(false);
    }
  };

  const handleConfirmReturn = async () => {
    const depositLabel = order.depositTotal > 0 ? ` et rembourser la consigne de ${formatPrice(order.depositTotal)}` : "";
    if (!window.confirm(`Confirmer la réception de la reprise${depositLabel} ? Cette action est irréversible.`)) return;
    setConfirming(true);
    try {
      await adminConfirmReturn(order.id);
      toast.success("Reprise confirmée" + (order.depositTotal > 0 ? ` — ${formatPrice(order.depositTotal)} remboursés` : ""));
      onReturnConfirmed();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la confirmation");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-blue-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 bg-blue-50/60 border-b border-blue-100">
        <RotateCcw className="h-4 w-4 text-blue-600" />
        <h2 className="text-sm font-bold text-blue-900">Échange Standard — Retour reprise</h2>
      </div>

      <div className="p-5 space-y-4">
        {/* Status row */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Statut retour</span>
          {rs ? (
            <StatusIndicator status={rs.returnStatus} />
          ) : (
            <span className="text-xs text-gray-400">Aucun shipment trouvé</span>
          )}
        </div>

        {/* Skybill */}
        {rs?.returnSkybillNumber && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">N° suivi retour</span>
            <a
              href={`https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${rs.returnSkybillNumber}&langue=fr`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs font-semibold text-blue-600 hover:underline"
            >
              {rs.returnSkybillNumber}
            </a>
          </div>
        )}

        {/* Label generated at */}
        {rs?.returnLabelGeneratedAt && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Étiquette créée le</span>
            <span className="text-xs text-gray-700">{formatDate(rs.returnLabelGeneratedAt)}</span>
          </div>
        )}

        {/* Consigne */}
        {order.depositTotal > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Consigne</span>
            <span className="text-xs font-semibold text-amber-700">
              {formatPrice(order.depositTotal)}
              {isRefunded && (
                <span className="ml-1.5 text-emerald-600 font-normal">· remboursée ✓</span>
              )}
            </span>
          </div>
        )}

        {/* Received at */}
        {rs?.returnReceivedAt && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
            <PackageCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-emerald-700">Reprise reçue</p>
              <p className="text-[11px] text-emerald-600">{formatDate(rs.returnReceivedAt)}</p>
            </div>
          </div>
        )}

        {/* Refunded at */}
        {order.depositRefundedAt && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 border border-purple-100">
            <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-purple-700">Consigne remboursée</p>
              <p className="text-[11px] text-purple-600">{formatDate(order.depositRefundedAt)}</p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-2 pt-1">
          {/* Download label */}
          {hasLabel && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full h-9 flex items-center justify-center gap-2 rounded-lg border border-blue-200 text-blue-700 text-xs font-medium hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              {downloading ? "Téléchargement..." : "Télécharger l'étiquette retour"}
            </button>
          )}

          {/* Regenerate */}
          {(labelFailed || hasLabel) && !isReceived && (
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="w-full h-9 flex items-center justify-center gap-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {regenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              {regenerating ? "Régénération..." : "Régénérer l'étiquette"}
            </button>
          )}

          {/* Confirm return reception */}
          {!isReceived && !isRefunded && rs && rs.returnStatus !== "NotRequired" && (
            <button
              onClick={handleConfirmReturn}
              disabled={confirming}
              className="w-full h-9 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {confirming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PackageCheck className="h-3.5 w-3.5" />}
              {confirming ? "Confirmation..." : "Confirmer réception de la reprise"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
