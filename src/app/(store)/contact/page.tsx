import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { readFile } from "fs/promises";
import { join } from "path";

interface SiteConfig {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  city: string;
  hours: string;
  mapUrl: string;
}

// Force dynamic rendering so config changes are reflected immediately
export const dynamic = "force-dynamic";

async function getConfig(): Promise<SiteConfig> {
  try {
    const data = await readFile(join(process.cwd(), "src/data/site-config.json"), "utf-8");
    return JSON.parse(data);
  } catch {
    return { phone: "", email: "", whatsapp: "", address: "", city: "", hours: "", mapUrl: "" };
  }
}

export default async function ContactPage() {
  const config = await getConfig();

  const contactItems = [
    { icon: Phone, label: "Telephone", value: config.phone, href: config.phone ? `tel:${config.phone.replace(/\s/g, "")}` : null },
    { icon: Mail, label: "Email", value: config.email, href: config.email ? `mailto:${config.email}` : null },
    { icon: MapPin, label: "Adresse", value: [config.address, config.city].filter(Boolean).join("\n"), href: null },
    { icon: Clock, label: "Horaires", value: config.hours, href: null },
  ].filter(item => item.value);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-600">Accueil</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium">Contact</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--ts-primary-900)] tracking-tight">
            Contactez-nous
          </h1>
          <p className="text-sm text-gray-500 mt-1">Notre equipe est a votre ecoute</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            {contactItems.map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--ts-primary-500)]/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-[var(--ts-primary-500)]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-medium text-gray-900 hover:text-[var(--ts-primary-500)]">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-900 whitespace-pre-line">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {config.whatsapp && (
              <a
                href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4 hover:bg-emerald-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-800">WhatsApp</p>
                  <p className="text-xs text-emerald-600">Reponse rapide par message</p>
                </div>
              </a>
            )}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Envoyez-nous un message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nom complet</Label>
                    <Input id="name" placeholder="Jean Dupont" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input id="email" type="email" placeholder="votre@email.com" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Telephone (optionnel)</Label>
                  <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-700">Sujet</Label>
                  <select id="subject" className="mt-1 w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
                    <option value="">Selectionnez un sujet</option>
                    <option>Demande de devis</option>
                    <option>Question sur un produit</option>
                    <option>Suivi de commande</option>
                    <option>Retour / Consigne</option>
                    <option>Service atelier</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
                  <Textarea id="message" placeholder="Decrivez votre demande..." rows={5} className="mt-1" />
                </div>
                <Button className="h-11 px-6 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white font-semibold">
                  Envoyer le message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
