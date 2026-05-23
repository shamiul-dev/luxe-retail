import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Exchanges | Luxe Retail",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl font-bold text-content mb-8 tracking-tight">
        Returns & Exchanges
      </h1>

      <div className="prose prose-sm sm:prose-base text-content-secondary space-y-6">
        <p>
          We want you to be completely satisfied with your Luxe Retail
          purchase. If for any reason you are not, we gladly accept returns and
          exchanges within 30 days of delivery.
        </p>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          Return Policy
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Items must be returned within 30 days of the delivery date.</li>
          <li>
            Items must be unworn, unwashed, undamaged, and in their original
            packaging with all tags attached.
          </li>
          <li>
            Footwear must include the original shoe box in its original condition.
          </li>
          <li>
            Personalized items, final sale items, and certain accessories
            (e.g., pierced jewelry) cannot be returned or exchanged.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          How to Initiate a Return
        </h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Log into your account and navigate to your{" "}
            <a href="/orders" className="text-accent hover:underline">
              Order History
            </a>
            .
          </li>
          <li>Select the order containing the item(s) you wish to return.</li>
          <li>Click "Request Return" and follow the prompts.</li>
          <li>
            Print the provided prepaid return shipping label and attach it to
            your package.
          </li>
          <li>Drop off the package at your nearest courier location.</li>
        </ol>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          Refund Processing
        </h2>
        <p>
          Once we receive and inspect your return, we will process your refund
          to your original payment method. Please allow 5-7 business days for
          the refund to appear on your statement. A return shipping fee of $10
          will be deducted from your refund amount.
        </p>
      </div>
    </div>
  );
}
