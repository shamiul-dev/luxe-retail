"use client";

import {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  Package,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

interface Stats {
  totalSales: number;
  activeOrders: number;
  newCustomers: number;
  totalRevenue: number;
  awaitingShipping: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  total: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface TopProduct {
  productId: string | null;
  name: string;
  revenue: string | null;
  sold: string | null;
}

interface AdminDashboardProps {
  stats: Stats;
  recentOrders: Order[];
  topProducts: TopProduct[];
}

export default function AdminDashboard({
  stats,
  recentOrders,
  topProducts,
}: AdminDashboardProps) {
  const statCards = [
    {
      label: "Total Sales",
      value: formatPrice(stats.totalSales),
      sub: "Paid orders",
      icon: CreditCard,
    },
    {
      label: "Active Orders",
      value: String(stats.activeOrders),
      sub: `${stats.awaitingShipping} awaiting shipping`,
      icon: ShoppingBag,
    },
    {
      label: "Customers",
      value: String(stats.newCustomers),
      sub: "Total registered",
      icon: Users,
    },
    {
      label: "Revenue",
      value: formatPrice(stats.totalRevenue),
      sub: "All time",
      icon: Package,
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-content tracking-tight">
            Overview
          </h1>
          <p className="text-content-muted text-sm mt-1">
            Welcome back, here&apos;s what&apos;s happening with your store
            today.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl shadow-raised p-5">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-content-muted tracking-widest uppercase">
                {label}
              </p>
              <div className="w-9 h-9 bg-surface-low rounded-lg flex items-center justify-center">
                <Icon size={18} className="text-primary" strokeWidth={1.8} />
              </div>
            </div>
            <p className="font-heading text-2xl font-bold text-content mb-1">
              {value}
            </p>
            <div className="flex items-center gap-1">
              <TrendingUp size={13} className="text-green-500" />
              <p className="text-xs text-content-muted">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Overview + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Sales chart */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-raised p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-base font-bold text-content">
              Sales Overview
            </h2>
            <div className="flex items-center gap-4 text-xs text-content-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
                Orders
              </span>
            </div>
          </div>
          {/* Placeholder bar chart */}
          <div className="flex items-end justify-between gap-3 h-44">
            {[
              { week: "Week 1", h: 40, a: 20 },
              { week: "Week 2", h: 65, a: 30 },
              { week: "Week 3", h: 80, a: 40 },
              { week: "Week 4", h: 55, a: 25 },
            ].map(({ week, h, a }) => (
              <div
                key={week}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full flex items-end justify-center gap-1.5"
                  style={{ height: "140px" }}
                >
                  <div
                    className="w-5 bg-surface-container rounded-t-sm"
                    style={{ height: `${a}%` }}
                  />
                  <div
                    className="w-5 bg-primary rounded-t-sm"
                    style={{ height: `${h}%` }}
                  />
                </div>
                <p className="text-[10px] text-content-muted uppercase tracking-wide">
                  {week}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-raised p-6">
          <h2 className="font-heading text-base font-bold text-content mb-5">
            Top Products
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-content-muted">No sales data yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {topProducts.map((p) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-low rounded-lg shrink-0 flex items-center justify-center text-[10px] text-content-muted">
                    {p.name.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-content line-clamp-1">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-content-muted">
                      {p.sold ?? 0} Sold
                    </p>
                  </div>
                  <span className="text-xs font-bold text-content shrink-0">
                    {formatPrice(Number(p.revenue ?? 0))}
                  </span>
                </div>
              ))}
            </div>
          )}
          <a href="/admin/products">
            <button className="w-full mt-5 py-2.5 border border-border rounded-lg text-xs font-semibold text-content-secondary hover:bg-surface-low transition-colors cursor-pointer">
              View All Products
            </button>
          </a>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-raised p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-base font-bold text-content">
            Recent Orders
          </h2>
          <a
            href="/admin/orders"
            className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
          >
            View All History
          </a>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-content-muted py-8 text-center">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Order ID", "Customer", "Date", "Amount", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-semibold text-content-muted tracking-widest uppercase pb-3 pr-4"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const s = ORDER_STATUS_MAP[order.status] ?? {
                    label: order.status,
                    classes: "bg-gray-50 text-gray-700 border border-gray-200",
                  };
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-0 hover:bg-surface-low transition-colors"
                    >
                      <td className="py-4 pr-4">
                        <span className="text-sm font-bold text-primary">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            {order.customerName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <span className="text-sm text-content">
                            {order.customerName}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="text-sm text-content-secondary">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="text-sm font-semibold text-content">
                          {formatPrice(Number(order.total))}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                            s.classes,
                          )}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="p-1 rounded hover:bg-surface-container transition-colors cursor-pointer" aria-label="More options">
                          <MoreVertical
                            size={15}
                            className="text-content-muted"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
