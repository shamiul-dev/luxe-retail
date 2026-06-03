"use client";
import Image from "next/image";

import { useState, useEffect } from "react";
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
  const [buyingNow, setBuyingNow] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsFetched, setReviewsFetched] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [titleInput, setTitleInput] = useState("");
  const [bodyInput, setBodyInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addItem } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  // Optimistic UI for reviews summary
  const [localRating, setLocalRating] = useState(Number(product.rating ?? 0));
  const [localReviewCount, setLocalReviewCount] = useState(product.reviewCount);

  useEffect(() => {
    if (activeTab === "reviews" && !reviewsFetched) {
      setReviewsLoading(true);
      fetch(`/api/reviews?productId=${product.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setReviews(data);
          }
          setReviewsFetched(true);
        })
        .catch(console.error)
        .finally(() => setReviewsLoading(false));
    }
  }, [activeTab, reviewsFetched, product.id]);

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return router.push("/auth");

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: ratingInput,
          title: titleInput,
          body: bodyInput,
        }),
      });
      
      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        setReviewFormOpen(false);
        setRatingInput(5);
        setTitleInput("");
        setBodyInput("");
        
        // Optimistically update counts
        const newTotal = (localRating * localReviewCount) + ratingInput;
        const newCount = localReviewCount + 1;
        setLocalRating(newTotal / newCount);
        setLocalReviewCount(newCount);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReview(false);
    }
  }

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

  async function handleBuyNow() {
    if (!session) {
      router.push("/auth");
      return;
    }
    setBuyingNow(true);
    
    // Instead of adding to cart, redirect directly to checkout with query params
    const params = new URLSearchParams();
    params.set("buyNow", "true");
    params.set("productId", product.id);
    params.set("qty", quantity.toString());
    if (selectedColor) params.set("color", selectedColor);
    if (selectedSize) params.set("size", selectedSize);
    
    router.push(`/checkout?${params.toString()}`);
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
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          disabled={!inStock || buyingNow}
          onClick={handleBuyNow}
        >
          {buyingNow ? "Processing..." : "Buy Now"}
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
              {tab === "reviews" ? `Reviews (${localReviewCount})` : tab}
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
            {/* Reviews Header / Add Review Button */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-heading text-xl font-bold text-content">Customer Reviews</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < Math.round(localRating) ? "fill-current" : "text-border"} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-content">{localRating.toFixed(1)} out of 5</span>
                </div>
              </div>
              
              {!reviewFormOpen && (
                <Button variant="outline" size="sm" onClick={() => {
                  if (!session) router.push("/auth");
                  else setReviewFormOpen(true);
                }}>
                  Write a Review
                </Button>
              )}
            </div>

            {/* Review Form */}
            {reviewFormOpen && (
              <form onSubmit={handleReviewSubmit} className="bg-surface-low p-6 rounded-xl border border-border mb-8">
                <h4 className="font-semibold text-content mb-4">Write a Review</h4>
                
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-content-muted uppercase tracking-wider mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        className={`p-1 hover:scale-110 transition-transform ${star <= ratingInput ? 'text-accent fill-accent' : 'text-border'}`}
                      >
                        <Star size={24} className={star <= ratingInput ? "fill-current" : ""} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-content-muted uppercase tracking-wider mb-2">Review Title (Optional)</label>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-white focus:outline-none focus:border-primary text-sm"
                    placeholder="Summary of your thoughts"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-semibold text-content-muted uppercase tracking-wider mb-2">Review (Optional)</label>
                  <textarea
                    value={bodyInput}
                    onChange={(e) => setBodyInput(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-white focus:outline-none focus:border-primary text-sm resize-none"
                    placeholder="What did you like or dislike?"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" type="button" onClick={() => setReviewFormOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={submittingReview}>
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="py-12 flex justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 bg-surface-low rounded-xl border border-border border-dashed">
                <p className="text-content-muted text-sm">
                  No reviews yet. Be the first to review this product.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-accent">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-border"} />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-content-secondary">
                        {review.userName}
                      </span>
                      <span className="text-xs text-content-muted ml-auto">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.title && <h5 className="font-semibold text-content text-sm mb-1">{review.title}</h5>}
                    {review.body && <p className="text-content-secondary text-sm leading-relaxed">{review.body}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
