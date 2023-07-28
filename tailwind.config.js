/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'spoqa-han-sans-neo': ['var(--font-spoqa-han-sans-neo)'],
        'outfit': ['var(--font-outfit)', 'var(--font-spoqa-han-sans-neo)'],
        'cascadia-code': ['var(--font-cascadia-code)', 'var(--font-spoqa-han-sans-neo)'],
        'cascadia-mono': ['var(--font-cascadia-mono)', 'var(--font-spoqa-han-sans-neo)']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
}
