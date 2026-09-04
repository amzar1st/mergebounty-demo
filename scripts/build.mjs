import { cp, mkdir, rm, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const src = resolve(root, 'frontend');
const out = resolve(root, 'dist');

async function requireFile(path) {
  const info = await stat(path);
  if (!info.isFile()) throw new Error(`Required file is not a file: ${path}`);
}

await Promise.all([
  requireFile(resolve(src, 'index.html')),
  requireFile(resolve(src, 'js/app.js')),
  requireFile(resolve(src, 'js/genlayer.js')),
  requireFile(resolve(src, 'js/wallet.js')),
  requireFile(resolve(src, 'css/main.css')),
]);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(src, out, { recursive: true });
console.log(`MergeBounty build complete: ${out}`);
