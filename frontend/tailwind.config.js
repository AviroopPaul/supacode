// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        gray: {
          700: '#374151',
          600: '#4B5563',
          300: '#D1D5DB',
        }
      }
    },
  },
  plugins: [],
}