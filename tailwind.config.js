/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./stores/**/*.{js,jsx,ts,tsx}",
    "./scripts/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        note: "#FFC107",
        bg: "#121212",
        main: "#FF9800",
      },
    },
  },
  plugins: [],
};
