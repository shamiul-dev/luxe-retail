"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { BRANDS, FILTER_CATEGORIES, COLORS } from "@/lib/products";
import { Star } from "lucide-react";

const PRICE_MAX = 5000;

export default function ShopFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const category = params.get("category") ?? "";
  const brand = params.get("brand") ?? "";
  const minPrice = Number(params.get("minPrice") ?? 0);
  const maxPrice = Number(params.get("maxPrice") ?? PRICE_MAX);
  const rating = Number(params.get("rating") ?? 0);

  const update = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      next.delete("page");
      router.push(`/shop?${next.toString()}`);
    },
    [params, router],
  );

  function clearAll() {
    router.push("/shop");
  }

  const hasFilters =
    category || brand || minPrice > 0 || maxPrice < PRICE_MAX || rating > 0;

  return (
    <aside className="w-full flex flex-col gap-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold text-content uppercase tracking-widest">
          Filters
        </h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-accent hover:text-accent-hover font-semibold transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-content tracking-widest uppercase">
          Category
        </p>
        <ul className="flex flex-col gap-2">
          <li>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={category === ""}
                onChange={() => update("category", null)}
                className="w-4 h-4 rounded border-border-strong accent-primary cursor-pointer"
              />
              <span
                className={cn(
                  "text-sm transition-colors",
                  category === ""
                    ? "text-content font-semibold"
                    : "text-content-secondary group-hover:text-content",
                )}
              >
                All Products
              </span>
            </label>
          </li>
          {FILTER_CATEGORIES.map((cat) => (
            <li key={cat}>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={category === cat}
                  onChange={() =>
                    update("category", category === cat ? null : cat)
                  }
                  className="w-4 h-4 rounded border-border-strong accent-primary cursor-pointer"
                />
                <span
                  className={cn(
                    "text-sm transition-colors",
                    category === cat
                      ? "text-content font-semibold"
                      : "text-content-secondary group-hover:text-content",
                  )}
                >
                  {cat}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px bg-border" />

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-content tracking-widest uppercase">
          Price Range
        </p>
        <input
          type="range"
          min={0}
          max={PRICE_MAX}
          step={50}
          value={maxPrice}
          onChange={(e) => update("maxPrice", e.target.value)}
          className="w-full accent-primary cursor-pointer"
          placeholder="Max Price"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-content-muted">$0</span>
          <span className="text-xs font-semibold text-content">
            ${maxPrice.toLocaleString()}
            {maxPrice >= PRICE_MAX ? "+" : ""}
          </span>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Brand */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-content tracking-widest uppercase">
          Brand
        </p>
        <ul className="flex flex-col gap-2">
          {BRANDS.map((b) => (
            <li key={b}>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="brand"
                  checked={brand === b}
                  onChange={() => update("brand", brand === b ? null : b)}
                  className="w-4 h-4 border-border-strong accent-primary cursor-pointer"
                />
                <span
                  className={cn(
                    "text-sm transition-colors",
                    brand === b
                      ? "text-content font-semibold"
                      : "text-content-secondary group-hover:text-content",
                  )}
                >
                  {b}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px bg-border" />

      {/* Colors */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-content tracking-widest uppercase">
          Colors
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => {}}
              title={color}
              className="w-7 h-7 rounded-full border-2 border-white shadow-raised hover:scale-110 transition-transform cursor-pointer"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Rating */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-content tracking-widest uppercase">
          Rating
        </p>
        <button
          onClick={() => update("rating", rating === 4 ? null : "4")}
          className={cn(
            "flex items-center gap-1.5 text-sm cursor-pointer transition-colors",
            rating === 4
              ? "text-content font-semibold"
              : "text-content-secondary hover:text-content",
          )}
        >
          {[1, 2, 3, 4].map((i) => (
            <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
          ))}
          <span className="ml-1">& Up</span>
        </button>
      </div>
    </aside>
  );
}
