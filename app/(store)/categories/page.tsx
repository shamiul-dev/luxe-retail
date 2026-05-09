import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/db";
import { categories } from "@/db/schema";

export const metadata = { title: "Categories" };
export const revalidate = 60;

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  fashion: { bg: "bg-[#e8d5c4]", text: "text-content" },
  electronics: { bg: "bg-primary-container", text: "text-white" },
  beauty: { bg: "bg-[#f2e8e8]", text: "text-content" },
  living: { bg: "bg-surface-container", text: "text-content" },
  footwear: { bg: "bg-[#e8e4d5]", text: "text-content" },
  accessories: { bg: "bg-[#d5e8e4]", text: "text-content" },
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
          const style = CATEGORY_STYLES[cat.slug] ?? {
            bg: "bg-surface-container",
            text: "text-content",
          };
          return (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`relative rounded-2xl overflow-hidden group ${style.bg} flex flex-col justify-end p-6 h-48 hover:shadow-overlay transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="relative z-10">
                <p className={`font-heading text-xl font-bold ${style.text}`}>
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
