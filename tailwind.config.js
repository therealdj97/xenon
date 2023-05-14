/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js,css}",
    "./src/**/*.{html,js,css}",
    "./node_modules/tw-elements/dist/js/**/*.js",
    "./views/*.ejs"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

