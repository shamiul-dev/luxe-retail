"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductFormModal from "./ProductFormModal";

function formatPrice(amount: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  status: string;
  category?: { name: string } | null;
  description: string;
  comparePrice?: string | null;
  categoryId?: string | null;
  brand?: string | null;
  colors?: string[] | null;
  sizes?: string[] | null;
  tags?: string[] | null;
  isNew: boolean;
}

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
}

export default function AdminProducts({
  products: initialProducts,
  categories,
}: AdminProductsProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  );

  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  function handleAddNew() {
    setEditProduct(null);
    setModalOpen(true);
  }

  function handleEdit(product: Product) {
    setEditProduct(product);
    setModalOpen(true);
  }

  function handleModalSave(saved: Product) {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      if (exists)
        return prev.map((p) => (p.id === saved.id ? { ...p, ...saved } : p));
      return [saved, ...prev];
    });
    setModalOpen(false);
  }

  async function handleDelete(productId: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(productId);
    await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setDeleting(null);
  }

  async function handleStatusToggle(productId: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p)),
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-xs text-content-muted mb-1">
            <span>Catalog</span> <span className="mx-1">/</span>
            <span className="text-content font-medium">Product Management</span>
          </nav>
          <h1 className="font-heading text-2xl font-bold text-content tracking-tight">
            Product Management
          </h1>
          <p className="text-content-muted text-sm mt-1">
            View and manage your store catalog.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors cursor-pointer"
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          {
            label: "Total Products",
            value: totalProducts,
            color: "text-content",
          },
          {
            label: "Low Stock Alerts",
            value: lowStock,
            color: "text-yellow-600",
          },
          { label: "Out of Stock", value: outOfStock, color: "text-red-500" },
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
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface-low rounded-lg border border-transparent focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-content-secondary hover:bg-surface-low transition-colors cursor-pointer">
            <Filter size={14} /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-low">
                <th className="w-8 px-4 py-3">
                  <input
                    type="checkbox"
                    className="accent-primary cursor-pointer"
                    aria-label="Select all products"
                  />
                </th>
                {[
                  "Product",
                  "Category",
                  "Price",
                  "Stock",
                  "Status",
                  "Actions",
                ].map((h) => (
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
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 hover:bg-surface-low transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="accent-primary cursor-pointer"
                      aria-label={`Select ${product.name}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface-container rounded-lg shrink-0 flex items-center justify-center text-[10px] text-content-muted">
                        {product.name.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-content-muted">
                          SKU: {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 bg-surface-container text-content-secondary text-[10px] font-semibold rounded-full uppercase tracking-wide">
                      {product.category?.name ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-content">
                      {formatPrice(product.price)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        product.stock === 0
                          ? "text-red-500"
                          : product.stock <= 10
                            ? "text-yellow-600"
                            : "text-content",
                      )}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        handleStatusToggle(product.id, product.status)
                      }
                      className="flex items-center gap-1.5 cursor-pointer"
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          product.status === "active"
                            ? "bg-green-500"
                            : "bg-surface-highest",
                        )}
                      />
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wide",
                          product.status === "active"
                            ? "text-green-600"
                            : "text-content-muted",
                        )}
                      >
                        {product.status}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-content-secondary hover:text-primary"
                        title="Edit Product"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer text-content-secondary hover:text-red-500 disabled:opacity-50"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-content-muted"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-border text-xs text-content-muted">
          Showing {filtered.length} of {totalProducts} products
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProductFormModal
          product={editProduct}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}
