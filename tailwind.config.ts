import type { Config } from "tailwindcss";
import { isChristmasSeason } from "./app/utils/dates";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Teal - modern, trustworthy, professional
        // accent: "rgb(45, 212, 191)",

        // Blue - classic, reliable, tech-focused
        // accent: "rgb(59, 130, 246)",
        accent: isChristmasSeason() ? "#dc2626" : "rgb(59, 130, 246)", // Christmas red : Default purple

        // Emerald - fresh, growth-oriented
        // accent: "rgb(52, 211, 153)",

        // Indigo - elegant, established
        // accent: "rgb(99, 102, 241)",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        sans: [
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      backgroundImage: {
        "gradient-radial-hero":
          "radial-gradient(circle at 50% -20%, theme(colors.accent / 0.2) 0%, transparent 70%)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
} satisfies Config;
