"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  total: number;
  perPage?: number;
}

export default function Pagination({ total, perPage = 12 }: PaginationProps) {
  const router = useRouter();
  const params = useSearchParams();
  const current = Number(params.get("page") ?? 1);
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(page));
    router.push(`/shop?${next.toString()}`);
  }

  // Build visible page numbers with ellipsis
  function getPages(): (number | "…")[] {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, "…", totalPages];
    if (current >= totalPages - 2)
      return [1, "…", totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", current, "…", totalPages];
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-12">
      {/* Prev */}
      <button
        onClick={() => goTo(current - 1)}
        disabled={current === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-content-secondary hover:bg-surface-low disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Pages */}
      {getPages().map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-content-muted text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p as number)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors cursor-pointer",
              p === current
                ? "bg-primary text-white shadow-raised"
                : "border border-border text-content-secondary hover:bg-surface-low",
            )}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => goTo(current + 1)}
        disabled={current === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-content-secondary hover:bg-surface-low disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
