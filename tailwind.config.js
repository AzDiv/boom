/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f84704',
          dark: '#c63a02',
          light: '#ff7a3a',
        },
        secondary: {
          DEFAULT: '#fab51d',
          dark: '#c49016',
          light: '#ffe082',
        },
        success: {
          DEFAULT: '#00b894',
          dark: '#00b894',
          light: '#00b894',
        },
        error: {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
          light: '#F87171',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};