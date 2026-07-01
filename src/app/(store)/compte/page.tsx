"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, LogOut, ChevronRight, Building2, Phone, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AccountPage() {
  const { user, token, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/connexion?redirect=/compte");
    }
  }, [isLoading, token, router]);

  if (isLoading || !user) {
    return (
      <div className="bg-[var(--ts-canvas)] min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--ts-primary-500)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[var(--ts-canvas)] min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-black text-[var(--ts-navy-700)] mb-8">Mon compte</h1>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[var(--ts-primary-500)]/10 flex items-center justify-center">
              <User className="h-7 w-7 text-[var(--ts-primary-500)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{user.fullName}</h2>
              <p className="text-sm text-gray-500 capitalize">{user.customerType === "B2B" ? "Professionnel" : "Particulier"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
              {user.email}
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                {user.phone}
              </div>
            )}
            {user.companyName && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                {user.companyName}
                {user.siret && <span className="text-xs text-gray-400">· SIRET: {user.siret}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Nav links */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
          <Link href="/compte/commandes" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-[var(--ts-primary-500)]" />
              <span className="text-sm font-medium text-gray-900">Mes commandes</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
