import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/db";
import { categories } from "@/db/schema";

export const metadata = { title: "Categories" };
export const revalidate = 60;

// Fallback images matching the ones used in CategoryGrid on the home page
const CATEGORY_IMAGES: Record<string, string> = {
  fashion:      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
  electronics:  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
  living:       "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  beauty:       "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
  footwear:     "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  accessories:  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
};

// Fallback bg color used only when there is no image
const CATEGORY_BG: Record<string, string> = {
  fashion:      "bg-[#e8d5c4]",
  electronics:  "bg-primary-container",
  beauty:       "bg-[#f2e8e8]",
  living:       "bg-surface-container",
  footwear:     "bg-[#e8e4d5]",
  accessories:  "bg-[#d5e8e4]",
};

export default async function CategoriesPage() {
  const allCategories = await db.query.categories.findMany();

  return (
    <div className="max-w-container mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-content tracking-tight">
          Categories
        </h1>
        <p className="text-content-muted text-sm mt-1">
          Browse our curated collections
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {allCategories.map((cat) => {
          const image = cat.image ?? CATEGORY_IMAGES[cat.slug];
          const fallbackBg = CATEGORY_BG[cat.slug] ?? "bg-surface-container";

          return (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`relative rounded-2xl overflow-hidden group ${image ? "" : fallbackBg} flex flex-col justify-end h-48 hover:shadow-overlay transition-all duration-300`}
            >
              {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="relative z-10 p-6">
                <p className="font-heading text-xl font-bold text-white">
                  {cat.name}
                </p>
                <p className="text-white/70 text-xs mb-3">{cat.description}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:gap-3 transition-all">
                  Shop Now <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
