
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(210, 70%, 50%)",
        accent: "hsl(160, 70%, 45%)",
        bg: "hsl(220, 15%, 95%)",
        surface: "hsl(220, 15%, 100%)",
        "text-primary": "hsl(220, 15%, 15%)",
        "text-secondary": "hsl(220, 15%, 45%)",
        border: "hsl(220, 15%, 85%)",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
      },
      spacing: {
        sm: "8px",
        md: "12px",
        lg: "20px",
      },
      boxShadow: {
        card: "0 8px 24px hsla(220, 15%, 30%, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 300ms cubic-bezier(0.22,1,0.36,1)",
        "slide-up": "slideUp 300ms cubic-bezier(0.22,1,0.36,1)",
      },
    },
  },
  plugins: [],
};

export default config;
