"use client";

import Link from "next/link";
import { Trash2, ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function CartContent() {
  const {
    items,
    subtotal,
    shipping,
    tax,
    total,
    itemCount,
    loading,
    updateItem,
    removeItem,
  } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  function handlePromo() {
    if (promoCode.trim()) setPromoApplied(true);
    // TODO: validate promo code via API
  }

  if (loading) {
    return (
      <div className="max-w-container mx-auto px-6 py-24 flex items-center justify-center">
        <p className="text-content-muted text-sm">Loading your bag...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-container mx-auto px-6 py-24 flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-content-muted"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        <div>
          <h2 className="font-heading text-2xl font-bold text-content mb-2">
            Your bag is empty
          </h2>
          <p className="text-content-muted text-sm">
            Looks like you haven&apos;t added anything yet.
          </p>
        </div>
        <Link href="/shop">
          <Button variant="primary" size="lg">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-content tracking-tight">
          Shopping Bag
        </h1>
        <p className="text-content-muted text-sm mt-1">
          You have{" "}
          <span className="font-semibold text-content">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>{" "}
          in your cart.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ── Cart Items ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-raised p-5 flex gap-5"
            >
              {/* Image */}
              <div className="w-24 h-24 bg-surface-low rounded-xl flex-shrink-0 flex items-center justify-center text-xs text-content-muted overflow-hidden">
                {item.product.name.slice(0, 2)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-accent tracking-widest uppercase mb-0.5">
                  {/* category shown if available */}
                </p>
                <h3 className="font-heading font-semibold text-content text-sm leading-snug">
                  {item.product.name}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  {item.size && (
                    <p className="text-xs text-content-muted">
                      Size: {item.size}
                    </p>
                  )}
                  {item.color && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-content-muted">Color:</span>
                      <span
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  )}
                </div>

                {/* Quantity + price row */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateItem(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-content-secondary hover:bg-surface-low transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-content">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-content-secondary hover:bg-surface-low transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-content text-sm">
                      {formatPrice(Number(item.product.price) * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-content-muted hover:text-red-500 transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Continue shopping */}
          <Link
            href="/shop"
            className="flex items-center gap-2 text-sm font-semibold text-content-secondary hover:text-primary transition-colors mt-2"
          >
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {/* ── Order Summary ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-raised p-6 flex flex-col gap-4">
            <h2 className="font-heading text-lg font-bold text-content">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-content-secondary">Subtotal</span>
                <span className="font-semibold text-content">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-secondary">Shipping</span>
                <span
                  className={
                    shipping === 0
                      ? "font-semibold text-green-600"
                      : "font-semibold text-content"
                  }
                >
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-secondary">Estimated Tax</span>
                <span className="font-semibold text-content">
                  {formatPrice(tax)}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-content">Total</span>
                <div className="text-right">
                  <p className="text-[10px] text-content-muted">USD</p>
                  <p className="font-heading text-2xl font-bold text-content">
                    {formatPrice(total)}
                  </p>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-content tracking-widest uppercase">
                Promo Code
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  disabled={promoApplied}
                  className="flex-1 px-3 py-2 text-sm bg-surface-low border border-transparent rounded-lg focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
                <button
                  onClick={handlePromo}
                  disabled={promoApplied || !promoCode}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-50"
                >
                  {promoApplied ? "✓" : "Apply"}
                </button>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link href="/checkout">
              <Button variant="primary" fullWidth size="lg" className="mt-2">
                Proceed to Checkout →
              </Button>
            </Link>

            {/* Trust */}
            <div className="flex flex-col gap-3 pt-2 border-t border-border">
              <div className="flex items-start gap-3 text-xs text-content-muted">
                <ShieldCheck
                  size={16}
                  className="text-accent shrink-0 mt-0.5"
                />
                Secure checkout with AES-256 bit encryption and protection.
              </div>
              <div className="flex items-start gap-3 text-xs text-content-muted">
                <Truck size={16} className="text-accent shrink-0 mt-0.5" />
                Free shipping on orders over $150. Easy 30-day returns.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
