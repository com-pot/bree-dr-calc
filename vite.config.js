import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue"
import tsconfifigPaths from "vite-tsconfig-paths"

export default defineConfig({
    plugins: [
        vue(),
        tsconfifigPaths({
            extensions: ['.js', '.ts', '.vue'],
            loose: true,
        }),
    ],
    define: {
        'process.env.VUE_APP_VERSION': `"${process.env.npm_package_version}"`,
    },
})
