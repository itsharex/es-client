import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";

const path = require('path')
// import path from 'path'

// 插件
import {visualizer} from 'rollup-plugin-visualizer';

function _resolve(dir: string) {
    return path.resolve(__dirname, dir);
}

function outDir() {
    switch (process.env.npm_lifecycle_event) {
        case 'build:ts':
            return 'dist';
        case 'build:edge':
            return 'chrome/es-client';
        case 'build:firefox':
            return 'firefox/es-client';
        default:
            return 'dist';
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': _resolve('src'),
            'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
        }
    },
    plugins: [vue(), visualizer({open: true}),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    base: './',
    build: {
        outDir: outDir()
    }
})