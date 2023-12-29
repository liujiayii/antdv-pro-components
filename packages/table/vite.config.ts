import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue(), vueJsx()],
  build: {
    outDir: "es",
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "./src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue", "lodash-es", "@ant-design/icons-vue", "ant-design-vue"],
    },
  },
});
