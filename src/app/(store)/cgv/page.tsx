import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Conditions Générales de Vente" };

export default function CGVPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-600">Accueil</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">CGV</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--ts-primary-900)] tracking-tight">
            Conditions Générales de Vente
          </h1>
          <p className="text-sm text-gray-500 mt-1">En vigueur à compter du 1er juillet 2026</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">

        <Section title="Article 1 — Objet et champ d'application">
          <p>Les présentes Conditions Générales de Vente (ci-après « CGV ») s'appliquent à toutes les ventes conclues par la société TurboSouf (ci-après « le Vendeur ») avec tout acheteur professionnel ou particulier (ci-après « le Client ») souhaitant acquérir des produits proposés sur le site <strong>turbo-souf.com</strong>.</p>
          <p className="mt-2">Tout achat sur le site implique l'acceptation sans réserve des présentes CGV. Les CGV prévalent sur tout autre document du Client, notamment ses conditions générales d'achat.</p>
        </Section>

        <Section title="Article 2 — Produits">
          <p>TurboSouf propose des turbos reconditionnés et pièces automobiles. Les produits sont décrits et présentés avec la plus grande exactitude possible. Toutefois, en cas d'erreur ou d'omission dans la description, la responsabilité du Vendeur ne pourra être engagée.</p>
          <p className="mt-2">Les photographies présentées sur le site sont non contractuelles. Les produits reconditionnés sont remis à neuf selon les normes constructeur et livrés avec une garantie.</p>
        </Section>

        <Section title="Article 3 — Prix">
          <p>Les prix sont indiqués en euros, toutes taxes comprises (TTC). Le Vendeur se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.</p>
          <p className="mt-2">Pour les produits soumis à consigne (échange standard), un montant de dépôt est indiqué sur la fiche produit. Ce montant est remboursé à réception et contrôle de la pièce usagée retournée.</p>
        </Section>

        <Section title="Article 4 — Commandes">
          <p>Le Client sélectionne les produits souhaités, les ajoute au panier et finalise la commande en renseignant ses informations personnelles et de livraison. La commande est confirmée après validation du paiement.</p>
          <p className="mt-2">Le Vendeur se réserve le droit d'annuler toute commande en cas de problème d'approvisionnement, d'erreur manifeste sur le prix, ou de suspicion de fraude. Le Client en sera informé dans les meilleurs délais.</p>
        </Section>

        <Section title="Article 5 — Paiement">
          <p>Le paiement s'effectue en ligne par carte bancaire via la plateforme sécurisée Stripe. Les données bancaires ne sont jamais transmises au Vendeur.</p>
          <p className="mt-2">Le paiement en plusieurs fois peut être proposé selon les modalités affichées lors de la commande.</p>
        </Section>

        <Section title="Article 6 — Livraison">
          <p>Les produits sont livrés à l'adresse indiquée lors de la commande. Les délais indicatifs sont de <strong>24 à 48h ouvrés</strong> pour la France métropolitaine.</p>
          <p className="mt-2">En cas de retard de livraison, le Client peut contacter le service client. Si le délai dépasse 30 jours, le Client peut annuler sa commande et être remboursé.</p>
          <p className="mt-2">Les frais de port sont indiqués lors de la validation du panier. La livraison est offerte à partir d'un certain montant d'achat selon les conditions affichées sur le site.</p>
        </Section>

        <Section title="Article 7 — Droit de rétractation">
          <p>Conformément aux articles L.221-18 et suivants du Code de la consommation, le Client dispose d'un délai de <strong>14 jours</strong> à compter de la réception du produit pour exercer son droit de rétractation, sans avoir à justifier de motifs.</p>
          <p className="mt-2">Pour exercer ce droit, le Client doit notifier sa décision par e-mail à <strong>contact@turbo-souf.com</strong>. Le produit doit être retourné en parfait état, dans son emballage d'origine. Les frais de retour sont à la charge du Client.</p>
          <p className="mt-2"><strong>Exception :</strong> Le droit de rétractation ne s'applique pas aux produits reconditionnés montés ou utilisés.</p>
        </Section>

        <Section title="Article 8 — Garantie">
          <p>Tous les produits TurboSouf sont couverts par une <strong>garantie de 2 ans</strong> (pièces et main-d'œuvre de reconditionnement) à compter de la date de livraison.</p>
          <p className="mt-2">La garantie ne couvre pas les dommages résultant d'une mauvaise installation, d'une utilisation anormale, ou d'une négligence du Client.</p>
          <p className="mt-2">Pour toute demande de garantie, le Client doit contacter le service client avec le numéro de commande et une description du problème.</p>
        </Section>

        <Section title="Article 9 — Responsabilité">
          <p>La responsabilité du Vendeur ne pourra être engagée en cas de mauvaise installation du produit, d'utilisation non conforme, ou de dommages indirects. Le Vendeur est responsable des dommages directs causés par un défaut du produit livré.</p>
        </Section>

        <Section title="Article 10 — Données personnelles">
          <p>Les données collectées lors de la commande sont nécessaires au traitement et à la livraison. Elles sont traitées conformément à notre <Link href="/politique-confidentialite" className="text-[var(--ts-primary-500)] hover:underline">Politique de Confidentialité</Link>.</p>
        </Section>

        <Section title="Article 11 — Litiges">
          <p>En cas de litige, le Client peut recourir à la médiation de la consommation. Les présentes CGV sont soumises au droit français. Tout litige relève de la compétence des tribunaux français.</p>
        </Section>

        <Section title="Article 12 — Contact">
          <p>Pour toute question relative aux présentes CGV :</p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
            <li>E-mail : <strong>contact@turbo-souf.com</strong></li>
            <li>Adresse : 123 Rue de l'Industrie, 67000 Strasbourg, France</li>
          </ul>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-base font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}
