// @file tailwind.config.ts
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0066ff',
          dark: '#0044cc',
          light: '#3385ff',
          muted: 'rgba(0,102,255,0.12)',
        },
        surface: {
          0: '#0a0a0a',
          1: '#111111',
          2: '#1a1a1a',
          3: '#222222',
          4: '#2a2a2a',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          subtle: 'rgba(255,255,255,0.04)',
          strong: 'rgba(255,255,255,0.16)',
        },
        status: {
          open: '#3b82f6',
          planned: '#8b5cf6',
          'in-progress': '#f59e0b',
          shipped: '#10b981',
          declined: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-jetbrains)', ...defaultTheme.fontFamily.mono],
      },
      animation: {
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        fadeIn: 'fadeIn 0.4s ease-out forwards',
        countUp: 'countUp 1s ease-out forwards',
        blink: 'blink 1s step-end infinite',
        slideInLeft: 'slideInLeft 0.4s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'brand-gradient': 'linear-gradient(135deg, #0066ff 0%, #0044cc 100%)',
        'hero-radial':
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,102,255,0.18) 0%, transparent 70%)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
    },
  },
  plugins: [],
};

export default config;
