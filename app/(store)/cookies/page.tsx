import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Luxe Retail",
};

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl font-bold text-content mb-8 tracking-tight">
        Cookie Policy
      </h1>

      <div className="prose prose-sm sm:prose-base text-content-secondary space-y-6">
        <p>
          This Cookie Policy explains how Luxe Retail uses cookies and similar
          technologies to recognize you when you visit our website. It explains
          what these technologies are and why we use them, as well as your
          rights to control our use of them.
        </p>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          What are cookies?
        </h2>
        <p>
          Cookies are small data files that are placed on your computer or
          mobile device when you visit a website. Cookies are widely used by
          website owners in order to make their websites work, or to work more
          efficiently, as well as to provide reporting information.
        </p>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          Why do we use cookies?
        </h2>
        <p>
          We use first and third-party cookies for several reasons. Some
          cookies are required for technical reasons in order for our website
          to operate, and we refer to these as "essential" or "strictly
          necessary" cookies. Other cookies also enable us to track and target
          the interests of our users to enhance the experience on our website.
        </p>

        <h2 className="text-xl font-semibold text-content mt-8 mb-4">
          Managing Cookies
        </h2>
        <p>
          You have the right to decide whether to accept or reject cookies. You
          can exercise your cookie rights by setting your preferences in the
          Cookie Consent Manager. The Cookie Consent Manager allows you to
          select which categories of cookies you accept or reject. Essential
          cookies cannot be rejected as they are strictly necessary to provide
          you with services.
        </p>
      </div>
    </div>
  );
}
