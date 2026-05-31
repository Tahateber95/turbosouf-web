"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://89.117.54.131:5280";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  customerType: string;
  companyName: string | null;
  siret: string | null;
  b2bTier: string | null;
  isB2BApproved: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: { fullName?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  customerType?: string;
  companyName?: string;
  siret?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "turbosouf_token";
const REFRESH_KEY = "turbosouf_refresh";
const USER_KEY = "turbosouf_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setState({ user, token, isLoading: false });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setState({ user: null, token: null, isLoading: false });
      }
    } else {
      setState({ user: null, token: null, isLoading: false });
    }
  }, []);

  const saveAuth = useCallback((token: string, refreshToken: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setState({ user, token, isLoading: false });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error?.message || "Erreur de connexion" };
      }
      const { accessToken, refreshToken, profile } = json.data;
      saveAuth(accessToken, refreshToken, profile);
      return { success: true };
    } catch {
      return { success: false, error: "Erreur réseau. Veuillez réessayer." };
    }
  }, [saveAuth]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const res = await fetch(`${API}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error?.message || "Erreur d'inscription" };
      }
      const { accessToken, refreshToken, profile } = json.data;
      saveAuth(accessToken, refreshToken, profile);
      return { success: true };
    } catch {
      return { success: false, error: "Erreur réseau. Veuillez réessayer." };
    }
  }, [saveAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ user: null, token: null, isLoading: false });
  }, []);

  const updateProfile = useCallback(async (data: { fullName?: string; phone?: string }) => {
    if (!state.token) return { success: false, error: "Non connecté" };
    try {
      const res = await fetch(`${API}/api/v1/auth/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error?.message || "Erreur de mise à jour" };
      }
      const user = json.data;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setState((prev) => ({ ...prev, user }));
      return { success: true };
    } catch {
      return { success: false, error: "Erreur réseau" };
    }
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
