/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}"
  ],
  theme: {
  extend: {
    keyframes: {
      'fade-in-down': {
        '0%': { opacity: 0, transform: 'translateY(-20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      'fade-in-left': {
        '0%': { opacity: 0, transform: 'translateX(-20px)' },
        '100%': { opacity: 1, transform: 'translateX(0)' },
      },
      'fade-in-up': {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
    },
    animation: {
      'fade-in-down': 'fade-in-down 0.7s ease-out',
      'fade-in-left': 'fade-in-left 0.7s ease-out',
      'fade-in-up': 'fade-in-up 0.7s ease-out',
    },
  },
},
  plugins: [
    require('tailwindcss-animate'),
  ],
};
