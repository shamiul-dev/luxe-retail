import { db } from "@/db";
import { reviews, products, users } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function getReviewsByProduct(productId: string) {
  return db
    .select({
      id: reviews.id,
      productId: reviews.productId,
      userId: reviews.userId,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      createdAt: reviews.createdAt,
      userName: users.name,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));
}

export async function getUserReviewForProduct(
  userId: string,
  productId: string,
) {
  return db.query.reviews.findFirst({
    where: (r, { and, eq }) =>
      and(eq(r.userId, userId), eq(r.productId, productId)),
  });
}

export async function addReview(
  userId: string,
  productId: string,
  rating: number,
  title: string | null,
  body: string | null,
) {
  const [newReview] = await db
    .insert(reviews)
    .values({ userId, productId, rating, title, body })
    .returning();

  // Recalculate aggregate rating & count on the product
  const [agg] = await db
    .select({
      avg: sql<string>`avg(${reviews.rating})::numeric(3,2)`,
      count: sql<number>`count(*)::int`,
    })
    .from(reviews)
    .where(eq(reviews.productId, productId));

  await db
    .update(products)
    .set({
      rating: agg.avg ?? "0",
      reviewCount: agg.count,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));

  // Fetch the user name so the caller can display it immediately
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { name: true },
  });

  return { ...newReview, userName: user?.name ?? "Customer" };
}
