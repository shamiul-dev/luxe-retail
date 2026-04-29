import { Metadata } from "next";
import WishlistContent from "@/components/shop/WishlistContent";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return <WishlistContent />;
}
