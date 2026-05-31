"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, FileText,
  Wrench, FileEdit, Settings, ChevronLeft, ChevronRight, LogOut,
  BarChart3, Database,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/dashboard/produits", icon: Package, label: "Produits" },
  { href: "/dashboard/commandes", icon: ShoppingCart, label: "Commandes" },
  { href: "/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/dashboard/factures", icon: FileText, label: "Factures" },
  { href: "/dashboard/services", icon: Wrench, label: "Services Atelier" },
  { href: "/dashboard/vehicules", icon: Database, label: "Véhicules" },
  { href: "/dashboard/contenu", icon: FileEdit, label: "Contenu" },
  { href: "/dashboard/rapports", icon: BarChart3, label: "Rapports" },
  { href: "/dashboard/parametres", icon: Settings, label: "Paramètres" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col bg-[var(--ts-primary-900)] text-white min-h-screen transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 h-14 px-3 border-b border-white/10 shrink-0">
        <img src="/logo.png" alt="TurboSouf" className="w-8 h-8 rounded-full object-contain shrink-0" />
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="text-sm font-bold whitespace-nowrap">TurboSouf</span>
            <span className="block text-[9px] text-gray-500 -mt-0.5">Administration</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-gray-400 hover:bg-white/8 hover:text-gray-200"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-white/10 space-y-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] text-gray-500 hover:bg-white/8 hover:text-gray-300 transition-all"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span>Réduire</span>
            </>
          )}
        </button>
        <Link
          href="/"
          className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] text-gray-500 hover:bg-white/8 hover:text-gray-300 transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Voir le site</span>}
        </Link>
      </div>
    </aside>
  );
}
