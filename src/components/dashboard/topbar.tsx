"use client";

import { Bell, Search, Menu, User } from "lucide-react";
import { useState } from "react";

export function Topbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100">
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        {/* Search */}
        <div className="hidden sm:block relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher commandes, produits, clients..."
            className="h-9 w-72 pl-9 pr-3 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)] focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Search className="h-4 w-4 text-gray-600" />
        </button>

        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="h-4 w-4 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2 pl-2 ml-2 border-l border-gray-100">
          <div className="w-8 h-8 rounded-full bg-[var(--ts-primary-500)] flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-900">Admin</p>
            <p className="text-[10px] text-gray-400">admin@turbosouf.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
