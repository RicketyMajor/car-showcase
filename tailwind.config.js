/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        "black-100": "#15161A",
        // The Configurator: a graphite stage the cars are lit on, and the
        // light showroom floor the catalogue stands on.
        stage: {
          DEFAULT: "#0E0F11",
          100: "#1C1E22",
        },
        chalk: "#F5F5F3",
        "primary-blue": {
          DEFAULT: "#2B59FF",
          100: "#F5F8FF",
        },
        "light-white": {
          DEFAULT: "rgba(59,60,152,0.03)",
          100: "rgba(59,60,152,0.02)",
        },
        grey: "#6B7079",
      }
    },
  },
  plugins: [],
};