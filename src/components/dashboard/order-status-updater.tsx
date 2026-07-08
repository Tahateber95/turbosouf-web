"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminUpdateOrderStatus } from "@/lib/admin-api";

const ORDER_STATUSES = [
  { value: "Pending", label: "En attente" },
  { value: "Confirmed", label: "Confirmée" },
  { value: "Preparing", label: "En préparation" },
  { value: "Shipped", label: "Expédiée" },
  { value: "Delivered", label: "Livrée" },
  { value: "Cancelled", label: "Annulée" },
  { value: "Refunded", label: "Remboursée" },
];

interface Props {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    if (status === currentStatus) return;
    setSaving(true);
    try {
      await adminUpdateOrderStatus(orderId, status);
      toast.success("Statut mis à jour");
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h2 className="text-sm font-bold text-gray-900 mb-3">Mettre à jour le statut</h2>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)] mb-3"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={saving || status === currentStatus}
        className="w-full h-10 flex items-center justify-center gap-2 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Mettre à jour
      </button>
    </div>
  );
}
