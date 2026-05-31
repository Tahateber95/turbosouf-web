import Link from "next/link";
import { Search, RefreshCw, FileText, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";

const INVOICES = [
  { id: "1", number: "FAC-2026-042", order: "TS-2026-000042", customer: "Jean Dupont", type: "Invoice", amount: 408, status: "Sent", sage: "Synced", date: "20/05/2026" },
  { id: "2", number: "FAC-2026-041", order: "TS-2026-000041", customer: "Marie Martin", type: "Invoice", amount: 258, status: "Paid", sage: "Synced", date: "19/05/2026" },
  { id: "3", number: "FAC-2026-040", order: "TS-2026-000040", customer: "Pierre Durand", type: "Invoice", amount: 689, status: "Paid", sage: "Synced", date: "19/05/2026" },
  { id: "4", number: "AVO-2026-003", order: "TS-2026-000037", customer: "Lucas Petit", type: "CreditNote", amount: -106.8, status: "Void", sage: "Synced", date: "17/05/2026" },
  { id: "5", number: "FAC-2026-038", order: "TS-2026-000038", customer: "Auto Garage Pro", type: "Invoice", amount: 1250, status: "Sent", sage: "Pending", date: "18/05/2026" },
];

function formatPrice(n: number) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n); }

export default function InvoicesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Factures</h1>
          <p className="text-sm text-gray-500">Gestion des factures et synchronisation Sage</p>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-4 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200">
          <RefreshCw className="h-4 w-4" />
          Sync Sage
        </button>
      </div>

      {/* Sage status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: CheckCircle2, label: "Synchronisées", value: "42", color: "text-emerald-600 bg-emerald-50" },
          { icon: Clock, label: "En attente", value: "1", color: "text-amber-600 bg-amber-50" },
          { icon: AlertCircle, label: "Erreurs", value: "0", color: "text-red-600 bg-red-50" },
          { icon: FileText, label: "Total factures", value: "45", color: "text-blue-600 bg-blue-50" },
        ].map((s) => (
          <div key={s.label} className={`flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="N° facture, client..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
        </div>
        <select className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white">
          <option value="">Tous types</option>
          <option>Facture</option>
          <option>Avoir</option>
        </select>
        <select className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white">
          <option value="">Sage: Tous</option>
          <option>Synchronisé</option>
          <option>En attente</option>
          <option>Erreur</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
                <th className="px-5 py-3 font-medium">N° Facture</th>
                <th className="px-5 py-3 font-medium">Commande</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium text-right">Montant TTC</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium">Sage</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-gray-900">{inv.number}</td>
                  <td className="px-5 py-3">
                    <Link href={`/dashboard/commandes/${inv.id}`} className="font-mono text-xs text-[var(--ts-primary-500)] hover:underline">
                      {inv.order}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-900">{inv.customer}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium ${inv.type === "CreditNote" ? "text-red-600" : "text-gray-600"}`}>
                      {inv.type === "CreditNote" ? "Avoir" : "Facture"}
                    </span>
                  </td>
                  <td className={`px-5 py-3 text-right font-semibold ${inv.amount < 0 ? "text-red-600" : ""}`}>
                    {formatPrice(inv.amount)}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-5 py-3"><StatusBadge status={inv.sage} /></td>
                  <td className="px-5 py-3 text-gray-500">{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
