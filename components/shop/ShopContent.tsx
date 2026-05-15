"use client";

import { useState } from "react";
import { X } from "lucide-react";
import ShopToolbar from "./ShopToolbar";
import ShopFilters from "./ShopFilters";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";
import { Product } from "@/db/schema";

interface ShopContentProps {
  products: Product[];
  total: number;
}

export default function ShopContent({ products, total }: ShopContentProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <>
      <div className="flex gap-10">
        {/* Sidebar — desktop */}
        <div className="hidden md:block w-52 shrink-0">
          <ShopFilters />
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <ShopToolbar
            total={total}
            onMobileFilterToggle={() => setMobileFiltersOpen(true)}
          />
          <ProductGrid products={products} />
          <Pagination total={total} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-floating overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-content">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface-low transition-colors cursor-pointer"
              >
                <X size={20} className="text-content-secondary" />
              </button>
            </div>
            <ShopFilters />
          </div>
        </div>
      )}
    </>
  );
}
