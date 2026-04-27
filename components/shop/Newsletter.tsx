"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!email) return;
    // TODO: connect to Resend / email service
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="max-w-container mx-auto px-6 pb-16">
      <div className="bg-primary rounded-2xl px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-10">

        {/* Text */}
        <div className="max-w-sm">
          <h2 className="font-heading text-3xl font-bold text-white leading-tight mb-3">
            Join the Inner Circle
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Get early access to new drops, exclusive sales, and curated style tips directly in your inbox.
          </p>
        </div>

        {/* Form */}
        <div className="w-full md:w-auto md:min-w-[380px]">
          {submitted ? (
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-6 py-4">
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-white text-sm font-medium">You&apos;re in! Welcome to the Inner Circle.</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-200"
              />
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 shrink-0 cursor-pointer active:scale-[0.98]"
              >
                Subscribe
              </button>
            </div>
          )}
          <p className="text-white/40 text-xs mt-3">No spam. Unsubscribe any time.</p>
        </div>
      </div>
    </section>
  );
}
