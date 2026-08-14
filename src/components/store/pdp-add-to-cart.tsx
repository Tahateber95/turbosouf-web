"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, X, ChevronRight, Phone } from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import type { ProductAddOn } from "@/lib/api";
import type { CartAddOn } from "@/lib/hooks/use-cart";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

interface PdpAddToCartProps {
  productId: string;
  name: string;
  sku: string;
  primaryImageUrl: string | null;
  priceHT: number;
  priceTTC: number;
  depositAmount: number | null;
  stockQuantity: number;
  addOns?: ProductAddOn[];
  conditionLabel?: string;
  condition?: string;
}

// ── Consigne drawer ──────────────────────────────────────────────────────────

function ConsigneDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-gray-900">Comment fonctionne la consigne ?</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-sm text-gray-700 leading-relaxed">
          <p>
            Lors de l'achat d'un turbo en échange standard, nous devons récupérer votre ancien turbo
            afin qu'il puisse être reconditionné. C'est pour cette raison qu'une consigne, également
            appelée caution, peut être ajoutée à votre commande.
          </p>
          <p>
            Le principe est simple : vous payez la consigne lors de votre commande, puis nous vous la
            remboursons lorsque nous recevons votre ancien turbo conforme.
          </p>

          {/* Option 1 */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-3">
            <p className="font-bold text-gray-900">
              1. Je règle la consigne et je reçois mon turbo immédiatement
            </p>
            <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide">
              C'est la solution la plus rapide.
            </p>
            <p>
              Vous réglez le prix du turbo ainsi que le montant de la consigne. Nous pouvons alors
              vous expédier immédiatement le turbo disponible en stock.
            </p>
            <div>
              <p className="font-semibold mb-2">Les étapes :</p>
              <ol className="space-y-1.5 list-none">
                {[
                  "Vous commandez votre turbo et réglez la consigne.",
                  "Nous expédions votre turbo en échange standard.",
                  "Vous remplacez votre ancien turbo.",
                  "Vous emballez soigneusement l'ancien turbo dans le carton reçu.",
                  "Vous nous retournez votre ancien turbo à l'aide du bordereau de retour.",
                  "Après réception et contrôle de votre ancien turbo, le montant de la consigne vous est remboursé.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="shrink-0 h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <span className="shrink-0">⚠️</span>
              <p className="text-xs text-amber-800">
                <strong>Important :</strong> le turbo retourné doit correspondre au modèle fourni en
                échange standard et doit être complet et correctement emballé. En cas de pièce
                différente, incomplète ou endommagée, le remboursement de la consigne pourra être
                partiel ou refusé.
              </p>
            </div>
          </div>

          {/* Option 2 */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
            <p className="font-bold text-gray-900">
              2. Je ne souhaite pas avancer le montant de la consigne
            </p>
            <p>
              Vous pouvez également nous envoyer votre ancien turbo avant l'expédition du turbo en
              échange standard.
            </p>
            <div>
              <p className="font-semibold mb-2">Les étapes :</p>
              <ol className="space-y-1.5 list-none">
                {[
                  "Vous passez votre commande.",
                  "Nous vous transmettons un bordereau pour l'envoi de votre ancien turbo.",
                  "Vous emballez soigneusement votre turbo et nous l'expédiez.",
                  "Dès sa réception et après vérification de sa conformité, nous procédons à l'expédition de votre turbo en échange standard.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="shrink-0 h-5 w-5 rounded-full bg-gray-500 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="text-xs text-gray-500">
              Cette solution vous permet de ne pas avancer le montant de la consigne, mais le délai
              de réception de votre nouveau turbo sera naturellement plus long.
            </p>
          </div>

          {/* À retenir */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 space-y-2">
            <p className="font-bold text-emerald-800">À retenir</p>
            <p className="text-emerald-700">
              La consigne n'est pas un coût supplémentaire lorsque votre ancien turbo nous est
              retourné conforme. Elle permet simplement de garantir le retour de l'ancienne pièce
              dans le cadre de l'échange standard.
            </p>
          </div>

          <p className="text-gray-500">
            Une question concernant la consigne ou le retour de votre turbo ?{" "}
            <a href="/contact" className="text-[var(--ts-primary-500)] font-semibold hover:underline">
              Contactez-nous
            </a>
            , notre équipe vous accompagnera.
          </p>
        </div>
      </div>
    </>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function PdpAddToCart({
  productId,
  name,
  sku,
  primaryImageUrl,
  priceHT,
  priceTTC,
  depositAmount,
  stockQuantity,
  addOns = [],
  condition,
}: PdpAddToCartProps) {
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<Set<string>>(new Set());
  const [consigneEnabled, setConsigneEnabled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeAddOns = addOns.filter((a) => a.isActive);
  const hasDeposit = !!depositAmount && depositAmount > 0;
  const isExchangeStandard = condition === "ExchangeStandard";
  const outOfStock = stockQuantity <= 0;
  const showContactCta = outOfStock && condition !== "Refurbished";

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectedAddOns: CartAddOn[] = activeAddOns
    .filter((a) => selectedAddOnIds.has(a.id))
    .map((a) => ({
      id: a.id,
      name: a.name,
      priceHT: a.priceHT,
      tvaRate: a.tvaRate,
      priceTTC: a.priceTTC,
    }));

  return (
    <div className="space-y-3">
      {/* Add-on options */}
      {activeAddOns.length > 0 && (
        <div className="space-y-2">
          {activeAddOns.map((addOn) => {
            const checked = selectedAddOnIds.has(addOn.id);
            return (
              <label
                key={addOn.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all select-none ${
                  checked
                    ? "border-[var(--ts-primary-500)] bg-[var(--ts-primary-500)]/5"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                {/* Toggle switch */}
                <span className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 transition-colors ${
                  checked ? "bg-[var(--ts-primary-500)] border-[var(--ts-primary-500)]" : "bg-gray-200 border-gray-200"
                }`}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    checked ? "translate-x-4" : "translate-x-0"
                  }`} />
                  <input type="checkbox" checked={checked} onChange={() => toggleAddOn(addOn.id)} className="sr-only" />
                </span>
                <span className="flex-1 text-sm font-medium text-gray-900">{addOn.name}</span>
                <span className="text-sm font-semibold text-gray-800 shrink-0">
                  {formatPrice(addOn.priceTTC)}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {/* Consigne row — toggleable, styled like add-ons */}
      {hasDeposit && isExchangeStandard && (
        <div
          className={`rounded-xl border-2 bg-white overflow-hidden transition-colors ${
            consigneEnabled ? "border-blue-500" : "border-gray-200"
          }`}
        >
          {/* Main row — clickable to toggle */}
          <button
            type="button"
            onClick={() => setConsigneEnabled((v) => !v)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left"
          >
            <span className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 transition-colors ${
              consigneEnabled ? "bg-blue-500 border-blue-500" : "bg-gray-200 border-gray-200"
            }`}>
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                consigneEnabled ? "translate-x-4" : "translate-x-0"
              }`} />
            </span>
            <span className="flex-1 text-sm font-bold text-gray-900">Consigne</span>
            <span className="text-sm font-bold text-gray-900 shrink-0">
              {formatPrice(depositAmount!)}
            </span>
          </button>

          {/* Info bar — always visible */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border-t border-emerald-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <p className="flex-1 text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              Remboursé à réception de l'ancien turbo
            </p>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
            >
              Voir plus
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Out-of-stock: contact CTA instead of add-to-cart */}
      {showContactCta ? (
        <Link
          href="/contact"
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-semibold transition-colors"
        >
          <Phone className="h-4 w-4" />
          Contacter pour une solution rapide
        </Link>
      ) : (
        <AddToCartButton
          product={{
            productId,
            name,
            sku,
            imageUrl: primaryImageUrl,
            priceHT,
            priceTTC,
            depositAmount: consigneEnabled ? depositAmount : null,
            stockQuantity,
            selectedAddOns,
          }}
          showQuantity
          className="w-full"
        />
      )}

      <ConsigneDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
