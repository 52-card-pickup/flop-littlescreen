import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { installGlobals } from "@remix-run/node";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  server: {
    port: safeEnvOrDefault("PORT", "10000", parseInt) || 10000,
  },
  plugins: [
    tsconfigPaths(),
    remix({
      ignoredRouteFiles: ["**/*.css"],
      ssr: false,

      // appDirectory: "app",
      // assetsBuildDirectory: "public/build",
      // publicPath: "/build/",
      // serverBuildPath: "build/index.js",
    }),
  ],
});

function safeEnvOrDefault<T = string>(
  key: string,
  def: string,
  transform?: (val: string) => T
): T | null {
  try {
    const val = process.env[key] || def;
    return transform ? transform(val) : (val as T);
  } catch {
    return null;
  }
}
