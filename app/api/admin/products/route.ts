import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    name,
    description,
    price,
    comparePrice,
    categoryId,
    brand,
    sku,
    stock,
    status,
    colors,
    sizes,
    tags,
    isNew,
  } = body;

  if (!name || !description || !price || !sku) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const slug = slugify(name);

  const [product] = await db
    .insert(products)
    .values({
      name,
      slug,
      description,
      price: String(price),
      comparePrice: comparePrice ? String(comparePrice) : null,
      categoryId: categoryId || null,
      brand: brand || null,
      sku,
      stock: Number(stock ?? 0),
      status: status ?? "active",
      images: [],
      colors: colors ?? [],
      sizes: sizes ?? [],
      tags: tags ?? [],
      isNew: isNew ?? false,
    })
    .returning();

  return NextResponse.json({ product });
}
