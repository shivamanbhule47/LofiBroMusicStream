/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        spotify: {
          black: '#121212',
          surface: '#181818',
          mid: '#1f1f1f',
          green: '#1ed760',
        },
        lofi: {
          warm: '#ff6b35',
        },
        text: {
          base: '#ffffff',
          muted: '#b3b3b3',
          negative: '#f3727f',
          warning: '#ffa42b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
        'pill-lg': '500px',
      },
      boxShadow: {
        'spotify-elevated': 'rgba(0,0,0,0.3) 0px 8px 8px',
        'spotify-dialog': 'rgba(0,0,0,0.5) 0px 8px 24px',
        'spotify-inset': 'rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset',
      },
    },
  },
  plugins: [],
};
