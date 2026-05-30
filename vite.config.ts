// Vercel deployment configuration.
// This project was migrated off Lovable's Cloudflare Workers wrapper.
// Nitro builds output to .vercel/output (Vercel auto-detects).
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      target: "vercel",
    }),
    viteReact(),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
