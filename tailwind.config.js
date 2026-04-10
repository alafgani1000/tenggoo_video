/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        baloo: ['Baloo 2', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        'bg-main': '#f3f8ff',
        'bg-soft': '#ffffff',
        'bg-soft-alt': '#f8fbff',
        'text-main': '#1f2a44',
        'text-muted': '#5f6d85',
        'line': '#d8e3f2',
        'primary': '#2f80ed',
        'primary-strong': '#1c67cb',
        'primary-soft': '#eaf3ff',
        'chip-bg': '#edf4ff',
        'chip-text': '#2d4d7a',
        'success-soft': '#eef9ee',
        'success-text': '#26633a',
        'focus': '#ffb347',
      },
      borderRadius: {
        'lg': '20px',
        'md': '14px',
      },
      boxShadow: {
        'sm': '0 6px 18px rgba(31, 42, 68, 0.08)',
        'md': '0 12px 30px rgba(31, 42, 68, 0.14)',
      },
    },
  },
  plugins: [],
}
