import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const PRODUCT_CATEGORIES: Record<string, string> = {
  "signature-wool-blend-overcoat": "fashion",
  "artisan-hand-stitched-loafers": "footwear",
  "classic-structured-leather-tote": "accessories",
  "italian-cashmere-crewneck": "fashion",
  "oxford-cotton-slim-fit-shirt": "fashion",
  "aviator-gold-frame-sunglasses": "accessories",
  "titanium-chronograph-watch": "accessories",
  "midnight-oud-eau-de-parfum": "beauty",
  "acoustic-pro-series-x": "electronics",
  "merino-wool-trench-coat": "fashion",
  "leather-chelsea-boots": "footwear",
  "zenith-smart-watch": "electronics",
};

async function fixCategories() {
  console.log("🔧 Fixing category IDs...");

  const allCategories = await db.query.categories.findMany();
  const catMap = Object.fromEntries(allCategories.map((c) => [c.slug, c.id]));

  for (const [slug, categorySlug] of Object.entries(PRODUCT_CATEGORIES)) {
    const categoryId = catMap[categorySlug];
    if (!categoryId) {
      console.warn(`  ⚠ Category not found: ${categorySlug}`);
      continue;
    }

    await db
      .update(schema.products)
      .set({ categoryId })
      .where(eq(schema.products.slug, slug));

    console.log(`  ✓ ${slug} → ${categorySlug}`);
  }

  console.log("✅ Done!");
  process.exit(0);
}

fixCategories().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
