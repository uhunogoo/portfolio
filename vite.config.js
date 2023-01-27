import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// import dns from 'dns'
// dns.setDefaultResultOrder('verbatim')

const isCodeSandbox = !!process.env.SANDBOX_URL

export default defineConfig({
    root: "src/",
    publicDir: "../public/",
    base: "./",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        sourcemap: true,
        cssCodeSplit: true,
        rollupOptions: {
            treeshake: true
        }
    },
    server: {
        host: true,
        port: '3000',
        strictPort: true,
        // open: !isCodeSandbox,
        hmr: true
    },
    plugins: [
        react()
    ]
})
