import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import bettercms from "@betttercms/astro";

// Static site: BetterCMS hosting serves the build as files, and the deploy Action writes
// bcms-content.json BEFORE the build (no API key at build time). We read all content from that
// snapshot — the integration is here only so <BcmsForm>/<BcmsImage> get `apiUrl`/`workspace`.
// `workspace` comes from env, else the snapshot the fetch step wrote, else a harmless placeholder.
const snapshotWorkspace = (() => {
  try {
    return JSON.parse(readFileSync("bcms-content.json", "utf8")).workspace;
  } catch {
    return "";
  }
})();

export default defineConfig({
  output: "static",
  integrations: [
    bettercms({
      apiUrl: process.env.PUBLIC_BCMS_API_URL ?? "https://api.bettercms.ai",
      workspace: process.env.PUBLIC_BCMS_WORKSPACE || snapshotWorkspace || "workspace",
      // Static build: no SSR draft routes (they require a server adapter). Content is read from
      // the build snapshot, so draft preview isn't applicable here.
      draft: false,
    }),
  ],
});
