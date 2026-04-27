"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  async function handleClick() {
    if (!session) {
      router.push("/auth");
      return;
    }
    setAdding(true);
    await addItem(productId, 1);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      disabled={adding}
      aria-label="Add to cart"
      className="w-8 h-8 bg-surface-low rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer group/btn disabled:opacity-50"
    >
      {added ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-green-500"
        >
          <path
            d="M20 6L9 17l-5-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <ShoppingCart
          size={15}
          className="text-content-secondary group-hover/btn:text-white transition-colors"
        />
      )}
    </button>
  );
}
