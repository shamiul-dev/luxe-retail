import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getReviewsByProduct, addReview } from "@/lib/queries/reviews";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  try {
    const reviews = await getReviewsByProduct(productId);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId, rating, title, body: reviewBody } = body;

    if (!productId || typeof rating !== "number") {
      return NextResponse.json(
        { error: "productId and rating are required" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    const newReview = await addReview(
      session.user.id,
      productId,
      rating,
      title,
      reviewBody,
    );

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Failed to add review:", error);
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 });
  }
}
