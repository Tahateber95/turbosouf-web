"use client";

import { CLIENT_API_URL } from "@/lib/api";
import type {
  CreateProductRequest,
  UpdateProductRequest,
  CreateMakeRequest,
  CreateModelRequest,
  CreateEngineRequest,
  ProductDetail,
  VehicleMake,
  VehicleModel,
  VehicleEngine,
  OrderDetail,
} from "@/lib/api";

const API = CLIENT_API_URL;

function getToken(): string {
  const token = localStorage.getItem("turbosouf_token");
  if (!token) throw new Error("Non authentifié");
  return token;
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

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error?.message || `Erreur ${res.status}`);
  }

  return json.data as T;
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

export const adminUpdateMake = (id: string, data: CreateMakeRequest) =>
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

// Orders
export const adminGetOrder = (id: string) =>
  adminFetch<OrderDetail>(`/orders/${id}`);

export const adminUpdateOrderStatus = (id: string, status: string) =>
  adminFetch<void>(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
