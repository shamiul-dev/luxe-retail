import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(imageUrl: string): Promise<string> {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: "luxe-retail/products",
    transformation: [
      { width: 800, height: 800, crop: "fill", gravity: "auto" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });
  return result.secure_url;
}

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Free-to-use product images from Unsplash
const PRODUCT_IMAGES: Record<string, string[]> = {
  "signature-wool-blend-overcoat": [
    "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800",
  ],
  "artisan-hand-stitched-loafers": [
    "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800",
  ],
  "classic-structured-leather-tote": [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
  ],
  "italian-cashmere-crewneck": [
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
  ],
  "oxford-cotton-slim-fit-shirt": [
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
  ],
  "aviator-gold-frame-sunglasses": [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
  ],
  "titanium-chronograph-watch": [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
  ],
  "midnight-oud-eau-de-parfum": [
    "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800",
  ],
  "acoustic-pro-series-x": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  ],
  "merino-wool-trench-coat": [
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
  ],
  "leather-chelsea-boots": [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  ],
  "zenith-smart-watch": [
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
  ],
};

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
  const PRODUCTS = [
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
      status: "active" as const,
      isNew: false,
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
      status: "active" as const,
      isNew: true,
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
      status: "active" as const,
      isNew: false,
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
      status: "active" as const,
      isNew: true,
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
      status: "active" as const,
      isNew: false,
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
      status: "active" as const,
      isNew: false,
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
      status: "active" as const,
      isNew: false,
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
      status: "active" as const,
      isNew: false,
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
      status: "active" as const,
      isNew: true,
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
      status: "active" as const,
      isNew: false,
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
      status: "active" as const,
      isNew: false,
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
      status: "active" as const,
      isNew: true,
      colors: ["#191c1e", "#767683", "#f8f9fb"],
      rating: "4.30",
      reviewCount: 38,
      tags: ["smartwatch", "fitness", "wearable"],
    },
  ];

  console.log("  → Uploading images to Cloudinary and inserting products…");

  for (const product of PRODUCTS) {
    // Upload images to Cloudinary
    const imageUrls = PRODUCT_IMAGES[product.slug] ?? [];
    let uploadedImages: string[] = [];

    if (imageUrls.length > 0) {
      try {
        console.log(`    ↑ Uploading images for ${product.name}…`);
        uploadedImages = [];

        for (const url of imageUrls) {
          try {
            const uploaded = await uploadImage(url);
            uploadedImages.push(uploaded);
          } catch (err) {
            console.warn("Image failed:", url);
          }
        }
        console.log(`    ✓ Uploaded ${uploadedImages.length} image(s)`);
      } catch (err) {
        console.warn(`    ⚠ Failed to upload images for ${product.name}:`, err);
      }
    }

    await db
      .insert(schema.products)
      .values({ ...product, images: uploadedImages })
      .onConflictDoNothing();
  }

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
