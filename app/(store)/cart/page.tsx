import { Metadata } from "next";
import CartContent from "@/components/shop/CartContent";

export const metadata: Metadata = { title: "Shopping Bag" };

export default function CartPage() {
  return <CartContent />;
}
