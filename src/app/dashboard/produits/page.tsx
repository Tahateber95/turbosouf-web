import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";

const PRODUCTS = [
  { id: "1", sku: "TRB-GT1544V-001", name: "Turbo Garrett GT1544V", category: "Turbocompresseurs", brand: "Garrett", priceHT: 215, stock: 12, active: true },
  { id: "2", sku: "INJ-BOSCH-CR-001", name: "Injecteur Bosch Common Rail", category: "Injecteurs", brand: "Bosch", priceHT: 89, stock: 25, active: true },
  { id: "3", sku: "PMP-DELPHI-HP-001", name: "Pompe HP Delphi DFP1", category: "Pompes HP", brand: "Delphi", priceHT: 320, stock: 3, active: true },
  { id: "4", sku: "BRK-PAD-001", name: "Plaquettes de frein avant", category: "Freinage", brand: "—", priceHT: 35, stock: 50, active: true },
  { id: "5", sku: "OIL-5W30-5L", name: "Huile moteur 5W-30 5L", category: "Huiles & Additifs", brand: "—", priceHT: 28, stock: 100, active: true },
  { id: "6", sku: "TRB-BW-001", name: "Turbo BorgWarner K03", category: "Turbocompresseurs", brand: "BorgWarner", priceHT: 285, stock: 2, active: true },
];

function formatPrice(n: number) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n); }

export default function ProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Produits</h1>
          <p className="text-sm text-gray-500">{PRODUCTS.length} produits au total</p>
        </div>
        <Link
          href="/dashboard/produits/nouveau"
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouveau produit
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, SKU, référence..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
          />
        </div>
        <select className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white">
          <option value="">Toutes catégories</option>
          <option>Turbocompresseurs</option>
          <option>Injecteurs</option>
          <option>Pompes HP</option>
          <option>Freinage</option>
          <option>Huiles & Additifs</option>
        </select>
        <select className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white">
          <option value="">Tout stock</option>
          <option>En stock</option>
          <option>Stock faible</option>
          <option>Rupture</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
                <th className="px-5 py-3 font-medium">Produit</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Catégorie</th>
                <th className="px-5 py-3 font-medium">Marque</th>
                <th className="px-5 py-3 font-medium text-right">Prix HT</th>
                <th className="px-5 py-3 font-medium text-right">Stock</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {PRODUCTS.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
                  <td className="px-5 py-3 text-gray-600">{p.category}</td>
                  <td className="px-5 py-3 text-gray-600">{p.brand}</td>
                  <td className="px-5 py-3 text-right font-semibold">{formatPrice(p.priceHT)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`font-semibold ${p.stock <= 5 ? "text-red-600" : "text-gray-900"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={p.active ? "Active" : "Inactive"} />
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/dashboard/produits/${p.id}`}
                      className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline"
                    >
                      Modifier
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
