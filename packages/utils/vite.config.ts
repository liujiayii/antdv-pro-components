import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

const external: Array<string | RegExp> = Object.keys(pkg.devDependencies);
external.push(/@antd-vc\//);

export default defineConfig({
  esbuild: {
    drop: ["console", "debugger"],
  },
  plugins: [
    vue(),
    vueJsx(),
    dts({
      entryRoot: resolve(__dirname, "src"),
    }),
  ],
  build: {
    outDir: "es",
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "./src/index.ts"),
      formats: ["es"],
      fileName: (format, entryName) => {
        return `${entryName}.js`;
      },
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external,
      output: {
        preserveModules: true,
      },
    },
  },
});
