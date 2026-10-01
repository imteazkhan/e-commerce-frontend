export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        script: ['"Alex Brush"', 'cursive'],
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        // Gold scale — used as the accent across the store
        primary: {
          DEFAULT: '#c5a059',
          50: '#faf6ee',
          100: '#f3e9d2',
          200: '#e6d2a6',
          300: '#d8bb7f',
          400: '#cfae6c',
          500: '#c5a059',
          600: '#a8843e',
          700: '#99732f',
          800: '#6d5326',
          900: '#4f3c1c',
        },
        brand: {
          gold: '#c5a059',
          darkGold: '#99732f',
          dark: '#111111',
          charcoal: '#1a1a1a',
          header: '#121212',
          muted: '#737373',
        },
        secondary: '#334155',
        border: '#e5e7eb',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px -8px rgba(0, 0, 0, 0.08)',
        lift: '0 2px 4px rgba(0, 0, 0, 0.04), 0 20px 40px -12px rgba(0, 0, 0, 0.22)',
        gold: '0 0 60px rgba(212, 175, 55, 0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.8s ease-out both',
      },
    },
  },
  plugins: [],
}
