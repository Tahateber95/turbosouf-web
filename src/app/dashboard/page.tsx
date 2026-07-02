import { AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import Link from "next/link";
import { SERVER_API_URL, type ProductListItem } from "@/lib/api";

export default async function DashboardPage() {
  let products: ProductListItem[] = [];
  let totalProducts = 0;

  try {
    const res = await fetch(`${SERVER_API_URL}/api/v1/products?PageSize=50&IncludeInactive=true`, { next: { revalidate: 60 } });
    const json = await res.json();
    products = json.data?.items || [];
    totalProducts = json.data?.totalCount || 0;
  } catch {
    // fallback
  }

  const lowStock = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500">Vue d&apos;ensemble de votre activité</p>
        </div>
        <p className="text-xs text-gray-400">{totalProducts} produits en catalogue</p>
      </div>

      {/* Stats — real data from analytics API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardStats />
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
          <div className="px-5 py-8 text-center text-sm text-gray-400">
            Consultez la liste complète des commandes pour voir le détail.
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
              <Link href="/dashboard/produits?stock=low" className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline">
                Gérer →
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {lowStock.map((product) => (
                <div key={product.sku} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{product.sku}</p>
                  </div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    {product.stockQuantity} en stock
                  </span>
                </div>
              ))}
              {lowStock.length === 0 && (
                <div className="px-5 py-4 text-sm text-gray-400 text-center">
                  Aucun produit en stock faible
                </div>
              )}
            </div>
          </div>

          {/* Sage Sync */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Sage Sync</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Statut</span>
                <StatusBadge status="Synced" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">En attente</span>
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
