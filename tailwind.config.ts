import type { Config } from 'tailwindcss';

export default {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#8b5cf6', // Morado Matríztica plano
          muted: '#c4b5fd',
          dark: '#6d28d9',
        },
      },
      boxShadow: {
        'flat': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'flat-sm': '2px 2px 0px 0px rgba(0, 0, 0, 1)',
        'flat-lg': '6px 6px 0px 0px rgba(0, 0, 0, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'zoom-in': 'zoomIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;


