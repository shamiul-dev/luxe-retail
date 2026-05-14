import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { and, asc, desc, eq, gte, lte, ilike, sql } from "drizzle-orm";
import { ProductFilters } from "@/types";

const PER_PAGE = 12;

export async function getProducts(filters: ProductFilters, page = 1) {
  const conditions = [];

  // Status always active for storefront
  conditions.push(eq(products.status, "active"));

  // Category filter — join on category slug
  if (filters.category) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, filters.category.toLowerCase()),
    });
    if (category) {
      conditions.push(eq(products.categoryId, category.id));
    }
  }

  // Brand filter
  if (filters.brand) {
    conditions.push(eq(products.brand, filters.brand));
  }

  // Price filters
  if (filters.minPrice !== undefined) {
    conditions.push(gte(products.price, String(filters.minPrice)));
  }
  if (filters.maxPrice !== undefined) {
    conditions.push(lte(products.price, String(filters.maxPrice)));
  }

  // Rating filter
  if (filters.rating !== undefined) {
    conditions.push(gte(products.rating, String(filters.rating)));
  }

  // Sort
  let orderBy;
  switch (filters.sort) {
    case "price-asc":
      orderBy = asc(products.price);
      break;
    case "price-desc":
      orderBy = desc(products.price);
      break;
    case "newest":
      orderBy = desc(products.createdAt);
      break;
    case "rating":
      orderBy = desc(products.rating);
      break;
    default:
      orderBy = desc(products.createdAt);
      break;
  }

  // Total count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(and(...conditions));

  // Paginated results
  const rows = await db.query.products.findMany({
    where: and(...conditions),
    orderBy,
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
    with: { category: true },
  });

  return { products: rows, total: count };
}

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: { category: true },
  });
}

export async function getProductById(id: string) {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: { category: true },
  });
}

export async function getNewArrivals(limit = 5) {
  return db.query.products.findMany({
    where: eq(products.status, "active"),
    orderBy: desc(products.createdAt),
    limit,
    with: { category: true },
  });
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4,
) {
  return db.query.products.findMany({
    where: and(
      eq(products.categoryId, categoryId),
      eq(products.status, "active"),
      sql`${products.id} != ${excludeId}`,
    ),
    orderBy: desc(products.rating),
    limit,
    with: { category: true },
  });
}

export async function searchProducts(query: string, limit = 8) {
  return db.query.products.findMany({
    where: and(
      eq(products.status, "active"),
      ilike(products.name, `%${query}%`),
    ),
    limit,
    with: { category: true },
  });
}
