import { Truck, CreditCard, ShieldCheck, RotateCcw } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Truck, title: "Livraison 24-48h", desc: "Expédition rapide en France" },
  { icon: CreditCard, title: "Paiement 3x/4x", desc: "Sans frais avec Alma" },
  { icon: ShieldCheck, title: "Garantie 2 ans", desc: "Sur tous nos turbos" },
  { icon: RotateCcw, title: "Rétractation 14 jours", desc: "Sous certaines conditions" },
];

export function TrustBar() {
  return (
    <section className="border-y border-gray-100 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--ts-primary-500)]/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-[var(--ts-primary-500)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
