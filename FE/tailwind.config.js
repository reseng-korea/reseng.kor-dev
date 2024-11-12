/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2EA642',
        warning: '#F75252',
        placeHolder: '#F3F3F3',
        re: '#245A98',
        and: '#EF7627',
        // 갈색
        brown1: '#8B5E3C',
        // 선
        gray1: '#E2E2E2',
        gray2: '#D1D1D1',
        gray3: '#9C9C9C',
        gray4: '#373737',
        // hover color
        hover: '#2B8F3F',
      },
      rotate: {
        0: '0deg',
        180: '180deg',
        181: '-180deg',
      },
      maxWidth: {
        '8xl': '88rem', // 1408px
        '9xl': '96rem', // 1536px
        '10xl': '104rem', // 1664px
        '11xl': '112rem', // 1792px
        '12xl': '120rem', // 1920px
        '13xl': '128rem',
      },
      boxShadow: {
        even: '0px 0px 8px rgba(0, 0, 0, 0.15)', // 상하좌우 균등 그림자
      },
    },
  },
  plugins: [],
};
