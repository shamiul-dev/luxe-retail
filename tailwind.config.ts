import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#000666",
          container: "#1a237e",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#fc820c",
          hover: "#e67300",
          foreground: "#ffffff",
        },
        surface: {
          DEFAULT: "#f8f9fb",
          low: "#f2f4f6",
          container: "#eceef0",
          high: "#e6e8ea",
          highest: "#e0e3e5",
          white: "#ffffff",
        },
        content: {
          DEFAULT: "#191c1e",
          secondary: "#454652",
          muted: "#767683",
        },
        border: {
          DEFAULT: "#eceef0",
          strong: "#c6c5d4",
        },
        error: "#ba1a1a",
      },
      boxShadow: {
        raised:
          "0 1px 3px rgba(26,35,126,0.08), 0 1px 2px rgba(26,35,126,0.06)",
        overlay:
          "0 4px 16px rgba(26,35,126,0.10), 0 2px 6px rgba(26,35,126,0.06)",
        floating:
          "0 8px 32px rgba(26,35,126,0.14), 0 4px 12px rgba(26,35,126,0.08)",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  safelist: [
    // Ensure admin avatar bg is included
    "bg-primary-container",
  ],
  plugins: [],
};
export default config;
