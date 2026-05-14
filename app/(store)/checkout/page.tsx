import { Metadata } from "next";
import CheckoutContent from "@/components/shop/CheckoutContent";
import { getProductById } from "@/lib/queries/products";

export const metadata: Metadata = { title: "Checkout" };

interface Props {
  searchParams: {
    productId?: string;
    qty?: string;
    color?: string;
    size?: string;
  };
}

export default async function CheckoutPage({ searchParams }: Props) {
  let buyNowItem = null;

  if (searchParams.productId) {
    const product = await getProductById(searchParams.productId);
    if (product) {
      buyNowItem = {
        id: "buy-now-" + product.id,
        productId: product.id,
        product,
        quantity: parseInt(searchParams.qty || "1", 10),
        color: searchParams.color || null,
        size: searchParams.size || null,
      };
    }
  }

  return <CheckoutContent buyNowItem={buyNowItem} />;
}
