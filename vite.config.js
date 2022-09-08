import basicSsl from '@vitejs/plugin-basic-ssl'
import { createHtmlPlugin } from 'vite-plugin-html'
// import { defineConfig } from 'vite'
/**
* @type {import('vite').UserConfig}
*/

export default {
    build: {
        minify: 'terser',
        cssCodeSplit: false,
        sourcemap: true,
    },
        // loader
        
    // },
    server: {
        https: true,
        host: '192.168.31.122',
        port: '3000'
    },
    plugins: [
        basicSsl(),
        createHtmlPlugin({
            minify: true,
        })
    ]
}