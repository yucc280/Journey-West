import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  // command === 'build' 代表打包上线，才加base；dev本地直接用/
  const baseUrl = command === 'build' ? '/Journey-West/' : '/'
  return {
    base: baseUrl,
    plugins: [react()],
  }
})