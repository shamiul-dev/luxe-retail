"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSession } from "@/lib/auth-client";

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice?: string | null;
  images: string[];
  stock: number;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  color?: string | null;
  size?: string | null;
  product: CartProduct;
}

interface CartContextValue {
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  itemCount: number;
  loading: boolean;
  addItem: (
    productId: string,
    quantity?: number,
    color?: string,
    size?: string,
  ) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 150;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : subtotal > 0 ? 10 : 0;
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const refresh = useCallback(async () => {
    if (!session) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (e) {
      console.error("Failed to fetch cart", e);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addItem(
    productId: string,
    quantity = 1,
    color?: string,
    size?: string,
  ) {
    if (!session) return;
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity, color, size }),
    });
    await refresh();
  }

  async function updateItem(itemId: string, quantity: number) {
    // Optimistic update
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
      );
    }
    await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
  }

  async function removeItem(itemId: string) {
    // Optimistic update
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
  }

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        subtotal,
        shipping,
        tax,
        itemCount,
        loading,
        addItem,
        updateItem,
        removeItem,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
