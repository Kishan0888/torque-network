import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      // index.html = landing page; account.html = lightweight account/checkout pages.
      input: { main: 'index.html', account: 'account.html' },
    },
  },
})
