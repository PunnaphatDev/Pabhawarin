/**
 * Tailwind CSS Configuration for Pabhawarin Website
 */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        helvethaica: ["'DB Helvethaica X'", "'DB Helvethaica X Cond'", "'Noto Sans Thai'", 'sans-serif'],
        noto: ["'Noto Sans Thai'", 'sans-serif'],
        script: ['"Alex Brush"', 'cursive'],
      },
      colors: {
        brand: {
          cream: '#F9F2E0',
          darkgreen: '#404E3F',
          darkgreenhover: '#5c6a5b',
          charcoal: '#231F20',
          bg: '#FAF8F2',
        },
        cream: {
          50: '#FAF8F2',
          100: '#F9F2E0',
          200: '#EEE7D6',
          300: '#E4DCB8',
        },
        forest: {
          800: '#2D4530',
          900: '#1E291C',
          dark: '#404E3F',
          copyright: '#404E3F',
        },
        darkcharcoal: '#231F20',
      }
    }
  }
};
