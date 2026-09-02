import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#171717", canvas: "#f7f8fa", accent: "#3269ed" },
    },
  },
  plugins: [],
};

export default config;
