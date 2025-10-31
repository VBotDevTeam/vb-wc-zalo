/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'member-bg': 'var(--member-bg)',
        'customer-bg': 'var(--customer-bg)',
        'ai-tag-bg': 'var(--ai-tag-bg)',
        'vb-bg': 'var(--vb-bg)',
        'vb-text': 'var(--vb-text)',
      },
    },
  },
  plugins: [require('./src/plugin.cjs')],
  darkMode: 'class',
}
