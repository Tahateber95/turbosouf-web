"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Package } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  adminGetRevenue,
  adminGetTopProducts,
  type RevenueChartPoint,
  type TopProductItem,
} from "@/lib/admin-api";

type Period = "7d" | "30d" | "12m";

function formatDate(date: string, period: Period) {
  if (period === "12m") {
    const [y, m] = date.split("-");
    return new Date(Number(y), Number(m) - 1).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
  }
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [revenue, setRevenue] = useState<RevenueChartPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductItem[]>([]);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [loadingTop, setLoadingTop] = useState(true);

  useEffect(() => {
    setLoadingRevenue(true);
    adminGetRevenue(period)
      .then(setRevenue)
      .catch(() => setRevenue([]))
      .finally(() => setLoadingRevenue(false));
  }, [period]);

  useEffect(() => {
    adminGetTopProducts(30)
      .then(setTopProducts)
      .catch(() => setTopProducts([]))
      .finally(() => setLoadingTop(false));
  }, []);

  const chartData = revenue.map((p) => ({
    ...p,
    label: formatDate(p.date, period),
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Rapports</h1>
        <p className="text-sm text-gray-500">Analyse de votre activité</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Chiffre d&apos;affaires
            </h2>
            <select
              className="h-7 px-2 rounded border border-gray-200 text-xs bg-white"
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
            >
              <option value="7d">7 jours</option>
              <option value="30d">30 jours</option>
              <option value="12m">12 mois</option>
            </select>
          </div>

          <div className="h-64">
            {loadingRevenue ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                Chargement...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E85D26" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#E85D26" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v.toLocaleString("fr-FR")} €`}
                    width={70}
                  />
                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(value))
                    }
                    labelStyle={{ fontSize: 12 }}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#E85D26"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                    name="CA"
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mb-4">
            <Package className="h-4 w-4 text-[var(--ts-primary-500)]" />
            Top produits (30 jours)
          </h2>

          {loadingTop ? (
            <div className="text-sm text-gray-400 text-center py-8">Chargement...</div>
          ) : topProducts.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-8">Aucune vente sur cette période.</div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.quantitySold} vendus</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(p.revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
