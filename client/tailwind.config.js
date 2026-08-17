/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#E26A12', // Logo orange
          orangeDark: '#C25505',
          orangeLight: '#FF914D',
          cream: '#FFFBF7',       // Main page background
          creamDark: '#FFF4E8',   // Secondary containers / cards
          creamBorder: '#FCE2C6', // Warm borders
          dark: '#1C1917',
          light: '#F5F5F4',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'Noto Sans Arabic', 'serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(226, 106, 18, 0.15)',
        'premium-hover': '0 20px 40px -15px rgba(226, 106, 18, 0.3)',
        'glow': '0 0 20px rgba(226, 106, 18, 0.2)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
