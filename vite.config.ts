import { defineConfig } from 'vite'
import monacoEditorPlugin from "vite-plugin-monaco-editor"
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
const path = require('path')
// import path from 'path'

function _resolve(dir: string) {
    return path.resolve(__dirname, dir);
}

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': _resolve('src'),
            'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
        }
    },
    plugins: [vue(), monacoEditorPlugin(), VitePWA({
        manifest: {
            id: "es-client",
            name: "es-client",
            short_name: "es-client",
            description: "elasticsearch客户端",
            theme_color: "#409eff",
            display: "standalone",
            icons: [
                {
                    src: './logo.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: './logo.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
            ],
            lang: 'zh-CN'
        }
    })],
    base: './'
})