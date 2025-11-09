/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepsee: {
          primary: '#1E3A5F',
          accent: '#2563EB',
          'light-bg': '#E6F2FF',
          navy: '#0F1419',
        },
        tier: {
          0: '#EF4444',
          1: '#8B5CF6',
          2: '#3B82F6',
          3: '#F59E0B',
          4: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
