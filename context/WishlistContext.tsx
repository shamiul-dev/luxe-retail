"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSession } from "@/lib/auth-client";

export interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice?: string | null;
  images: string[];
  stock: number;
  isNew: boolean;
  category?: { name: string; slug: string } | null;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: WishlistProduct;
}

interface WishlistContextValue {
  items: WishlistItem[];
  itemCount: number;
  loading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!session) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (e) {
      console.error("Failed to fetch wishlist", e);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function isWishlisted(productId: string) {
    return items.some((i) => i.productId === productId);
  }

  async function toggle(productId: string) {
    if (!session) return;

    if (isWishlisted(productId)) {
      // Optimistic remove
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
    } else {
      // Add
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      await refresh();
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        loading,
        isWishlisted,
        toggle,
        refresh,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
