#!/usr/bin/env node
/**
 * validate-design-system.mjs — comprueba que el sistema de Menorca Connect es coherente consigo mismo.
 *
 *   node validate-design-system.mjs
 *   node validate-design-system.mjs --src ../..      ← además, lint del código web actual
 *
 * Comprueba:
 *   TOKENS    roles obligatorios, parejas {rol}-solid/-fg y cta/cta-fg, contraste real
 *             en los 4 esquemas×contextos (brisa, marino, web·brisa, web·marino),
 *             resolviendo var() y color-mix en OKLab; y la paleta categórica: contraste ≥3:1,
 *             separación normal ΔE ≥ 15 y con protanopia/deuteranopia ΔE ≥ 8 (Machado 2009).
 *   MANIFEST  módulos con icono y etiqueta · un icono ↔ un concepto · iconos que existen
 *             en lucide · vistas, plantillas, estados y menú /dashboard coherentes.
 *   DOCS      marcadores GEN con generador, enlaces locales válidos, referencias §N válidas.
 *   SYNC      guia-visual.html y MENORCA_CONNECT_DESIGN.md sincronizados (equivale a sync --check).
 *   CÓDIGO    (opcional, con --src) hex sueltos, rgba sueltos, valores arbitrarios,
 *             font-mono, cursiva, z-index y duraciones numéricas.
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, resolve, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const srcFlag = process.argv.indexOf('--src');
const srcDir = srcFlag > -1 ? resolve(process.cwd(), process.argv[srcFlag + 1]) : null;

const problems = [];
const notes = [];
const fail = (area, msg) => problems.push(`[${area}] ${msg}`);
const note = (area, msg) => notes.push(`[${area}] ${msg}`);

const tokensCss = await readFile(resolve(here, 'tokens.css'), 'utf8');
const manifest = JSON.parse(await readFile(resolve(here, 'design-manifest.json'), 'utf8'));
const doc = await readFile(resolve(here, 'MENORCA_CONNECT_DESIGN.md'), 'utf8');
const generic = await readFile(resolve(here, 'DESIGN_SYSTEM.md'), 'utf8');

/* ═══════════════════ color: resolver var() y color-mix(in oklab) ═══════════ */

const hex2rgb = (h) => h.replace('#', '').match(/../g).map((x) => parseInt(x, 16));
const s2l = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const l2s = (c) => { const v = c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, v)) * 255); };
const lum = ([r, g, b]) => 0.2126 * s2l(r) + 0.7152 * s2l(g) + 0.0722 * s2l(b);
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
function rgb2oklab([r, g, b]) {
  const R = s2l(r), G = s2l(g), B = s2l(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
}
function oklab2rgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  return [l2s(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    l2s(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    l2s(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)];
}
const mixOklab = (c1, c2, p) => {
  const A = rgb2oklab(c1), B = rgb2oklab(c2);
  return oklab2rgb(A.map((v, i) => v * p + B[i] * (1 - p)));
};
const deltaE = (a, b) => { const A = rgb2oklab(a), B = rgb2oklab(b); return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]) * 100; };
const CVD = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
};
const simulate = (rgb, M) => {
  const L = rgb.map(s2l);
  return M.map((r) => l2s(r[0] * L[0] + r[1] * L[1] + r[2] * L[2]));
};

const readDecls = (block) => {
  const out = new Map();
  for (const m of block.matchAll(/^\s*(--[\w-]+)\s*:\s*([^;]+);/gm)) out.set(m[1], m[2].trim());
  return out;
};
const themeStart = tokensCss.indexOf('@theme static {');
const themeEnd = tokensCss.indexOf('/* ══ 11.');
if (themeStart === -1 || themeEnd === -1) fail('TOKENS', 'no encuentro el bloque @theme o la sección 11 en tokens.css');
const decls = readDecls(tokensCss.slice(themeStart, themeEnd));
const darkMatch = tokensCss.match(/\[data-theme="dark"\]\s*\{([^}]*)\}/);
if (!darkMatch) fail('TOKENS', 'falta el bloque [data-theme="dark"] (esquema marino)');
const darkOnly = darkMatch ? readDecls(darkMatch[1]) : new Map();
const darkDecls = new Map([...decls, ...darkOnly]);

for (const [name, value] of decls) {
  if (!name.startsWith('--color-') || darkOnly.has(name)) continue;
  const refs = [...value.matchAll(/var\((--[\w-]+)\)/g)].map((m) => m[1]);
  if (refs.some((r) => darkOnly.has(r) && !/^--color-mc-/.test(r))) {
    fail('TOKENS', `${name} depende de un token que el esquema marino redefine, pero el esquema marino no lo vuelve a declarar`);
  }
}

function resolver(table) {
  return function resolveColor(expr, depth = 0) {
    if (depth > 12 || expr == null) return null;
    expr = expr.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (/^#[0-9a-f]{6}$/i.test(expr)) return hex2rgb(expr);
    if (expr === 'white') return [255, 255, 255];
    if (expr === 'black') return [0, 0, 0];
    if (expr === 'transparent') return null;
    const mix = expr.match(/^color-mix\(in oklab,\s*(.+?)\s+(\d+)%\s*,\s*(.+)\)$/);
    if (mix) {
      const a = resolveColor(mix[1], depth + 1);
      const b = resolveColor(mix[3], depth + 1);
      if (!a || !b) return null;
      return mixOklab(a, b, Number(mix[2]) / 100);
    }
    const v = expr.match(/^var\((--[\w-]+)\)$/);
    if (v) {
      if (table.has(v[1])) return resolveColor(table.get(v[1]), depth + 1);
      note('TOKENS', `no sé resolver ${v[1]}`);
      return null;
    }
    return null;
  };
}

const webMatch = tokensCss.match(/\[data-context="web"\]\s*\{([^}]*)\}/);
const webOnly = webMatch ? readDecls(webMatch[1]) : new Map();
const webDarkMatch = tokensCss.match(/\[data-context="web"\]\[data-theme="dark"\]\s*\{([^}]*)\}/);
const webDarkOnly = webDarkMatch ? readDecls(webDarkMatch[1]) : new Map();
const webDecls = new Map([...decls, ...webOnly]);
const webDarkDecls = new Map([...darkDecls, ...webDarkOnly]);
const schemes = [
  { name: 'brisa', table: decls, resolve: resolver(decls) },
  { name: 'marino', table: darkDecls, resolve: resolver(darkDecls) },
  { name: 'web·brisa', table: webDecls, resolve: resolver(webDecls) },
  { name: 'web·marino', table: webDarkDecls, resolve: resolver(webDarkDecls) },
];

/* ═══════════════════ 1 · TOKENS ════════════════════════════════════════════ */

const REQUIRED_ROLES = ['page', 'surface', 'surface-sunken', 'surface-raised', 'surface-hover',
  'surface-overlay', 'overlay', 'line', 'line-strong', 'fg', 'fg-muted', 'fg-subtle',
  'link', 'link-hover', 'primary', 'danger', 'success', 'warning', 'focus', 'cta', 'cta-fg'];
for (const role of REQUIRED_ROLES) {
  if (!decls.has(`--color-${role}`)) fail('TOKENS', `falta el rol obligatorio --color-${role}`);
}

const SOLID_ROLES = [];
for (const [name] of decls) {
  const m = name.match(/^--color-(.+)-solid$/);
  if (!m) continue;
  SOLID_ROLES.push(m[1]);
  if (!decls.has(`--color-${m[1]}-fg`)) {
    fail('TOKENS', `${name} no tiene pareja --color-${m[1]}-fg`);
  }
}

const SCHEME_TOKENS = ['page', 'surface', 'surface-sunken', 'surface-raised', 'surface-hover',
  'surface-overlay', 'overlay', 'line', 'line-strong', 'fg', 'fg-muted', 'fg-subtle'];
for (const t of SCHEME_TOKENS) {
  if (!darkOnly.has(`--color-${t}`)) fail('TOKENS', `el esquema marino no redefine --color-${t}`);
}

const CONTRAST_RULES = [
  ['fg', 4.5, 'texto principal'], ['fg-muted', 4.5, 'texto secundario'],
  ['line-strong', 3, 'borde de control'], ['focus', 3, 'anillo de foco'],
  ['primary', 4.5, 'texto de acción'], ['success', 4.5, 'texto de estado'],
  ['warning', 4.5, 'texto de estado'], ['danger', 4.5, 'texto de error'],
  ['secondary', 4.5, 'texto del botón secundario'], ['accent', 4.5, 'antetítulo e icono de acento'],
];
const CATS = [...decls.keys()].filter((k) => /^--color-cat-\d+$/.test(k)).map((k) => k.replace('--color-', ''));
for (const scheme of schemes) {
  const page = scheme.resolve(scheme.table.get('--color-page'));
  if (!page) { fail('TOKENS', `no puedo resolver --color-page en el esquema ${scheme.name}`); continue; }
  for (const [token, min, what] of CONTRAST_RULES) {
    const c = scheme.resolve(scheme.table.get(`--color-${token}`));
    if (!c) continue;
    const r = contrast(c, page);
    if (r < min) fail('TOKENS', `[${scheme.name}] ${token} da ${r.toFixed(2)}:1 sobre page y como ${what} necesita ≥${min}:1`);
  }
  for (const role of SOLID_ROLES) {
    const solid = scheme.resolve(scheme.table.get(`--color-${role}-solid`));
    const fg = scheme.resolve(scheme.table.get(`--color-${role}-fg`));
    if (!solid || !fg) continue;
    const r = contrast(solid, fg);
    if (r < 4.5) fail('TOKENS', `[${scheme.name}] ${role}-fg sobre ${role}-solid da ${r.toFixed(2)}:1 (necesita ≥4,5:1)`);
  }
  const cta = scheme.resolve(scheme.table.get('--color-cta'));
  const ctaFg = scheme.resolve(scheme.table.get('--color-cta-fg'));
  const ctaHover = scheme.resolve(scheme.table.get('--color-cta-hover'));
  if (cta && ctaFg && contrast(cta, ctaFg) < 4.5) {
    fail('TOKENS', `[${scheme.name}] cta-fg sobre cta da ${contrast(cta, ctaFg).toFixed(2)}:1 (necesita ≥4,5:1)`);
  }
  if (ctaHover && ctaFg && contrast(ctaHover, ctaFg) < 4.5) {
    fail('TOKENS', `[${scheme.name}] cta-fg sobre cta-hover da ${contrast(ctaHover, ctaFg).toFixed(2)}:1 (necesita ≥4,5:1)`);
  }

  const surface = scheme.name.includes('marino') ? null : scheme.resolve(scheme.table.get('--color-surface'));
  for (const cat of CATS) {
    const c = scheme.resolve(scheme.table.get(`--color-${cat}`));
    if (!c) continue;
    for (const [bg, where] of [[page, 'page'], [surface, 'surface']]) {
      if (!bg) continue;
      const r = contrast(c, bg);
      if (r < 3) fail('TOKENS', `[${scheme.name}] ${cat} da ${r.toFixed(2)}:1 sobre ${where}: una serie necesita ≥3:1`);
    }
  }
  const hover = scheme.resolve(scheme.table.get('--color-primary-hover'));
  const pfg = scheme.resolve(scheme.table.get('--color-primary-fg'));
  if (hover && pfg && contrast(hover, pfg) < 4.5) {
    fail('TOKENS', `[${scheme.name}] primary-fg sobre primary-hover da ${contrast(hover, pfg).toFixed(2)}:1 (necesita ≥4,5:1)`);
  }
}

/* Velo sobre fotografía: peor caso sobre blanco puro (#FFFFFF). */
{
  const m = (decls.get('--color-scrim') || '').match(/color-mix\(in oklab,\s*(.+?)\s+(\d+)%\s*,\s*transparent\)/);
  if (!m) fail('TOKENS', 'falta --color-scrim o no es color-mix(… N%, transparent)');
  else {
    const base = schemes[0].resolve(m[1]);
    const a = Number(m[2]) / 100;
    const over = base.map((v) => Math.round(v * a + 255 * (1 - a)));
    const text = schemes[1].resolve(darkDecls.get('--color-fg'));
    const r = contrast(over, text);
    if (r < 4.5) fail('TOKENS', `el velo deja el texto a ${r.toFixed(2)}:1 sobre una zona blanca de la foto (necesita ≥4,5:1)`);
    else note('TOKENS', `velo sobre fotografía · texto brisa sobre la zona más clara: ${r.toFixed(1)}:1`);
  }
}

/* Paleta categórica: separación entre pares en visión normal y dicromacia. */
{
  const res = schemes[0].resolve;
  const cols = CATS.map((c) => [c, res(decls.get(`--color-${c}`))]).filter((x) => x[1]);
  let worstN = [Infinity, ''], worstC = [Infinity, ''];
  for (let i = 0; i < cols.length; i++) {
    for (let j = i + 1; j < cols.length; j++) {
      const [a, ca] = cols[i], [b, cb] = cols[j];
      const dn = deltaE(ca, cb);
      if (dn < worstN[0]) worstN = [dn, `${a}/${b}`];
      if (dn < 15) fail('TOKENS', `${a} y ${b} están a ΔE ${dn.toFixed(1)} en visión normal (necesitan ≥15)`);
      for (const [type, M] of Object.entries(CVD)) {
        const dc = deltaE(simulate(ca, M), simulate(cb, M));
        if (dc < worstC[0]) worstC = [dc, `${a}/${b} (${type})`];
        if (dc < 8) fail('TOKENS', `${a} y ${b} están a ΔE ${dc.toFixed(1)} con ${type} (necesitan ≥8)`);
      }
    }
  }
  if (cols.length) {
    note('TOKENS', `paleta categórica · ${cols.length} entradas · peor par normal ΔE ${worstN[0].toFixed(1)} (${worstN[1]}) · peor par con daltonismo ΔE ${worstC[0].toFixed(1)} (${worstC[1]})`);
  }
  const roleCols = ['primary', 'success', 'warning', 'danger'].map((r) => [r, res(decls.get(`--color-${r}`))]).filter((x) => x[1]);
  let closest = [Infinity, ''];
  for (let i = 0; i < roleCols.length; i++) for (let j = i + 1; j < roleCols.length; j++) {
    const d = deltaE(roleCols[i][1], roleCols[j][1]);
    if (d < closest[0]) closest = [d, `${roleCols[i][0]}/${roleCols[j][0]}`];
  }
  if (roleCols.length > 1) note('TOKENS', `roles de texto · par más cercano ${closest[1]} ΔE ${closest[0].toFixed(1)}: por eso estado = color + icono + etiqueta`);
}

/* ═══════════════════ 2 · MANIFEST ══════════════════════════════════════════ */

const icons = new Map();
const concepts = new Map();
const allIconGroups = manifest.iconDictionary.concat([{
  group: 'Vistas',
  items: manifest.views.map((v) => ({ icon: v.icon, concept: v.label, label: v.label, legacy: null })),
}]);
for (const group of allIconGroups) {
  for (const it of group.items) {
    if (icons.has(it.icon) && icons.get(it.icon) !== it.concept) {
      fail('MANIFEST', `el icono "${it.icon}" tiene dos conceptos: «${icons.get(it.icon)}» y «${it.concept}». Un icono, un concepto`);
    }
    icons.set(it.icon, it.concept);
    if (concepts.has(it.concept) && concepts.get(it.concept) !== it.icon) {
      fail('MANIFEST', `el concepto «${it.concept}» tiene dos iconos: "${concepts.get(it.concept)}" y "${it.icon}". Un concepto, un icono`);
    }
    concepts.set(it.concept, it.icon);
  }
}

const viewIds = new Set(manifest.views.map((v) => v.id));
const templateIds = new Set(manifest.screenTemplates.map((t) => t.id));
const stateIds = new Set(manifest.screenStates.map((s) => s.s ?? s.id));
const STATUS_TONES = new Set(['neutral', 'primary', 'success', 'warning', 'danger']);
const variants = new Set(['soft', 'solid', 'outline', 'quiet']);
const domainNames = new Set(manifest.domainComponents.map((c) => c.name));

if (manifest.appShell?.context !== 'gestion') fail('MANIFEST', 'el menú lateral (appShell) debe pertenecer al contexto «gestion»');
const navigationIds = new Set();
for (const item of manifest.appShell.navigation) {
  if (navigationIds.has(item.id)) fail('MANIFEST', `el menú de gestión repite «${item.id}»`);
  navigationIds.add(item.id);
  if (!icons.has(item.icon)) fail('MANIFEST', `el menú usa «${item.icon}», que no está en el diccionario de iconos`);
  if (!item.route.startsWith('/dashboard')) fail('MANIFEST', `«${item.label}» apunta fuera de /dashboard`);
}
for (const id of ['resumen', 'solicitudes', 'tarifas', 'instalaciones', 'cobertura', 'empresas', 'analitica']) {
  if (!navigationIds.has(id)) fail('MANIFEST', `falta «${id}» en el menú de /dashboard`);
}

try {
  const lucide = await readFile(resolve(here, 'vendor/lucide-1.47.0.min.js'), 'utf8');
  const toPascal = (k) => k.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('');
  for (const [icon, concept] of icons) {
    if (!new RegExp(`\\b${toPascal(icon)}\\b`).test(lucide)) {
      fail('MANIFEST', `el icono "${icon}" (${concept}) no existe en lucide 1.47.0`);
    }
  }
} catch {
  note('MANIFEST', 'no he podido comprobar los iconos contra lucide: ejecuta `node vendor.mjs`');
}

for (const m of manifest.modules) {
  if (!m.icon || !m.label) fail('MANIFEST', `el módulo "${m.id}" no tiene icono o etiqueta`);
  if (m.icon && !icons.has(m.icon)) fail('MANIFEST', `el módulo "${m.id}" usa el icono "${m.icon}", que no está en el diccionario`);
  if (!navigationIds.has(m.id)) fail('MANIFEST', `el módulo "${m.id}" no está en el menú de gestión`);
  for (const t of m.templates) if (!templateIds.has(t)) fail('MANIFEST', `el módulo "${m.id}" declara la plantilla "${t}", que no existe`);
  for (const v of m.views) if (!viewIds.has(v)) fail('MANIFEST', `el módulo "${m.id}" declara la vista "${v}", que no existe`);
  for (const c of m.domainComponents) if (!domainNames.has(c)) fail('MANIFEST', `el módulo "${m.id}" declara el componente "${c}", que no está en domainComponents`);
  if (m.statusModel && !manifest.statusModels[m.statusModel]) fail('MANIFEST', `el módulo "${m.id}" apunta al modelo de estados "${m.statusModel}", que no existe`);
}

for (const [key, model] of Object.entries(manifest.statusModels)) {
  for (const g of model.groups) {
    for (const it of g.items) {
      if (!STATUS_TONES.has(it.tone)) fail('MANIFEST', `el estado ${key}.${it.id} usa el tono "${it.tone}", que no es un rol válido`);
      if (!variants.has(it.variant)) fail('MANIFEST', `el estado ${key}.${it.id} usa la variante "${it.variant}", que no existe en Badge`);
      if (it.icon && !icons.has(it.icon)) fail('MANIFEST', `el estado ${key}.${it.id} usa el icono "${it.icon}", que no está en el diccionario`);
      if (it.tone !== 'neutral' && !it.icon) fail('MANIFEST', `el estado ${key}.${it.id} tiene color y no tiene icono`);
    }
  }
}

for (const t of manifest.screenTemplates) {
  for (const st of t.states) if (!stateIds.has(st)) fail('MANIFEST', `la plantilla "${t.id}" declara el estado "${st}", que no existe`);
}
for (const row of manifest.screenTemplateMap) {
  if (!templateIds.has(row.template)) fail('MANIFEST', `«${row.view}» apunta a la plantilla "${row.template}", que no existe`);
}
const mapped = new Set(manifest.screenTemplateMap.map((r) => r.template));
for (const t of templateIds) {
  if (!mapped.has(t)) note('MANIFEST', `la plantilla "${t}" no la usa ninguna vista del producto`);
}
for (const r of manifest.componentStates.rows) {
  if (r.states.length !== manifest.componentStates.columns.length) {
    fail('MANIFEST', `la fila "${r.component}" de la matriz de estados no tiene ${manifest.componentStates.columns.length} valores`);
  }
}
for (const sfc of manifest.motion.surfaces) {
  for (const field of ['entrada', 'salida', 'origen', 'disparador']) {
    if (!sfc[field]) fail('MANIFEST', `la superficie "${sfc.surface}" no declara "${field}"`);
  }
  if (sfc.clase && sfc.clase !== '—') {
    for (const cls of sfc.clase.split('+').map((c) => c.trim())) {
      if (!tokensCss.includes(`.${cls}`)) {
        fail('MANIFEST', `la superficie "${sfc.surface}" declara la clase "${cls}", que no existe en tokens.css`);
      }
    }
  }
}
for (const r of manifest.responsive.rows) {
  if (r.values.length !== manifest.responsive.columns.length) {
    fail('MANIFEST', `la fila "${r.pattern}" de la matriz responsive no tiene ${manifest.responsive.columns.length} valores`);
  }
}
const pending = JSON.stringify(manifest.media).match(/⚠️ DECIDIR/g);
if (pending) note('MANIFEST', `la política de imagen tiene ${pending.length} decisiones pendientes`);

/* ═══════════════════ 3 · DOCUMENTACIÓN ═════════════════════════════════════ */

const syncSrc = await readFile(resolve(here, 'sync-design-system.mjs'), 'utf8');
const genBlock = syncSrc.match(/const GEN = \{([\s\S]*?)\n\};/);
const GEN_KEYS = genBlock ? [...genBlock[1].matchAll(/^\s{2}(\w+)\(m/gm)].map((x) => x[1]) : [];
if (!GEN_KEYS.length) fail('DOCS', 'no he podido leer los generadores de sync-design-system.mjs');

for (const m of doc.matchAll(/<!-- GEN:([\w.]+)/g)) {
  const [key, arg] = m[1].split('.');
  if (!GEN_KEYS.includes(key)) fail('DOCS', `el marcador GEN:${m[1]} no tiene generador en sync-design-system.mjs`);
  if (key === 'status' && !manifest.statusModels[arg]) fail('DOCS', `el marcador GEN:${m[1]} apunta a un modelo de estados que no existe`);
}
for (const m of doc.matchAll(/<!-- GEN:([\w.]+)[^>]*-->/g)) {
  if (!doc.includes(`<!-- /GEN:${m[1]} -->`)) fail('DOCS', `el marcador GEN:${m[1]} no está cerrado`);
}
for (const key of Object.keys(manifest.statusModels)) {
  if (!doc.includes(`<!-- GEN:status.${key} `)) fail('DOCS', `el modelo de estados «${key}» no aparece en MENORCA_CONNECT_DESIGN.md (falta su marcador GEN)`);
}

const files = new Set(await readdir(here));
for (const [, target] of [...doc.matchAll(/\]\(\.\/([^)#]+)[^)]*\)/g), ...generic.matchAll(/\]\(\.\/([^)#]+)[^)]*\)/g)]) {
  if (!files.has(target)) fail('DOCS', `enlace roto: ./${target}`);
}

for (const [file, text] of [['MENORCA_CONNECT_DESIGN.md', doc], ['DESIGN_SYSTEM.md', generic]]) {
  const sections = new Set();
  for (const m of text.matchAll(/^#{2,3} (\d+)(?:\.(\d+))?\./gm)) {
    sections.add(m[1]);
    if (m[2]) sections.add(`${m[1]}.${m[2]}`);
  }
  for (const m of text.matchAll(/(?<!`)§(\d+(?:\.\d+)?)/g)) {
    const before = text.slice(Math.max(0, m.index - 40), m.index);
    if (/\.md`?\s*$|DESIGN_SYSTEM|_ARCHITECTURE|dataviz|PLAN_RECONSTRUCCION/.test(before)) continue;
    if (!sections.has(m[1])) fail('DOCS', `${file} referencia §${m[1]}, que no existe en ese documento`);
  }
}

/* ═══════════════════ 4 · SINCRONÍA ═════════════════════════════════════════ */

try {
  execFileSync('node', [resolve(here, 'sync-design-system.mjs'), '--check'], { stdio: 'pipe' });
} catch {
  fail('SYNC', 'la guía o el documento no están al día: ejecuta `node sync-design-system.mjs`');
}

/* ═══════════════════ 5 · CÓDIGO (opcional) ═════════════════════════════════ */

if (srcDir) {
  const LINTS = [
    [/#[0-9a-fA-F]{6}\b/, 'hex suelto'],
    [/\brgba?\(\s*\d/, 'rgba suelto (usa un token o color-mix)'],
    [/\btext-\[\d+px\]/, 'tamaño de texto arbitrario'],
    [/\brounded-\[[^\]]+\]/, 'radio arbitrario'],
    [/\bz-(?:[1-9]\d*)\b|\bz-\[\d+\]|z-index:\s*\d{2,}/, 'z-index numérico (usa z-modal, z-sticky, z-dropdown…)'],
    [/\bduration-\d+\b/, 'duración numérica (usa duration-fast/base/slow)'],
    [/\bfont-mono\b|monospace/, 'monoespaciada'],
    [/font-style:\s*italic|\bitalic\b/, 'cursiva sintética'],
    [/linear-gradient|radial-gradient/, 'degradado (usa bg-scrim plano)'],
    [/\b(?:bg|text|border)-(?:gray|slate|neutral|stone|zinc)-\d{2,3}\b/, 'gris de Tailwind (usa tokens de brisa + marino)'],
  ];
  const exts = ['.tsx', '.ts', '.jsx', '.js', '.css', '.html'];
  const skip = new Set(['node_modules', '.next', '.vercel', '.git', 'dist', 'build', 'docs', 'context', 'vendor', 'assets']);
  let scanned = 0;
  async function walk(dir) {
    let entries;
    try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (skip.has(e.name)) continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) { await walk(full); continue; }
      if (!exts.some((x) => e.name.endsWith(x))) continue;
      const text = await readFile(full, 'utf8');
      scanned++;
      text.split('\n').forEach((line, i) => {
        if (line.includes('DS-EXCEPTION')) return;
        for (const [re, what] of LINTS) {
          if (re.test(line)) fail('CÓDIGO', `${relative(srcDir, full)}:${i + 1} · ${what}`);
        }
      });
    }
  }
  try { await stat(srcDir); await walk(srcDir); note('CÓDIGO', `${scanned} archivos revisados en ${srcDir}`); }
  catch { fail('CÓDIGO', `no encuentro el directorio ${srcDir}`); }
} else {
  note('CÓDIGO', 'lint del código no ejecutado (pásale --src <dir> para incluirlo)');
}

/* ═══════════════════ informe ═══════════════════════════════════════════════ */

for (const n of notes) console.log(`  · ${n}`);
if (!problems.length) {
  console.log('\n✓ Design system coherente.');
  process.exit(0);
}
console.error(`\n✗ ${problems.length} problema(s):\n`);
for (const p of problems) console.error(`  ${p}`);
process.exit(1);
