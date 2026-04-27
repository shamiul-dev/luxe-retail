import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { getNewArrivals } from "@/lib/queries/products";

export default async function NewArrivals() {
  const products = await getNewArrivals(5);

  return (
    <section className="max-w-container mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-heading text-3xl font-bold text-content tracking-tight">
            New Arrivals
          </h2>
          <p className="text-content-muted text-sm mt-1">
            The latest additions to our collection
          </p>
        </div>
        <Link
          href="/shop?sort=newest"
          className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-content-muted text-sm">No products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      )}
    </section>
  );
}
