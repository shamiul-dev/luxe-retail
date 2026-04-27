import { CartItem, Cart } from "@/types";
import { TAX_RATE, FREE_SHIPPING_THRESHOLD } from "./constants";

// ─── cn ───────────────────────────────────────────────────────────────────────
type ClassValue = string | undefined | null | false | Record<string, boolean>;

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flatMap((input) => {
      if (!input) return [];
      if (typeof input === "string") return [input];
      return Object.entries(input).filter(([, v]) => v).map(([k]) => k);
    })
    .join(" ");
}

// ─── Formatting ───────────────────────────────────────────────────────────────
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(dateStr));
}

export function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateStr));
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export function calculateCart(items: CartItem[], promoDiscount = 0): Cart {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discounted = subtotal - promoDiscount;
  const shipping = discounted >= FREE_SHIPPING_THRESHOLD ? 0 : 10;
  const tax = parseFloat((discounted * TAX_RATE).toFixed(2));
  const total = parseFloat((discounted + shipping + tax).toFixed(2));
  return {
    items,
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping,
    tax,
    total,
    discount: promoDiscount > 0 ? promoDiscount : undefined,
  };
}

// ─── Misc ─────────────────────────────────────────────────────────────────────
export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function generateOrderNumber(): string {
  return `#LX-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}
