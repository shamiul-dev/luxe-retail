import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Seeding database…");

  // ── Categories ──────────────────────────────────────────────────────────────
  console.log("  → Inserting categories…");
  const insertedCategories = await db
    .insert(schema.categories)
    .values([
      {
        name: "Fashion",
        slug: "fashion",
        description: "Premium Apparel & Accessories",
      },
      { name: "Electronics", slug: "electronics", description: "Shop Tech" },
      { name: "Beauty", slug: "beauty", description: "Self Care" },
      { name: "Living", slug: "living", description: "Discover" },
      { name: "Footwear", slug: "footwear", description: "Shop Shoes" },
      { name: "Accessories", slug: "accessories", description: "Shop All" },
    ])
    .onConflictDoNothing()
    .returning();

  const catMap = Object.fromEntries(
    insertedCategories.map((c) => [c.slug, c.id]),
  );

  // ── Products ────────────────────────────────────────────────────────────────
  console.log("  → Inserting products…");
  await db
    .insert(schema.products)
    .values([
      {
        name: "Signature Wool Blend Overcoat",
        slug: "signature-wool-blend-overcoat",
        description:
          "A refined overcoat crafted from premium wool blend fabric with a tailored silhouette.",
        price: "895.00",
        categoryId: catMap["fashion"],
        brand: "Luxe Core",
        sku: "OC-001",
        stock: 8,
        status: "active",
        isNew: false,
        images: [],
        colors: ["#191c1e", "#f8f9fb", "#767683"],
        sizes: ["XS", "S", "M", "L", "XL"],
        rating: "4.70",
        reviewCount: 42,
        tags: ["outerwear", "wool", "coat"],
      },
      {
        name: "Artisan Hand-Stitched Loafers",
        slug: "artisan-hand-stitched-loafers",
        description:
          "Handcrafted leather loafers with intricate hand-stitched detailing and leather sole.",
        price: "450.00",
        categoryId: catMap["footwear"],
        brand: "Heritage Craft",
        sku: "FW-002",
        stock: 14,
        status: "active",
        isNew: true,
        images: [],
        colors: ["#191c1e", "#964900"],
        sizes: ["40", "41", "42", "43", "44", "45"],
        rating: "4.50",
        reviewCount: 18,
        tags: ["loafers", "leather", "handmade"],
      },
      {
        name: "Classic Structured Leather Tote",
        slug: "classic-structured-leather-tote",
        description:
          "Full-grain leather tote with a structured silhouette, suede lining, and brass hardware.",
        price: "1200.00",
        categoryId: catMap["accessories"],
        brand: "Luxe Core",
        sku: "AC-003",
        stock: 5,
        status: "active",
        isNew: false,
        images: [],
        colors: ["#191c1e", "#964900", "#f8f9fb"],
        rating: "4.80",
        reviewCount: 124,
        tags: ["bag", "leather", "tote"],
      },
      {
        name: "Italian Cashmere Crewneck",
        slug: "italian-cashmere-crewneck",
        description:
          "Ultra-soft pure cashmere knit sourced from Italian mills. Relaxed fit with ribbed trims.",
        price: "325.00",
        categoryId: catMap["fashion"],
        brand: "Modern Minimalist",
        sku: "KN-004",
        stock: 20,
        status: "active",
        isNew: true,
        images: [],
        colors: ["#f8f9fb", "#191c1e", "#fc820c"],
        sizes: ["XS", "S", "M", "L", "XL"],
        rating: "4.90",
        reviewCount: 67,
        tags: ["knitwear", "cashmere", "sweater"],
      },
      {
        name: "Oxford Cotton Slim Fit Shirt",
        slug: "oxford-cotton-slim-fit-shirt",
        description:
          "Breathable Oxford cotton in a modern slim fit. Mother-of-pearl buttons and a spread collar.",
        price: "185.00",
        categoryId: catMap["fashion"],
        brand: "Modern Minimalist",
        sku: "SH-005",
        stock: 30,
        status: "active",
        isNew: false,
        images: [],
        colors: ["#f8f9fb", "#000666", "#191c1e"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        rating: "4.60",
        reviewCount: 89,
        tags: ["shirt", "cotton", "slim"],
      },
      {
        name: "Aviator Gold-Frame Sunglasses",
        slug: "aviator-gold-frame-sunglasses",
        description:
          "Polarized UV400 lenses in a classic aviator profile with a premium gold-tone frame.",
        price: "295.00",
        categoryId: catMap["accessories"],
        brand: "Heritage Craft",
        sku: "AC-006",
        stock: 12,
        status: "active",
        isNew: false,
        images: [],
        colors: ["#fc820c", "#191c1e"],
        rating: "4.40",
        reviewCount: 31,
        tags: ["sunglasses", "aviator", "gold"],
      },
      {
        name: "Titanium Chronograph Watch",
        slug: "titanium-chronograph-watch",
        description:
          "Swiss-movement chronograph in a lightweight titanium case with sapphire crystal glass.",
        price: "450.00",
        categoryId: catMap["accessories"],
        brand: "Luxe Core",
        sku: "AC-007",
        stock: 6,
        status: "active",
        isNew: false,
        images: [],
        colors: ["#191c1e", "#767683"],
        rating: "4.80",
        reviewCount: 55,
        tags: ["watch", "chronograph", "titanium"],
      },
      {
        name: "Midnight Oud Eau de Parfum",
        slug: "midnight-oud-eau-de-parfum",
        description:
          "A warm, woody oriental fragrance with oud, amber, and sandalwood at its heart.",
        price: "120.00",
        categoryId: catMap["beauty"],
        brand: "Modern Minimalist",
        sku: "BT-008",
        stock: 25,
        status: "active",
        isNew: false,
        images: [],
        rating: "4.70",
        reviewCount: 43,
        tags: ["fragrance", "oud", "parfum"],
      },
      {
        name: "Acoustic Pro Series X Headphones",
        slug: "acoustic-pro-series-x",
        description:
          "Studio-grade active noise cancelling over-ear headphones with 40-hour battery life.",
        price: "299.00",
        categoryId: catMap["electronics"],
        brand: "Luxe Core",
        sku: "EL-009",
        stock: 9,
        status: "active",
        isNew: true,
        images: [],
        colors: ["#191c1e", "#f8f9fb"],
        rating: "4.60",
        reviewCount: 77,
        tags: ["headphones", "anc", "audio"],
      },
      {
        name: "Merino Wool Trench Coat",
        slug: "merino-wool-trench-coat",
        description:
          "Classic double-breasted trench silhouette in fine merino wool with a storm flap.",
        price: "520.00",
        comparePrice: "680.00",
        categoryId: catMap["fashion"],
        brand: "Heritage Craft",
        sku: "OC-010",
        stock: 4,
        status: "active",
        isNew: false,
        images: [],
        colors: ["#964900", "#191c1e", "#f8f9fb"],
        sizes: ["XS", "S", "M", "L", "XL"],
        rating: "4.50",
        reviewCount: 29,
        tags: ["trench", "wool", "coat", "sale"],
      },
      {
        name: "Leather Chelsea Boots",
        slug: "leather-chelsea-boots",
        description:
          "Pull-on Chelsea boots in full-grain calf leather with elastic side panels and stacked heel.",
        price: "380.00",
        categoryId: catMap["footwear"],
        brand: "Heritage Craft",
        sku: "FW-011",
        stock: 11,
        status: "active",
        isNew: false,
        images: [],
        colors: ["#191c1e", "#964900"],
        sizes: ["40", "41", "42", "43", "44", "45"],
        rating: "4.70",
        reviewCount: 61,
        tags: ["boots", "chelsea", "leather"],
      },
      {
        name: "Zenith Smart Watch",
        slug: "zenith-smart-watch",
        description:
          "Premium smartwatch with health tracking, always-on AMOLED display, and 5-day battery.",
        price: "349.00",
        categoryId: catMap["electronics"],
        brand: "Luxe Core",
        sku: "EL-012",
        stock: 5,
        status: "active",
        isNew: true,
        images: [],
        colors: ["#191c1e", "#767683", "#f8f9fb"],
        rating: "4.30",
        reviewCount: 38,
        tags: ["smartwatch", "fitness", "wearable"],
      },
    ])
    .onConflictDoNothing();

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
