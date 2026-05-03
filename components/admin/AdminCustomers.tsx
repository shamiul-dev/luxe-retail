"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

interface Customer {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AdminCustomersProps {
  customers: Customer[];
}

export default function AdminCustomers({
  customers: initialCustomers,
}: AdminCustomersProps) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalCustomers = customers.length;
  const adminCount = customers.filter((c) => c.role === "admin").length;
  const newThisMonth = customers.filter((c) => {
    const created = new Date(c.createdAt);
    const now = new Date();
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-content tracking-tight">
            Customer Management
          </h1>
          <p className="text-content-muted text-sm mt-1">
            View and manage registered users.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          {
            label: "Total Customers",
            value: totalCustomers,
            color: "text-content",
          },
          {
            label: "New This Month",
            value: newThisMonth,
            color: "text-green-600",
          },
          { label: "Admins", value: adminCount, color: "text-primary" },
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
          <div className="flex-1 relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted"
            />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface-low rounded-lg border border-transparent focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-low">
                {["Customer", "Email", "Role", "Joined", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-semibold text-content-muted tracking-widest uppercase px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => {
                const initials = customer.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <tr
                    key={customer.id}
                    className="border-b border-border last:border-0 hover:bg-surface-low transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-white">
                            {initials}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-content">
                          {customer.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-content-secondary">
                        {customer.email}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                          customer.role === "admin"
                            ? "bg-primary text-white"
                            : "bg-surface-container text-content-secondary",
                        )}
                      >
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-content-secondary">
                        {formatDate(customer.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const newRole =
                              customer.role === "admin" ? "customer" : "admin";
                            setCustomers((prev) =>
                              prev.map((c) =>
                                c.id === customer.id
                                  ? { ...c, role: newRole }
                                  : c,
                              ),
                            );
                            // TODO: wire to API
                          }}
                          className="px-2.5 py-1.5 border border-border rounded-lg text-xs font-medium text-content-secondary hover:bg-surface-low transition-colors cursor-pointer"
                        >
                          {customer.role === "admin"
                            ? "Remove Admin"
                            : "Make Admin"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-content-muted"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-border text-xs text-content-muted">
          Showing {filtered.length} of {totalCustomers} customers
        </div>
      </div>
    </div>
  );
}
