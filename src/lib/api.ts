export const SERVER_API_URL = process.env.INTERNAL_API_URL || "http://turbosouf-api:8080";
export const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://89.117.54.131:5280";

const API_URL = typeof window === "undefined" ? SERVER_API_URL : CLIENT_API_URL;

type FetchOptions = RequestInit & {
  token?: string;
};

export async function api<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_URL}/api/v1${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...rest,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || "An error occurred");
  }

  return json.data;
}

// Types matching the API DTOs
export interface ProductListItem {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  priceHT: number;
  priceTTC: number;
  salePriceHT: number | null;
  depositAmount: number | null;
  categoryName: string | null;
  brandName: string | null;
  condition: string;
  stockQuantity: number;
  isFeatured: boolean;
  primaryImageUrl: string | null;
}

export interface ProductDetail extends ProductListItem {
  description: string;
  tvaRate: number;
  b2bPriceHT: number | null;
  categoryId: string;
  brandId: string | null;
  oemReference: string | null;
  isActive: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  images: ProductImage[];
  attributes: ProductAttribute[];
  compatibleVehicles: VehicleCompatibility[];
}

export interface ProductImage {
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductAttribute {
  key: string;
  value: string;
  sortOrder: number;
}

export interface VehicleCompatibility {
  vehicleEngineId: string;
  makeName: string;
  modelName: string;
  engineName: string;
  powerCV: number | null;
  fuelType: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  children: Category[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  isActive: boolean;
  productCount: number;
}

export interface VehicleMake {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  modelCount: number;
}

export interface VehicleModel {
  id: string;
  makeId: string;
  name: string;
  slug: string;
  makeName: string;
  engineCount: number;
}

export interface VehicleEngine {
  id: string;
  modelId: string;
  name: string;
  engineCode: string | null;
  fuelType: string;
  powerCV: number | null;
  displacementCC: number | null;
  yearFrom: number | null;
  yearTo: number | null;
  modelName: string;
  makeName: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

// API functions
export const getCategories = () => api<Category[]>("/categories");
export const getBrands = () => api<Brand[]>("/brands");
export const getProducts = (params?: string) => api<PagedResult<ProductListItem>>(`/products${params ? `?${params}` : ""}`);
export const getProductBySlug = (slug: string) => api<ProductDetail>(`/products/${slug}`);
export const getVehicleMakes = () => api<VehicleMake[]>("/vehicles/makes");
export const getVehicleModels = (makeId: string) => api<VehicleModel[]>(`/vehicles/makes/${makeId}/models`);
export const getVehicleEngines = (modelId: string) => api<VehicleEngine[]>(`/vehicles/models/${modelId}/engines`);
