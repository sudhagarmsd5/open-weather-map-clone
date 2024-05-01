/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./projects/**/*.{ts,css}", "./src/**/*.{ts,css}"],
  theme: {
    extend: {
      colors: {
        "light-gray-one": "#ececed",
        "light-gray-two": "#f2f2f2",
        "light-gray-three": "#48484a"
      }
    },
  },
  plugins: [],
}

