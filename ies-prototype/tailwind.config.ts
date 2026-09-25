import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        canvas: '#F5F6F8',
        line: '#E4E7EC',
        ink: { DEFAULT: '#0E1726', 2: '#344054', 3: '#667085', 4: '#98A2B3' },
        brand: {
          50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC', 400: '#7C8CF8',
          500: '#5465F0', 600: '#3F4FD9', 700: '#3340B3', 800: '#2A348C', 900: '#1E2566',
        },
        agent: { 50: '#ECFDF9', 100: '#CCFBEF', 500: '#14A38B', 600: '#0E8A75', 700: '#0B6E5E' },
        ok: { 50: '#ECFDF3', 100: '#D1FADF', 500: '#12B76A', 600: '#039855', 700: '#027A48' },
        warn: { 50: '#FFFAEB', 100: '#FEF0C7', 500: '#F79009', 600: '#DC6803', 700: '#B54708' },
        risk: { 50: '#FEF3F2', 100: '#FEE4E2', 500: '#F04438', 600: '#D92D20', 700: '#B42318' },
        violet: { 50: '#F5F3FF', 100: '#EDE9FE', 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9' },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
        pop: '0 12px 32px -8px rgba(16,24,40,0.18), 0 4px 8px -4px rgba(16,24,40,0.08)',
        drawer: '-24px 0 48px -12px rgba(16,24,40,0.18)',
      },
      borderRadius: { xl: '12px', '2xl': '16px' },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
      },
      animation: {
        shimmer: 'shimmer 1.4s linear infinite',
        pulseDot: 'pulseDot 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
