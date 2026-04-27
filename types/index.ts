// ─── Product ──────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  brand?: string;
  sku: string;
  stock: number;
  status: "active" | "inactive";
  colors?: string[];
  sizes?: string[];
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  isNew?: boolean;
  createdAt: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  promoCode?: string;
  discount?: number;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "paid" | "processing" | "failed" | "refunded";

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

// ─── Address ──────────────────────────────────────────────────────────────────
export interface Address {
  fullName: string;
  email: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

// ─── Shipping ─────────────────────────────────────────────────────────────────
export interface ShippingMethod {
  id: string;
  label: string;
  description: string;
  price: number;
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

// ─── Filters ──────────────────────────────────────────────────────────────────
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  rating?: number;
  sort?: "relevance" | "price-asc" | "price-desc" | "newest" | "rating";
}
