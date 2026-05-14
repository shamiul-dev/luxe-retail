import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    slug:        "fashion",
    name:        "Fashion",
    description: "Premium Apparel & Accessories",
    image:       "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
  },
  {
    slug:        "electronics",
    name:        "Electronics",
    description: "Shop Tech",
    image:       "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
  },
  {
    slug:        "living",
    name:        "Living",
    description: "Discover",
    image:       "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  },
  {
    slug:        "beauty",
    name:        "Beauty",
    description: "Self Care",
    image:       "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
  },
];

export default function CategoryGrid() {
  const [fashion, electronics, living, beauty] = CATEGORIES;

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

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[480px]">

        {/* Fashion — large, spans 2 rows */}
        <Link
          href={`/shop?category=${fashion.slug}`}
          className="relative row-span-2 rounded-2xl overflow-hidden group"
        >
          <Image
            src={fashion.image}
            alt={fashion.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 z-10">
            <p className="font-heading text-xl font-bold text-white">{fashion.name}</p>
            <p className="text-white/75 text-xs mb-3">{fashion.description}</p>
            <span className="inline-flex items-center px-4 py-2 bg-white text-content text-xs font-semibold rounded-lg group-hover:bg-surface-low transition-colors uppercase tracking-wide">
              Explore
            </span>
          </div>
        </Link>

        {/* Electronics — spans 2 cols */}
        <Link
          href={`/shop?category=${electronics.slug}`}
          className="relative col-span-1 md:col-span-2 rounded-2xl overflow-hidden group"
        >
          <Image
            src={electronics.image}
            alt={electronics.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="66vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 z-10">
            <p className="font-heading text-xl font-bold text-white">{electronics.name}</p>
            <p className="text-white/70 text-xs">{electronics.description}</p>
          </div>
        </Link>

        {/* Living */}
        <Link
          href={`/shop?category=${living.slug}`}
          className="relative rounded-2xl overflow-hidden group"
        >
          <Image
            src={living.image}
            alt={living.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5 z-10">
            <p className="font-heading text-base font-bold text-white">{living.name}</p>
            <p className="text-white/70 text-xs">{living.description}</p>
          </div>
        </Link>

        {/* Beauty */}
        <Link
          href={`/shop?category=${beauty.slug}`}
          className="relative rounded-2xl overflow-hidden group"
        >
          <Image
            src={beauty.image}
            alt={beauty.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5 z-10">
            <p className="font-heading text-base font-bold text-white">{beauty.name}</p>
            <p className="text-white/70 text-xs">{beauty.description}</p>
          </div>
        </Link>
      </div>
    </section>
  );
}