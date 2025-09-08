/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif-tc': ['Noto Serif TC', 'serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cyber: {
          bg: '#0a0a0a',
          primary: '#ffffff',
          neon: {
            pink: '#ff00ff',
            cyan: '#00ffff',
            green: '#00ff7f',
            yellow: '#ffff00',
          },
          grid: '#282828',
          overlay: 'rgba(0, 0, 0, 0.7)',
        }
      },
      animation: {
        'glitch': 'glitch 0.3s ease-in-out',
        'glitch-btn': 'glitch-btn 0.2s infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)', color: '#ff00ff' },
          '40%': { transform: 'translate(-2px, -2px)', color: '#00ffff' },
          '60%': { transform: 'translate(2px, 2px)', color: '#ffff00' },
          '80%': { transform: 'translate(2px, -2px)', color: '#ff00ff' },
        },
        'glitch-btn': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        }
      }
    },
  },
  plugins: [],
}