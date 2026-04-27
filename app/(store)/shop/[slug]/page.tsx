import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";
import ProductDetail from "@/components/shop/ProductDetail";
import ProductCard from "@/components/shop/ProductCard";

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = product.categoryId
    ? await getRelatedProducts(product.categoryId, product.id, 4)
    : [];

  return (
    <div className="max-w-container mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-content-muted mb-8">
        <a href="/" className="hover:text-primary transition-colors">
          Home
        </a>
        <span>/</span>
        <a href="/shop" className="hover:text-primary transition-colors">
          Shop
        </a>
        {product.category && (
          <>
            <span>/</span>
            <a
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-primary transition-colors capitalize"
            >
              {product.category.name}
            </a>
          </>
        )}
        <span>/</span>
        <span className="text-content font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Product Detail */}
      <ProductDetail product={product as any} />

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-20">
          <div className="mb-2">
            <p className="text-xs font-semibold text-accent tracking-widest uppercase">
              Curated For You
            </p>
            <h2 className="font-heading text-2xl font-bold text-content mt-1">
              You Might Also Like
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
