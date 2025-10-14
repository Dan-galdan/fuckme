/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        myShadow1: "4.1px -5px 0 0 #F5F3F4",
        myShadow2: "-4.1px -5px 0 0 #F5F3F4",
        myShadow3: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"
      },
    },
  },
  plugins: [],
  darkMode: "class",
}