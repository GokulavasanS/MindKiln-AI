/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
      },
      colors: {
        paper: '#FAF7F2',
        ink: '#1C1A17',
        clay: '#B65A2A',
        ash: '#8A837A',
        'paper-dark': '#F0EBE3',
        'ink-light': '#3D3832',
        'clay-light': '#D4875A',
        'clay-dark': '#8F4420',
        'ash-light': '#B5AFA7',
        'ash-dark': '#5E5850',
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.025em', fontWeight: '400' }],
        'display-sm': ['2.5rem', { lineHeight: '1.12', letterSpacing: '-0.02em', fontWeight: '400' }],
        'heading': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body': ['0.9375rem', { lineHeight: '1.7', fontWeight: '400' }],
        'caption': ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }],
        'micro': ['0.6875rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'paper': '2px',
      },
      boxShadow: {
        'torn': '0 1px 3px rgba(28, 26, 23, 0.06), 0 4px 12px rgba(28, 26, 23, 0.03)',
        'lifted': '0 2px 8px rgba(28, 26, 23, 0.08), 0 8px 24px rgba(28, 26, 23, 0.04)',
        'polaroid': '2px 3px 8px rgba(28, 26, 23, 0.12), 0 1px 2px rgba(28, 26, 23, 0.06)',
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'rise': 'rise 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 400ms ease forwards',
        'ink-spread': 'inkSpread 300ms ease-out forwards',
        'stamp': 'stamp 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-up': 'slideUp 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        inkSpread: {
          '0%': { transform: 'scaleX(0)', opacity: '0' },
          '100%': { transform: 'scaleX(1)', opacity: '1' },
        },
        stamp: {
          '0%': { transform: 'scale(0) rotate(-12deg)', opacity: '0' },
          '60%': { transform: 'scale(1.15) rotate(2deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionDuration: {
        '180': '180ms',
        '220': '220ms',
      },
    },
  },
  plugins: [],
}
