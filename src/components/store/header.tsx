"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, Search, Menu, X, User, Phone, LogOut, ChevronDown, Package } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCartContext } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/produits", label: "Nos Turbos" },
  { href: "/services", label: "Reconditionnement" },
  { href: "/articles", label: "Nos Articles" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const { user, logout, isLoading } = useAuth();
  const { itemCount } = useCartContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/produits?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? "shadow-md shadow-black/6 border-b border-[rgba(0,0,0,0.08)]" : "border-b border-[rgba(0,0,0,0.06)]"
      }`}
    >
      {/* Top bar — orange gradient */}
      <div style={{ background: "linear-gradient(90deg,#E85D26 0%,#F7941D 100%)" }}>
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-8 text-xs font-medium text-white">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" />
              +33 7 79 49 05 55
            </span>
          </div>
          <div className="flex items-center gap-4 text-white/85">
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img src="/logo.png" alt="TurboSouf" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain" />
            <div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#0A0A0A]">TurboSouf</span>
              <span className="hidden sm:block text-[12px] text-[#6B6B6B] -mt-0.5 tracking-wider uppercase">Specialiste Turbo</span>
            </div>
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un turbo par reference, vehicule..."
                className="w-full h-10 pl-4 pr-12 rounded-lg border border-[rgba(0,0,0,0.12)] bg-[#F8F7F4] text-sm text-[#0A0A0A] placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#E85D26]/40 focus:bg-white focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 h-8 w-8 flex items-center justify-center rounded-md text-white hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(180deg,#FF7A45 0%,#E85D26 100%)" }}
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="lg:hidden p-2 rounded-lg hover:bg-[#F2F0EC] transition-colors">
              <Search className="h-5 w-5 text-[#6B6B6B]" />
            </button>

            {!isLoading && (
              user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#3A3A3A] hover:bg-[#F2F0EC] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(180deg,#FF7A45 0%,#E85D26 100%)" }}>
                      <span className="text-[10px] font-bold text-white">{user.fullName.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="max-w-[100px] truncate">{user.fullName.split(" ")[0]}</span>
                    <ChevronDown className="h-3 w-3 text-[#A0A0A0]" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-[rgba(0,0,0,0.08)] shadow-xl shadow-black/8 py-1 z-50">
                      <div className="px-3 py-2.5 border-b border-[rgba(0,0,0,0.06)]">
                        <p className="text-sm font-bold text-[#0A0A0A] truncate">{user.fullName}</p>
                        <p className="text-xs text-[#A0A0A0] truncate">{user.email}</p>
                      </div>
                      <Link href="/compte" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-[#3A3A3A] hover:bg-[#F8F7F4]">
                        <User className="h-4 w-4" /> Mon compte
                      </Link>
                      <Link href="/compte/commandes" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-[#3A3A3A] hover:bg-[#F8F7F4]">
                        <Package className="h-4 w-4" /> Mes commandes
                      </Link>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" /> Deconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/connexion" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#3A3A3A] hover:bg-[#F2F0EC] transition-colors">
                  <User className="h-4 w-4" />
                  <span>Connexion</span>
                </Link>
              )
            )}

            {/* Cart — gradient orange */}
            <Link
              href="/panier"
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-bold text-white hover:opacity-90 transition-opacity shadow-md shadow-[#E85D26]/20"
              style={{ background: "linear-gradient(180deg,#FF7A45 0%,#E85D26 100%)" }}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Panier</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-[#1A3A5C] text-[10px] font-black flex items-center justify-center text-white shadow">
                  {itemCount}
                </span>
              )}
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-[#F2F0EC] transition-colors text-[#6B6B6B]">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Nav links - desktop */}
        <nav className="hidden lg:flex items-center gap-0.5 -mb-px h-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-sm font-semibold text-[#6B6B6B] hover:text-[#E85D26] border-b-2 border-transparent hover:border-[#E85D26] transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile search */}
      {searchOpen && (
        <form onSubmit={handleSearch} className="lg:hidden border-t border-[rgba(0,0,0,0.06)] px-4 py-3 bg-[#F8F7F4]">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un turbo..."
              className="w-full h-10 pl-4 pr-10 rounded-lg border border-[rgba(0,0,0,0.12)] bg-white text-sm text-[#0A0A0A] placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#E85D26]/40"
              autoFocus
            />
            <button type="submit">
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-[#A0A0A0]" />
            </button>
          </div>
        </form>
      )}

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-[rgba(0,0,0,0.06)] bg-white px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#3A3A3A] hover:bg-[#F8F7F4] hover:text-[#E85D26]"
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2 border-[rgba(0,0,0,0.06)]" />
          {user ? (
            <>
              <div className="px-3 py-2 text-sm text-[#A0A0A0]">Connecte : {user.fullName}</div>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" /> Deconnexion
              </button>
            </>
          ) : (
            <Link href="/connexion" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#3A3A3A] hover:bg-[#F8F7F4]">
              <User className="h-4 w-4" /> Connexion / Inscription
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
