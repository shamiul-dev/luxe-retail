"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/constants";

interface ShopToolbarProps {
  total: number;
  onMobileFilterToggle: () => void;
}

export default function ShopToolbar({
  total,
  onMobileFilterToggle,
}: ShopToolbarProps) {
  const router = useRouter();
  const params = useSearchParams();
  const sort = params.get("sort") ?? "relevance";

  function handleSort(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set("sort", value);
    next.delete("page");
    router.push(`/shop?${next.toString()}`);
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-content-muted">
        Showing{" "}
        <span className="font-semibold text-content">
          1–{Math.min(12, total)}
        </span>{" "}
        of <span className="font-semibold text-content">{total}</span> products
      </p>

      <div className="flex items-center gap-3">
        {/* Mobile filter toggle */}
        <button
          onClick={onMobileFilterToggle}
          className="md:hidden flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-content-secondary hover:bg-surface-low transition-colors cursor-pointer"
        >
          <Filter size={15} /> Filters
        </button>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-content-muted hidden md:inline">
            Sort By:
          </span>
          <select
            value={sort}
            onChange={(e) => handleSort(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-white text-content focus:outline-none focus:border-primary cursor-pointer"
            title="Sort products by"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
