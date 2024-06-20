/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#121212', // dark
        'secondary': '#1F2937', // cool-gray
        'accent': '#2563EB', // tech-blue
        'highlight': '#10B981', // neo-green
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}

