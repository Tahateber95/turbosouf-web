import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

export default function OrderConfirmationPage() {
  const orderNumber = `TS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(6, "0")}`;

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 animate-fade-up">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2 animate-fade-up">
          Commande confirmée !
        </h1>
        <p className="text-gray-500 mb-6 animate-fade-up-delay">
          Merci pour votre commande. Vous recevrez un email de confirmation sous peu.
        </p>

        {/* Order number */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 animate-fade-up-delay">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Numéro de commande</p>
          <p className="text-lg font-mono font-bold text-[var(--ts-primary-900)]">{orderNumber}</p>
        </div>

        {/* Next steps */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 text-left animate-fade-up-delay-2">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Prochaines étapes</h3>
          <div className="space-y-3">
            {[
              { step: "1", text: "Email de confirmation envoyé" },
              { step: "2", text: "Préparation de votre commande" },
              { step: "3", text: "Expédition avec numéro de suivi" },
              { step: "4", text: "Livraison sous 24-48h" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[var(--ts-primary-500)]/10 flex items-center justify-center text-[10px] font-bold text-[var(--ts-primary-500)] shrink-0">
                  {item.step}
                </span>
                <span className="text-sm text-gray-600">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/produits"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white font-semibold rounded-lg transition-colors"
          >
            Continuer mes achats
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
