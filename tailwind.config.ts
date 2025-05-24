import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'breathing': 'breathing 4s ease-in-out infinite',
        'floating': 'floating 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'drift': 'drift 8s ease-in-out infinite',
        'magnetic': 'magnetic 2s ease-out',
        'reveal': 'reveal 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        breathing: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        floating: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(-5px) rotate(-0.5deg)' },
        },
        glow: {
          '0%, 100%': { 
            opacity: '0.8',
            filter: 'drop-shadow(0 0 5px rgba(96, 165, 250, 0.3))'
          },
          '50%': { 
            opacity: '1',
            filter: 'drop-shadow(0 0 15px rgba(96, 165, 250, 0.6))'
          },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '25%': { transform: 'translate(5px, -3px) rotate(0.5deg)' },
          '50%': { transform: 'translate(-3px, 5px) rotate(-0.3deg)' },
          '75%': { transform: 'translate(2px, -2px) rotate(0.2deg)' },
        },
        magnetic: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(var(--magnetic-x, 0px), var(--magnetic-y, 0px)) scale(1.05)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(20px) rotateX(-10deg)' },
          '100%': { opacity: '1', transform: 'translateY(0px) rotateX(0deg)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
