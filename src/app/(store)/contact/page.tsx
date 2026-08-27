import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import Link from "next/link";
import ContactForm from "@/components/store/contact-form";

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

const BACKEND = process.env.INTERNAL_API_URL ?? "http://turbosouf-api:8080";

async function getConfig(): Promise<SiteConfig> {
  try {
    const res = await fetch(`${BACKEND}/api/v1/site-content/site-config`, { cache: "no-store" });
    if (!res.ok) return { phone: "", email: "", whatsapp: "", address: "", city: "", hours: "", mapUrl: "" };
    const json = await res.json();
    return JSON.parse(json.data.value) as SiteConfig;
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
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
