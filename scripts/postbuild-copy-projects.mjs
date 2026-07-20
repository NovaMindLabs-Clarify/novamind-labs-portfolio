// Copies sibling project folders (1_site..5_site plain static sites, and
// 6_site's own Vite build output) into the hub's dist/ output, so the final
// deployed dist/ is fully self-contained — every relative link the hub pages
// use (/1_site/index.html, /6_site/dist/index.html, etc.) resolves correctly
// once dist/ is deployed as the site root (GitHub Pages).
//
// During local development (`npm run dev`), these links already resolve
// correctly for free, because Vite's dev server serves the whole portfolio
// root as static files — this script only matters for the production build.

import { existsSync, cpSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

const plainSites = ['1_site', '2_site', '3_site', '4_site', '5_site', '7_site'];

for (const name of plainSites) {
  const src = resolve(root, name);
  const dest = resolve(dist, name);
  if (!existsSync(src)) {
    console.warn(`[postbuild] skip ${name} — not found`);
    continue;
  }
  cpSync(src, dest, {
    recursive: true,
    filter: (srcPath) => {
      const base = srcPath.split(/[\\/]/).pop() ?? '';
      // Skip docs and any node_modules that shouldn't ship.
      return !['PRD.md', 'PLAN.md', 'node_modules'].includes(base);
    },
  });
  console.log(`[postbuild] copied ${name}/ -> dist/${name}/`);
}

// 6_site is a separate Vite app with its own dist/ build — copy that build
// output preserving the same /6_site/dist/... path the hub links use.
const chairtimeDist = resolve(root, '6_site', 'dist');
if (existsSync(chairtimeDist)) {
  const dest = resolve(dist, '6_site', 'dist');
  cpSync(chairtimeDist, dest, { recursive: true });
  console.log('[postbuild] copied 6_site/dist/ -> dist/6_site/dist/');
} else {
  console.warn('[postbuild] skip 6_site/dist — not built yet (run `npm run build` inside 6_site first)');
}
