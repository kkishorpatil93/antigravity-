/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f2f9f3',
          100: '#e1f2e4',
          200: '#c5e5cb',
          300: '#99d2a4',
          400: '#66b876',
          500: '#419c52',
          600: '#307f40',
          700: '#276534',
          800: '#23502c',
          900: '#1e4326',
          950: '#0c2412',
        },
        cream: {
          50: '#fdfcf9',
          100: '#faf7f2',
          200: '#f4ede2',
          300: '#ede1cf',
        },
        earth: {
          50: '#fbf7f4',
          100: '#f5ede6',
          500: '#8c6239',
          700: '#5c3d1e',
          900: '#382210',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

