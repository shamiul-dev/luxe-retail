export const TAX_RATE = 0.08;
export const FREE_SHIPPING_THRESHOLD = 150;

export const SHIPPING_METHODS = [
  { id: "standard", label: "Standard Delivery", description: "3-5 business days", price: 0 },
  { id: "express",  label: "Express Courier",   description: "Next day delivery",  price: 25 },
] as const;

export const SORT_OPTIONS = [
  { value: "relevance",  label: "Relevance" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest",     label: "Newest" },
  { value: "rating",     label: "Top Rated" },
] as const;

export const CATEGORIES = [
  { id: "fashion",     name: "Fashion",     slug: "fashion",     description: "Premium Apparel & Accessories" },
  { id: "electronics", name: "Electronics", slug: "electronics", description: "Shop Tech" },
  { id: "living",      name: "Living",      slug: "living",      description: "Discover" },
  { id: "beauty",      name: "Beauty",      slug: "beauty",      description: "Self Care" },
  { id: "accessories", name: "Accessories", slug: "accessories", description: "Shop All" },
  { id: "footwear",    name: "Footwear",    slug: "footwear",    description: "Shop Shoes" },
] as const;

export const ORDER_STATUS_MAP: Record<string, { label: string; classes: string }> = {
  pending:    { label: "Pending",    classes: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
  processing: { label: "Processing", classes: "bg-orange-50 text-orange-700 border border-orange-200" },
  shipped:    { label: "Shipped",    classes: "bg-blue-50 text-blue-700 border border-blue-200" },
  delivered:  { label: "Delivered",  classes: "bg-green-50 text-green-700 border border-green-200" },
  cancelled:  { label: "Cancelled",  classes: "bg-red-50 text-red-700 border border-red-200" },
};

export const PAYMENT_STATUS_MAP: Record<string, { label: string; classes: string }> = {
  paid:       { label: "Paid",       classes: "bg-green-50 text-green-700 border border-green-200" },
  processing: { label: "Processing", classes: "bg-orange-50 text-orange-700 border border-orange-200" },
  failed:     { label: "Failed",     classes: "bg-red-50 text-red-700 border border-red-200" },
  refunded:   { label: "Refunded",   classes: "bg-gray-50 text-gray-700 border border-gray-200" },
};
