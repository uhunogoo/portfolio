/**
* @type {import('vite').UserConfig}
*/
export default {
    build: {
        sourcemap: true,
    },
    server: {
        https: true,
        host: '192.168.31.122'
    }
}