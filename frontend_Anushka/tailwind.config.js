/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Space Theme Colors
        background: {
          DEFAULT: '#0a0a0f',
          dark: '#050508',
          light: '#1a1a2e'
        },
        surface: {
          DEFAULT: '#16213e',
          dark: '#0f1729',
          light: '#1e3a8a'
        },
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
          light: '#60a5fa'
        },
        accent: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          light: '#fbbf24'
        },
        text: {
          DEFAULT: '#f8fafc',
          dark: '#e2e8f0',
          light: '#ffffff'
        },
        space: {
          blue: '#1e3a8a',
          purple: '#7c3aed',
          orange: '#f59e0b',
          gold: '#ffd700',
          silver: '#c0c0c0'
        }
      },
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'rotate-slow': 'rotate 20s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 15px #3b82f6' },
          '100%': { boxShadow: '0 0 10px #f59e0b, 0 0 20px #f59e0b, 0 0 30px #f59e0b' }
        }
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
        'nebula': 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.3) 0%, rgba(124, 58, 237, 0.2) 45%, rgba(10, 10, 15, 0.8) 100%)'
      }
    },
  },
  plugins: [],
}