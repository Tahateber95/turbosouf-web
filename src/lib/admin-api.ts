"use client";

import { CLIENT_API_URL } from "@/lib/api";
import type {
  CreateProductRequest,
  UpdateProductRequest,
  CreateMakeRequest,
  UpdateMakeRequest,
  CreateModelRequest,
  CreateEngineRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateBrandRequest,
  UpdateBrandRequest,
  ProductDetail,
  VehicleMake,
  VehicleModel,
  VehicleEngine,
  Category,
  Brand,
  CustomerListItem,
  OrderListItem,
  OrderDetail,
  InvoiceListResponse,
  InvoiceDetail,
  BlogPostListItem,
  BlogPostDetail,
} from "@/lib/api";

const API = CLIENT_API_URL;

const TOKEN_KEY = "turbosouf_token";
const REFRESH_KEY = "turbosouf_refresh";
const USER_KEY = "turbosouf_user";

function getToken(): string {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.location.href = "/connexion?redirect=/dashboard";
    throw new Error("Non authentifié");
  }
  return token;
}

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const { accessToken, refreshToken: newRefresh, profile } = json.data;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, newRefresh);
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    return accessToken;
  } catch {
    return null;
  }
}

function redirectToLogin() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = "/connexion?redirect=/dashboard";
}

async function adminFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API}/api/v1${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });

  // Token expired — try to refresh once then retry
  if (res.status === 401) {
    const newToken = await tryRefreshToken();
    if (!newToken) {
      redirectToLogin();
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }
    const retry = await fetch(`${API}/api/v1${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken}`,
        ...options.headers,
      },
      ...options,
    });
    const retryJson = await retry.json().catch(() => ({}));
    if (!retry.ok) {
      if (retry.status === 401) redirectToLogin();
      throw new Error(retryJson.error?.message || `Erreur ${retry.status}`);
    }
    return retryJson.data as T;
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error?.message || `Erreur ${res.status}`);
  }

  return json.data as T;
}

// Categories
export const adminCreateCategory = (data: CreateCategoryRequest) =>
  adminFetch<Category>("/categories", { method: "POST", body: JSON.stringify(data) });

export const adminUpdateCategory = (id: string, data: UpdateCategoryRequest) =>
  adminFetch<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const adminDeleteCategory = (id: string) =>
  adminFetch<void>(`/categories/${id}`, { method: "DELETE" });

// Brands
export const adminCreateBrand = (data: CreateBrandRequest) =>
  adminFetch<Brand>("/brands", { method: "POST", body: JSON.stringify(data) });

export const adminUpdateBrand = (id: string, data: UpdateBrandRequest) =>
  adminFetch<Brand>(`/brands/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const adminDeleteBrand = (id: string) =>
  adminFetch<void>(`/brands/${id}`, { method: "DELETE" });

// Image upload
export async function adminUploadProductImage(file: File): Promise<string> {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API}/api/v1/upload/product-image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error?.message || `Erreur ${res.status}`);
  return json.data.url as string;
}

// Products
export const adminCreateProduct = (data: CreateProductRequest) =>
  adminFetch<ProductDetail>("/products", { method: "POST", body: JSON.stringify(data) });

export const adminUpdateProduct = (id: string, data: UpdateProductRequest) =>
  adminFetch<ProductDetail>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const adminDeleteProduct = (id: string) =>
  adminFetch<void>(`/products/${id}`, { method: "DELETE" });

// Vehicle Makes
export const adminCreateMake = (data: CreateMakeRequest) =>
  adminFetch<VehicleMake>("/vehicles/makes", { method: "POST", body: JSON.stringify(data) });

export const adminUpdateMake = (id: string, data: UpdateMakeRequest) =>
  adminFetch<VehicleMake>(`/vehicles/makes/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const adminDeleteMake = (id: string) =>
  adminFetch<void>(`/vehicles/makes/${id}`, { method: "DELETE" });

// Vehicle Models — backend expects POST /vehicles/models with makeId in body
export const adminCreateModel = (makeId: string, data: CreateModelRequest) =>
  adminFetch<VehicleModel>(`/vehicles/models`, { method: "POST", body: JSON.stringify({ makeId, ...data }) });

export const adminUpdateModel = (id: string, data: CreateModelRequest) =>
  adminFetch<VehicleModel>(`/vehicles/models/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const adminDeleteModel = (id: string) =>
  adminFetch<void>(`/vehicles/models/${id}`, { method: "DELETE" });

// Vehicle Engines — backend expects POST /vehicles/engines with modelId in body
export const adminCreateEngine = (modelId: string, data: CreateEngineRequest) =>
  adminFetch<VehicleEngine>(`/vehicles/engines`, { method: "POST", body: JSON.stringify({ modelId, ...data }) });

export const adminUpdateEngine = (id: string, data: CreateEngineRequest) =>
  adminFetch<VehicleEngine>(`/vehicles/engines/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const adminDeleteEngine = (id: string) =>
  adminFetch<void>(`/vehicles/engines/${id}`, { method: "DELETE" });

// Customers
export const adminGetCustomers = (search = "", customerType = "", page = 1, pageSize = 50) => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (search) params.set("search", search);
  if (customerType) params.set("customerType", customerType);
  return adminFetch<{ items: CustomerListItem[]; totalCount: number }>(`/customers?${params}`);
};

export const adminGetCustomer = (id: string) =>
  adminFetch<CustomerListItem & { siret?: string; sageCustomerId?: string }>(`/customers/${id}`);

// Orders
export const adminGetOrders = (page = 1, pageSize = 25, search = "", status = "") => {
  const params = new URLSearchParams({ Page: String(page), PageSize: String(pageSize) });
  if (search) params.set("Search", search);
  if (status) params.set("Status", status);
  return adminFetch<{ items: OrderListItem[]; totalCount: number; page: number; pageSize: number }>(`/orders?${params}`);
};

export const adminGetOrder = (id: string) =>
  adminFetch<OrderDetail>(`/orders/${id}`);

// Analytics
export const adminGetDashboardStats = () =>
  adminFetch<{
    todayOrders: number;
    todayRevenue: number;
    pendingOrders: number;
    lowStockCount: number;
    totalProducts: number;
    totalCustomers: number;
  }>("/analytics/dashboard");

export const adminUpdateOrderStatus = (id: string, status: string) =>
  adminFetch<void>(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });

export const adminRefundOrder = (id: string) =>
  adminFetch<void>(`/orders/${id}/refund`, { method: "POST" });

// Invoices
export const adminGetInvoices = (page = 1, pageSize = 25, search = "", type = "", status = "") => {
  const params = new URLSearchParams({ Page: String(page), PageSize: String(pageSize) });
  if (search) params.set("Search", search);
  if (type) params.set("Type", type);
  if (status) params.set("Status", status);
  return adminFetch<InvoiceListResponse>(`/invoices?${params}`);
};

export const adminGetInvoice = (id: string) =>
  adminFetch<InvoiceDetail>(`/invoices/${id}`);

export const adminGenerateInvoiceFromOrder = (orderId: string) =>
  adminFetch<InvoiceDetail>(`/invoices/generate-from-order/${orderId}`, { method: "POST" });

export const adminUpdateInvoiceStatus = (id: string, status: string) =>
  adminFetch<void>(`/invoices/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });

export const adminDeleteInvoice = (id: string) =>
  adminFetch<void>(`/invoices/${id}`, { method: "DELETE" });

// Blog
export const adminGetBlogPosts = (page = 1, pageSize = 50) =>
  adminFetch<{ items: BlogPostListItem[]; total: number; page: number; pageSize: number }>(`/blog?adminAll=true&page=${page}&pageSize=${pageSize}`);

export const adminGetBlogPost = (id: string) =>
  adminFetch<BlogPostDetail>(`/blog/${id}`);

export interface CreateBlogPostRequest {
  title: string;
  excerpt: string;
  content: string;
  featuredImageUrl?: string | null;
  author?: string | null;
  status: string;
  tags?: string | null;
}

export type UpdateBlogPostRequest = CreateBlogPostRequest;

export const adminCreateBlogPost = (data: CreateBlogPostRequest) =>
  adminFetch<BlogPostListItem>("/blog", { method: "POST", body: JSON.stringify(data) });

export const adminUpdateBlogPost = (id: string, data: UpdateBlogPostRequest) =>
  adminFetch<BlogPostListItem>(`/blog/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const adminDeleteBlogPost = (id: string) =>
  adminFetch<void>(`/blog/${id}`, { method: "DELETE" });

export async function downloadInvoicePdf(id: string, invoiceNumber: string): Promise<void> {
  const doFetch = (token: string) =>
    fetch(`${API}/api/v1/invoices/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    });

  let res = await doFetch(getToken());

  if (res.status === 401) {
    const newToken = await tryRefreshToken();
    if (!newToken) {
      redirectToLogin();
      throw new Error("Session expirée.");
    }
    res = await doFetch(newToken);
  }

  if (!res.ok) throw new Error(`Erreur ${res.status}`);

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${invoiceNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
