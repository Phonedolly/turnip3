/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'code': '0px 4px 12px rgba(0,0,0,.16)',
        'card': '0px 4px 12px rgba(0,0,0,.18)',
        'card-hover': '0px 4px 12px rgba(0,0,0,.24)',
        'card-dark': '0px 0px 12px rgba(255,255,255,.18)',
        'card-hover-dark': '0px 0px 12px rgba(255,255,255,.24)'
      },
      fontFamily: {
        'spoqa-han-sans-neo': ['var(--font-spoqa-han-sans-neo)'],
        'noto-serif': ['var(--font-noto-serif-kr)'],
        'outfit': ['var(--font-outfit)', 'var(--font-spoqa-han-sans-neo)'],
        'cascadia-code': ['var(--font-cascadia-code)', 'var(--font-spoqa-han-sans-neo)'],
        'cascadia-mono': ['var(--font-cascadia-mono)', 'var(--font-spoqa-han-sans-neo)'], 'mono': ['var(--font-cascadia-mono)', 'var(--font-spoqa-han-sans-neo)'],
        'code': ['var(--font-cascadia-code)', 'var(--font-spoqa-han-sans-neo)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
}
