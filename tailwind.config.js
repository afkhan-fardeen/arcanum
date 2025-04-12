/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'blood-red': '#7f1d1d',
        'bronze': '#8B5A2B',
        'gold': '#FFD700', // Define custom gold color
      },
    },
  },
  plugins: [],
};