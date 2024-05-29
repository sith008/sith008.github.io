/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
