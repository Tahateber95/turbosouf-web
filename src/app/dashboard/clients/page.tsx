"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, Users, Loader2 } from "lucide-react";
import { adminGetCustomers } from "@/lib/admin-api";
import type { CustomerListItem } from "@/lib/api";

const PAGE_SIZE = 25;

function formatDate(iso: string) { return new Date(iso).toLocaleDateString("fr-FR"); }

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback((p: number, s: string, t: string) => {
    setLoading(true);
    setError(null);
    adminGetCustomers(s, t, p, PAGE_SIZE)
      .then((data) => {
        setCustomers(data.items);
        setTotalCount(data.totalCount);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  // Debounced search/filter — reset to page 1
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1, search, customerType); }, 300);
    return () => clearTimeout(t);
  }, [search, customerType, load]);

  // Reload when page changes
  useEffect(() => { load(page, search, customerType); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

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
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom, email, entreprise..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
          />
        </div>
        <select
          value={customerType}
          onChange={(e) => setCustomerType(e.target.value)}
          className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="">Tous types</option>
          <option value="B2C">B2C</option>
          <option value="B2B">B2B</option>
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement...
        </div>
      )}

      {error && <div className="py-8 text-center text-sm text-red-500">{error}</div>}

      {!loading && !error && (
        <>
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
                            {c.companyName && <p className="text-xs text-gray-400">{c.companyName}</p>}
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

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className={`h-9 w-9 flex items-center justify-center rounded-lg border text-sm transition-colors ${
                  page <= 1
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-600 hover:border-[var(--ts-primary-500)] hover:text-[var(--ts-primary-500)]"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`e-${i}`} className="h-9 w-9 flex items-center justify-center text-sm text-gray-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`h-9 w-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-[var(--ts-primary-500)] border-[var(--ts-primary-500)] text-white"
                          : "border-gray-200 text-gray-600 hover:border-[var(--ts-primary-500)] hover:text-[var(--ts-primary-500)]"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className={`h-9 w-9 flex items-center justify-center rounded-lg border text-sm transition-colors ${
                  page >= totalPages
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-600 hover:border-[var(--ts-primary-500)] hover:text-[var(--ts-primary-500)]"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <p className="text-center text-xs text-gray-400 mt-3">
              Page {page} sur {totalPages} · {totalCount} clients
            </p>
          )}
        </>
      )}
    </div>
  );
}
