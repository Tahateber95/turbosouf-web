"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, Mail, Phone, Building2, ShoppingBag, User, Hash } from "lucide-react";
import { adminGetCustomer, adminGetOrders } from "@/lib/admin-api";
import type { CustomerListItem, OrderListItem } from "@/lib/api";

type CustomerDetail = CustomerListItem & { siret?: string; sageCustomerId?: string };

function formatDate(iso: string) { return new Date(iso).toLocaleDateString("fr-FR"); }
function formatPrice(n: number) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n); }

interface Props { params: Promise<{ id: string }> }

export default function CustomerDetailPage({ params }: Props) {
  const { id } = use(params);
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      adminGetCustomer(id),
      adminGetOrders(1, 100),
    ])
      .then(([c, o]) => {
        setCustomer(c);
        // Filter orders belonging to this customer by email
        setOrders(o.items.filter((ord) => ord.customerEmail === c.email));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-gray-400">
      <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement...
    </div>
  );

  if (error || !customer) return (
    <div className="py-12 text-center text-sm text-red-500">{error || "Client introuvable."}</div>
  );

  const totalSpent = orders.reduce((sum, o) => sum + o.totalTTC, 0);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/clients" className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900">{customer.fullName}</h1>
          <p className="text-sm text-gray-500">Client depuis le {formatDate(customer.createdAt)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${customer.customerType === "B2B" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
          {customer.customerType}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: info */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <p className="text-2xl font-black text-gray-900">{customer.orderCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Commandes</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <p className="text-lg font-black text-gray-900">{formatPrice(totalSpent)}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total dépensé</p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-[var(--ts-primary-500)]" /> Informations
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <a href={`mailto:${customer.email}`} className="hover:text-[var(--ts-primary-500)] hover:underline truncate">{customer.email}</a>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  {customer.phone}
                </div>
              )}
              {customer.companyName && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <p>{customer.companyName}</p>
                    {customer.siret && <p className="text-xs text-gray-400">SIRET: {customer.siret}</p>}
                  </div>
                </div>
              )}
              {customer.sageCustomerId && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Hash className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-xs font-mono text-gray-500">Sage: {customer.sageCustomerId}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[var(--ts-primary-500)]" />
              <h2 className="text-sm font-bold text-gray-900">Commandes ({orders.length})</h2>
            </div>
            {orders.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-400">Aucune commande.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
                    <th className="px-5 py-2 font-medium">N°</th>
                    <th className="px-5 py-2 font-medium">Date</th>
                    <th className="px-5 py-2 font-medium text-right">Total</th>
                    <th className="px-5 py-2 font-medium">Statut</th>
                    <th className="px-5 py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs font-semibold text-[var(--ts-primary-500)]">{o.orderNumber}</td>
                      <td className="px-5 py-3 text-gray-500">{formatDate(o.createdAt)}</td>
                      <td className="px-5 py-3 text-right font-semibold">{formatPrice(o.totalTTC)}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-medium text-gray-600">{o.status}</span>
                      </td>
                      <td className="px-5 py-3">
                        <Link href={`/dashboard/commandes/${o.id}`} className="text-xs text-[var(--ts-primary-500)] hover:underline">
                          Détails
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
