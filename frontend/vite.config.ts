import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      features: "/src/features",
      components: "/src/components",
      hooks: "/src/hooks",
      constants: "/src/constants",
      utils: "/src/utils",
      contexts: "/src/contexts",
    },
  },
});
