import AuthForm from "@/components/shop/AuthForm";

export const metadata = { title: "Sign In" };

export default function AuthPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left — brand image panel */}
      <div className="hidden md:flex relative bg-primary-container flex-col justify-end p-12">
        {/* Decorative background placeholder — replace with <Image> */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-primary/10" />
        <div className="absolute inset-0 bg-surface-high opacity-20" />
        <div className="relative z-10">
          <p className="font-heading font-bold text-lg tracking-widest text-white uppercase mb-2">
            Luxe Retail
          </p>
          <p className="text-white/80 text-sm leading-relaxed max-w-xs">
            Experience the pinnacle of curated shopping with seamless access to global luxury.
          </p>
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex flex-col justify-center px-8 md:px-16 py-12 bg-white">
        <AuthForm />
        <p className="text-center text-xs text-content-muted mt-8">
          © 2024 Luxe Retail. All Rights Reserved.{" "}
          <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
          {" · "}
          <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
        </p>
      </div>
    </div>
  );
}
