// Vercel deployment. Nitro outputs to .vercel/output, which Vercel auto-detects.
// The Lovable sandbox still works in dev (this only affects `vite build`).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
  },
});
