import Link from "next/link";
import { Search } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { SERVER_API_URL } from "@/lib/api";

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  totalTTC: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

function formatPrice(n: number) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n); }
function formatDate(iso: string) { return new Date(iso).toLocaleDateString("fr-FR"); }

export default async function OrdersPage() {
  let orders: OrderItem[] = [];
  let totalCount = 0;

  try {
    const res = await fetch(`${SERVER_API_URL}/api/v1/orders?PageSize=50`, {
      next: { revalidate: 30 },
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const json = await res.json();
      orders = json.data?.items || [];
      totalCount = json.data?.totalCount || 0;
    }
  } catch {
    // fallback
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Commandes</h1>
          <p className="text-sm text-gray-500">{totalCount} commandes</p>
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
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Preparing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
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
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/dashboard/commandes/${o.id}`} className="font-mono text-xs font-semibold text-[var(--ts-primary-500)] hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">{o.customerName}</td>
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
    </div>
  );
}
