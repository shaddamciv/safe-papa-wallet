/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        grotesque: ["Basis Grotesque Off White Pro", "sans"],
      },
    },
  },
  daisyui: {
    themes: ["lofi"],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
