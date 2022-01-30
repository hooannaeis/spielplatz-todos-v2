module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
        keyframes: {
            'fade-in-down': {
                '0%': {
                    opacity: '0',
                    transform: 'translateY(-10px)'
                },
                '75%': {
                    opacity: '0.8',
                    transform: 'translateY(3px)'
                },
                '100%': {
                    opacity: '1',
                    transform: 'translateY(0)'
                },
            },
            'shake-left-right': {
                '0%': {
                    transform: 'translateX(-10px)'
                },
                '25%': {
                    transform: 'translateX(10px)'
                },
                '50%': {
                    transform: 'translateX(-10px)'
                },
                '75%': {
                    transform: 'translateX(10px)'
                },
                '100%': {
                    transform: 'translateX(0)'
                },
            },
        },
        animation: {
            'fade-in-down': 'fade-in-down 0.3s ease-out',
            'shake-left-right': 'shake-left-right 0.3s ease-out',
        }
    },
},
  variants: {
    extend: {
      backgroundColor: ['checked', 'focus'],
      borderColor: ['checked', 'focus'],
    }
  },
  plugins: [],
}
