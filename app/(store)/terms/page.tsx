import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Luxe Retail",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl font-bold text-content mb-8 tracking-tight">
        Terms of Service
      </h1>

      <div className="prose prose-sm sm:prose-base text-content-secondary space-y-6">
        <p>Last updated: October 2023</p>

        <p>
          Welcome to Luxe Retail. Please read these Terms of Service carefully
          before using our website or purchasing our products.
        </p>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using any part of the site, you agree to be bound by
          these Terms of Service. If you do not agree to all the terms and
          conditions of this agreement, then you may not access the website or
          use any services.
        </p>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          2. Products and Services
        </h2>
        <p>
          Certain products or services may be available exclusively online
          through the website. These products or services may have limited
          quantities and are subject to return or exchange only according to
          our Return Policy. We have made every effort to display as accurately
          as possible the colors and images of our products.
        </p>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          3. Pricing and Payment
        </h2>
        <p>
          Prices for our products are subject to change without notice. We
          reserve the right at any time to modify or discontinue the Service
          (or any part or content thereof) without notice at any time. We shall
          not be liable to you or to any third-party for any modification,
          price change, suspension or discontinuance of the Service.
        </p>
      </div>
    </div>
  );
}
