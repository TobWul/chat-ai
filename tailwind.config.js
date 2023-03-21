/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        textColor: "#8E8E8E",
        gray: {
          black: "black",
          900: "#1F1F1F",
          800: "#2D2D2D",
          700: "#3B3B3B",
          600: "#494949",
          500: "#575757",
          400: "#656565",
          300: "#737373",
          200: "#818181",
          100: "#8E8E8E",
          50: "#9C9C9C",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
