"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useCartContext } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { createCheckoutSession } from "@/lib/api";
import { StripeProvider } from "@/components/store/stripe-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ShoppingCart, ChevronRight, Lock, Truck, CreditCard,
  ArrowLeft, Check, Loader2, AlertCircle,
} from "lucide-react";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

type Step = "info" | "shipping" | "payment" | "review";

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: "info", label: "Coordonnées", icon: ShoppingCart },
  { key: "shipping", label: "Livraison", icon: Truck },
  { key: "payment", label: "Paiement", icon: CreditCard },
  { key: "review", label: "Confirmation", icon: Check },
];

/* ------------------------------------------------------------------ */
/*  Inner form — rendered inside <Elements> once clientSecret exists   */
/* ------------------------------------------------------------------ */
function PaymentStepForm({
  onBack,
  onReady,
}: {
  onBack: () => void;
  onReady: () => void;
}) {
  const [ready, setReady] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Paiement sécurisé</h2>
      <div className="mb-6">
        <PaymentElement
          onReady={() => setReady(true)}
          options={{ layout: "tabs" }}
        />
      </div>
      {!ready && (
        <div className="flex items-center justify-center py-6 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Chargement...
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="h-10 px-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Retour
        </button>
        <button
          onClick={onReady}
          disabled={!ready}
          className="h-10 px-6 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          Vérifier la commande <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Review step with Stripe confirm                                    */
/* ------------------------------------------------------------------ */
function ReviewStep({
  items,
  form,
  grandTotal,
  shipping,
  shippingTTC,
  subtotalTTC,
  totalDeposit,
  onBack,
}: {
  items: { productId: string; name: string; quantity: number; priceTTC: number }[];
  form: CheckoutForm;
  grandTotal: number;
  shipping: number;
  shippingTTC: number;
  subtotalTTC: number;
  totalDeposit: number;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useCartContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmPayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/commande/confirmation`,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message || "Le paiement a échoué. Veuillez réessayer.");
      setLoading(false);
      return;
    }

    // Payment succeeded without redirect
    clearCart();
    router.push("/commande/confirmation");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif de commande</h2>

      {/* Order items */}
      <div className="space-y-2 mb-5">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-400">Qté: {item.quantity} × {formatPrice(item.priceTTC)}</p>
            </div>
            <p className="text-sm font-semibold">{formatPrice(item.priceTTC * item.quantity)}</p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm mb-5">
        <div className="flex justify-between">
          <span className="text-gray-500">Sous-total TTC</span>
          <span>{formatPrice(subtotalTTC)}</span>
        </div>
        {totalDeposit > 0 && (
          <div className="flex justify-between">
            <span className="text-amber-600">Consigne</span>
            <span className="text-amber-600">{formatPrice(totalDeposit)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">Livraison</span>
          <span>{shipping === 0 ? <span className="text-emerald-600">Gratuite</span> : formatPrice(shippingTTC)}</span>
        </div>
        <div className="flex justify-between text-base font-bold border-t border-gray-100 pt-2 mt-2">
          <span>Total</span>
          <span className="text-[var(--ts-primary-900)]">{formatPrice(grandTotal)}</span>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="p-3 rounded-lg bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Livraison</p>
          <p className="text-sm text-gray-900">{form.shippingFullName}</p>
          <p className="text-xs text-gray-500">{form.shippingStreet}</p>
          <p className="text-xs text-gray-500">{form.shippingPostalCode} {form.shippingCity}</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Contact</p>
          <p className="text-sm text-gray-900">{form.fullName}</p>
          <p className="text-xs text-gray-500">{form.email}</p>
          {form.phone && <p className="text-xs text-gray-500">{form.phone}</p>}
        </div>
      </div>

      {/* GDPR consent */}
      <label className="flex items-start gap-2 mb-5 text-xs text-gray-600">
        <input type="checkbox" required className="mt-0.5 rounded border-gray-300 text-[var(--ts-primary-500)]" />
        <span>
          J&apos;accepte les{" "}
          <Link href="/cgv" className="text-[var(--ts-primary-500)] underline">conditions générales de vente</Link>
          {" "}et la{" "}
          <Link href="/politique-confidentialite" className="text-[var(--ts-primary-500)] underline">politique de confidentialité</Link>.
        </span>
      </label>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={onBack} className="h-10 px-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Modifier
        </button>
        <button
          onClick={handleConfirmPayment}
          disabled={loading || !stripe}
          className="h-11 px-8 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          {loading ? "Traitement..." : `Payer ${formatPrice(grandTotal)}`}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Form type                                                          */
/* ------------------------------------------------------------------ */
interface CheckoutForm {
  email: string;
  fullName: string;
  phone: string;
  shippingFullName: string;
  shippingStreet: string;
  shippingStreet2: string;
  shippingPostalCode: string;
  shippingCity: string;
  shippingPhone: string;
  shippingType: string;
  sameAsBilling: boolean;
  billingFullName: string;
  billingStreet: string;
  billingPostalCode: string;
  billingCity: string;
  billingCompanyName: string;
  billingSiret: string;
  customerNote: string;
}

/* ------------------------------------------------------------------ */
/*  Main checkout page                                                 */
/* ------------------------------------------------------------------ */
export default function CheckoutPage() {
  const { items, itemCount, subtotalHT, subtotalTTC, totalDeposit, clearCart } = useCartContext();
  const { user, token } = useAuth();
  const [step, setStep] = useState<Step>("info");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const [form, setForm] = useState<CheckoutForm>({
    email: user?.email || "",
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    shippingFullName: user?.fullName || "",
    shippingStreet: "",
    shippingStreet2: "",
    shippingPostalCode: "",
    shippingCity: "",
    shippingPhone: user?.phone || "",
    shippingType: "Standard",
    sameAsBilling: true,
    billingFullName: "",
    billingStreet: "",
    billingPostalCode: "",
    billingCity: "",
    billingCompanyName: user?.companyName || "",
    billingSiret: user?.siret || "",
    customerNote: "",
  });

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const shipping = subtotalTTC >= 150 ? 0 : form.shippingType === "Express" ? 12.9 : form.shippingType === "RelayPoint" ? 4.9 : 6.9;
  const shippingTTC = shipping * 1.2;
  const grandTotal = subtotalTTC + totalDeposit + shippingTTC;

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  const goBack = () => {
    const prev = STEPS[currentStepIndex - 1];
    if (prev) setStep(prev.key);
  };

  // After shipping step, create the checkout session on the API to get the Stripe clientSecret
  const handleProceedToPayment = async () => {
    if (!token) {
      setError("Veuillez vous connecter pour continuer.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createCheckoutSession(
        {
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shippingAddress: {
            fullName: form.shippingFullName,
            street: form.shippingStreet,
            street2: form.shippingStreet2 || undefined,
            postalCode: form.shippingPostalCode,
            city: form.shippingCity,
            phone: form.shippingPhone || undefined,
          },
          billingAddress: form.sameAsBilling
            ? undefined
            : {
                fullName: form.billingFullName,
                street: form.billingStreet,
                postalCode: form.billingPostalCode,
                city: form.billingCity,
                companyName: form.billingCompanyName || undefined,
                siret: form.billingSiret || undefined,
              },
          shippingMethod: form.shippingType,
          customerNote: form.customerNote || undefined,
        },
        token
      );

      setClientSecret(result.clientSecret);
      setOrderNumber(result.orderNumber);
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création de la commande.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if cart empty
  if (items.length === 0 && !clientSecret) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingCart className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h1 className="text-lg font-bold text-gray-900 mb-2">Panier vide</h1>
          <p className="text-sm text-gray-500 mb-4">Ajoutez des produits avant de commander.</p>
          <Link href="/produits" className="inline-flex items-center gap-2 h-10 px-5 bg-[var(--ts-primary-500)] text-white text-sm font-semibold rounded-lg">
            <ArrowLeft className="h-4 w-4" /> Voir les produits
          </Link>
        </div>
      </div>
    );
  }

  // Steps that live inside the Stripe Elements provider
  const stripeSteps = (step === "payment" || step === "review") && clientSecret;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/panier" className="hover:text-gray-600">Panier</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600 font-medium">Commande</span>
        </nav>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  s.key === step
                    ? "bg-[var(--ts-primary-500)] text-white"
                    : i < currentStepIndex
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i < currentStepIndex ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <s.icon className="h-3 w-3" />
                )}
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-px mx-1 ${i < currentStepIndex ? "bg-emerald-300" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form steps */}
          <div className="lg:col-span-2">
            {/* Step 1: Info */}
            {step === "info" && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Vos coordonnées</h2>
                {!user && (
                  <p className="text-sm text-gray-500 mb-4">
                    Déjà client ?{" "}
                    <Link href="/connexion" className="text-[var(--ts-primary-500)] font-medium hover:underline">
                      Connectez-vous
                    </Link>
                  </p>
                )}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Nom complet</Label>
                      <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Jean Dupont" className="mt-1" required />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Email</Label>
                      <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="votre@email.com" className="mt-1" required />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Téléphone</Label>
                    <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+33 6 12 34 56 78" className="mt-1" />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button onClick={() => setStep("shipping")} className="h-10 px-6 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1">
                    Continuer <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === "shipping" && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Adresse de livraison</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Nom complet</Label>
                    <Input value={form.shippingFullName} onChange={(e) => update("shippingFullName", e.target.value)} className="mt-1" required />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Adresse</Label>
                    <Input value={form.shippingStreet} onChange={(e) => update("shippingStreet", e.target.value)} placeholder="123 Rue de la Paix" className="mt-1" required />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Complément (optionnel)</Label>
                    <Input value={form.shippingStreet2} onChange={(e) => update("shippingStreet2", e.target.value)} placeholder="Bât A, Apt 12" className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Code postal</Label>
                      <Input value={form.shippingPostalCode} onChange={(e) => update("shippingPostalCode", e.target.value)} placeholder="75001" className="mt-1" required maxLength={5} />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Ville</Label>
                      <Input value={form.shippingCity} onChange={(e) => update("shippingCity", e.target.value)} placeholder="Paris" className="mt-1" required />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Téléphone de livraison</Label>
                    <Input type="tel" value={form.shippingPhone} onChange={(e) => update("shippingPhone", e.target.value)} className="mt-1" />
                  </div>

                  {/* Shipping method */}
                  <div>
                    <Label className="text-sm font-bold text-gray-900 mb-3 block">Mode de livraison</Label>
                    <div className="space-y-2">
                      {[
                        { value: "Standard", label: "Standard (48h)", price: subtotalTTC >= 150 ? "Gratuit" : "8,28€ TTC", desc: "2-3 jours ouvrés" },
                        { value: "Express", label: "Express (24h)", price: "15,48€ TTC", desc: "1 jour ouvré" },
                        { value: "RelayPoint", label: "Point Relais", price: subtotalTTC >= 100 ? "Gratuit" : "5,88€ TTC", desc: "3-5 jours ouvrés" },
                      ].map((method) => (
                        <label
                          key={method.value}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                            form.shippingType === method.value
                              ? "border-[var(--ts-primary-500)] bg-[var(--ts-primary-500)]/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              value={method.value}
                              checked={form.shippingType === method.value}
                              onChange={(e) => update("shippingType", e.target.value)}
                              className="text-[var(--ts-primary-500)]"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{method.label}</p>
                              <p className="text-xs text-gray-500">{method.desc}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{method.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Customer note */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Note (optionnel)</Label>
                    <Textarea
                      value={form.customerNote}
                      onChange={(e) => update("customerNote", e.target.value)}
                      placeholder="Instructions spéciales pour la livraison..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={goBack} className="h-10 px-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4" /> Retour
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    disabled={loading}
                    className="h-10 px-6 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    {loading ? "Création..." : "Continuer vers le paiement"}
                    {!loading && <ChevronRight className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Steps 3 & 4: Wrapped in Stripe Elements */}
            {stripeSteps && (
              <StripeProvider clientSecret={clientSecret}>
                {/* Keep PaymentElement mounted (hidden) during review so confirmPayment can collect card data */}
                <div className={step === "payment" ? "" : "hidden"}>
                  <PaymentStepForm
                    onBack={() => setStep("shipping")}
                    onReady={() => setStep("review")}
                  />
                </div>
                {step === "review" && (
                  <ReviewStep
                    items={items}
                    form={form}
                    grandTotal={grandTotal}
                    shipping={shipping}
                    shippingTTC={shippingTTC}
                    subtotalTTC={subtotalTTC}
                    totalDeposit={totalDeposit}
                    onBack={() => setStep("payment")}
                  />
                )}
              </StripeProvider>
            )}
          </div>

          {/* Right: Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Votre commande</h3>

              <div className="space-y-2 mb-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-xs">
                    <span className="text-gray-600 truncate mr-2">{item.name} ×{item.quantity}</span>
                    <span className="font-medium shrink-0">{formatPrice(item.priceTTC * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sous-total</span>
                  <span>{formatPrice(subtotalTTC)}</span>
                </div>
                {totalDeposit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-amber-600">Consigne</span>
                    <span className="text-amber-600">{formatPrice(totalDeposit)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Livraison</span>
                  <span>{shipping === 0 ? <span className="text-emerald-600">Gratuite</span> : formatPrice(shippingTTC)}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-gray-100 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-[var(--ts-primary-900)]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-gray-400">
                <Lock className="h-3 w-3" />
                Paiement 100% sécurisé par Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
