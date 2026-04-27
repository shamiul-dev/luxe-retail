import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CategoryGrid() {
  return (
    <section className="max-w-container mx-auto px-6 py-20">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-heading text-3xl font-bold text-content tracking-tight">
            Shop by Category
          </h2>
          <p className="text-content-muted text-sm mt-1">Find exactly what you&apos;re looking for</p>
        </div>
        <Link
          href="/categories"
          className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>

      {/* Asymmetric grid — matches Figma layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[480px]">

        {/* Fashion — large, spans 2 rows */}
        <Link
          href="/shop?category=fashion"
          className="relative row-span-2 rounded-2xl overflow-hidden group bg-[#e8d5c4] flex flex-col justify-end p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          {/* Image placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-52 bg-[#c9a882] rounded-xl opacity-50" />
          </div>
          <div className="relative z-10">
            <p className="font-heading text-xl font-bold text-white">Fashion</p>
            <p className="text-white/75 text-xs mb-3">Premium Apparel &amp; Accessories</p>
            <span className="inline-flex items-center px-4 py-2 bg-white text-content text-xs font-semibold rounded-lg group-hover:bg-surface-low transition-colors">
              Explore
            </span>
          </div>
        </Link>

        {/* Electronics — spans 2 cols on md */}
        <Link
          href="/shop?category=electronics"
          className="relative col-span-1 md:col-span-2 rounded-2xl overflow-hidden group bg-primary-container flex flex-col justify-end p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-end pr-10">
            <div className="w-44 h-28 bg-white/10 rounded-xl" />
          </div>
          <div className="relative z-10">
            <p className="font-heading text-xl font-bold text-white">Electronics</p>
            <p className="text-white/70 text-xs">Shop Tech</p>
          </div>
        </Link>

        {/* Living */}
        <Link
          href="/shop?category=living"
          className="relative rounded-2xl overflow-hidden group bg-surface-container flex flex-col justify-end p-5"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-surface-high rounded-xl opacity-70" />
          </div>
          <div className="relative z-10">
            <p className="font-heading text-base font-bold text-content">Living</p>
            <p className="text-content-muted text-xs">Discover</p>
          </div>
        </Link>

        {/* Beauty */}
        <Link
          href="/shop?category=beauty"
          className="relative rounded-2xl overflow-hidden group bg-[#f2e8e8] flex flex-col justify-end p-5"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-[#e8d5d5] rounded-xl opacity-70" />
          </div>
          <div className="relative z-10">
            <p className="font-heading text-base font-bold text-content">Beauty</p>
            <p className="text-content-muted text-xs">Self Care</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
