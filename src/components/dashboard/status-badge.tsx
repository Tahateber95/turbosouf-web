interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_STYLES: Record<string, string> = {
  // Orders
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Preparing: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
  Refunded: "bg-gray-100 text-gray-700",
  // Payments
  Paid: "bg-emerald-100 text-emerald-700",
  Failed: "bg-red-100 text-red-700",
  // Services
  Submitted: "bg-amber-100 text-amber-700",
  Diagnosed: "bg-blue-100 text-blue-700",
  InProgress: "bg-indigo-100 text-indigo-700",
  Ready: "bg-purple-100 text-purple-700",
  // Sage
  Synced: "bg-emerald-100 text-emerald-700",
  Retrying: "bg-amber-100 text-amber-700",
  // Invoices
  Draft: "bg-gray-100 text-gray-600",
  Sent: "bg-blue-100 text-blue-700",
  Void: "bg-red-100 text-red-700",
  // Generic
  Active: "bg-emerald-100 text-emerald-700",
  Inactive: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<string, string> = {
  Pending: "En attente",
  Confirmed: "Confirmée",
  Preparing: "En préparation",
  Shipped: "Expédiée",
  Delivered: "Livrée",
  Completed: "Terminée",
  Cancelled: "Annulée",
  Refunded: "Remboursée",
  Paid: "Payé",
  Failed: "Échoué",
  Submitted: "Soumise",
  Diagnosed: "Diagnostiquée",
  InProgress: "En cours",
  Ready: "Prête",
  Synced: "Synchronisé",
  Retrying: "En retry",
  Draft: "Brouillon",
  Sent: "Envoyée",
  Void: "Annulée",
  Active: "Actif",
  Inactive: "Inactif",
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-600";
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${style} ${className}`}>
      {label}
    </span>
  );
}
