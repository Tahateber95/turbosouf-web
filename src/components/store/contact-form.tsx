"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone || undefined,
          subject: form.subject,
          message: form.message,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json?.error?.message ?? "Une erreur est survenue. Veuillez réessayer.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Une erreur réseau est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Message envoyé !</h2>
          <p className="text-sm text-gray-500 max-w-xs">
            Votre message a été envoyé avec succès. Notre équipe vous répondra dans les meilleurs délais.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Envoyez-nous un message</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Nom complet</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Jean Dupont"
              className="mt-1"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="votre@email.com"
              className="mt-1"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Telephone (optionnel)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+33 6 12 34 56 78"
            className="mt-1"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="subject" className="text-sm font-medium text-gray-700">Sujet</Label>
          <select
            id="subject"
            name="subject"
            className="mt-1 w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            value={form.subject}
            onChange={handleChange}
            required
          >
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
          <Textarea
            id="message"
            name="message"
            placeholder="Decrivez votre demande..."
            rows={5}
            className="mt-1"
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 px-6 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white font-semibold"
        >
          {loading ? "Envoi en cours..." : "Envoyer le message"}
        </Button>
      </form>
    </div>
  );
}
