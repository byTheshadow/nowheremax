/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'full': '9999px'
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', 'Segoe UI',
          'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'
        ]
      },
      zIndex: {
        'base': '1',
        'topbar': '10',
        'input': '20',
        'music': '20',
        'dropdown': '30',
        'drawer': '40',
        'modal': '50',
        'zen': '60',
        'toast': '70'
      }
    }
  },
  plugins: []
}
