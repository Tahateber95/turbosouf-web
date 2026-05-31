import Link from "next/link";
import { ChevronRight } from "lucide-react";

const FAQS = [
  { category: "Garantie", items: [
    { q: "Quelle est la garantie sur les pièces reconditionnées ?", a: "Toutes nos pièces reconditionnées sont couvertes par une garantie de 2 ans pièces et main-d'œuvre. Cette garantie couvre tout défaut de fabrication ou de reconditionnement." },
    { q: "Comment faire jouer la garantie ?", a: "Contactez notre service client par téléphone ou email avec votre numéro de commande. Nous organisons le retour de la pièce défectueuse et son remplacement ou remboursement." },
  ]},
  { category: "Consigne", items: [
    { q: "Qu'est-ce que la consigne ?", a: "La consigne est un montant que vous payez à l'achat d'une pièce en échange standard. Elle vous est remboursée intégralement lorsque vous nous renvoyez votre ancienne pièce usagée dans un délai de 30 jours." },
    { q: "Comment retourner ma pièce usagée ?", a: "Nous vous fournissons une étiquette de retour prépayée. Emballez soigneusement votre ancienne pièce dans le carton de livraison et déposez-la en point relais. Le remboursement de la consigne est effectué sous 5 jours ouvrés après réception." },
  ]},
  { category: "Livraison", items: [
    { q: "Quels sont les délais de livraison ?", a: "Livraison standard en 2-3 jours ouvrés partout en France. Livraison express en 24h disponible. Point Relais en 3-5 jours ouvrés." },
    { q: "La livraison est-elle gratuite ?", a: "La livraison est gratuite en France métropolitaine dès 150€ d'achat (standard) ou dès 100€ en Point Relais." },
  ]},
  { category: "Recherche", items: [
    { q: "Comment trouver la bonne pièce pour mon véhicule ?", a: "Utilisez notre outil de recherche par plaque d'immatriculation pour identifier automatiquement votre véhicule. Vous pouvez aussi sélectionner manuellement votre marque, modèle et motorisation." },
    { q: "La pièce est-elle compatible avec mon véhicule ?", a: "Chaque fiche produit indique la liste des véhicules compatibles. En cas de doute, contactez notre équipe technique qui vous confirmera la compatibilité." },
  ]},
  { category: "Paiement", items: [
    { q: "Quels modes de paiement acceptez-vous ?", a: "Carte bancaire (Visa, Mastercard), PayPal, et paiement en 3x ou 4x sans frais via Alma. Les professionnels peuvent également payer par virement bancaire." },
    { q: "Le paiement est-il sécurisé ?", a: "Oui, tous les paiements sont sécurisés par chiffrement SSL. Les paiements par carte sont traités par Stripe, leader mondial du paiement en ligne." },
  ]},
];

export default function FaqPage() {
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
            Questions fréquentes
          </h1>
          <p className="text-sm text-gray-500 mt-1">Trouvez rapidement les réponses à vos questions</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
        {FAQS.map((section) => (
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

        <div className="text-center pt-6">
          <p className="text-sm text-gray-500 mb-3">Vous n&apos;avez pas trouvé la réponse ?</p>
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
