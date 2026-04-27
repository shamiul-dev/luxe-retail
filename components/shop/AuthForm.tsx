"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signIn, signUp } from "@/lib/auth-client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Tab = "login" | "register";

export default function AuthForm() {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (tab === "register" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    if (tab === "login") {
      const { error: err } = await signIn.email({ email, password });
      if (err) {
        setError(err.message ?? "Invalid email or password.");
        setLoading(false);
        return;
      }
    } else {
      const { error: err } = await signUp.email({ name, email, password });
      if (err) {
        setError(err.message ?? "Could not create account. Please try again.");
        setLoading(false);
        return;
      }
    }

    router.push("/");
    router.refresh();
  }

  function switchTab(t: Tab) {
    setTab(t);
    setError(null);
    setName("");
    setEmail("");
    setPassword("");
    setConfirm("");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-border mb-8">
        {(["login", "register"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={cn(
              "flex-1 pb-3 text-sm font-semibold transition-colors cursor-pointer",
              tab === t
                ? "text-primary border-b-2 border-primary"
                : "text-content-muted hover:text-content-secondary",
            )}
          >
            {t === "login" ? "Login" : "Create Account"}
          </button>
        ))}
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-content">
          {tab === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-content-muted text-sm mt-1">
          {tab === "login"
            ? "Please enter your details to continue."
            : "Fill in your details to get started."}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {tab === "register" && (
          <Input
            id="name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-medium text-content-secondary tracking-wide"
            >
              Password
            </label>
            {tab === "login" && (
              <a
                href="/auth/reset"
                className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                Forgot Password?
              </a>
            )}
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-3 rounded-lg bg-surface-low border border-transparent text-content placeholder-content-muted text-sm transition-all duration-200 focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {tab === "register" && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm"
              className="text-xs font-medium text-content-secondary tracking-wide"
            >
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-lg bg-surface-low border border-transparent text-content placeholder-content-muted text-sm transition-all duration-200 focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
          </div>
        )}

        {tab === "login" && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border-strong accent-primary cursor-pointer"
            />
            <span className="text-sm text-content-secondary">
              Keep me logged in
            </span>
          </label>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          className="mt-2 tracking-widest uppercase"
          disabled={loading}
        >
          {loading
            ? "Please wait…"
            : tab === "login"
              ? "Sign In"
              : "Create Account"}
        </Button>
      </form>
    </div>
  );
}
