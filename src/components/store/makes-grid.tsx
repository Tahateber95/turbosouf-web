"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MakeLogo } from "@/components/store/make-logo";

interface Make {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

const INITIAL_COUNT = 12;

export function MakesGrid({ makes }: { makes: Make[] }) {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? makes : makes.slice(0, INITIAL_COUNT);
  const hasMore = makes.length > INITIAL_COUNT;

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {visible.map((make) => (
          <Link
            key={make.id}
            href={`/produits?make=${make.slug}`}
            className="group flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-[rgba(0,0,0,0.07)] hover:border-[rgba(232,93,38,0.35)] hover:shadow-lg hover:shadow-[rgba(232,93,38,0.08)] transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#F8F7F4] group-hover:bg-[rgba(232,93,38,0.06)] flex items-center justify-center mb-2 transition-colors p-2">
              <MakeLogo name={make.name} logoUrl={make.logoUrl} className="w-full h-full" />
            </div>
            <span className="text-xs font-semibold text-[#3A3A3A] group-hover:text-[#E85D26] transition-colors">
              {make.name}
            </span>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[rgba(232,93,38,0.4)] text-[#E85D26] text-sm font-semibold hover:bg-[rgba(232,93,38,0.06)] transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Voir moins
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Voir plus ({makes.length - INITIAL_COUNT} marques)
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}
