"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  comparePrice?: string | null;
  categoryId?: string | null;
  brand?: string | null;
  sku: string;
  stock: number;
  status: string;
  colors?: string[] | null;
  sizes?: string[] | null;
  tags?: string[] | null;
  isNew: boolean;
}

interface ProductFormModalProps {
  product?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (product: Product) => void;
}

export default function ProductFormModal({
  product,
  categories,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    comparePrice: product?.comparePrice ?? "",
    categoryId: product?.categoryId ?? "",
    brand: product?.brand ?? "",
    sku: product?.sku ?? "",
    stock: String(product?.stock ?? 0),
    status: product?.status ?? "active",
    isNew: product?.isNew ?? false,
  });

  const [colors, setColors] = useState<string[]>(product?.colors ?? []);
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const [tags, setTags] = useState<string[]>(product?.tags ?? []);
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      ...form,
      price: form.price,
      comparePrice: form.comparePrice || null,
      categoryId: form.categoryId || null,
      brand: form.brand || null,
      stock: Number(form.stock),
      colors,
      sizes,
      tags,
    };

    const url = isEdit
      ? `/api/admin/products/${product!.id}`
      : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to save product.");
      setSaving(false);
      return;
    }

    setSaving(false);
    onSave(data.product);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-floating w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-white z-10">
          <h2 className="font-heading text-lg font-bold text-content">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-low transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} className="text-content-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Product Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Italian Cashmere Crewneck"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-content-secondary tracking-wide block mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Product description..."
                required
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-surface-low border border-transparent text-content placeholder-content-muted text-sm transition-all duration-200 focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 resize-none"
              />
            </div>
            <Input
              label="Price ($)"
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
            <Input
              label="Compare Price ($)"
              name="comparePrice"
              type="number"
              step="0.01"
              value={form.comparePrice}
              onChange={handleChange}
              placeholder="0.00 (optional)"
            />
            <Input
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="e.g. KN-004"
              required
            />
            <Input
              label="Stock"
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              required
            />
            <Input
              label="Brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Luxe Core"
            />

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-content-secondary tracking-wide">
                Category
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-surface-low border border-transparent text-content text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                title="Select category"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-content-secondary tracking-wide">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-surface-low border border-transparent text-content text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                title="Select product status"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Is New */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isNew"
              checked={form.isNew}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-primary cursor-pointer"
            />
            <span className="text-sm text-content-secondary">
              Mark as New Arrival
            </span>
          </label>

          {/* Colors */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-content-secondary tracking-wide">
              Colors
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                placeholder="#191c1e or color name"
                className="flex-1 px-4 py-2 rounded-lg bg-surface-low border border-transparent text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  if (colorInput) {
                    setColors([...colors, colorInput]);
                    setColorInput("");
                  }
                }}
                className="px-3 py-2 bg-surface-container rounded-lg hover:bg-surface-high transition-colors cursor-pointer"
                title="Add Color"
              >
                <Plus size={16} className="text-content-secondary" />
              </button>
            </div>
            {colors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {colors.map((c, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-full text-xs text-content-secondary"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ backgroundColor: c }}
                    />
                    {c}
                    <button
                      type="button"
                      onClick={() =>
                        setColors(colors.filter((_, j) => j !== i))
                      }
                      className="cursor-pointer hover:text-red-500"
                      title="Remove Color"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sizes */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-content-secondary tracking-wide">
              Sizes
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                placeholder="e.g. S, M, L or 42"
                className="flex-1 px-4 py-2 rounded-lg bg-surface-low border border-transparent text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  if (sizeInput) {
                    setSizes([...sizes, sizeInput]);
                    setSizeInput("");
                  }
                }}
                className="px-3 py-2 bg-surface-container rounded-lg hover:bg-surface-high transition-colors cursor-pointer"
                title="Add Size"
              >
                <Plus size={16} className="text-content-secondary" />
              </button>
            </div>
            {sizes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {sizes.map((s, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-full text-xs text-content-secondary"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => setSizes(sizes.filter((_, j) => j !== i))}
                      className="cursor-pointer hover:text-red-500"
                      title="Remove Size"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-content-secondary tracking-wide">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. leather, summer"
                className="flex-1 px-4 py-2 rounded-lg bg-surface-low border border-transparent text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  if (tagInput) {
                    setTags([...tags, tagInput]);
                    setTagInput("");
                  }
                }}
                className="px-3 py-2 bg-surface-container rounded-lg hover:bg-surface-high transition-colors cursor-pointer"
                title="Add Tag"
              >
                <Plus size={16} className="text-content-secondary" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((t, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-full text-xs text-content-secondary"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((_, j) => j !== i))}
                      className="cursor-pointer hover:text-red-500"
                      title="Remove Tag"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
