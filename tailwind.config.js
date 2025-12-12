/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,php,js}",
    "./public/index.php",
    "./public/assets/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        accentStart: '#00FF5B',
        accentEnd: '#0014FF',
        bgDark: '#05060f',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

