import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app//*.{js,ts,jsx,tsx,mdx}",
    "./components//*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        danflix: {
          black: "#0a0a0a",
          dark: "#141414",
          red: "#e50914",
          gold: "#c4a747",
          gray: "#808080",
        },
      },
      fontFamily: {
        heading: ['"Bebas Neue"', "sans-serif"],
        body: ['"Inter"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;