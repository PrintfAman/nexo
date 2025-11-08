module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f1115',
        panel: '#14171d',
        muted: '#9aa3af',
        text: '#e9edf1',
        'text-weak': '#c8cdd4',
        brand: '#ff6b2c',
        chip: '#1d212b',
        card: '#161a21',
        border: '#222835',
        success: '#10b981',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      aspectRatio: {
        '4/5': '4 / 5',
        '9/16': '9 / 16',
      },
    },
  },
  plugins: [],
}
