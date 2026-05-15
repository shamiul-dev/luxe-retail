import { Suspense } from "react";
import { getProducts } from "@/lib/queries/products";
import { ProductFilters } from "@/types";
import ShopContent from "@/components/shop/ShopContent";

interface ShopPageProps {
  searchParams: {
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    sort?: string;
    page?: string;
  };
}

export const metadata = { title: "Shop" };

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const filters: ProductFilters = {
    query: searchParams.q,
    category: searchParams.category,
    brand: searchParams.brand,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    rating: searchParams.rating ? Number(searchParams.rating) : undefined,
    sort: searchParams.sort as ProductFilters["sort"],
  };

  const page = Number(searchParams.page ?? 1);
  const { products, total } = await getProducts(filters, page);
  
  let heading = "All Products";
  if (searchParams.q) {
    heading = `Search Results for "${searchParams.q}"`;
  } else if (searchParams.category) {
    heading = searchParams.category;
  }

  return (
    <div className="max-w-container mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-content-muted mb-6">
        <a href="/" className="hover:text-primary transition-colors">
          Home
        </a>
        <span>/</span>
        <a href="/shop" className="hover:text-primary transition-colors">
          Shop
        </a>
        {searchParams.category && !searchParams.q && (
          <>
            <span>/</span>
            <span className="text-content font-medium">
              {searchParams.category}
            </span>
          </>
        )}
        {searchParams.q && (
          <>
            <span>/</span>
            <span className="text-content font-medium">
              Search
            </span>
          </>
        )}
      </nav>

      {/* Page title */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-content tracking-tight">
          {heading}
        </h1>
        <p className="text-content-muted text-sm mt-1">
          {total === 0
            ? "No products found"
            : `Showing ${(page - 1) * 12 + 1}–${Math.min(page * 12, total)} of ${total} products`}
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center text-content-muted text-sm">
            Loading…
          </div>
        }
      >
        <ShopContent products={products as any} total={total} />
      </Suspense>
    </div>
  );
}
