import { getOrderById } from "@/lib/queries/admin";
import { notFound } from "next/navigation";
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Package, User, MapPin, CreditCard } from "lucide-react";

export const metadata = { title: "Order Details | Admin" };

function formatPrice(amount: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const statusInfo = ORDER_STATUS_MAP[order.status] ?? {
    label: order.status,
    classes: "bg-gray-50 text-gray-700 border border-gray-200",
  };

  const paymentInfo = PAYMENT_STATUS_MAP[order.paymentStatus] ?? {
    label: order.paymentStatus,
    classes: "bg-gray-50 text-gray-700 border border-gray-200",
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-content-secondary hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-content tracking-tight">
              Order {order.orderNumber}
            </h1>
            <p className="text-content-muted text-sm mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                paymentInfo.classes,
              )}
            >
              {paymentInfo.label}
            </span>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                statusInfo.classes,
              )}
            >
              {statusInfo.label}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Items & Summary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-raised p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-primary">
                <Package size={20} />
              </div>
              <h2 className="font-heading text-lg font-bold text-content">
                Order Items
              </h2>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover bg-surface-low"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-surface-low rounded-lg flex items-center justify-center text-xs text-content-muted">
                        No Img
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-content">{item.name}</p>
                      <p className="text-xs text-content-secondary mt-0.5">
                        {[
                          item.color && `Color: ${item.color}`,
                          item.size && `Size: ${item.size}`,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <p className="text-sm font-medium text-content mt-1">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-bold text-content">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Summary */}
          <div className="bg-white rounded-xl shadow-raised p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-primary">
                <CreditCard size={20} />
              </div>
              <h2 className="font-heading text-lg font-bold text-content">
                Payment Summary
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-content-secondary">
                <span>Subtotal</span>
                <span className="font-medium text-content">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-content-secondary">
                <span>Shipping ({order.shippingMethod})</span>
                <span className="font-medium text-content">
                  {Number(order.shipping) === 0
                    ? "Free"
                    : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-content-secondary">
                <span>Tax</span>
                <span className="font-medium text-content">
                  {formatPrice(order.tax)}
                </span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between items-center">
                <span className="font-bold text-content">Total</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Customer & Shipping */}
        <div className="space-y-8">
          {/* Customer */}
          <div className="bg-white rounded-xl shadow-raised p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-primary">
                <User size={20} />
              </div>
              <h2 className="font-heading text-lg font-bold text-content">
                Customer Details
              </h2>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-content-muted uppercase tracking-wider mb-1">
                  Name
                </p>
                <p className="font-medium text-content">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-content-muted uppercase tracking-wider mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="font-medium text-accent hover:underline"
                >
                  {order.customerEmail}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold text-content-muted uppercase tracking-wider mb-1">
                  Account ID
                </p>
                <p className="text-content-secondary font-mono text-xs">
                  {order.userId}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl shadow-raised p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-primary">
                <MapPin size={20} />
              </div>
              <h2 className="font-heading text-lg font-bold text-content">
                Shipping Address
              </h2>
            </div>
            <div className="space-y-1 text-sm text-content-secondary">
              <p className="font-medium text-content">{order.shippingName}</p>
              <p>{order.shippingStreet}</p>
              <p>
                {order.shippingCity}, {order.shippingZip}
              </p>
              <p>{order.shippingCountry}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
