import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/landing-v2.tsx',
    './pages/landing-v2/**/*.{ts,tsx}',
    './components/v2/**/*.{ts,tsx}',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#ffffff',
          secondary: '#f6f8fa',
        },
        'blue-medium': '#eef2ff',
        'blue-light': '#e0e7ff',
        accent: {
          DEFAULT: '#4f46e5',
          dark: '#4338ca',
          light: '#6366f1',
        },
        brand: {
          50: '#f6f8fa',
          100: '#eaeef2',
          200: '#d0d7de',
          300: '#afb8c1',
          400: '#8c959f',
          500: '#6e7781',
          600: '#57606a',
          700: '#424a53',
        },
        border: {
          DEFAULT: '#d0d7de',
          input: '#d0d7de',
          'input-hover': '#afb8c1',
          'input-focus': '#4f46e5',
        },
        tag: {
          DEFAULT: '#eaeef2',
        },
        footer: {
          DEFAULT: '#0d1117',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)',
        btn: '0 2px 8px rgba(0,0,0,0.1)',
        header: '0 4px 24px 0px rgba(0,0,0,0.04)',
        dropdown: '0 0 20px 0px rgba(17,18,38,0.15)',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      screens: {
        xs: '400px',
        xxs: '320px',
      },
    },
  },
  plugins: [],
}

export default config
