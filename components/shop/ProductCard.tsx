import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { Heart } from "lucide-react";
import { Product } from "@/db/schema";

interface ProductCardProps {
  product: Product & { category?: { name: string } | null };
}

function formatPrice(amount: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

export default function ProductCard({ product }: ProductCardProps) {
  const categoryName =
    typeof product.category === "object"
      ? (product.category?.name ?? "")
      : (product.category ?? "");

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-raised hover:shadow-overlay transition-all duration-300">
      {/* Image */}
      <Link
        href={`/shop/${product.slug}`}
        className="block relative aspect-square bg-surface-low overflow-hidden"
      >
        <div className="w-full h-full flex items-center justify-center text-content-muted text-xs p-4 text-center">
          {product.name}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2.5 py-1 bg-accent text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
              New
            </span>
          )}
          {product.comparePrice && (
            <span className="px-2.5 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-raised opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-surface-low cursor-pointer"
        >
          <Heart size={15} className="text-content-secondary" />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] font-semibold text-content-muted tracking-widest uppercase mb-1">
          {categoryName}
        </p>
        <Link
          href={`/shop/${product.slug}`}
          className="text-sm font-semibold text-content hover:text-primary transition-colors line-clamp-1 font-heading"
        >
          {product.name}
        </Link>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-content">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-content-muted line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
