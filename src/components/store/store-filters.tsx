"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Category, Brand } from "@/lib/api";

interface Props {
  categories: Category[];
  brands: Brand[];
  activeCategory?: string;
  activeBrand?: string;
  activeCondition?: string;
  activeInStock: boolean;
  activeSort?: string;
}

export function StoreFilters({ categories, brands, activeCategory, activeBrand, activeCondition, activeInStock, activeSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page when filters change
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const clearAllFilters = useCallback(() => {
    // Keep only search/make/engineId/application (from vehicle finder), clear user filters
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("brand");
    params.delete("condition");
    params.delete("inStock");
    params.delete("sort");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const hasActiveFilters = activeCategory || activeBrand || activeCondition || activeInStock;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
          </h3>
          {hasActiveFilters && (
            <button onClick={clearAllFilters} className="text-xs text-[var(--ts-primary-500)] hover:underline flex items-center gap-1">
              <X className="h-3 w-3" />
              Effacer
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Trier par</p>
          <select
            value={activeSort || ""}
            onChange={(e) => updateFilter("sort", e.target.value || null)}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
          >
            <option value="">Plus récents</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="name">Nom A-Z</option>
            <option value="popular">Populaires</option>
          </select>
        </div>

        {/* Category filter */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Catégorie</p>
          <div className="space-y-1.5">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[var(--ts-primary-500)]">
                <input
                  type="radio"
                  name="category"
                  checked={activeCategory === cat.slug}
                  onChange={() => updateFilter("category", activeCategory === cat.slug ? null : cat.slug)}
                  className="text-[var(--ts-primary-500)] focus:ring-[var(--ts-primary-500)]"
                />
                {cat.name}
                <span className="text-xs text-gray-400 ml-auto">{cat.productCount}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brand filter */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Marque</p>
          <div className="space-y-1.5">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[var(--ts-primary-500)]">
                <input
                  type="radio"
                  name="brand"
                  checked={activeBrand === brand.id}
                  onChange={() => updateFilter("brand", activeBrand === brand.id ? null : brand.id)}
                  className="text-[var(--ts-primary-500)] focus:ring-[var(--ts-primary-500)]"
                />
                {brand.name}
                <span className="text-xs text-gray-400 ml-auto">{brand.productCount}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Condition filter */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">État</p>
          <div className="space-y-1.5">
            {[
              { l: "Reconditionné", v: "Refurbished" },
              { l: "Neuf", v: "New" },
              { l: "Échange standard", v: "ExchangeStandard" },
            ].map((cond) => (
              <label key={cond.v} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[var(--ts-primary-500)]">
                <input
                  type="radio"
                  name="condition"
                  checked={activeCondition === cond.v}
                  onChange={() => updateFilter("condition", activeCondition === cond.v ? null : cond.v)}
                  className="text-[var(--ts-primary-500)] focus:ring-[var(--ts-primary-500)]"
                />
                {cond.l}
              </label>
            ))}
          </div>
        </div>

        {/* In stock */}
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={activeInStock}
            onChange={() => updateFilter("inStock", activeInStock ? null : "true")}
            className="rounded border-gray-300 text-[var(--ts-primary-500)] focus:ring-[var(--ts-primary-500)]"
          />
          En stock uniquement
        </label>
      </div>
    </aside>
  );
}
