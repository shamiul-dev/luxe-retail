"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import WishlistButton from "./WishlistButton";

function formatPrice(amount: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

export default function WishlistContent() {
  const { items, itemCount, loading } = useWishlist();
  const { addItem } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  async function handleAddToCart(productId: string) {
    if (!session) {
      router.push("/auth");
      return;
    }
    await addItem(productId, 1);
  }

  if (loading) {
    return (
      <div className="max-w-container mx-auto px-6 py-24 flex items-center justify-center">
        <p className="text-content-muted text-sm">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-content tracking-tight">
            Wishlist
          </h1>
          <p className="text-content-muted text-sm mt-1">
            {itemCount === 0
              ? "No saved items"
              : `${itemCount} ${itemCount === 1 ? "item" : "items"} saved`}
          </p>
        </div>
        <Link
          href="/shop"
          className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center">
            <Heart size={32} className="text-content-muted" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-content mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-content-muted text-sm">
              Save items you love by clicking the heart icon on any product.
            </p>
          </div>
          <Link href="/shop">
            <button className="px-8 py-3 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors cursor-pointer">
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-raised hover:shadow-overlay transition-all duration-300"
            >
              {/* Image */}
              <Link
                href={`/shop/${item.product.slug}`}
                className="block relative aspect-square bg-surface-low overflow-hidden"
              >
                <div className="w-full h-full flex items-center justify-center text-content-muted text-xs p-4 text-center">
                  {item.product.name}
                </div>

                {/* New badge */}
                {item.product.isNew && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-accent text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                    New
                  </span>
                )}

                {/* Remove from wishlist */}
                <WishlistButton
                  productId={item.productId}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100"
                />
              </Link>

              {/* Info */}
              <div className="p-4">
                {item.product.category && (
                  <p className="text-[10px] font-semibold text-content-muted tracking-widest uppercase mb-1">
                    {item.product.category.name}
                  </p>
                )}
                <Link
                  href={`/shop/${item.product.slug}`}
                  className="text-sm font-semibold text-content hover:text-primary transition-colors line-clamp-1 font-heading"
                >
                  {item.product.name}
                </Link>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-content">
                      {formatPrice(item.product.price)}
                    </span>
                    {item.product.comparePrice && (
                      <span className="text-xs text-content-muted line-through">
                        {formatPrice(item.product.comparePrice)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(item.productId)}
                    aria-label="Add to cart"
                    className={cn(
                      "w-8 h-8 bg-surface-low rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer group/btn",
                      item.product.stock > 0
                        ? "hover:bg-primary"
                        : "opacity-40 cursor-not-allowed",
                    )}
                    disabled={item.product.stock === 0}
                  >
                    <ShoppingCart
                      size={15}
                      className="text-content-secondary group-hover/btn:text-white transition-colors"
                    />
                  </button>
                </div>

                {item.product.stock === 0 && (
                  <p className="text-[10px] text-red-500 font-medium mt-1">
                    Out of stock
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
