import { ShoppingCart, DollarSign, Clock, AlertTriangle, Package, Users, TrendingUp, FileText } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import Link from "next/link";

const RECENT_ORDERS = [
  { id: "1", number: "TS-2026-000042", customer: "Jean Dupont", email: "jean@example.com", total: 408, status: "Pending", date: "20/05/2026" },
  { id: "2", number: "TS-2026-000041", customer: "Marie Martin", email: "marie@example.com", total: 258, status: "Confirmed", date: "19/05/2026" },
  { id: "3", number: "TS-2026-000040", customer: "Pierre Durand", email: "pierre@example.com", total: 689, status: "Shipped", date: "19/05/2026" },
  { id: "4", number: "TS-2026-000039", customer: "Sophie Lefebvre", email: "sophie@example.com", total: 142, status: "Delivered", date: "18/05/2026" },
  { id: "5", number: "TS-2026-000038", customer: "Auto Garage Pro", email: "garage@example.com", total: 1250, status: "Preparing", date: "18/05/2026" },
];

const LOW_STOCK = [
  { name: "Turbo BorgWarner K03", sku: "TRB-BW-001", stock: 2, threshold: 5 },
  { name: "Pompe HP Delphi DFP1", sku: "PMP-DELPHI-HP-001", stock: 3, threshold: 5 },
  { name: "Injecteur Bosch CR", sku: "INJ-BOSCH-CR-002", stock: 1, threshold: 5 },
];

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500">Vue d&apos;ensemble de votre activité</p>
        </div>
        <p className="text-xs text-gray-400">Dernière mise à jour : il y a 5 min</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={ShoppingCart} label="Commandes aujourd'hui" value="12" change="+3 vs hier" changeType="positive" />
        <StatsCard icon={DollarSign} label="CA aujourd'hui" value="2 450€" change="+15%" changeType="positive" />
        <StatsCard icon={Clock} label="En attente" value="5" change="À traiter" changeType="neutral" />
        <StatsCard icon={AlertTriangle} label="Stock faible" value="3" change="Produits à réapprovisionner" changeType="negative" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-900">Dernières commandes</h2>
            <Link href="/dashboard/commandes" className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline">
              Voir tout →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
                  <th className="px-5 py-2.5 font-medium">Commande</th>
                  <th className="px-5 py-2.5 font-medium">Client</th>
                  <th className="px-5 py-2.5 font-medium">Total</th>
                  <th className="px-5 py-2.5 font-medium">Statut</th>
                  <th className="px-5 py-2.5 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/dashboard/commandes/${order.id}`} className="font-mono text-xs font-semibold text-[var(--ts-primary-500)] hover:underline">
                        {order.number}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-400">{order.email}</p>
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-3 text-gray-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Low Stock */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Stock faible
              </h2>
              <Link href="/dashboard/produits" className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline">
                Gérer →
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {LOW_STOCK.map((product) => (
                <div key={product.sku} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{product.sku}</p>
                  </div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    {product.stock} en stock
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Sage Sync</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Statut</span>
                <StatusBadge status="Synced" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Dernier sync</span>
                <span className="text-gray-700 font-medium">Il y a 2h</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">En attente</span>
                <span className="text-gray-700 font-medium">0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Erreurs</span>
                <span className="text-gray-700 font-medium">0</span>
              </div>
            </div>
            <Link
              href="/dashboard/factures"
              className="block mt-4 text-center text-xs font-medium text-[var(--ts-primary-500)] hover:underline"
            >
              Voir les détails →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
