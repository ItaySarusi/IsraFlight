/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00',
          dark: '#CC5500',
          light: '#FF8533',
        },
        secondary: {
          DEFAULT: '#4A4A4A',
          dark: '#333333',
          light: '#666666',
        },
        accent: {
          DEFAULT: '#1E90FF',
          dark: '#0066CC',
          light: '#66B2FF',
        },
        background: {
          DEFAULT: '#F5F5F5',
          dark: '#E0E0E0',
          glass: 'rgba(255, 255, 255, 0.1)',
        },
      },
      boxShadow: {
        'neo-sm': '3px 3px 6px #D1D1D1, -3px -3px 6px #FFFFFF',
        'neo': '5px 5px 10px #D1D1D1, -5px -5px 10px #FFFFFF',
        'neo-lg': '10px 10px 20px #D1D1D1, -10px -10px 20px #FFFFFF',
        'neo-inner': 'inset 3px 3px 6px #D1D1D1, inset -3px -3px 6px #FFFFFF',
      },
      backdropBlur: {
        'glass': '10px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} 