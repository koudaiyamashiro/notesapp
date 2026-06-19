export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        slate: {
          975: '#0b1220',
        },
      },
      boxShadow: {
        soft: '0 24px 90px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
