"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({
  productId,
  className,
}: WishlistButtonProps) {
  const { isWishlisted, toggle } = useWishlist();
  const { data: session } = useSession();
  const router = useRouter();
  const wishlisted = isWishlisted(productId);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      router.push("/auth");
      return;
    }
    await toggle(productId);
  }

  return (
    <button
      onClick={handleClick}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-raised hover:shadow-overlay transition-all duration-200 cursor-pointer",
        className,
      )}
    >
      <Heart
        size={15}
        className={cn(
          "transition-colors",
          wishlisted ? "fill-red-500 text-red-500" : "text-content-secondary",
        )}
      />
    </button>
  );
}
