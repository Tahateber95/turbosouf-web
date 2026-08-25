import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mentions Légales" };

export default function MentionsLegalesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-600">Accueil</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Mentions légales</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--ts-primary-900)] tracking-tight">
            Mentions Légales
          </h1>
          <p className="text-sm text-gray-500 mt-1">Conformément à la loi n° 2004-575 du 21 juin 2004</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">

        <Section title="Éditeur du site">
          <Row label="Société" value="TurboSouf" />
          <Row label="Forme juridique" value="SARL" />
          <Row label="Siège social" value="1 rue Joseph et Etienne Montgolfier, 93110, Rosny-sous-Bois, FRANCE" />
          <Row label="E-mail" value="turbosouf.idf@gmail.com" />
          <Row label="Directeur de la publication" value="TurboSouf" />
        </Section>

        <Section title="Hébergement">
          <Row label="Hébergeur" value="OVH SAS" />
          <Row label="Adresse" value="2 rue Kellermann, 59100 Roubaix, France" />
          <Row label="Site web" value="www.ovh.com" />
        </Section>

        <Section title="Propriété intellectuelle">
          <p>L'ensemble du contenu du site <strong>turbo-souf.com</strong> (textes, images, logos, graphismes) est protégé par le droit d'auteur et appartient à TurboSouf ou à ses partenaires. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>
        </Section>

        <Section title="Données personnelles">
          <p>Les informations recueillies sur ce site sont traitées conformément au Règlement Général sur la Protection des Données (RGPD). Pour en savoir plus, consultez notre <Link href="/politique-confidentialite" className="text-[var(--ts-primary-500)] hover:underline">Politique de Confidentialité</Link>.</p>
          <p className="mt-2">Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en nous contactant à <strong>turbosouf.idf@gmail.com</strong>.</p>
        </Section>

        <Section title="Cookies">
          <p>Le site utilise des cookies techniques nécessaires à son fonctionnement (session, panier). Ces cookies ne nécessitent pas de consentement préalable. Aucun cookie publicitaire ou de traçage tiers n'est utilisé sans votre consentement.</p>
        </Section>

        <Section title="Limitation de responsabilité">
          <p>TurboSouf s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, TurboSouf ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.</p>
          <p className="mt-2">TurboSouf décline toute responsabilité pour tout dommage résultant d'une intrusion frauduleuse d'un tiers ou d'une interruption de service.</p>
        </Section>

        <Section title="Droit applicable">
          <p>Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-base font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="font-medium text-gray-700 shrink-0 w-40">{label} :</span>
      <span>{value}</span>
    </div>
  );
}
