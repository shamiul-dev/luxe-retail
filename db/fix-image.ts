import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function fix() {
  console.log("Uploading missing perfume image...");

  const result = await cloudinary.uploader.upload(
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
    {
      folder: "luxe-retail/products",
      transformation: [
        { width: 800, height: 800, crop: "fill", gravity: "auto" },
        { quality: "auto", fetch_format: "auto" },
      ],
    },
  );

  await db
    .update(schema.products)
    .set({ images: [result.secure_url] })
    .where(eq(schema.products.slug, "midnight-oud-eau-de-parfum"));

  console.log("✅ Done!", result.secure_url);
  process.exit(0);
}

fix().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
