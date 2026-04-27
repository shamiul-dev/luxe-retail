import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-surface-low overflow-hidden">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[560px] py-20">

          {/* Text */}
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold tracking-widest text-accent uppercase">
              Spring Collection 2024
            </p>
            <h1 className="font-heading text-5xl lg:text-6xl font-bold text-content leading-[1.15] tracking-tight">
              Elevate Your<br />Everyday<br />Essentials
            </h1>
            <p className="text-content-secondary text-lg leading-relaxed max-w-md">
              Discover a curated selection of premium goods designed for the modern lifestyle.
              Quality craftsmanship meets timeless design.
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

          {/* Image slot — replace div with <Image> when assets are ready */}
          <div className="relative flex items-center justify-center h-[420px]">
            <div className="w-72 h-[400px] bg-surface-high rounded-2xl flex items-center justify-center text-content-muted text-sm">
              {/* <Image src="/hero.jpg" alt="Hero" fill className="object-cover rounded-2xl" /> */}
              Hero Image
            </div>
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-primary/5 -z-10" />
            <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-accent/8 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
