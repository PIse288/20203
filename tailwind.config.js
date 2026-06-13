/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe6ff',
          200: '#bdd1ff',
          300: '#93b2ff',
          400: '#6389ff',
          500: '#165DFF',
          600: '#144ee0',
          700: '#123fbf',
          800: '#0f3395',
          900: '#0b266f',
        },
        surface: {
          light: '#ffffff',
          muted: '#f7f8fa',
          dark: '#0f172a',
        },
      },
      borderRadius: {
        lg: '10px',
        md: '8px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(15, 23, 42, 0.05)',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
