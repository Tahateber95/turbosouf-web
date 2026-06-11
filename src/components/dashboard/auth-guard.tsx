"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      window.location.href = "/connexion?redirect=/dashboard";
      return;
    }
    if (user.role !== "Admin" && user.role !== "admin") {
      window.location.href = "/";
      return;
    }
    setChecked(true);
  }, [user, isLoading]);

  if (isLoading || !checked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--ts-primary-500)] mx-auto mb-3" />
          <p className="text-sm text-gray-500">Vérification de l&apos;accès...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
