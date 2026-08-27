"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ChevronLeft, ChevronRight, Search, UserCog, Loader2,
  Plus, X, Eye, EyeOff, Trash2,
} from "lucide-react";
import {
  adminGetUsers, adminCreateUser, adminToggleUserActive, adminDeleteUser,
  type AdminUserListItem, type AdminCreateUserRequest,
} from "@/lib/admin-api";

const PAGE_SIZE = 25;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR");
}

const ROLE_LABELS: Record<string, string> = {
  Admin: "Admin",
  SuperAdmin: "Super Admin",
  Technician: "Technicien",
  CustomerB2C: "Client B2C",
  CustomerB2B: "Client B2B",
};

const ROLE_COLORS: Record<string, string> = {
  Admin: "bg-red-100 text-red-700",
  SuperAdmin: "bg-purple-100 text-purple-700",
  Technician: "bg-blue-100 text-blue-700",
  CustomerB2C: "bg-gray-100 text-gray-600",
  CustomerB2B: "bg-indigo-100 text-indigo-700",
};

/* ── Create User Modal ─────────────────────────────────────────────────────── */
function CreateUserModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<AdminCreateUserRequest>({
    fullName: "",
    email: "",
    role: "CustomerB2C",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const update = (field: keyof AdminCreateUserRequest, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await adminCreateUser({
        ...form,
        password: form.password?.trim() || null,
      });
      setSuccess(`Compte créé pour ${result.email}. Les identifiants ont été envoyés par email.`);
      setTimeout(() => { onCreated(); onClose(); }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Nouvel utilisateur</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nom complet</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              required
              placeholder="Jean Dupont"
              className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
              placeholder="jean@exemple.com"
              className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rôle</label>
            <select
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
            >
              <option value="Admin">Admin</option>
              <option value="Technician">Technicien</option>
              <option value="CustomerB2C">Client B2C</option>
              <option value="CustomerB2B">Client B2B</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Mot de passe <span className="text-gray-400 font-normal">(laisser vide pour générer automatiquement)</span>
            </label>
            <input
              type="text"
              value={form.password ?? ""}
              onChange={(e) => update("password", e.target.value)}
              placeholder="Généré automatiquement"
              className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}
          {success && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{success}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="h-9 px-4 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-9 px-5 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Créer et envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────────────────────── */
export default function UsersPage() {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback((p: number, s: string, r: string) => {
    setLoading(true);
    setError(null);
    adminGetUsers(s, r, p, PAGE_SIZE)
      .then((data) => {
        setUsers(data.items);
        setTotalCount(data.totalCount);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1, search, roleFilter); }, 300);
    return () => clearTimeout(t);
  }, [search, roleFilter, load]);

  useEffect(() => { load(page, search, roleFilter); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleToggleActive = async (user: AdminUserListItem) => {
    setActionLoading(user.id);
    try {
      await adminToggleUserActive(user.id, !user.isActive);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (user: AdminUserListItem) => {
    if (!window.confirm(`Supprimer le compte de ${user.fullName} ? Cette action est irréversible.`)) return;
    setActionLoading(user.id);
    try {
      await adminDeleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setTotalCount((c) => c - 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      {showModal && (
        <CreateUserModal
          onClose={() => setShowModal(false)}
          onCreated={() => load(1, search, roleFilter)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Utilisateurs</h1>
          <p className="text-sm text-gray-500">{totalCount} utilisateur{totalCount !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 h-9 px-4 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvel utilisateur
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom ou email..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="">Tous les rôles</option>
          <option value="Admin">Admin</option>
          <option value="Technician">Technicien</option>
          <option value="CustomerB2C">Client B2C</option>
          <option value="CustomerB2B">Client B2B</option>
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement...
        </div>
      )}

      {error && <div className="py-8 text-center text-sm text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50/50">
                    <th className="px-5 py-3 font-medium">Utilisateur</th>
                    <th className="px-5 py-3 font-medium">Rôle</th>
                    <th className="px-5 py-3 font-medium">Statut</th>
                    <th className="px-5 py-3 font-medium text-center">Commandes</th>
                    <th className="px-5 py-3 font-medium">Inscrit le</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--ts-primary-500)]/10 flex items-center justify-center shrink-0">
                            <UserCog className="h-3.5 w-3.5 text-[var(--ts-primary-500)]" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{u.fullName}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${ROLE_COLORS[u.role] ?? "bg-gray-100 text-gray-600"}`}>
                          {ROLE_LABELS[u.role] ?? u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                          {u.isActive ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center text-gray-600">{u.orderCount}</td>
                      <td className="px-5 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(u)}
                            disabled={actionLoading === u.id}
                            title={u.isActive ? "Désactiver le compte" : "Activer le compte"}
                            className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                          >
                            {actionLoading === u.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : u.isActive ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                            {u.isActive ? "Désactiver" : "Activer"}
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            disabled={actionLoading === u.id || u.orderCount > 0}
                            title={u.orderCount > 0 ? "Impossible : l'utilisateur a des commandes" : "Supprimer le compte"}
                            className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md border border-red-100 text-xs text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-gray-500">Aucun utilisateur trouvé.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className={`h-9 w-9 flex items-center justify-center rounded-lg border text-sm transition-colors ${
                  page <= 1 ? "border-gray-100 text-gray-300 cursor-not-allowed" : "border-gray-200 text-gray-600 hover:border-[var(--ts-primary-500)] hover:text-[var(--ts-primary-500)]"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`e-${i}`} className="h-9 w-9 flex items-center justify-center text-sm text-gray-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`h-9 w-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-[var(--ts-primary-500)] border-[var(--ts-primary-500)] text-white"
                          : "border-gray-200 text-gray-600 hover:border-[var(--ts-primary-500)] hover:text-[var(--ts-primary-500)]"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className={`h-9 w-9 flex items-center justify-center rounded-lg border text-sm transition-colors ${
                  page >= totalPages ? "border-gray-100 text-gray-300 cursor-not-allowed" : "border-gray-200 text-gray-600 hover:border-[var(--ts-primary-500)] hover:text-[var(--ts-primary-500)]"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <p className="text-center text-xs text-gray-400 mt-3">
              Page {page} sur {totalPages} · {totalCount} utilisateurs
            </p>
          )}
        </>
      )}
    </div>
  );
}
