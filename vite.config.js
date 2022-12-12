import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue"
import tsconfifigPaths from "vite-tsconfig-paths"
import {viteStaticCopy as copy} from "vite-plugin-static-copy"

export default defineConfig({
    plugins: [
        vue(),
        tsconfifigPaths({
            extensions: ['.js', '.ts', '.vue'],
            loose: true,
        }),
        copy({
            targets: [
                {src: 'src/modules/**/localization/*.json', dest: 'i18n'},
                {src: 'libs/**/localization/*.json', dest: 'i18n'},
            ],
            flatten: false,
            watch: true,
        }),
    ],
    define: {
        'process.env.VUE_APP_NAME': `"Bree Dr.Calc"`,
        'process.env.VUE_APP_VERSION': `"${process.env.npm_package_version}"`,
        'process.env.VUE_APP_REPO': `'https://github.com/Thoronir42/bree-dr-calc'`,
    },
})
