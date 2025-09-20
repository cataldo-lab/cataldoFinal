/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors based on your existing CSS
        'primary': '#003366',
        'primary-dark': '#001a33', 
        'primary-light': '#eef7ff',
        'secondary': '#006edf',
        'accent': '#006edf',
        'error': '#E4332C',
        'success': '#22c55e',
        'warning': '#f59e0b',
        'info': '#3b82f6',
        
        // Additional neutral colors
        'neutral': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        'sans': ['roboto', 'ui-sans-serif', 'system-ui'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        'medium': 'rgba(0, 0, 0, 0.1) 0px 4px 12px 0px',
        'strong': 'rgba(0, 0, 0, 0.25) 0px 8px 16px 0px',
      },
      animation: {
        'heartbeat': 'heartbeat 5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        heartbeat: {
          '0%': { transform: 'scaleX(1)' },
          '25%': { transform: 'scaleX(1.2)' },
          '50%': { transform: 'scaleX(1)' },
          '75%': { transform: 'scaleX(1.2)' },
          '100%': { transform: 'scaleX(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
}