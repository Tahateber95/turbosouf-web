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
  conditionLabel: string;
  conditionSortOrder: number;
  stockQuantity: number;
  isFeatured: boolean;
  primaryImageUrl: string | null;
  oemReference: string | null;
  vehicleSummary: string | null;
  availableConditions: string[];
}

export interface ProductAddOn {
  id: string;
  name: string;
  description: string | null;
  priceHT: number;
  tvaRate: number;
  priceTTC: number;
  isActive: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  condition: string;
  conditionLabel: string;
  conditionSortOrder: number;
  priceHT: number;
  tvaRate: number;
  priceTTC: number;
  salePriceHT: number | null;
  depositAmount: number | null;
  stockQuantity: number;
}

export interface ProductConditionItem {
  id: string;
  code: string;
  label: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
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
  addOns: ProductAddOn[];
  variants: ProductVariant[];
  returnInstructions: string | null;
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
  isActive: boolean;
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

// Checkout / Stripe types
export interface CheckoutRequest {
  items: { productId: string; quantity: number; selectedAddOns?: { addOnId: string; quantity: number }[] }[];
  shippingAddress: {
    fullName: string;
    street: string;
    street2?: string;
    postalCode: string;
    city: string;
    phone?: string;
  };
  billingAddress?: {
    fullName: string;
    street: string;
    postalCode: string;
    city: string;
    companyName?: string;
    siret?: string;
  };
  shippingMethod: string;
  customerNote?: string;
}

export interface CheckoutResponse {
  orderId: string;
  orderNumber: string;
  clientSecret: string;
}

// --- Mutation DTOs ---

export interface CreateProductRequest {
  name: string;
  sku: string;
  shortDescription: string;
  description: string;
  priceHT: number;
  tvaRate: number;
  salePriceHT?: number | null;
  depositAmount?: number | null;
  categoryId: string;
  brandId?: string | null;
  condition: string;
  stockQuantity: number;
  oemReference?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  b2bPriceHT?: number | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  images?: { url: string; altText?: string | null; sortOrder: number; isPrimary: boolean }[];
  attributes?: { key: string; value: string; sortOrder: number }[];
  compatibleVehicleEngineIds?: string[];
  addOns?: { name: string; description?: string | null; priceHT: number; tvaRate: number; isActive: boolean; sortOrder: number }[];
  variants?: { condition: string; priceHT: number; tvaRate: number; salePriceHT?: number | null; depositAmount?: number | null; stockQuantity: number }[];
}

export type UpdateProductRequest = Partial<CreateProductRequest>;

export interface CreateCategoryRequest {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  sortOrder?: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  isActive: boolean;
}

export interface CreateBrandRequest {
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  sortOrder?: number;
}

export interface UpdateBrandRequest extends CreateBrandRequest {
  isActive: boolean;
}

export interface CreateMakeRequest {
  name: string;
  slug?: string;
  logoUrl?: string | null;
}

export interface UpdateMakeRequest extends CreateMakeRequest {
  isActive: boolean;
  sortOrder?: number;
}

export interface CreateModelRequest {
  name: string;
  slug?: string;
}

export interface CreateEngineRequest {
  name: string;
  engineCode?: string | null;
  fuelType: string;
  powerCV?: number | null;
  displacementCC?: number | null;
  yearFrom?: number | null;
  yearTo?: number | null;
}

export interface CustomerListItem {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  customerType: string;
  companyName: string | null;
  b2bTier: string | null;
  isB2BApproved: boolean;
  orderCount: number;
  createdAt: string;
}

export interface OrderListItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  paymentStatus: string;
  totalTTC: number;
  itemCount: number;
  createdAt: string;
  hasExchangeStandardItems?: boolean;
  hasRefurbishedItems?: boolean;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  status: string;
  paymentStatus: string;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  shippingCost: number;
  depositTotal: number;
  shippingMethod: string;
  customerNote: string | null;
  shippingAddress: {
    fullName: string;
    street: string;
    street2?: string;
    postalCode: string;
    city: string;
    phone?: string;
  };
  billingAddress?: {
    fullName: string;
    street: string;
    postalCode: string;
    city: string;
    companyName?: string;
    siret?: string;
  };
  items: {
    id: string;
    productId: string;
    productName: string;
    productSku: string;
    quantity: number;
    unitPriceHT: number;
    unitPriceTTC: number;
    totalHT: number;
    totalTTC: number;
  }[];
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string | null;
  hasExchangeStandardItems: boolean;
  hasRefurbishedItems: boolean;
  depositRefundedAt: string | null;
  depositRefundStripeId: string | null;
  returnShipment: {
    returnSkybillNumber: string | null;
    returnStatus: string;
    returnLabelGeneratedAt: string | null;
    returnReceivedAt: string | null;
    hasReturnLabel: boolean;
  } | null;
  inboundShipment: {
    skybillNumber: string | null;
    status: string;
    labelGeneratedAt: string | null;
    receivedAt: string | null;
    hasLabel: boolean;
  } | null;
}

// --- Invoice types ---

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  type: string;
  status: string;
  orderNumber: string | null;
  customerName: string | null;
  customerEmail: string | null;
  amountHT: number;
  amountTVA: number;
  amountTTC: number;
  sageInvoiceId: string | null;
  pdfUrl: string | null;
  issuedAt: string;
  dueAt: string | null;
  paidAt: string | null;
}

export interface InvoiceLineResponse {
  id: string;
  description: string;
  articleCode: string | null;
  quantity: number;
  unitPriceHT: number;
  tvaRate: number;
  lineTotalHT: number;
  lineTotalTTC: number;
}

export interface InvoiceDetail extends InvoiceListItem {
  orderId: string | null;
  billingAddress: string | null;
  createdAt: string;
  lines: InvoiceLineResponse[];
}

export interface InvoiceListResponse {
  items: InvoiceListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// --- Blog types ---

export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImageUrl: string | null;
  author: string | null;
  status: string;
  tags: string | null;
  createdAt: string;
  publishedAt: string | null;
}

export interface BlogPostDetail extends BlogPostListItem {
  content: string;
  updatedAt: string;
}

// --- API functions (read) ---

export const getCategories = () => api<Category[]>("/categories");
export const getBrands = () => api<Brand[]>("/brands");
export const getProducts = (params?: string) => api<PagedResult<ProductListItem>>(`/products${params ? `?${params}` : ""}`);
export const getProductBySlug = (slug: string) => api<ProductDetail>(`/products/${slug}`);
export const getVehicleMakes = () => api<VehicleMake[]>("/vehicles/makes");
export const getVehicleModels = (makeId: string) => api<VehicleModel[]>(`/vehicles/makes/${makeId}/models`);
export const getVehicleEngines = (modelId: string) => api<VehicleEngine[]>(`/vehicles/models/${modelId}/engines`);
export const getMyOrders = (token: string) => api<OrderListItem[]>("/orders/my", { token });
export const getMyOrderById = (id: string, token: string) => api<OrderDetail>(`/orders/my/${id}`, { token });
export const getOrderById = (id: string, token: string) => api<OrderDetail>(`/orders/${id}`, { token });
export const forgotPassword = (email: string) =>
  api<void>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
export const resetPassword = (email: string, token: string, newPassword: string) =>
  api<void>("/auth/reset-password", { method: "POST", body: JSON.stringify({ email, token, newPassword }) });

// --- API functions (mutations) ---

// Products
export const createProduct = (data: CreateProductRequest, token: string) =>
  api<ProductDetail>("/products", { method: "POST", body: JSON.stringify(data), token });

export const updateProduct = (id: string, data: UpdateProductRequest, token: string) =>
  api<ProductDetail>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data), token });

export const deleteProduct = (id: string, token: string) =>
  api<void>(`/products/${id}`, { method: "DELETE", token });

// Vehicle Makes
export const createMake = (data: CreateMakeRequest, token: string) =>
  api<VehicleMake>("/vehicles/makes", { method: "POST", body: JSON.stringify(data), token });

export const updateMake = (id: string, data: CreateMakeRequest, token: string) =>
  api<VehicleMake>(`/vehicles/makes/${id}`, { method: "PUT", body: JSON.stringify(data), token });

export const deleteMake = (id: string, token: string) =>
  api<void>(`/vehicles/makes/${id}`, { method: "DELETE", token });

// Vehicle Models
export const createModel = (makeId: string, data: CreateModelRequest, token: string) =>
  api<VehicleModel>(`/vehicles/makes/${makeId}/models`, { method: "POST", body: JSON.stringify(data), token });

export const updateModel = (id: string, data: CreateModelRequest, token: string) =>
  api<VehicleModel>(`/vehicles/models/${id}`, { method: "PUT", body: JSON.stringify(data), token });

export const deleteModel = (id: string, token: string) =>
  api<void>(`/vehicles/models/${id}`, { method: "DELETE", token });

// Vehicle Engines
export const createEngine = (modelId: string, data: CreateEngineRequest, token: string) =>
  api<VehicleEngine>(`/vehicles/models/${modelId}/engines`, { method: "POST", body: JSON.stringify(data), token });

export const updateEngine = (id: string, data: CreateEngineRequest, token: string) =>
  api<VehicleEngine>(`/vehicles/engines/${id}`, { method: "PUT", body: JSON.stringify(data), token });

export const deleteEngine = (id: string, token: string) =>
  api<void>(`/vehicles/engines/${id}`, { method: "DELETE", token });

// Orders
export const updateOrderStatus = (id: string, status: string, token: string) =>
  api<void>(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }), token });

// Checkout
export const createCheckoutSession = (data: CheckoutRequest, token: string) =>
  api<CheckoutResponse>("/orders/checkout", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
