"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login, register, user } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isB2B, setIsB2B] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [siret, setSiret] = useState("");

  // Redirect if already logged in
  if (user) {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      if (redirect) {
        window.location.href = redirect;
      } else if (user.role === "Admin" || user.role === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
    }
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      // Check redirect param or role-based redirect
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      if (redirect) {
        window.location.href = redirect;
      } else {
        // Read the user from localStorage since state hasn't updated yet
        try {
          const stored = localStorage.getItem("turbosouf_user");
          const u = stored ? JSON.parse(stored) : null;
          if (u?.role === "Admin" || u?.role === "admin") {
            window.location.href = "/dashboard";
          } else {
            window.location.href = "/";
          }
        } catch {
          window.location.href = "/";
        }
      }
    } else {
      setError(result.error || "Erreur de connexion");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await register({
      fullName,
      email,
      password,
      phone: phone || undefined,
      customerType: isB2B ? "B2B" : "B2C",
      companyName: isB2B ? companyName : undefined,
      siret: isB2B ? siret : undefined,
    });
    setLoading(false);
    if (result.success) {
      window.location.href = "/";
    } else {
      setError(result.error || "Erreur d'inscription");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="TurboSouf" className="w-10 h-10 rounded-full object-contain" />
            <span className="text-xl font-black text-[var(--ts-primary-900)]">TurboSouf</span>
          </Link>
          <h1 className="text-2xl font-black text-[var(--ts-primary-900)] tracking-tight">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === "login" ? "Accédez à votre espace client" : "Rejoignez TurboSouf"}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => { setMode("login"); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            Connexion
          </button>
          <button
            onClick={() => { setMode("register"); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === "register" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            Inscription
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1" required />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 flex items-center justify-center gap-2 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Nom complet</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jean Dupont" className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="regEmail" className="text-sm font-medium text-gray-700">Email</Label>
                <Input id="regEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Téléphone (optionnel)</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+33 6 12 34 56 78" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="regPassword" className="text-sm font-medium text-gray-700">Mot de passe</Label>
                <Input id="regPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 caractères" className="mt-1" required />
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={isB2B} onChange={(e) => setIsB2B(e.target.checked)} className="rounded border-gray-300 text-[var(--ts-primary-500)]" />
                  Je suis un professionnel (B2B)
                </label>
              </div>
              {isB2B && (
                <div className="space-y-3 p-3 rounded-lg border border-blue-100 bg-blue-50/50">
                  <div>
                    <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Raison sociale</Label>
                    <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Mon Garage SARL" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="siret" className="text-sm font-medium text-gray-700">SIRET</Label>
                    <Input id="siret" value={siret} onChange={(e) => setSiret(e.target.value)} placeholder="123 456 789 00012" className="mt-1" maxLength={14} />
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 flex items-center justify-center gap-2 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Création..." : "Créer mon compte"}
              </button>
              <p className="text-[10px] text-gray-400 text-center">
                En créant un compte, vous acceptez nos CGV et notre politique de confidentialité.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
