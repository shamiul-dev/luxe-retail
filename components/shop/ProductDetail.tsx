"use client";
import Image from "next/image";

import { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  comparePrice?: string | number | null;
  images: string[];
  category?: { name: string; slug: string } | null;
  brand?: string | null;
  stock: number;
  colors?: string[] | null;
  sizes?: string[] | null;
  rating?: string | number | null;
  reviewCount: number;
  isNew: boolean;
  tags?: string[] | null;
}

interface ProductDetailProps {
  product: Product;
}

function formatPrice(amount: string | number | null | undefined) {
  if (!amount) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

const COLOR_LABELS: Record<string, string> = {
  "#191c1e": "Midnight Black",
  "#f8f9fb": "Off White",
  "#fc820c": "Burnt Orange",
  "#000666": "Indigo",
  "#767683": "Slate Grey",
  "#964900": "Cognac",
  "#c9a882": "Camel",
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors?.[0] ?? null,
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes?.[0] ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "reviews"
  >("description");
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addItem } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const rating = Number(product.rating ?? 0);
  const inStock = product.stock > 0;
  const discount = product.comparePrice
    ? Math.round(
        (1 - Number(product.price) / Number(product.comparePrice)) * 100,
      )
    : null;

  // Placeholder images — replace with real product.images
  const images = product.images.length > 0 ? product.images : [];

  async function handleAddToCart() {
    if (!session) {
      router.push("/auth");
      return;
    }
    setAdding(true);
    await addItem(
      product.id,
      quantity,
      selectedColor ?? undefined,
      selectedSize ?? undefined,
    );
    setAdding(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      {/* ── Left: Image Gallery ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {/* Main image */}
        <div className="relative aspect-square bg-surface-low rounded-2xl overflow-hidden">
          {images[activeImage] && images[activeImage] !== "/placeholder.jpg" ? (
            <Image
              src={images[activeImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-content-muted text-sm bg-surface-low">
              {product.name}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && <Badge variant="accent">New</Badge>}
            {discount && <Badge variant="primary">-{discount}%</Badge>}
          </div>

          {/* Wishlist */}
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-raised hover:shadow-overlay transition-all cursor-pointer"
            aria-label="Add to wishlist"
          >
            <Heart
              size={18}
              className={cn(
                "transition-colors",
                wishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-content-secondary",
              )}
            />
          </button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "w-20 h-20 rounded-xl bg-surface-low border-2 transition-all cursor-pointer overflow-hidden relative",
                  activeImage === i
                    ? "border-primary"
                    : "border-transparent hover:border-border-strong",
                )}
              >
                {images[i] && images[i] !== "/placeholder.jpg" ? (
                  <Image
                    src={images[i]}
                    alt={product.name + " " + (i + 1)}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-xs text-content-muted">
                    {i + 1}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: Product Info ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {/* Category + badges */}
        <div className="flex items-center gap-2">
          {product.category && (
            <a
              href={`/shop?category=${product.category.slug}`}
              className="text-xs font-semibold text-accent tracking-widest uppercase hover:text-accent-hover transition-colors"
            >
              {product.category.name}
            </a>
          )}
          {product.isNew && <Badge variant="accent">Limited Edition</Badge>}
        </div>

        {/* Name */}
        <h1 className="font-heading text-3xl lg:text-4xl font-bold text-content leading-tight tracking-tight">
          {product.name}
        </h1>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={16}
                  className={cn(
                    i <= Math.round(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-surface-high fill-surface-high",
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-content">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm text-content-muted">
              ({product.reviewCount} reviews)
            </span>
            <span
              className={cn(
                "text-xs font-semibold ml-2",
                inStock ? "text-green-600" : "text-red-500",
              )}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="font-heading text-3xl font-bold text-content">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-lg text-content-muted line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Color selector */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-content">
              Select Dial Color:{" "}
              <span className="font-normal text-content-secondary">
                {selectedColor
                  ? (COLOR_LABELS[selectedColor] ?? selectedColor)
                  : ""}
              </span>
            </p>
            <div className="flex items-center gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  title={COLOR_LABELS[color] ?? color}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all cursor-pointer hover:scale-110",
                    selectedColor === color
                      ? "border-primary scale-110 shadow-overlay"
                      : "border-white shadow-raised",
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-content">Strap Size</p>
              <button className="text-xs text-accent underline hover:text-accent-hover transition-colors cursor-pointer">
                Size Guide
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer",
                    selectedSize === size
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-content border-border hover:border-primary hover:text-primary",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + Add to Cart */}
        <div className="flex items-center gap-3">
          {/* Quantity */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-12 flex items-center justify-center text-content-secondary hover:bg-surface-low transition-colors cursor-pointer text-lg"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-semibold text-content">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-10 h-12 flex items-center justify-center text-content-secondary hover:bg-surface-low transition-colors cursor-pointer text-lg"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            disabled={!inStock || adding}
            className="flex-1 gap-2"
          >
            <ShoppingCart size={18} />
            {adding ? "Adding..." : "Add to Cart"}
          </Button>
        </div>

        {/* Buy Now */}
        <Button variant="secondary" size="lg" fullWidth disabled={!inStock}>
          Buy Now
        </Button>

        {/* Shipping note */}
        <p className="text-xs text-content-muted flex items-center gap-1.5">
          <Truck size={14} className="text-accent" />
          Free worldwide express shipping on orders over $500
        </p>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
          {[
            { icon: Truck, label: "Free Shipping", sub: "Orders over $500" },
            {
              icon: ShieldCheck,
              label: "Secure Payment",
              sub: "SSL encrypted",
            },
            { icon: RefreshCw, label: "Easy Returns", sub: "30-day policy" },
          ].map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-1"
            >
              <Icon size={18} className="text-accent" strokeWidth={1.5} />
              <p className="text-xs font-semibold text-content">{label}</p>
              <p className="text-[10px] text-content-muted">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs: Description / Specs / Reviews ─────────────────────────── */}
      <div className="lg:col-span-2 mt-8">
        <div className="flex border-b border-border gap-8 mb-8">
          {(["description", "specs", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-3 text-sm font-semibold capitalize transition-colors cursor-pointer",
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-content-muted hover:text-content-secondary",
              )}
            >
              {tab === "reviews" ? `Reviews (${product.reviewCount})` : tab}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div className="max-w-2xl">
            <p className="text-content-secondary leading-relaxed">
              {product.description}
            </p>
            {product.brand && (
              <p className="mt-4 text-sm text-content-muted">
                Brand:{" "}
                <span className="font-semibold text-content">
                  {product.brand}
                </span>
              </p>
            )}
            {product.tags && product.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-4">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-surface-container rounded-full text-xs text-content-secondary capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "specs" && (
          <div className="max-w-2xl">
            <p className="text-content-muted text-sm">
              Specifications will be listed here.
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="max-w-2xl">
            {product.reviewCount === 0 ? (
              <p className="text-content-muted text-sm">
                No reviews yet. Be the first to review this product.
              </p>
            ) : (
              <p className="text-content-muted text-sm">Reviews coming soon.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
