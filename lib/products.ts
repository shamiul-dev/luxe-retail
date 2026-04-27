import { Product, ProductFilters } from "@/types";

export const ALL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Signature Wool Blend Overcoat",
    slug: "signature-wool-blend-overcoat",
    description: "A refined overcoat crafted from premium wool blend.",
    price: 895,
    category: "Outerwear",
    brand: "Luxe Core",
    sku: "OC-001",
    stock: 8,
    status: "active",
    images: [],
    rating: 4.7,
    reviewCount: 42,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Artisan Hand-Stitched Loafers",
    slug: "artisan-hand-stitched-loafers",
    description: "Handcrafted leather loafers with hand-stitched detailing.",
    price: 450,
    category: "Footwear",
    brand: "Heritage Craft",
    sku: "FW-002",
    stock: 14,
    status: "active",
    images: [],
    rating: 4.5,
    reviewCount: 18,
    createdAt: "2024-01-02",
    isNew: true,
  },
  {
    id: "3",
    name: "Classic Structured Leather Tote",
    slug: "classic-structured-leather-tote",
    description: "Full-grain leather tote with structured silhouette.",
    price: 1200,
    category: "Accessories",
    brand: "Luxe Core",
    sku: "AC-003",
    stock: 5,
    status: "active",
    images: [],
    rating: 4.8,
    reviewCount: 124,
    createdAt: "2024-01-03",
  },
  {
    id: "4",
    name: "Italian Cashmere Crewneck",
    slug: "italian-cashmere-crewneck",
    description: "Ultra-soft pure cashmere knit from Italian mills.",
    price: 325,
    category: "Knitwear",
    brand: "Modern Minimalist",
    sku: "KN-004",
    stock: 20,
    status: "active",
    images: [],
    rating: 4.9,
    reviewCount: 67,
    createdAt: "2024-01-04",
    isNew: true,
  },
  {
    id: "5",
    name: "Oxford Cotton Slim Fit Shirt",
    slug: "oxford-cotton-slim-fit-shirt",
    description: "Breathable Oxford cotton in a modern slim fit.",
    price: 185,
    category: "Shirts",
    brand: "Modern Minimalist",
    sku: "SH-005",
    stock: 30,
    status: "active",
    images: [],
    rating: 4.6,
    reviewCount: 89,
    createdAt: "2024-01-05",
  },
  {
    id: "6",
    name: "Aviator Gold-Frame Sunglasses",
    slug: "aviator-gold-frame-sunglasses",
    description: "Polarized lenses in a classic aviator gold frame.",
    price: 295,
    category: "Accessories",
    brand: "Heritage Craft",
    sku: "AC-006",
    stock: 12,
    status: "active",
    images: [],
    rating: 4.4,
    reviewCount: 31,
    createdAt: "2024-01-06",
  },
  {
    id: "7",
    name: "Titanium Chronograph Watch",
    slug: "titanium-chronograph-watch",
    description: "Swiss-movement chronograph in a titanium case.",
    price: 450,
    category: "Accessories",
    brand: "Luxe Core",
    sku: "AC-007",
    stock: 6,
    status: "active",
    images: [],
    rating: 4.8,
    reviewCount: 55,
    createdAt: "2024-01-07",
  },
  {
    id: "8",
    name: "Midnight Oud Eau de Parfum",
    slug: "midnight-oud-eau-de-parfum",
    description: "A warm, woody oriental fragrance with oud at its heart.",
    price: 120,
    category: "Beauty",
    brand: "Modern Minimalist",
    sku: "BT-008",
    stock: 25,
    status: "active",
    images: [],
    rating: 4.7,
    reviewCount: 43,
    createdAt: "2024-01-08",
  },
  {
    id: "9",
    name: "Acoustic Pro Series X Headphones",
    slug: "acoustic-pro-series-x",
    description: "Studio-grade noise cancelling over-ear headphones.",
    price: 299,
    category: "Electronics",
    brand: "Luxe Core",
    sku: "EL-009",
    stock: 9,
    status: "active",
    images: [],
    rating: 4.6,
    reviewCount: 77,
    createdAt: "2024-01-09",
    isNew: true,
  },
  {
    id: "10",
    name: "Merino Wool Trench Coat",
    slug: "merino-wool-trench-coat",
    description: "Classic trench silhouette in fine merino wool.",
    price: 520,
    comparePrice: 680,
    category: "Outerwear",
    brand: "Heritage Craft",
    sku: "OC-010",
    stock: 4,
    status: "active",
    images: [],
    rating: 4.5,
    reviewCount: 29,
    createdAt: "2024-01-10",
  },
  {
    id: "11",
    name: "Leather Chelsea Boots",
    slug: "leather-chelsea-boots",
    description: "Pull-on Chelsea boots in full-grain calf leather.",
    price: 380,
    category: "Footwear",
    brand: "Heritage Craft",
    sku: "FW-011",
    stock: 11,
    status: "active",
    images: [],
    rating: 4.7,
    reviewCount: 61,
    createdAt: "2024-01-11",
  },
  {
    id: "12",
    name: "Zenith Smart Watch",
    slug: "zenith-smart-watch",
    description: "Premium smartwatch with health tracking and AMOLED display.",
    price: 349,
    category: "Electronics",
    brand: "Luxe Core",
    sku: "EL-012",
    stock: 5,
    status: "active",
    images: [],
    rating: 4.3,
    reviewCount: 38,
    createdAt: "2024-01-12",
    isNew: true,
  },
];

export const BRANDS = ["Luxe Core", "Heritage Craft", "Modern Minimalist"];
export const FILTER_CATEGORIES = [
  "Apparel",
  "Accessories",
  "Leather Goods",
  "Electronics",
  "Beauty",
  "Footwear",
];
export const COLORS = ["#191c1e", "#f8f9fb", "#fc820c", "#000666", "#767683"];

export function filterProducts(filters: ProductFilters): Product[] {
  let products = [...ALL_PRODUCTS];

  if (filters.category) {
    products = products.filter(
      (p) => p.category.toLowerCase() === filters.category!.toLowerCase(),
    );
  }
  if (filters.brand) {
    products = products.filter((p) => p.brand === filters.brand);
  }
  if (filters.minPrice !== undefined) {
    products = products.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.rating !== undefined) {
    products = products.filter((p) => (p.rating ?? 0) >= filters.rating!);
  }

  switch (filters.sort) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      products.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "rating":
      products.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
  }

  return products;
}
