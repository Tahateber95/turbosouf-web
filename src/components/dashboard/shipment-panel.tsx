"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Truck, Package, Loader2, AlertTriangle, Download,
  X, CheckCircle2, ExternalLink, RefreshCw, XCircle,
} from "lucide-react";
import {
  adminGetShipment,
  adminCreateShipment,
  adminCancelShipment,
  downloadShipmentLabel,
  type ShipmentInfo,
} from "@/lib/admin-api";

interface Props {
  orderNumber: string;
  orderStatus: string;
}

const STATUS_CONFIG: Record<ShipmentInfo["status"], { label: string; color: string; bg: string }> = {
  Created:   { label: "Créé",      color: "text-blue-700",  bg: "bg-blue-50 border-blue-100" },
  Printed:   { label: "Imprimé",   color: "text-indigo-700",bg: "bg-indigo-50 border-indigo-100" },
  Collected: { label: "Collecté",  color: "text-orange-700",bg: "bg-orange-50 border-orange-100" },
  Delivered: { label: "Livré",     color: "text-green-700", bg: "bg-green-50 border-green-100" },
  Cancelled: { label: "Annulé",    color: "text-gray-500",  bg: "bg-gray-50 border-gray-200" },
  Failed:    { label: "Échec",     color: "text-red-700",   bg: "bg-red-50 border-red-100" },
};

export function ShipmentPanel({ orderNumber, orderStatus }: Props) {
  const [shipment, setShipment]     = useState<ShipmentInfo | null>(null);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [weightKg, setWeightKg]     = useState("2.5");
  const [creating, setCreating]     = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const loadShipment = useCallback(async () => {
    try {
      const data = await adminGetShipment(orderNumber);
      setShipment(data);
    } catch {
      setShipment(null); // no shipment yet — expected
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => { loadShipment(); }, [loadShipment]);

  const handleCreate = async () => {
    const weight = parseFloat(weightKg);
    if (isNaN(weight) || weight <= 0) { setError("Poids invalide"); return; }
    setCreating(true);
    setError(null);
    try {
      const data = await adminCreateShipment(orderNumber, weight);
      setShipment(data);
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = async () => {
    if (!shipment) return;
    if (!confirm("Annuler cette expédition Chronopost ?")) return;
    setCancelling(true);
    setError(null);
    try {
      await adminCancelShipment(orderNumber);
      await loadShipment();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'annulation");
    } finally {
      setCancelling(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      await downloadShipmentLabel(orderNumber, "PDF");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de téléchargement");
    } finally {
      setDownloading(false);
    }
  };

  const canCreate = !shipment || shipment.status === "Failed" || shipment.status === "Cancelled";
  const canCancel = shipment && (shipment.status === "Created" || shipment.status === "Printed");
  const canDownload = shipment && shipment.status !== "Failed" && shipment.status !== "Cancelled" && shipment.reservationNumber;
  const cfg = shipment ? STATUS_CONFIG[shipment.status] : null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-[#E85D26]" />
          <h2 className="text-sm font-bold text-gray-900">Expédition Chronopost</h2>
        </div>
        {shipment && (
          <button onClick={loadShipment} className="text-gray-400 hover:text-gray-600 transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-3 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-700">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Chargement...
        </div>
      ) : shipment ? (
        <div className="space-y-3">
          {/* Status badge */}
          <div className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold ${cfg!.bg} ${cfg!.color}`}>
            <span>{cfg!.label}</span>
            {shipment.skybillNumber && (
              <span className="font-mono text-[10px] opacity-80">{shipment.skybillNumber}</span>
            )}
          </div>

          {/* Shipment details */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Produit</span>
              <span className="font-mono font-medium text-gray-700">{shipment.productCode} / {shipment.serviceCode}</span>
            </div>
            <div className="flex justify-between">
              <span>Poids</span>
              <span className="font-medium text-gray-700">{shipment.weightKg} kg</span>
            </div>
            {shipment.lastEventCode && (
              <div className="flex justify-between">
                <span>Dernier événement</span>
                <span className="font-mono font-medium text-gray-700">{shipment.lastEventCode}</span>
              </div>
            )}
          </div>

          {/* Error details */}
          {shipment.status === "Failed" && shipment.errorMessage && (
            <div className="flex items-start gap-2 p-2 rounded-lg bg-red-50 text-xs text-red-700">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>Chronopost {shipment.errorCode}: {shipment.errorMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-1">
            {canDownload && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full h-9 flex items-center justify-center gap-2 bg-[#E85D26] hover:bg-[#d44f1e] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                {downloading ? "Téléchargement..." : "Télécharger l'étiquette"}
              </button>
            )}

            {shipment.trackingUrl && (
              <a
                href={shipment.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full h-9 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:border-[#E85D26] hover:text-[#E85D26] text-xs font-medium rounded-lg transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Suivi Chronopost
              </a>
            )}

            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full h-8 flex items-center justify-center gap-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {cancelling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                {cancelling ? "Annulation..." : "Annuler l'expédition"}
              </button>
            )}

            {canCreate && (
              <button
                onClick={() => { setError(null); setShowModal(true); }}
                className="w-full h-9 flex items-center justify-center gap-2 border border-dashed border-gray-300 text-gray-500 hover:border-[#E85D26] hover:text-[#E85D26] text-xs font-medium rounded-lg transition-colors"
              >
                <Package className="h-3.5 w-3.5" />
                Créer une nouvelle expédition
              </button>
            )}
          </div>
        </div>
      ) : (
        /* No shipment yet */
        <div className="space-y-3">
          <p className="text-xs text-gray-500">
            Aucune expédition créée. Cliquez sur &quot;Expédier&quot; une fois le colis prêt.
          </p>
          <button
            onClick={() => { setError(null); setShowModal(true); }}
            disabled={orderStatus === "Cancelled" || orderStatus === "Refunded"}
            className="w-full h-10 flex items-center justify-center gap-2 bg-[#E85D26] hover:bg-[#d44f1e] disabled:opacity-40 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <Truck className="h-4 w-4" />
            Expédier via Chronopost
          </button>
        </div>
      )}

      {/* Weight modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#E85D26]" />
                <h3 className="text-base font-black text-gray-900">Créer l'expédition</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Poids du colis (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                value={weightKg}
                onChange={e => setWeightKg(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D26]/30 focus:border-[#E85D26]"
                placeholder="ex: 2.5"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Commande <span className="font-mono font-medium text-gray-600">{orderNumber}</span> — le service Chronopost sera sélectionné automatiquement.
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 text-xs text-red-700">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 h-10 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 h-10 bg-[#E85D26] hover:bg-[#d44f1e] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {creating ? "Création..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
