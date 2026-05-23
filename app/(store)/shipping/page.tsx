import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Information | Luxe Retail",
};

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl font-bold text-content mb-8 tracking-tight">
        Shipping Information
      </h1>

      <div className="prose prose-sm sm:prose-base text-content-secondary space-y-6">
        <p>
          At Luxe Retail, we aim to provide a seamless delivery experience. We
          partner with top-tier global logistics providers to ensure your luxury
          purchases arrive safely and on time.
        </p>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          Delivery Options & Times
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-content">Standard Shipping:</strong> 3-5
            business days (Free on orders over $500)
          </li>
          <li>
            <strong className="text-content">Express Shipping:</strong> 1-2
            business days ($25 flat rate)
          </li>
          <li>
            <strong className="text-content">Same Day Delivery:</strong>{" "}
            Available in select metropolitan areas for orders placed before 12
            PM local time ($50 flat rate).
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          International Shipping
        </h2>
        <p>
          We ship worldwide. International orders may be subject to customs
          duties and taxes, which are calculated at checkout. Delivery times
          for international orders vary by destination but typically range from
          5-10 business days.
        </p>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          Order Tracking
        </h2>
        <p>
          Once your order has been dispatched, you will receive a shipping
          confirmation email containing your tracking number. You can also track
          your order by logging into your account and navigating to the{" "}
          <a href="/orders" className="text-accent hover:underline">
            Order Tracking
          </a>{" "}
          section.
        </p>
      </div>
    </div>
  );
}
