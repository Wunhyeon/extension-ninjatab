import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html",
        background: "src/background.ts",
        content: "src/content.ts", // content-script 추가
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // background 또는 content-script는 root에 출력
          if (chunkInfo.name === "background" || chunkInfo.name === "content") {
            return "[name].js";
          }
          // 나머지는 assets 폴더에 저장
          return "assets/[name]-[hash].js";
        },
      },
    },
  },
});
