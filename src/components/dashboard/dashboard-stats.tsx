"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { adminGetDashboardStats } from "@/lib/admin-api";

type Stats = {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  lowStockCount: number;
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminGetDashboardStats()
      .then((data) => setStats(data))
      .catch(() => {}); // fail silently — cards stay at "—"
  }, []);

  return (
    <>
      <StatsCard
        icon={ShoppingCart}
        label="Commandes aujourd'hui"
        value={stats ? String(stats.todayOrders) : "—"}
        change={stats ? (stats.todayOrders > 0 ? "Aujourd'hui" : "Aucune commande") : "Chargement..."}
        changeType={stats && stats.todayOrders > 0 ? "positive" : "neutral"}
      />
      <StatsCard
        icon={DollarSign}
        label="CA aujourd'hui"
        value={stats ? formatPrice(stats.todayRevenue) : "—"}
        change={stats ? "Paiements reçus" : "Chargement..."}
        changeType="neutral"
      />
      <StatsCard
        icon={Clock}
        label="En attente"
        value={stats ? String(stats.pendingOrders) : "—"}
        change={stats ? (stats.pendingOrders > 0 ? "À traiter" : "Tout est à jour") : "Chargement..."}
        changeType={stats && stats.pendingOrders > 0 ? "negative" : "positive"}
      />
      <StatsCard
        icon={AlertTriangle}
        label="Stock faible"
        value={stats ? String(stats.lowStockCount) : "—"}
        change={stats ? (stats.lowStockCount > 0 ? "Produits à réapprovisionner" : "Stock OK") : "Chargement..."}
        changeType={stats && stats.lowStockCount > 0 ? "negative" : "positive"}
      />
    </>
  );
}
