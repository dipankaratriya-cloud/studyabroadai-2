import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        "background-light": "#f8fafc",
        "background-dark": "#0f172a",
        "surface-light": "#ffffff",
        "surface-dark": "#1e293b",
        "text-primary-light": "#0f172a",
        "text-primary-dark": "#f1f5f9",
        "text-secondary-light": "#64748b",
        "text-secondary-dark": "#94a3b8",
        "border-light": "#e2e8f0",
        "border-dark": "#334155",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
