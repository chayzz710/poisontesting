/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sunflower: { DEFAULT: '#F5C842', dark: '#E2A500' },
        orchid:    { DEFAULT: '#9B7FD4', deep: '#6A5ACD' },
        cream:     '#FFFDF4',
        chocolate: '#3B1F0E',
        surface:   '#FFFFFF',
        riptide:   '#3B82C4',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['Inter', 'sans-serif'],
        hand:    ['Caveat', 'cursive'],
      },
      boxShadow: {
        polaroid: '0 4px 12px rgba(59,31,14,0.18)',
        soft:     '0 2px 8px rgba(59,31,14,0.08)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'tilt':    { '0%,100%': { transform: 'rotate(0deg)' }, '50%': { transform: 'rotate(2deg)' } },
        'pulse-heart': { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.15)' } },
      },
      animation: {
        'fade-up':     'fade-up 0.5s ease-out',
        'tilt':        'tilt 4s ease-in-out infinite',
        'pulse-heart': 'pulse-heart 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

