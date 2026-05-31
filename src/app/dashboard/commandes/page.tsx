import Link from "next/link";
import { Search } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";

const ORDERS = [
  { id: "1", number: "TS-2026-000042", customer: "Jean Dupont", items: 2, total: 408, status: "Pending", payment: "Paid", date: "20/05/2026" },
  { id: "2", number: "TS-2026-000041", customer: "Marie Martin", items: 1, total: 258, status: "Confirmed", payment: "Paid", date: "19/05/2026" },
  { id: "3", number: "TS-2026-000040", customer: "Pierre Durand", items: 3, total: 689, status: "Shipped", payment: "Paid", date: "19/05/2026" },
  { id: "4", number: "TS-2026-000039", customer: "Sophie Lefebvre", items: 1, total: 142, status: "Delivered", payment: "Paid", date: "18/05/2026" },
  { id: "5", number: "TS-2026-000038", customer: "Auto Garage Pro", items: 5, total: 1250, status: "Preparing", payment: "Paid", date: "18/05/2026" },
  { id: "6", number: "TS-2026-000037", customer: "Lucas Petit", items: 1, total: 106.8, status: "Cancelled", payment: "Refunded", date: "17/05/2026" },
];

function formatPrice(n: number) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n); }

export default function OrdersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Commandes</h1>
          <p className="text-sm text-gray-500">{ORDERS.length} commandes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="N° de commande, client..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
        </div>
        <select className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white">
          <option value="">Tous statuts</option>
          <option>En attente</option>
          <option>Confirmée</option>
          <option>En préparation</option>
          <option>Expédiée</option>
          <option>Livrée</option>
          <option>Annulée</option>
        </select>
        <select className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white">
          <option value="">Toute période</option>
          <option>Aujourd&apos;hui</option>
          <option>7 derniers jours</option>
          <option>30 derniers jours</option>
        </select>
      </div>

      {/* Table */}
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
              {ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/dashboard/commandes/${o.id}`} className="font-mono text-xs font-semibold text-[var(--ts-primary-500)] hover:underline">
                      {o.number}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">{o.customer}</td>
                  <td className="px-5 py-3 text-center text-gray-600">{o.items}</td>
                  <td className="px-5 py-3 text-right font-semibold">{formatPrice(o.total)}</td>
                  <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3"><StatusBadge status={o.payment} /></td>
                  <td className="px-5 py-3 text-gray-500">{o.date}</td>
                  <td className="px-5 py-3">
                    <Link href={`/dashboard/commandes/${o.id}`} className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline">
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
