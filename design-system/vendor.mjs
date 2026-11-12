#!/usr/bin/env node
/**
 * vendor.mjs — guarda una copia local de Tailwind y lucide en `vendor/`.
 *
 *   node vendor.mjs
 *
 * `guia-visual.html` es la referencia visual de Menorca Connect: intenta primero
 * la copia local de `vendor/` y usa el CDN como respaldo, para funcionar sin red.
 *
 * Plus Jakarta Sans y Montserrat se cargan desde Google Fonts (igual que en
 * `index.html`); si no hay conexión, caen a la sans-serif del sistema sin romper
 * la maquetación.
 */

import { mkdir, copyFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, 'vendor');

const DEPS = [
  { pkg: '@tailwindcss/browser@4.3.3', from: '@tailwindcss/browser/dist/index.global.js', to: 'tailwindcss-browser-4.3.3.js' },
  { pkg: 'lucide@1.47.0', from: 'lucide/dist/umd/lucide.min.js', to: 'lucide-1.47.0.min.js' },
];

await mkdir(out, { recursive: true });

const tmp = resolve(here, '.vendor-tmp');
await mkdir(tmp, { recursive: true });

console.log('Descargando…');
execFileSync('npm', ['install', '--silent', '--no-save', '--prefix', tmp, ...DEPS.map((d) => d.pkg)], { stdio: 'inherit' });

for (const dep of DEPS) {
  const src = resolve(tmp, 'node_modules', dep.from);
  const dst = resolve(out, dep.to);
  await copyFile(src, dst);
  const { size } = await stat(dst);
  console.log(`✓ vendor/${dep.to} (${Math.round(size / 1024)} KB)`);
}

console.log('\nListo. La guía usará estas copias antes de recurrir al CDN.');
console.log('Puedes borrar .vendor-tmp/ cuando quieras.');
