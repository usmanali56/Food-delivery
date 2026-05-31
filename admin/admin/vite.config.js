import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const isVercelAdminOnly = process.env.VERCEL_ADMIN_STANDALONE === "1";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: isVercelAdminOnly ? "/" : "/admin/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
