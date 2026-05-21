import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canary: '#f3f754',
        'racing-green': '#121e18',
        'la-palma': '#3c8a0d',
        'dark-fern': '#12400a',
        dell: '#286411',
        asparagus: '#7ca667',
        xanadu: '#7a7b7a',
        'gray-nickel': '#c4c5c3',
        celery: '#b0bb4c',
      },
    },
  },
  plugins: [],
}

export default config
