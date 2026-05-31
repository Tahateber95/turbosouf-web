import Link from "next/link";
import { Search, Users } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";

const CUSTOMERS = [
  { id: "1", name: "Jean Dupont", email: "jean@example.com", type: "B2C", orders: 3, totalSpent: 856, date: "15/03/2026" },
  { id: "2", name: "Marie Martin", email: "marie@example.com", type: "B2C", orders: 1, totalSpent: 258, date: "10/04/2026" },
  { id: "3", name: "Auto Garage Pro", email: "garage@example.com", type: "B2B", orders: 12, totalSpent: 4520, date: "01/01/2026", company: "Garage Pro SARL", tier: "Gold" },
  { id: "4", name: "Pierre Durand", email: "pierre@example.com", type: "B2C", orders: 5, totalSpent: 1340, date: "20/02/2026" },
  { id: "5", name: "Méca Express", email: "contact@mecaexpress.fr", type: "B2B", orders: 8, totalSpent: 3200, date: "05/02/2026", company: "Méca Express SAS", tier: "Silver" },
];

function formatPrice(n: number) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n); }

export default function CustomersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500">{CUSTOMERS.length} clients inscrits</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Nom, email, entreprise..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
        </div>
        <select className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white">
          <option value="">Tous types</option>
          <option>B2C</option>
          <option>B2B</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium text-center">Commandes</th>
                <th className="px-5 py-3 font-medium text-right">Total dépensé</th>
                <th className="px-5 py-3 font-medium">Inscrit le</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {CUSTOMERS.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--ts-primary-500)]/10 flex items-center justify-center shrink-0">
                        <Users className="h-3.5 w-3.5 text-[var(--ts-primary-500)]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      c.type === "B2B" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center text-gray-600">{c.orders}</td>
                  <td className="px-5 py-3 text-right font-semibold">{formatPrice(c.totalSpent)}</td>
                  <td className="px-5 py-3 text-gray-500">{c.date}</td>
                  <td className="px-5 py-3">
                    <Link href={`/dashboard/clients/${c.id}`} className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline">
                      Voir
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
