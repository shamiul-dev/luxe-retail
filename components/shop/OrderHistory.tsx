"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";

interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  color?: string | null;
  size?: string | null;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: string;
  subtotal: string;
  shipping: string;
  tax: string;
  shippingName: string;
  shippingStreet: string;
  shippingCity: string;
  shippingZip: string;
  shippingCountry: string;
  shippingMethod: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderHistoryProps {
  orders: Order[];
}

function formatPrice(amount: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const statusInfo = ORDER_STATUS_MAP[order.status] ?? {
    label: order.status,
    classes: "bg-gray-50 text-gray-700 border border-gray-200",
  };

  return (
    <div className="bg-white rounded-xl shadow-raised overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-surface-low transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-6 flex-wrap">
          {/* Order number */}
          <div>
            <p className="text-[10px] font-semibold text-content-muted tracking-widest uppercase mb-0.5">
              Order
            </p>
            <p className="text-sm font-bold text-primary">
              {order.orderNumber}
            </p>
          </div>

          {/* Date */}
          <div>
            <p className="text-[10px] font-semibold text-content-muted tracking-widest uppercase mb-0.5">
              Date
            </p>
            <p className="text-sm text-content">
              {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Items count */}
          <div>
            <p className="text-[10px] font-semibold text-content-muted tracking-widest uppercase mb-0.5">
              Items
            </p>
            <p className="text-sm text-content">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>

          {/* Total */}
          <div>
            <p className="text-[10px] font-semibold text-content-muted tracking-widest uppercase mb-0.5">
              Total
            </p>
            <p className="text-sm font-bold text-content">
              {formatPrice(order.total)}
            </p>
          </div>

          {/* Status */}
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide",
              statusInfo.classes,
            )}
          >
            {statusInfo.label}
          </span>
        </div>

        <div className="text-content-muted ml-4 shrink-0">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border px-6 py-5 flex flex-col gap-6">
          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-content-muted tracking-widest uppercase mb-3">
              Items
            </p>
            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-low rounded-lg flex items-center justify-center text-[10px] text-content-muted shrink-0">
                    {item.name.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-content line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-content-muted">
                      {[
                        item.size && `Size: ${item.size}`,
                        item.color && `Color: ${item.color}`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}{" "}
                      · Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-content shrink-0">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary + Shipping side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order summary */}
            <div>
              <p className="text-xs font-semibold text-content-muted tracking-widest uppercase mb-3">
                Order Summary
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-content-secondary">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-secondary">Shipping</span>
                  <span
                    className={cn(
                      "font-medium",
                      Number(order.shipping) === 0 ? "text-green-600" : "",
                    )}
                  >
                    {Number(order.shipping) === 0
                      ? "FREE"
                      : formatPrice(order.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-secondary">Tax</span>
                  <span className="font-medium">{formatPrice(order.tax)}</span>
                </div>
                <div className="h-px bg-border my-1" />
                <div className="flex justify-between font-bold text-content">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div>
              <p className="text-xs font-semibold text-content-muted tracking-widest uppercase mb-3">
                Delivery Address
              </p>
              <div className="text-sm text-content-secondary flex flex-col gap-0.5">
                <p className="font-medium text-content">{order.shippingName}</p>
                <p>{order.shippingStreet}</p>
                <p>
                  {order.shippingCity}, {order.shippingZip}
                </p>
                <p>{order.shippingCountry}</p>
                <p className="mt-1 text-xs text-content-muted capitalize">
                  {order.shippingMethod === "express"
                    ? "Express Courier"
                    : "Standard Delivery"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <div className="max-w-container mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-content tracking-tight">
            Order History
          </h1>
          <p className="text-content-muted text-sm mt-1">
            {orders.length === 0
              ? "No orders yet"
              : `${orders.length} ${orders.length === 1 ? "order" : "orders"}`}
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
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center">
            <Package size={32} className="text-content-muted" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-content mb-2">
              No orders yet
            </h2>
            <p className="text-content-muted text-sm">
              When you place an order it will appear here.
            </p>
          </div>
          <Link href="/shop">
            <button className="px-8 py-3 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors cursor-pointer">
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
