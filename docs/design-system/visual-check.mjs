#!/usr/bin/env node
/**
 * visual-check.mjs — regresión visual de la guía de Menorca Connect.
 *
 *   node visual-check.mjs --update    genera/actualiza las capturas de referencia
 *   node visual-check.mjs             compara y sale con 1 si algo se ha roto
 *
 * Captura las plantillas canónicas de `guia-visual.html` (panel /dashboard y web
 * pública en escritorio y móvil) para detectar roturas estructurales, desbordes
 * horizontales o recursos caídos.
 *
 * Requisitos: `npm i -D playwright` y `node vendor.mjs`.
 */

import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const baseDir = resolve(here, 'visual-baseline');
const update = process.argv.includes('--update');

const CHANNEL_TOLERANCE = 12;
const MAX_DIFF_RATIO = 0.005;

const SHOTS = [
  { id: 'inicio-escritorio', width: 1440, section: 'adn' },
  { id: 'solicitudes-escritorio', width: 1440, section: 'pantallas', screen: 'list' },
  { id: 'solicitudes-movil', width: 390, section: 'pantallas', screen: 'list' },
  { id: 'resumen-escritorio', width: 1440, section: 'pantallas', screen: 'metrics' },
  { id: 'tarifas-escritorio', width: 1440, section: 'pantallas', screen: 'long-form' },
  { id: 'portada-web-escritorio', width: 1440, section: 'pantallas', screen: 'public-landing' },
  { id: 'portada-web-movil', width: 390, section: 'pantallas', screen: 'public-landing' },
  { id: 'cobertura-web-escritorio', width: 1440, section: 'pantallas', screen: 'coverage-page' },
  { id: 'piezas-web', width: 1440, section: 'web' },
  { id: 'componentes-movil', width: 390, section: 'botones' },
];

let chromium;
try { ({ chromium } = await import('playwright')); }
catch {
  console.error('✗ Falta Playwright. Instálalo con `npm i -D playwright` y vuelve a ejecutarlo.');
  process.exit(1);
}

await mkdir(baseDir, { recursive: true });
const existing = new Set(await readdir(baseDir).catch(() => []));

const browser = await chromium.launch(process.env.PW_EXECUTABLE ? { executablePath: process.env.PW_EXECUTABLE } : {});
const url = pathToFileURL(resolve(here, 'guia-visual.html')).href;
const failures = [];
const updated = [];

async function diffRatio(page, a, b) {
  return page.evaluate(async ({ a, b, tol }) => {
    const load = (src) => new Promise((ok, no) => {
      const img = new Image(); img.onload = () => ok(img); img.onerror = no; img.src = src;
    });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    if (ia.width !== ib.width || ia.height !== ib.height) return 1;
    const c = document.createElement('canvas');
    c.width = ia.width; c.height = ia.height;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(ia, 0, 0);
    const da = ctx.getImageData(0, 0, c.width, c.height).data;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(ib, 0, 0);
    const db = ctx.getImageData(0, 0, c.width, c.height).data;
    let diff = 0;
    for (let i = 0; i < da.length; i += 4) {
      if (Math.abs(da[i] - db[i]) > tol || Math.abs(da[i + 1] - db[i + 1]) > tol ||
          Math.abs(da[i + 2] - db[i + 2]) > tol) diff++;
    }
    return diff / (da.length / 4);
  }, { a, b, tol: CHANNEL_TOLERANCE });
}

const differ = await browser.newPage();
await differ.goto('about:blank');

for (const shot of SHOTS) {
  const page = await browser.newPage({ viewport: { width: shot.width, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(3500);

  const broken = await page.evaluate(() => !document.getElementById('load-error').hidden);
  if (broken) failures.push(`${shot.id}: la guía no ha podido cargar sus recursos`);
  if (pageErrors.length) failures.push(`${shot.id}: error de JS · ${pageErrors[0]}`);

  if (shot.screen) {
    await page.click(`[data-screen="${shot.screen}"]`);
    await page.waitForTimeout(500);
  }
  await page.evaluate((id) => document.getElementById(id).scrollIntoView(), shot.section);
  await page.evaluate(() => document.querySelectorAll('.ds-reveal, .ds-reveal-mask').forEach((el) => el.setAttribute('data-revealed', '')));
  await page.waitForTimeout(900);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) failures.push(`${shot.id}: ${overflow}px de scroll horizontal`);

  const png = await page.screenshot();
  const current = `data:image/png;base64,${png.toString('base64')}`;
  const file = resolve(baseDir, `${shot.id}.png`);

  if (update || !existing.has(`${shot.id}.png`)) {
    await writeFile(file, png);
    updated.push(shot.id);
  } else {
    const base = await readFile(file);
    const ratio = await diffRatio(differ, `data:image/png;base64,${base.toString('base64')}`, current);
    if (process.env.VISUAL_VERBOSE) console.log(`  ${shot.id}: ${(ratio * 100).toFixed(3)}%`);
    if (ratio > MAX_DIFF_RATIO) {
      failures.push(`${shot.id}: ${(ratio * 100).toFixed(1)}% de píxeles distintos (límite ${MAX_DIFF_RATIO * 100}%)`);
      await writeFile(resolve(baseDir, `${shot.id}.actual.png`), png);
    }
  }
  await page.close();
}

await browser.close();

if (updated.length) console.log(`✓ Referencias generadas: ${updated.join(', ')}`);
if (!failures.length) {
  console.log('✓ Sin regresiones visuales.');
  process.exit(0);
}
console.error(`\n✗ ${failures.length} problema(s):\n`);
for (const f of failures) console.error(`  ${f}`);
console.error('\n  Las capturas actuales están en visual-baseline/*.actual.png.');
console.error('  Si el cambio es intencionado: `node visual-check.mjs --update`.');
process.exit(1);
