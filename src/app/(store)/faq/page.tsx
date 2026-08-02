import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface FaqItem { q: string; a: string }
interface FaqCategory { category: string; items: FaqItem[] }

const BACKEND = process.env.INTERNAL_API_URL ?? "http://turbosouf-api:8080";

async function getFaqs(): Promise<FaqCategory[]> {
  try {
    const res = await fetch(`${BACKEND}/api/v1/site-content/faq`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return JSON.parse(json.data.value) as FaqCategory[];
  } catch { return []; }
}

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-600">Accueil</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">FAQ</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--ts-primary-900)] tracking-tight">
            Questions frequentes
          </h1>
          <p className="text-sm text-gray-500 mt-1">Trouvez rapidement les reponses a vos questions</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-sm font-bold text-[var(--ts-primary-500)] uppercase tracking-wider mb-3">
              {section.category}
            </h2>
            <div className="space-y-2">
              {section.items.map((faq) => (
                <details key={faq.q} className="group bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                    {faq.q}
                    <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
                  </summary>
                  <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}

        {faqs.length === 0 && (
          <p className="text-center text-gray-400 py-12">Aucune FAQ pour le moment.</p>
        )}

        <div className="text-center pt-6">
          <p className="text-sm text-gray-500 mb-3">Vous n&apos;avez pas trouve la reponse ?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--ts-primary-500)] hover:underline"
          >
            Contactez-nous <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
