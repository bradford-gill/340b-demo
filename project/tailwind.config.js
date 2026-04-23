/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#0B0F19',
          surface: '#111827',
          elevated: '#1F2937',
          input: '#161E2E',
        },
        content: {
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          tertiary: '#94A3B8',
          quaternary: '#64748B',
          muted: '#475569',
          faint: '#334155',
        },
        border: {
          subtle: '#1E293B',
          DEFAULT: '#334155',
          focus: '#3B82F6',
        },
        danger: {
          bg: 'rgba(239, 68, 68, 0.12)',
          surface: 'rgba(239, 68, 68, 0.20)',
          border: '#B91C1C',
          text: '#FCA5A5',
          solid: '#EF4444',
        },
        warning: {
          bg: 'rgba(245, 158, 11, 0.12)',
          surface: 'rgba(245, 158, 11, 0.20)',
          border: '#B45309',
          text: '#FCD34D',
          solid: '#F59E0B',
        },
        safe: {
          bg: 'rgba(16, 185, 129, 0.12)',
          surface: 'rgba(16, 185, 129, 0.20)',
          border: '#047857',
          text: '#6EE7B7',
          solid: '#10B981',
        },
        info: {
          bg: 'rgba(59, 130, 246, 0.12)',
          surface: 'rgba(59, 130, 246, 0.20)',
          border: '#1D4ED8',
          text: '#93C5FD',
          solid: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
