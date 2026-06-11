/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        night: '#070914',
        panel: '#101426',
        line: '#25304a',
        mint: '#34d399',
        ember: '#fb923c',
        electric: '#38bdf8',
      },
      boxShadow: {
        glow: '0 0 40px rgba(56, 189, 248, 0.18)',
      },
    },
  },
  plugins: [],
};
