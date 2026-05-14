"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const STEPS = ["SHIPPING", "PAYMENT", "REVIEW"] as const;
type Step = (typeof STEPS)[number];

interface CheckoutContentProps {
  buyNowItem?: any;
}

const SHIPPING_METHODS = [
  {
    id: "standard",
    label: "Standard Delivery",
    description: "3-5 business days",
    price: 0,
  },
  {
    id: "express",
    label: "Express Courier",
    description: "Next day delivery",
    price: 25,
  },
];

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function CheckoutContent({ buyNowItem }: CheckoutContentProps) {
  const router = useRouter();
  const cart = useCart();
  const { data: session } = useSession();

  const items = buyNowItem ? [buyNowItem] : cart.items;
  const itemCount = buyNowItem ? buyNowItem.quantity : cart.itemCount;
  
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );
  
  const tax = parseFloat((subtotal * 0.08).toFixed(2)); // Use same logic as cart
  const FREE_SHIPPING_THRESHOLD = 150;

  const [step, setStep] = useState<Step>("SHIPPING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0]);

  const [address, setAddress] = useState({
    fullName: session?.user.name ?? "",
    email: session?.user.email ?? "",
    street: "",
    city: "",
    zipCode: "",
    country: "United States",
  });

  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });

  const shippingPrice = shippingMethod.price;
  
  // Update shipping if free threshold met
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : subtotal > 0 ? shippingPrice : 0;
  
  const orderTotal = parseFloat((subtotal + shipping + tax).toFixed(2));

  function handleAddressChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validateAddress() {
    return (
      address.fullName &&
      address.email &&
      address.street &&
      address.city &&
      address.zipCode &&
      address.country
    );
  }

  async function handlePlaceOrder() {
    setLoading(true);
    setError(null);

    const cartSnapshot = items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      image: item.product.images?.[0] ?? "",
      price: item.product.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    }));

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        shippingMethod,
        cartSnapshot,
        subtotal,
        shipping,
        tax,
        total: orderTotal,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to place order. Please try again.");
      setLoading(false);
      return;
    }

    if (!buyNowItem) {
      await cart.refresh();
    }
    router.push(`/orders/confirmation?order=${data.order.orderNumber}`);
  }

  if (itemCount === 0) {
    return (
      <div className="max-w-container mx-auto px-6 py-24 text-center">
        <p className="text-content-muted text-sm">Your cart is empty.</p>
        <a
          href="/shop"
          className="mt-4 inline-block text-accent font-semibold hover:text-accent-hover"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-6 py-10">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  step === s || STEPS.indexOf(step) > i
                    ? "bg-primary text-white"
                    : "bg-surface-container text-content-muted",
                )}
              >
                {STEPS.indexOf(step) > i ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold tracking-widest uppercase",
                  step === s ? "text-primary" : "text-content-muted",
                )}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-16 h-px",
                  STEPS.indexOf(step) > i ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ── Form ── */}
        <div className="lg:col-span-2">
          {step === "SHIPPING" && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-content mb-6">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleAddressChange}
                    placeholder="John Doe"
                    required
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={address.email}
                    onChange={handleAddressChange}
                    placeholder="john@example.com"
                    required
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Street Address"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      placeholder="123 Luxury Ave, Apt 4B"
                      required
                    />
                  </div>
                  <Input
                    label="City"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="New York"
                    required
                  />
                  <Input
                    label="Zip Code"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleAddressChange}
                    placeholder="10001"
                    required
                  />
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label
                      htmlFor="country"
                      className="text-xs font-medium text-content-secondary tracking-wide"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 rounded-lg bg-surface-low border border-transparent text-content text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                    >
                      {[
                        "United States",
                        "United Kingdom",
                        "Canada",
                        "Australia",
                        "Germany",
                        "France",
                        "Bangladesh",
                      ].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-content mb-4">
                  Shipping Method
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SHIPPING_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        shippingMethod.id === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border-strong",
                      )}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod.id === method.id}
                        onChange={() => setShippingMethod(method)}
                        className="accent-primary"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-content">
                          {method.label}
                        </p>
                        <p className="text-xs text-content-muted">
                          {method.description}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-content">
                        {method.price === 0
                          ? "Free"
                          : formatPrice(method.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => validateAddress() && setStep("PAYMENT")}
                disabled={!validateAddress()}
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {step === "PAYMENT" && (
            <div className="flex flex-col gap-6">
              <h2 className="font-heading text-2xl font-bold text-content">
                Payment Details
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 p-3 border-2 border-primary rounded-xl text-sm font-semibold text-primary cursor-pointer">
                  <CreditCard size={18} /> Credit Card
                </button>
                <button className="flex items-center justify-center gap-2 p-3 border-2 border-border rounded-xl text-sm font-semibold text-content-secondary hover:border-border-strong cursor-pointer transition-colors">
                  Apple Pay
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <Input
                  label="Card Number"
                  name="number"
                  value={card.number}
                  onChange={(e) =>
                    setCard((p) => ({ ...p, number: e.target.value }))
                  }
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    name="expiry"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard((p) => ({ ...p, expiry: e.target.value }))
                    }
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  <Input
                    label="CVV"
                    name="cvv"
                    value={card.cvv}
                    onChange={(e) =>
                      setCard((p) => ({ ...p, cvv: e.target.value }))
                    }
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep("SHIPPING")}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep("REVIEW")}
                >
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {step === "REVIEW" && (
            <div className="flex flex-col gap-6">
              <h2 className="font-heading text-2xl font-bold text-content">
                Review Order
              </h2>

              <div className="bg-white rounded-xl shadow-raised p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-content tracking-widest uppercase">
                    Delivery Address
                  </p>
                  <button
                    onClick={() => setStep("SHIPPING")}
                    className="text-xs text-accent hover:text-accent-hover font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-content">{address.fullName}</p>
                <p className="text-sm text-content-secondary">
                  {address.street}, {address.city}, {address.zipCode}
                </p>
                <p className="text-sm text-content-secondary">
                  {address.country}
                </p>
                <p className="text-sm text-content-muted mt-1">
                  {address.email}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-raised p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-content tracking-widest uppercase">
                    Shipping
                  </p>
                  <button
                    onClick={() => setStep("SHIPPING")}
                    className="text-xs text-accent hover:text-accent-hover font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-content">
                  {shippingMethod.label} — {shippingMethod.description}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-raised p-5">
                <p className="text-xs font-semibold text-content tracking-widest uppercase mb-3">
                  Items ({itemCount})
                </p>
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-low rounded-lg flex items-center justify-center text-[10px] text-content-muted shrink-0">
                          {item.product.name.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-content line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-content-muted">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-content shrink-0">
                        {formatPrice(
                          Number(item.product.price) * item.quantity,
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep("PAYMENT")}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? "Placing Order…" : "Place Order"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Order Summary ── */}
        <div>
          <div className="bg-white rounded-xl shadow-raised p-6 sticky top-24">
            <h2 className="font-heading text-lg font-bold text-content mb-5">
              Order Summary
            </h2>
            <div className="flex flex-col gap-3 mb-5">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface-low rounded-lg shrink-0 flex items-center justify-center text-[10px] text-content-muted">
                    {item.product.name.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-content line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-[10px] text-content-muted">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-content shrink-0">
                    {formatPrice(Number(item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-px bg-border mb-4" />
            <div className="flex flex-col gap-2 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-content-secondary">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-secondary">Shipping</span>
                <span
                  className={cn(
                    "font-semibold",
                    shipping === 0 ? "text-green-600" : "",
                  )}
                >
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-secondary">Tax</span>
                <span className="font-semibold">{formatPrice(tax)}</span>
              </div>
              <div className="h-px bg-border my-1" />
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-content">Total</span>
                <span className="font-heading text-xl font-bold text-content">
                  {formatPrice(orderTotal)}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-content-muted pt-4 border-t border-border">
              <ShieldCheck size={14} className="text-accent shrink-0 mt-0.5" />
              Secure encrypted checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
