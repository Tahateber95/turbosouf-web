import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Politique de Confidentialité" };

export default function PolitiqueConfidentialitePage() {
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

        <Section title="1. Responsable du traitement">
          <p>Le responsable du traitement des données personnelles est <strong>TurboSouf</strong>, dont le siège social est situé au 1 rue Joseph et Etienne Montgolfier, 93110, Rosny-sous-Bois, FRANCE.</p>
          <p className="mt-2">Contact : <strong>turbosouf.idf@gmail.com</strong></p>
        </Section>

        <Section title="2. Données collectées">
          <p>Nous collectons les données suivantes :</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li><strong>Données d'identification</strong> : nom, prénom, adresse e-mail, numéro de téléphone</li>
            <li><strong>Données de livraison</strong> : adresse postale</li>
            <li><strong>Données de facturation</strong> : adresse de facturation (pour les professionnels : raison sociale, SIRET)</li>
            <li><strong>Données de connexion</strong> : historique de commandes, préférences de compte</li>
            <li><strong>Données techniques</strong> : adresse IP, type de navigateur (via cookies techniques)</li>
          </ul>
          <p className="mt-2">Nous ne collectons jamais vos données bancaires — les paiements sont traités directement par Stripe.</p>
        </Section>

        <Section title="3. Finalités du traitement">
          <p>Vos données sont utilisées pour :</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Traiter et livrer vos commandes</li>
            <li>Gérer votre compte client</li>
            <li>Assurer le service après-vente et la garantie</li>
            <li>Respecter nos obligations légales (facturation, comptabilité)</li>
            <li>Améliorer nos services (données agrégées et anonymisées)</li>
          </ul>
        </Section>

        <Section title="4. Base légale">
          <p>Le traitement de vos données repose sur :</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li><strong>L'exécution du contrat</strong> : traitement des commandes, livraison, garantie</li>
            <li><strong>L'obligation légale</strong> : conservation des données de facturation (10 ans)</li>
            <li><strong>L'intérêt légitime</strong> : prévention de la fraude, amélioration du service</li>
          </ul>
        </Section>

        <Section title="5. Durée de conservation">
          <ul className="space-y-1 list-disc list-inside">
            <li>Données de compte : durée de vie du compte + 3 ans après la dernière activité</li>
            <li>Données de commandes et factures : 10 ans (obligation comptable)</li>
            <li>Données de connexion : 13 mois</li>
          </ul>
        </Section>

        <Section title="6. Partage des données">
          <p>Vos données peuvent être partagées avec :</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li><strong>Stripe</strong> : prestataire de paiement sécurisé</li>
            <li><strong>Transporteurs</strong> : pour la livraison de vos commandes</li>
            <li><strong>Prestataires informatiques</strong> : hébergement (OVH)</li>
          </ul>
          <p className="mt-2">Nous ne vendons ni ne louons vos données à des tiers.</p>
        </Section>

        <Section title="7. Vos droits">
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
            <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
            <li><strong>Droit à l'effacement</strong> : supprimer vos données (sous réserve des obligations légales)</li>
            <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition</strong> : vous opposer à certains traitements</li>
          </ul>
          <p className="mt-2">Pour exercer ces droits, contactez-nous à <strong>turbosouf.idf@gmail.com</strong>. Vous pouvez également introduire une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[var(--ts-primary-500)] hover:underline">CNIL</a>.</p>
        </Section>

        <Section title="8. Sécurité">
          <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation : connexions chiffrées (HTTPS), accès restreint aux données, authentification sécurisée.</p>
        </Section>

        <Section title="9. Cookies">
          <p>Le site utilise uniquement des cookies strictement nécessaires au fonctionnement (session, panier). Pour plus d'informations, consultez nos <Link href="/mentions-legales" className="text-[var(--ts-primary-500)] hover:underline">Mentions Légales</Link>.</p>
        </Section>

        <Section title="10. Modifications">
          <p>Nous nous réservons le droit de modifier la présente politique à tout moment. La date de mise à jour en haut de page indique la version en vigueur. Nous vous informerons de tout changement significatif.</p>
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
