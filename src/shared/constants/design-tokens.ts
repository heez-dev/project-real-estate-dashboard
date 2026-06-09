export const colorTokens = {
  primary: {
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
  },
  neutral: {
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    500: '#64748b',
    700: '#334155',
    950: '#0f172a',
    white: '#ffffff',
  },
  semantic: {
    error: '#dc2626',
    info: '#0ea5e9',
    lightBlue: '#eff6ff',
    success: '#16a34a',
    warning: '#f59e0b',
  },
} as const;

export const typographyTokens = {
  body: { fontSize: 14, fontWeight: 400, lineHeight: 20 },
  bodyLarge: { fontSize: 16, fontWeight: 400, lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: 400, lineHeight: 16 },
  h1: { fontSize: 28, fontWeight: 700, lineHeight: 36 },
  h2: { fontSize: 22, fontWeight: 700, lineHeight: 30 },
  h3: { fontSize: 18, fontWeight: 600, lineHeight: 26 },
} as const;

export const radiusTokens = {
  '2xl': 24,
  lg: 12,
  md: 8,
  sm: 6,
  xl: 16,
  xs: 4,
} as const;

export const shadowTokens = {
  lg: '0 10px 15px rgb(15 23 42 / 0.10), 0 4px 6px rgb(15 23 42 / 0.10)',
  md: '0 4px 6px rgb(15 23 42 / 0.08), 0 2px 4px rgb(15 23 42 / 0.06)',
  sm: '0 1px 2px rgb(15 23 42 / 0.05)',
} as const;

