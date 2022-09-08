import basicSsl from '@vitejs/plugin-basic-ssl'
/**
* @type {import('vite').UserConfig}
*/

export default {
    build: {
        cssCodeSplit: false,
        sourcemap: true,
    },
    server: {
        https: true,
        host: '192.168.31.122',
        port: '3000'
    },
    plugins: [
        basicSsl()
    ]
}