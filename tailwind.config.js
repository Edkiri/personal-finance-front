/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        page: 'var(--color-background)',
        surface: 'var(--color-surface)',
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        accent: {
          primary: 'var(--color-accent-primary)',
          secondary: 'var(--color-accent-secondary)',
          negative: 'var(--color-negative)',
        },
        chart: {
          blue: 'var(--color-chart-blue)',
          green: 'var(--color-chart-green)',
          grayBlue: 'var(--color-chart-gray-blue)',
          slate: 'var(--color-chart-slate)',
          grayLight: 'var(--color-chart-gray-light)',
        },
      },
      boxShadow: {
        'custom-dark': '0 4px 6px rgba(255, 255, 255, 0.1)',
        soft: 'var(--shadow-soft)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
