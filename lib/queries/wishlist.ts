import { db } from "@/db";
import { wishlistItems } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getWishlistItems(userId: string) {
  return db.query.wishlistItems.findMany({
    where: eq(wishlistItems.userId, userId),
    with: { product: { with: { category: true } } },
  });
}

export async function addToWishlist(userId: string, productId: string) {
  const existing = await db.query.wishlistItems.findFirst({
    where: and(
      eq(wishlistItems.userId, userId),
      eq(wishlistItems.productId, productId),
    ),
  });
  if (existing) return existing;

  const [item] = await db
    .insert(wishlistItems)
    .values({ userId, productId })
    .returning();
  return item;
}

export async function removeFromWishlist(userId: string, productId: string) {
  await db
    .delete(wishlistItems)
    .where(
      and(
        eq(wishlistItems.userId, userId),
        eq(wishlistItems.productId, productId),
      ),
    );
}

export async function isInWishlist(userId: string, productId: string) {
  const item = await db.query.wishlistItems.findFirst({
    where: and(
      eq(wishlistItems.userId, userId),
      eq(wishlistItems.productId, productId),
    ),
  });
  return !!item;
}
