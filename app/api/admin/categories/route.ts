import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createCategory, getAllCategories } from "@/lib/queries/admin";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await getAllCategories();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, image } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = slugify(name);
  const category = await createCategory({ name, slug, description, image });
  return NextResponse.json({ category });
}
