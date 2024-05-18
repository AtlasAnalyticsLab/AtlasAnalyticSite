
module.exports = {
  content: [
    './**/*.html',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'mdlg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'lg': '1700px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '2200px',
    },
    
    extend: {      fontSize: {
      '10xl': '10rem',
      '11xl': '12rem',
      '12xl': '14rem',
      // Add as many as you need...
    },
    colors:{
      atlas: '#121212'
    },
    borderRadius: {
      'lg-pub': 'calc(0.5rem - 0.92px)', // 0.5rem is the value for 'lg'
    },
    scale: ['hover', 'focus'],
    scale: {
      101.5: '1.015',
    },
    spacing:{
      '19/50': '38%',
      '88': '22rem',
    },
    fontSize: {
      'lgxl': '1.15rem', 
      '1.5xl': '1.4rem',
    }
    
  }
  },
  variants: {},
  plugins: [
    require('tailwindcss-animated')
  ]
}

