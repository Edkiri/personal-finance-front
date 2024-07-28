/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'custom-dark': '0 4px 6px rgba(255, 255, 255, 0.1)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
