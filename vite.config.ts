// Vercel deployment. Nitro must write the Build Output API structure into
// .vercel/output so Vercel can deploy the SSR app instead of treating it like
// a static Vite site.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
    output: {
      dir: ".vercel/output",
      publicDir: ".vercel/output/static",
      serverDir: ".vercel/output/functions/__server.func",
    },
  },
});
