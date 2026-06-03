"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search, Tags } from "lucide-react";
import CategoryFormModal from "./CategoryFormModal";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: string;
}

interface AdminCategoriesProps {
  categories: Category[];
}

export default function AdminCategories({
  categories: initialCategories,
}: AdminCategoriesProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()),
  );

  function handleAddNew() {
    setEditCategory(null);
    setModalOpen(true);
  }

  function handleEdit(category: Category) {
    setEditCategory(category);
    setModalOpen(true);
  }

  function handleModalSave(saved: Category) {
    setCategories((prev) => {
      const exists = prev.find((c) => c.id === saved.id);
      if (exists)
        return prev.map((c) => (c.id === saved.id ? { ...c, ...saved } : c));
      return [saved, ...prev];
    });
    setModalOpen(false);
  }

  async function handleDelete(categoryId: string) {
    if (!confirm("Are you sure you want to delete this category? This might affect products linked to it.")) return;
    
    setDeleting(categoryId);
    try {
      await fetch(`/api/admin/categories/${categoryId}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } catch (e) {
      console.error(e);
      alert("Failed to delete category.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-xs text-content-muted mb-1">
            <span>Catalog</span> <span className="mx-1">/</span>
            <span className="text-content font-medium">Category Management</span>
          </nav>
          <h1 className="font-heading text-2xl font-bold text-content tracking-tight">
            Category Management
          </h1>
          <p className="text-content-muted text-sm mt-1">
            View, add, and edit product categories.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors cursor-pointer"
        >
          <Plus size={16} /> Add New Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-raised overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="flex-1 relative max-w-md">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted"
            />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface-low rounded-lg border border-transparent focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-low">
                {["Category", "Slug", "Description", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-semibold text-content-muted tracking-widest uppercase px-6 py-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-border last:border-0 hover:bg-surface-low transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface-container rounded-lg shrink-0 flex items-center justify-center text-accent">
                        {category.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Tags size={16} />
                        )}
                      </div>
                      <p className="text-sm font-semibold text-content">
                        {category.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-surface-container text-content-secondary text-[10px] font-mono rounded uppercase tracking-wide">
                      {category.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-sm text-content-secondary">
                    {category.description || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-content-secondary hover:text-primary"
                        title="Edit Category"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deleting === category.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer text-content-secondary hover:text-red-500 disabled:opacity-50"
                        title="Delete Category"
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
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-content-muted"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-border text-xs text-content-muted bg-surface-low/50">
          Showing {filtered.length} of {categories.length} categories
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <CategoryFormModal
          category={editCategory}
          onClose={() => setModalOpen(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}
