/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        sans: ['Amiri', 'sans-serif'],
      },
      colors: {
        islamic: {
          primary: '#f8f9fa',    // Light gray background
          secondary: '#daa520',  // Traditional gold
          tertiary: '#e9ecef',   // Lighter gray
          accent: '#c19b6c',     // Warm bronze
          light: '#212529',      // Dark text
          dark: '#495057',       // Medium gray
          gold: '#ffd700',       // Bright gold
          teal: '#20c997',       // Soft teal
          rose: '#ff9a8b',       // Soft rose
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};