import Link from "next/link";
import { Search, Users } from "lucide-react";
import { SERVER_API_URL } from "@/lib/api";

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  customerType: string;
  companyName: string | null;
  b2bTier: string | null;
  orderCount: number;
  createdAt: string;
}

function formatDate(iso: string) { return new Date(iso).toLocaleDateString("fr-FR"); }

export default async function CustomersPage() {
  let customers: Customer[] = [];
  let totalCount = 0;

  try {
    const res = await fetch(`${SERVER_API_URL}/api/v1/customers?pageSize=50`, {
      next: { revalidate: 30 },
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const json = await res.json();
      customers = json.data?.items || [];
      totalCount = json.data?.totalCount || 0;
    }
  } catch {
    // fallback
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500">{totalCount} clients inscrits</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Nom, email, entreprise..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
        </div>
        <select className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white">
          <option value="">Tous types</option>
          <option value="B2C">B2C</option>
          <option value="B2B">B2B</option>
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
                <th className="px-5 py-3 font-medium">Inscrit le</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--ts-primary-500)]/10 flex items-center justify-center shrink-0">
                        <Users className="h-3.5 w-3.5 text-[var(--ts-primary-500)]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{c.fullName}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      c.customerType === "B2B" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {c.customerType}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center text-gray-600">{c.orderCount}</td>
                  <td className="px-5 py-3 text-gray-500">{formatDate(c.createdAt)}</td>
                  <td className="px-5 py-3">
                    <Link href={`/dashboard/clients/${c.id}`} className="text-xs font-medium text-[var(--ts-primary-500)] hover:underline">
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500">Aucun client trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
