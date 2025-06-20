/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5B47E0',
          50: '#F4F2FF',
          100: '#E9E4FF',
          200: '#D4CBFF',
          300: '#BEB1FF',
          400: '#A998FF',
          500: '#5B47E0',
          600: '#4E3DC7',
          700: '#4133AE',
          800: '#342995',
          900: '#271F7C'
        },
        secondary: {
          DEFAULT: '#8B7FE8',
          50: '#F6F5FF',
          100: '#EDEBFF',
          200: '#DCD7FF',
          300: '#CBC3FF',
          400: '#B5ACFF',
          500: '#8B7FE8',
          600: '#7B6FD9',
          700: '#6A5FCA',
          800: '#5A4FBB',
          900: '#4A3FAC'
        },
        accent: {
          DEFAULT: '#00D4AA',
          50: '#E6FFF9',
          100: '#CCFFF3',
          200: '#99FFE7',
          300: '#66FFDB',
          400: '#33FFCF',
          500: '#00D4AA',
          600: '#00C097',
          700: '#00AC84',
          800: '#009871',
          900: '#00845E'
        },
        surface: {
          50: '#FFFFFF',
          100: '#F8F9FB',
          200: '#F1F3F5',
          300: '#E9ECF0',
          400: '#D1D7E0',
          500: '#94A3B8',
          600: '#64748B',
          700: '#475569',
          800: '#334155',
          900: '#1E293B'
        },
        success: '#00C896',
        warning: '#FFB547',
        error: '#FF5757',
        info: '#3B82F6'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 0.5s ease-out',
        'confetti': 'confetti 0.8s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out'
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' }
        },
        'confetti': {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(2) rotate(360deg)', opacity: '0' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}