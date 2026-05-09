/**
 * Windows workaround: esbuild fails silently on paths with spaces/accented chars,
 * so open-next.config.edge.mjs is never generated.
 * This script creates it manually after `next build`.
 */
import { mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const buildDir = resolve(root, ".open-next", ".build");

mkdirSync(buildDir, { recursive: true });

const edgeConfig = `var config = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  edgeExternals: ["node:crypto"],
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
};
var open_next_config_default = config;
export { open_next_config_default as default };
`;

writeFileSync(resolve(buildDir, "open-next.config.edge.mjs"), edgeConfig);
console.log("✓ open-next.config.edge.mjs generated for Windows compatibility");
