"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: string;
}

interface CategoryFormModalProps {
  category?: Category | null;
  onClose: () => void;
  onSave: (category: Category) => void;
}

export default function CategoryFormModal({
  category,
  onClose,
  onSave,
}: CategoryFormModalProps) {
  const isEdit = !!category;

  const [form, setForm] = useState({
    name: category?.name ?? "",
    description: category?.description ?? "",
    image: category?.image ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description || null,
      image: form.image || null,
    };

    const url = isEdit
      ? `/api/admin/categories/${category!.id}`
      : "/api/admin/categories";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to save category.");
        return;
      }

      onSave(data.category);
    } catch (e) {
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-floating w-full max-w-lg overflow-hidden mx-4">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-white">
          <h2 className="font-heading text-lg font-bold text-content">
            {isEdit ? "Edit Category" : "Add New Category"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-low transition-colors cursor-pointer"
          >
            <X size={18} className="text-content-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Category Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Activewear"
            required
          />

          <div>
            <label className="text-xs font-medium text-content-secondary tracking-wide block mb-1.5">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="A brief description of this category..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-surface-low border border-transparent text-content placeholder-content-muted text-sm transition-all focus:outline-none focus:border-primary focus:bg-white resize-none"
            />
          </div>

          <Input
            label="Image URL (Optional)"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
          />

          <div className="flex items-center gap-3 pt-4 border-t border-border mt-2">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Category"}
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
