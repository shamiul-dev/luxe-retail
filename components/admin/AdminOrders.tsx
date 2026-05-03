"use client";

import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_MAP, PAYMENT_STATUS_MAP } from "@/lib/constants";

function formatPrice(amount: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { id: string }[];
}

interface AdminOrdersProps {
  orders: Order[];
}

const STATUS_FILTERS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrders({
  orders: initialOrders,
}: AdminOrdersProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [activeFilter, setFilter] = useState("All");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      o.status.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const inTransit = orders.filter((o) => o.status === "shipped").length;

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdating(orderId);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
    setUpdating(null);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-content tracking-tight">
            Order Management
          </h1>
          <p className="text-content-muted text-sm mt-1">
            View and manage customer transactions across all channels.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-content-secondary hover:bg-surface-low transition-colors cursor-pointer">
          Export CSV
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          {
            label: "Pending Orders",
            value: pendingOrders,
            color: "text-content",
          },
          {
            label: "Total Revenue",
            value: formatPrice(totalRevenue),
            color: "text-content",
          },
          { label: "In Transit", value: inTransit, color: "text-blue-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-raised p-5">
            <p className="text-xs font-semibold text-content-muted tracking-widest uppercase mb-2">
              {label}
            </p>
            <p className={cn("font-heading text-2xl font-bold", color)}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-raised overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          {/* Status filters */}
          <div className="flex items-center gap-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                  activeFilter === f
                    ? "bg-primary text-white"
                    : "text-content-secondary hover:bg-surface-container",
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted"
            />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-surface-low rounded-lg border border-transparent focus:outline-none focus:border-primary focus:bg-white transition-all w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-low">
                {[
                  "Order ID",
                  "Date",
                  "Customer Name",
                  "Total Amount",
                  "Payment Status",
                  "Fulfillment",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-semibold text-content-muted tracking-widest uppercase px-4 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const paymentInfo = PAYMENT_STATUS_MAP[order.paymentStatus] ?? {
                  label: order.paymentStatus,
                  classes: "bg-gray-50 text-gray-700 border border-gray-200",
                };
                const statusInfo = ORDER_STATUS_MAP[order.status] ?? {
                  label: order.status,
                  classes: "bg-gray-50 text-gray-700 border border-gray-200",
                };

                return (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-surface-low transition-colors"
                  >
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-primary">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-content-secondary">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {order.customerName
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm text-content font-medium">
                            {order.customerName}
                          </p>
                          <p className="text-[10px] text-content-muted">
                            {order.customerEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-content">
                        {formatPrice(order.total)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                          paymentInfo.classes,
                        )}
                      >
                        {paymentInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            order.status === "delivered"
                              ? "bg-green-500"
                              : order.status === "shipped"
                                ? "bg-blue-500"
                                : order.status === "cancelled"
                                  ? "bg-red-500"
                                  : "bg-yellow-500",
                          )}
                        />
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          disabled={updating === order.id}
                          className="text-xs font-medium text-content bg-transparent border-none outline-none cursor-pointer capitalize disabled:opacity-50"
                        >
                          {[
                            "pending",
                            "processing",
                            "shipped",
                            "delivered",
                            "cancelled",
                          ].map((s) => (
                            <option key={s} value={s} className="capitalize">
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-border rounded-lg text-xs font-medium text-content-secondary hover:bg-surface-low transition-colors cursor-pointer">
                          Update Status
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-content-secondary hover:text-primary">
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-content-muted"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-content-muted">
            Showing 1 to {filtered.length} of {filtered.length} orders
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={cn(
                  "w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                  p === 1
                    ? "bg-primary text-white"
                    : "text-content-secondary hover:bg-surface-container",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
