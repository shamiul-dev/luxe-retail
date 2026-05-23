import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Luxe Retail",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl font-bold text-content mb-8 tracking-tight">
        Privacy Policy
      </h1>

      <div className="prose prose-sm sm:prose-base text-content-secondary space-y-6">
        <p>Last updated: October 2023</p>

        <p>
          At Luxe Retail, we respect your privacy and are committed to protecting
          your personal data. This privacy policy will inform you as to how we
          look after your personal data when you visit our website and tell you
          about your privacy rights.
        </p>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          1. The Data We Collect
        </h2>
        <p>
          We may collect, use, store and transfer different kinds of personal
          data about you which we have grouped together as follows:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Identity Data</strong> includes first name, last name, username.
          </li>
          <li>
            <strong>Contact Data</strong> includes billing address, delivery
            address, email address, and telephone numbers.
          </li>
          <li>
            <strong>Financial Data</strong> includes payment card details.
          </li>
          <li>
            <strong>Transaction Data</strong> includes details about payments to
            and from you and other details of products you have purchased.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          2. How We Use Your Data
        </h2>
        <p>
          We will only use your personal data when the law allows us to. Most
          commonly, we will use your personal data to process your orders,
          manage your account, and provide customer support.
        </p>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          3. Data Security
        </h2>
        <p>
          We have put in place appropriate security measures to prevent your
          personal data from being accidentally lost, used or accessed in an
          unauthorized way, altered or disclosed. In addition, we limit access
          to your personal data to those employees, agents, contractors and
          other third parties who have a business need to know.
        </p>
      </div>
    </div>
  );
}
