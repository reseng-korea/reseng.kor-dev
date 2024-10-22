/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2EA642',
        warning: '#F75252',
        placeHolder: '#F3F3F3',
        // 선
        gray1: '#E2E2E2',
        gray2: '#D1D1D1',
        gray3: '#9C9C9C',
        gray4: '#373737',
      },
    },
  },
  plugins: [],
};
