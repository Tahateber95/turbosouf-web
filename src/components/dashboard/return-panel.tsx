"use client";

import { useState } from "react";
import { RotateCcw, Download, RefreshCw, CheckCircle2, Clock, AlertTriangle, Loader2, PackageCheck, ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import {
  adminConfirmReturn,
  adminRegenerateReturnLabel,
  adminRegenerateInboundLabel,
  adminDownloadReturnLabel,
  adminDownloadInboundLabel,
} from "@/lib/admin-api";
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

function StatusIndicator({ status }: { status: string }) {
  if (status === "Delivered") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Reçu
      </span>
    );
  }
  if (status === "Failed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
        <AlertTriangle className="h-3.5 w-3.5" />
        Échec génération
      </span>
    );
  }
  if (["Created", "Printed", "Collected"].includes(status)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <Clock className="h-3.5 w-3.5" />
        En attente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
      {status}
    </span>
  );
}

export function ReturnPanel({ order, onReturnConfirmed }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [downloadingInbound, setDownloadingInbound] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regeneratingInbound, setRegeneratingInbound] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Determine which flow this order is in
  const withConsigne = order.hasExchangeStandardItems && order.depositTotal > 0;
  const isInboundFirst = order.hasRefurbishedItems || (order.hasExchangeStandardItems && order.depositTotal === 0);
  const isRenovation = order.hasRefurbishedItems && !order.hasExchangeStandardItems;

  const rs = order.returnShipment;   // ParcelIndex=1 return label (with consigne)
  const inb = order.inboundShipment; // ParcelIndex=99 inbound label (customer ships first)

  const isRefunded = !!order.depositRefundedAt;

  // Which shipment tracks "has the customer item arrived?"
  const inboundReceived = isInboundFirst ? !!inb?.receivedAt : !!rs?.returnReceivedAt;

  const handleDownloadReturn = async () => {
    setDownloading(true);
    try { await adminDownloadReturnLabel(order.id, order.orderNumber); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Téléchargement impossible"); }
    finally { setDownloading(false); }
  };

  const handleDownloadInbound = async () => {
    setDownloadingInbound(true);
    try { await adminDownloadInboundLabel(order.id, order.orderNumber); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Téléchargement impossible"); }
    finally { setDownloadingInbound(false); }
  };

  const handleRegenerateReturn = async () => {
    if (!window.confirm("Régénérer l'étiquette de retour ? Un nouveau skybill sera créé et l'email renvoyé au client.")) return;
    setRegenerating(true);
    try {
      await adminRegenerateReturnLabel(order.id);
      toast.success("Étiquette régénérée — email envoyé au client");
      onReturnConfirmed();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Erreur de régénération"); }
    finally { setRegenerating(false); }
  };

  const handleRegenerateInbound = async () => {
    if (!window.confirm("Régénérer l'étiquette d'envoi ? Un nouveau skybill sera créé et l'email renvoyé au client.")) return;
    setRegeneratingInbound(true);
    try {
      await adminRegenerateInboundLabel(order.id);
      toast.success("Étiquette régénérée — email envoyé au client");
      onReturnConfirmed();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Erreur de régénération"); }
    finally { setRegeneratingInbound(false); }
  };

  const handleConfirmReturn = async () => {
    const depositLabel = order.depositTotal > 0 ? ` et rembourser la consigne de ${formatPrice(order.depositTotal)}` : "";
    if (!window.confirm(`Confirmer la réception${depositLabel} ? Cette action est irréversible.`)) return;
    setConfirming(true);
    try {
      await adminConfirmReturn(order.id);
      toast.success("Réception confirmée" + (order.depositTotal > 0 ? ` — ${formatPrice(order.depositTotal)} remboursés` : ""));
      onReturnConfirmed();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Erreur lors de la confirmation"); }
    finally { setConfirming(false); }
  };

  const panelTitle = isRenovation
    ? "Je rénove mon turbo — Envoi & retour"
    : withConsigne
      ? "Échange Standard avec consigne"
      : "Échange Standard sans consigne";

  return (
    <div className="bg-white rounded-xl border border-blue-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 bg-blue-50/60 border-b border-blue-100">
        <RotateCcw className="h-4 w-4 text-blue-600" />
        <h2 className="text-sm font-bold text-blue-900">{panelTitle}</h2>
      </div>

      <div className="p-5 space-y-4">

        {/* ── Inbound label block (customer ships first) ── */}
        {isInboundFirst && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ArrowUp className="h-3.5 w-3.5 text-orange-500" />
              <span className="text-xs font-semibold text-gray-700">
                {isRenovation ? "Envoi client → TurboSouf (réparation)" : "Envoi client → TurboSouf (avant expédition)"}
              </span>
            </div>

            {inb ? (
              <div className="pl-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Statut</span>
                  <StatusIndicator status={inb.status} />
                </div>
                {inb.skybillNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">N° suivi</span>
                    <a
                      href={`https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${inb.skybillNumber}&langue=fr`}
                      target="_blank" rel="noopener noreferrer"
                      className="font-mono text-xs font-semibold text-blue-600 hover:underline"
                    >
                      {inb.skybillNumber}
                    </a>
                  </div>
                )}
                {inb.labelGeneratedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Étiquette créée</span>
                    <span className="text-xs text-gray-700">{formatDate(inb.labelGeneratedAt)}</span>
                  </div>
                )}
                {inb.receivedAt && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                    <PackageCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-emerald-700">Turbo reçu</p>
                      <p className="text-[11px] text-emerald-600">{formatDate(inb.receivedAt)}</p>
                    </div>
                  </div>
                )}

                {/* Download inbound label */}
                {inb.hasLabel && (
                  <button onClick={handleDownloadInbound} disabled={downloadingInbound}
                    className="w-full h-9 flex items-center justify-center gap-2 rounded-lg border border-blue-200 text-blue-700 text-xs font-medium hover:bg-blue-50 transition-colors disabled:opacity-50"
                  >
                    {downloadingInbound ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    {downloadingInbound ? "Téléchargement..." : "Télécharger l'étiquette d'envoi"}
                  </button>
                )}
                {/* Regenerate inbound */}
                {(inb.status === "Failed" || inb.hasLabel) && !inb.receivedAt && (
                  <button onClick={handleRegenerateInbound} disabled={regeneratingInbound}
                    className="w-full h-9 flex items-center justify-center gap-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {regeneratingInbound ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                    {regeneratingInbound ? "Régénération..." : "Régénérer l'étiquette d'envoi"}
                  </button>
                )}
                {/* Confirm reception */}
                {!inb.receivedAt && inb.status !== "NotRequired" && (
                  <button onClick={handleConfirmReturn} disabled={confirming}
                    className="w-full h-9 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {confirming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PackageCheck className="h-3.5 w-3.5" />}
                    {confirming ? "Confirmation..." : "Confirmer réception du turbo client"}
                  </button>
                )}
              </div>
            ) : (
              <div className="pl-5 p-3 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-700">
                ⚠️ Étiquette d'envoi non encore générée (génération automatique à la confirmation du paiement).
              </div>
            )}
          </div>
        )}

        {/* Separator between the two label blocks */}
        {isInboundFirst && <hr className="border-gray-100" />}

        {/* ── Return label block (Échange Standard avec consigne) ── */}
        {withConsigne && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs font-semibold text-gray-700">Retour client → TurboSouf (consigne)</span>
            </div>

            {rs ? (
              <div className="pl-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Statut retour</span>
                  <StatusIndicator status={rs.returnStatus} />
                </div>
                {rs.returnSkybillNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">N° suivi retour</span>
                    <a
                      href={`https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${rs.returnSkybillNumber}&langue=fr`}
                      target="_blank" rel="noopener noreferrer"
                      className="font-mono text-xs font-semibold text-blue-600 hover:underline"
                    >
                      {rs.returnSkybillNumber}
                    </a>
                  </div>
                )}
                {rs.returnLabelGeneratedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Étiquette créée</span>
                    <span className="text-xs text-gray-700">{formatDate(rs.returnLabelGeneratedAt)}</span>
                  </div>
                )}

                {/* Consigne */}
                {order.depositTotal > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Consigne</span>
                    <span className="text-xs font-semibold text-amber-700">
                      {formatPrice(order.depositTotal)}
                      {isRefunded && <span className="ml-1.5 text-emerald-600 font-normal">· remboursée ✓</span>}
                    </span>
                  </div>
                )}

                {rs.returnReceivedAt && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                    <PackageCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-emerald-700">Reprise reçue</p>
                      <p className="text-[11px] text-emerald-600">{formatDate(rs.returnReceivedAt)}</p>
                    </div>
                  </div>
                )}
                {order.depositRefundedAt && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 border border-purple-100">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-purple-700">Consigne remboursée</p>
                      <p className="text-[11px] text-purple-600">{formatDate(order.depositRefundedAt)}</p>
                    </div>
                  </div>
                )}

                {rs.hasReturnLabel && (
                  <button onClick={handleDownloadReturn} disabled={downloading}
                    className="w-full h-9 flex items-center justify-center gap-2 rounded-lg border border-blue-200 text-blue-700 text-xs font-medium hover:bg-blue-50 transition-colors disabled:opacity-50"
                  >
                    {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    {downloading ? "Téléchargement..." : "Télécharger l'étiquette retour"}
                  </button>
                )}
                {(rs.returnStatus === "Failed" || rs.hasReturnLabel) && !rs.returnReceivedAt && (
                  <button onClick={handleRegenerateReturn} disabled={regenerating}
                    className="w-full h-9 flex items-center justify-center gap-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {regenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                    {regenerating ? "Régénération..." : "Régénérer l'étiquette retour"}
                  </button>
                )}
                {!rs.returnReceivedAt && !isRefunded && rs.returnStatus !== "NotRequired" && (
                  <button onClick={handleConfirmReturn} disabled={confirming}
                    className="w-full h-9 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {confirming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PackageCheck className="h-3.5 w-3.5" />}
                    {confirming ? "Confirmation..." : "Confirmer réception de la reprise"}
                  </button>
                )}
              </div>
            ) : (
              <div className="pl-5 p-3 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-700">
                ⚠️ Étiquette retour non générée — elle sera créée automatiquement à l'expédition.
              </div>
            )}
          </div>
        )}

        {/* Je rénove — forward note after inbound reception */}
        {isRenovation && inboundReceived && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
            <ArrowDown className="h-4 w-4 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-700">
              Turbo reçu. Après réparation, créez l'expédition (TurboSouf → client) depuis le panneau <strong>Expédition</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
