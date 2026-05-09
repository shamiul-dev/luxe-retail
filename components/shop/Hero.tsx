import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[580px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600"
          alt="Spring Collection 2024"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-white/60" />
      </div>

      {/* Content */}
      <div className="max-w-container mx-auto px-6 py-24 w-full">
        <div className="max-w-lg flex flex-col gap-6">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">
            Spring Collection 2024
          </p>
          <h1 className="font-heading text-5xl lg:text-6xl font-bold text-content leading-[1.15] tracking-tight">
            Elevate Your
            <br />
            Everyday
            <br />
            Essentials
          </h1>
          <p className="text-content-secondary text-lg leading-relaxed">
            Discover a curated selection of premium goods designed for the
            modern lifestyle. Quality craftsmanship meets timeless design.
          </p>
          <div className="flex items-center gap-4 flex-wrap pt-2">
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 shadow-raised hover:shadow-overlay active:scale-[0.98]"
            >
              Shop Now
            </Link>
            <Link
              href="/shop?sort=newest"
              className="px-8 py-3.5 border border-content text-content text-sm font-semibold rounded-lg hover:bg-white transition-all duration-200 active:scale-[0.98]"
            >
              Explore Trends
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
