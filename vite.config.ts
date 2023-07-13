import legacy from '@vitejs/plugin-legacy'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      // 为传统浏览器提供支持
      legacy({
        targets: ['defaults', 'not IE 11']
      }),
      glsl({
        include: [
          '**/*.glsl',
          '**/*.wlsl',
          '**/*.vert',
          '**/*.frag',
          '**/*.vs',
          '**/*.fs'
        ],
        exclude: undefined,
        warnDuplicatedImports: true,
        defaultExtension: 'glsl',
        compress: false,
        root: '/'
      }),
    ],

    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm-bundler.js',
        '@': resolve(__dirname, './src'),
        '@utils': resolve(__dirname, './src/utils'),
        '@components': resolve(__dirname, 'src/components')
      },
    }
  }
})
