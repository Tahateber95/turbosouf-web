import { BarChart3, TrendingUp, Package, Users } from "lucide-react";

export default function ReportsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Rapports</h1>
        <p className="text-sm text-gray-500">Analyse de votre activité</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart placeholder */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Chiffre d&apos;affaires
            </h2>
            <select className="h-7 px-2 rounded border border-gray-200 text-xs bg-white">
              <option>7 jours</option>
              <option>30 jours</option>
              <option>12 mois</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <div className="text-center text-gray-400">
              <BarChart3 className="h-10 w-10 mx-auto mb-2" />
              <p className="text-sm">Graphique Recharts</p>
              <p className="text-xs">Sera connecté à l&apos;API analytics</p>
            </div>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mb-4">
            <Package className="h-4 w-4 text-[var(--ts-primary-500)]" />
            Top produits (30 jours)
          </h2>
          <div className="space-y-3">
            {[
              { name: "Turbo Garrett GT1544V", sold: 18, revenue: 4644 },
              { name: "Injecteur Bosch CR", sold: 32, revenue: 3417 },
              { name: "Pompe HP Delphi", sold: 8, revenue: 3072 },
              { name: "Turbo BorgWarner K03", sold: 6, revenue: 2052 },
              { name: "Plaquettes frein avant", sold: 45, revenue: 1890 },
            ].map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.sold} vendus</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(p.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
