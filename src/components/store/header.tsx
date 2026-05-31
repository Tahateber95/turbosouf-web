"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, Search, Menu, X, User, Phone, Truck, LogOut, ChevronDown, Package } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCartContext } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/produits/turbocompresseurs", label: "Turbos" },
  { href: "/produits/injecteurs", label: "Injecteurs" },
  { href: "/produits/pompes-hp", label: "Pompes HP" },
  { href: "/produits/freinage", label: "Freinage" },
  { href: "/produits/huiles-additifs", label: "Huiles" },
  { href: "/services", label: "Services" },
];

export function Header() {
  const { user, logout, isLoading } = useAuth();
  const { itemCount } = useCartContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/produits?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d1117] border-b border-white/5">
      {/* Top bar */}
      <div className="bg-[var(--ts-primary-500)] text-white">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-8 text-xs font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" />
              +33 1 23 45 67 89
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Truck className="h-3 w-3" />
              Livraison gratuite dès 150€
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/faq" className="hover:text-white/80 transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-white/80 transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo.png" alt="TurboSouf" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-contain" />
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">TurboSouf</span>
              <span className="hidden sm:block text-[11px] text-gray-500 -mt-0.5 tracking-wider uppercase">Expert Turbo</span>
            </div>
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par référence, nom, véhicule..."
                className="w-full h-10 pl-4 pr-12 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)] focus:bg-white/10 transition-all"
              />
              <button type="submit" className="absolute right-1 top-1 h-8 w-8 flex items-center justify-center rounded-md bg-[var(--ts-primary-500)] text-white hover:bg-[var(--ts-primary-400)] transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Search className="h-5 w-5 text-gray-400" />
            </button>

            {/* Auth section */}
            {!isLoading && (
              user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--ts-primary-500)] flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">{user.fullName.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="max-w-[100px] truncate">{user.fullName.split(" ")[0]}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-gray-100 shadow-lg py-1 z-50">
                      <div className="px-3 py-2 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link href="/compte" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="h-4 w-4" /> Mon compte
                      </Link>
                      <Link href="/compte/commandes" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Package className="h-4 w-4" /> Mes commandes
                      </Link>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" /> Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/connexion" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors">
                  <User className="h-4 w-4" />
                  <span>Connexion</span>
                </Link>
              )
            )}

            {/* Cart */}
            <Link href="/panier" className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-[var(--ts-primary-500)] text-white hover:bg-[var(--ts-primary-400)] transition-colors">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Panier</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-[var(--ts-accent-500)] text-[10px] font-bold flex items-center justify-center text-white animate-bounce">
                  {itemCount}
                </span>
              )}
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Category nav - desktop */}
        <nav className="hidden lg:flex items-center gap-1 -mb-px h-10">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-[var(--ts-primary-500)] border-b-2 border-transparent hover:border-[var(--ts-primary-500)] transition-all">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile search */}
      {searchOpen && (
        <form onSubmit={handleSearch} className="lg:hidden border-t border-white/5 px-4 py-3 bg-[#161b22]">
          <div className="relative">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher..." className="w-full h-10 pl-4 pr-10 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" autoFocus />
            <button type="submit"><Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" /></button>
          </div>
        </form>
      )}

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-white/5 bg-[#161b22] px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-[var(--ts-primary-500)]">
              {link.label}
            </Link>
          ))}
          <hr className="my-2 border-white/10" />
          {user ? (
            <>
              <div className="px-3 py-2 text-sm text-gray-500">Connecté : {user.fullName}</div>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10">
                <LogOut className="h-4 w-4" /> Déconnexion
              </button>
            </>
          ) : (
            <Link href="/connexion" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5">
              <User className="h-4 w-4" /> Connexion / Inscription
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
