/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eefcf6',
          100: '#d6f7e9',
          200: '#b0eed5',
          300: '#7adFba',
          400: '#3ec797',
          500: '#18ad7d',
          600: '#0c8c66',
          700: '#0a7053',
          800: '#0b5944',
          900: '#0a4939',
          950: '#042a21',
        },
        accent: {
          50: '#eff7ff',
          100: '#daedff',
          200: '#bce0ff',
          300: '#8ccdff',
          400: '#54afff',
          500: '#2b8eff',
          600: '#1470f5',
          700: '#0d5ae0',
          800: '#1149b5',
          900: '#13408f',
          950: '#0e2a59',
        },
        warn: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d4d9e2',
          300: '#aeb7c8',
          400: '#8190a8',
          500: '#61718d',
          600: '#4c5a74',
          700: '#3e4960',
          800: '#363f52',
          900: '#0f1626',
          950: '#080c16',
        },
      },
      backgroundImage: {
        'grid-pattern':
          "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 0h1v40H0zM0 0h40v1H0z' fill='%23ffffff' fill-opacity='0.04'/%3E%3C/svg%3E\")",
        'hero-glow':
          'radial-gradient(60% 50% at 50% 0%, rgba(24,173,125,0.25) 0%, rgba(24,173,125,0) 70%), radial-gradient(40% 40% at 80% 20%, rgba(43,142,255,0.18) 0%, rgba(43,142,255,0) 70%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(15,22,38,0.37)',
        glow: '0 0 40px rgba(24,173,125,0.35)',
        'glow-accent': '0 0 40px rgba(43,142,255,0.30)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
      },
    },
  },
  plugins: [],
};
