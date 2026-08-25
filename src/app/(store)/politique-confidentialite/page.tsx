import Link from "next/link";
import type { Metadata } from "next";
import { SERVER_API_URL } from "@/lib/api";

export const metadata: Metadata = { title: "Politique de Confidentialité" };

interface LegalSection {
  title: string;
  content: string;
}

async function getSections(): Promise<LegalSection[]> {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/v1/site-content/confidentialite`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    const parsed = JSON.parse(json.data.value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function PolitiqueConfidentialitePage() {
  const sections = await getSections();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-600">Accueil</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Politique de confidentialité</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--ts-primary-900)] tracking-tight">
            Politique de Confidentialité
          </h1>
          <p className="text-sm text-gray-500 mt-1">Dernière mise à jour : 1er juillet 2026</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        {sections.map((section, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">{section.title}</h2>
            <div
              className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        ))}
        {sections.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
            Contenu non disponible.
          </div>
        )}
      </div>
    </div>
  );
}
