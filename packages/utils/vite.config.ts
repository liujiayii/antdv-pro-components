import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json";
const external = Object.keys(pkg.devDependencies);

export default defineConfig({
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
        return entryName + ".js";
      },
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: external,
      output: {
        preserveModules: true,
      },
    },
  },
});
