/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  plugins: [require('tailwindcss-animate')],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        'ds-neutral': {
          50: 'hsl(var(--ds-neutral-50))',
          100: 'hsl(var(--ds-neutral-100))',
          200: 'hsl(var(--ds-neutral-200))',
          300: 'hsl(var(--ds-neutral-300))',
          400: 'hsl(var(--ds-neutral-400))',
          500: 'hsl(var(--ds-neutral-500))',
          600: 'hsl(var(--ds-neutral-600))',
          700: 'hsl(var(--ds-neutral-700))',
          800: 'hsl(var(--ds-neutral-800))',
          900: 'hsl(var(--ds-neutral-900))',
          950: 'hsl(var(--ds-neutral-950))',
        },
        'ds-blue': {
          50: 'hsl(var(--ds-blue-50))',
          500: 'hsl(var(--ds-blue-500))',
          700: 'hsl(var(--ds-blue-700))',
        },
        'ds-green': {
          100: 'hsl(var(--ds-green-100))',
          500: 'hsl(var(--ds-green-500))',
        },
        'ds-red': {
          100: 'hsl(var(--ds-red-100))',
          500: 'hsl(var(--ds-red-500))',
        },
        'ds-accent': {
          DEFAULT: 'hsl(var(--ds-accent-500))',
        },
        background: 'hsl(var(--background))',
        'background-2': 'hsl(var(--ds-neutral-800))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          secondary: 'hsl(var(--ds-neutral-900))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
    },
  },
}
