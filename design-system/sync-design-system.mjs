#!/usr/bin/env node
/**
 * sync-design-system.mjs — propaga las dos fuentes únicas a todo lo demás.
 *
 *   node sync-design-system.mjs           escribe
 *   node sync-design-system.mjs --check   comprueba; sale con 1 si algo difiere
 *
 *   tokens.css                      ──► guia-visual.html            (bloque TOKENS)
 *   design-manifest.json            ──► guia-visual.html            (bloque MANIFEST)
 *                                   └─► MENORCA_CONNECT_DESIGN.md   (tablas entre marcadores GEN)
 *   assets/logo-menorca-connect.svg ──► guia-visual.html            (bloque LOGO, con los colores
 *                                       pasados a tokens: fill-logo-mark / fill-logo-text)
 *
 * Añádelo al pre-commit o a CI:
 *   node docs/design-system/sync-design-system.mjs --check
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const F = {
  tokens: resolve(here, 'tokens.css'),
  manifest: resolve(here, 'design-manifest.json'),
  guide: resolve(here, 'guia-visual.html'),
  doc: resolve(here, 'MENORCA_CONNECT_DESIGN.md'),
  logo: resolve(here, 'assets/logo-menorca-connect.svg'),
};

const check = process.argv.includes('--check');
const changes = [];

/* ── utilidades de bloque ─────────────────────────────────────────────────── */

function splice(source, file, beginMark, endMark, body) {
  const start = source.indexOf(beginMark);
  const end = source.indexOf(endMark);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`No encuentro ${beginMark} / ${endMark} en ${basename(file)}`);
  }
  return source.slice(0, start) + beginMark + '\n' + body + '\n' + source.slice(end);
}

const indent = (text, spaces) =>
  text.trimEnd().split('\n').map((l) => (l.trim() ? ' '.repeat(spaces) + l : '')).join('\n');

/* ── generadores de tabla markdown ────────────────────────────────────────── */

const cell = (v) => (v == null || v === '' ? '—' : String(v).replace(/\|/g, '\\|'));
const table = (headers, rows) =>
  [`| ${headers.join(' | ')} |`, `|${headers.map(() => '---').join('|')}|`,
   ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n');

const bullets = (items) => items.map((i) => `- ${i}`).join('\n');

const GEN = {
  styleProfile(m) {
    const p = m.styleProfile;
    const section = (title, key) => `**${title}**\n\n${bullets(p[key])}`;
    return [
      section('Carácter', 'caracter'),
      section('Jerarquía', 'jerarquia'),
      section('Geometría', 'geometria'),
      section('Superficies', 'superficies'),
      section('Tipografía', 'tipografia'),
      section('Uso del color', 'color'),
      section('Densidad', 'densidad'),
      section('Movimiento', 'movimiento'),
      section('Datos y gráficos', 'datos'),
      `**Nunca hacemos**\n\n${bullets(p.neverDo)}`,
    ].join('\n\n');
  },

  contexts(m) {
    return table(['Contexto', 'Dónde', 'Carácter'],
      m.contexts.map((c) => [`**${c.label}**`, c.routes, c.character]));
  },

  modules(m) {
    return table(['Módulo', 'Icono', 'Plantillas permitidas', 'Vistas', 'Estados', 'Componentes de dominio'],
      m.modules.map((x) => [
        `**${x.label}**`, `\`${x.icon}\``,
        x.templates.join(' · '),
        x.views.join(' · '),
        x.statusModel ? `\`${x.statusModel}\`` : '—',
        x.domainComponents.length ? x.domainComponents.map((c) => `\`${c}\``).join(' · ') : '—',
      ]));
  },

  moduleContract(m) {
    const c = m.moduleContract;
    return `**Puede añadir:**\n\n${bullets(c.mayAdd)}\n\n**No puede redefinir:**\n\n${bullets(c.mayNotRedefine.map((x) => `\`${x}\``))}`;
  },

  appShell(m) {
    const a = m.appShell;
    return `**Contexto exclusivo:** ${a.context}. ${a.navigationRule}\n\n` +
      table(['Sección', 'Ruta', 'Subsecciones'], a.navigation.map((n) => [`**${n.label}** · \`${n.icon}\``, `\`${n.route}\``, (n.children || []).join(' · ') || '—'])) +
      `\n\nAnchos: **desplegado ${a.widths.expanded}** · **contraído ${a.widths.collapsed}**.\n\n` +
      table(['Aspecto', 'Regla'], a.collapse.map((c) => [`**${c.aspecto}**`, c.regla]));
  },

  views(m) {
    return table(['Vista', 'Icono', 'Etiqueta', 'Cuándo'],
      m.views.map((v) => [`\`${v.id}\``, `\`${v.icon}\``, v.label, v.note]));
  },

  status(m, key) {
    const model = m.statusModels[key];
    const parts = model.groups.map((g) =>
      `**${g.label}**${g.note ? ` — ${g.note}` : ''}\n\n` +
      table(['Estado', 'Etiqueta', 'Rol · variante', 'Icono', 'Significado'],
        g.items.map((i) => [`\`${i.id}\``, i.label, `**\`${i.tone}\`** · ${i.variant}`,
          i.icon ? `\`${i.icon}\`` : '—', i.meaning])));
    if (model.rule) parts.push(`Regla que se lee sola: **${model.rule}**.`);
    if (model.hiddenStates.length) {
      parts.push(`${model.hiddenStates.map((s) => `\`${s}\``).join(', ')} — ${model.hiddenNote}`);
    }
    return parts.join('\n\n');
  },

  icons(m) {
    return m.iconDictionary.map((g) =>
      `### ${g.group}\n\n` +
      table(['Concepto', 'Icono', 'Etiqueta estándar', 'Alias en el código actual'],
        g.items.map((i) => [i.concept, `\`${i.icon}\``, i.label, i.legacy ? `\`${i.legacy}\`` : '—']))
    ).join('\n\n');
  },

  vocabulary(m) {
    return table(['Situación', 'Fórmula'], m.vocabulary.map((v) => [v.case, v.formula]));
  },

  screenTemplates(m) {
    return table(['Plantilla', 'Qué fija', 'Estados que debe cubrir'],
      m.screenTemplates.map((t) => [`**${t.label}** \`${t.id}\``, t.note, t.states.map((s) => `\`${s}\``).join(' ')]));
  },

  screenStates(m) {
    return table(['Estado', 'Componente', 'Nota'],
      m.screenStates.map((s) => [`**${s.label}** \`${s.id}\``, `\`${s.component}\``, s.note]));
  },

  screenTemplateMap(m) {
    return table(['Vista', 'Plantilla'],
      m.screenTemplateMap.map((r) => [r.view, `\`${r.template}\``]));
  },

  componentStates(m) {
    const c = m.componentStates;
    return table(['Componente', ...c.columns], c.rows.map((r) => [`\`${r.component}\``, ...r.states]));
  },

  motion(m) {
    const mo = m.motion;
    return `> ${mo.rule}\n\n` +
      table(['Superficie', 'Clase', 'Entrada', 'Salida', 'Origen', 'Disparador'],
        mo.surfaces.map((x) => [`**${x.surface}**`, x.clase === '—' ? '—' : `\`${x.clase}\``,
          x.entrada, x.salida, x.origen, `\`${x.disparador}\``])) +
      `\n\n**Con \`prefers-reduced-motion\`:**\n\n${bullets(mo.reducedMotion)}` +
      `\n\n**Nunca:**\n\n${bullets(mo.neverDo)}`;
  },

  responsive(m) {
    const r = m.responsive;
    return table(['Patrón', ...r.columns], r.rows.map((x) => [`**${x.pattern}**`, ...x.values]));
  },

  domainComponents(m) {
    return table(['Componente', 'Ámbito', 'Nota'],
      m.domainComponents.map((c) => [`\`${c.name}\``, c.module, c.note]));
  },

  media(m) {
    const md = m.media;
    const block = (title, obj) =>
      `**${title}**\n\n` + table(['Aspecto', 'Decisión'],
        Object.entries(obj).map(([k, v]) => [k, v]));
    return [
      block('Fotografía', md.fotografia),
      block('Vídeo', md.video),
      block('Ilustración', md.ilustracion),
      block('Logos de terceros', md.logosTerceros),
    ].join('\n\n');
  },
};

/* ── ejecución ────────────────────────────────────────────────────────────── */

const lf = (s) => s.replace(/\r\n/g, '\n');
const [tokensRaw, manifestRaw, guideRaw, docRaw] = await Promise.all([
  readFile(F.tokens, 'utf8'),
  readFile(F.manifest, 'utf8'),
  readFile(F.guide, 'utf8'),
  readFile(F.doc, 'utf8'),
]);
const [tokens, guideBefore, docBefore] = [lf(tokensRaw), lf(guideRaw), lf(docRaw)];

let manifest;
try {
  manifest = JSON.parse(manifestRaw);
} catch (err) {
  console.error(`✗ design-manifest.json no es JSON válido: ${err.message}`);
  process.exit(1);
}

/* 1 · tokens.css → guía */
let guide = splice(
  guideBefore, F.guide,
  '/* ==== TOKENS:BEGIN — generado desde tokens.css · no editar a mano ==== */',
  '    /* ==== TOKENS:END ==== */',
  indent(tokens, 4)
);

/* 2 · manifest → guía (JSON compacto) */
const compact = JSON.stringify(manifest, (k, v) => (k === '_comment' ? undefined : v)).replace(/<\//g, '<\\/');
guide = splice(
  guide, F.guide,
  '  <!-- ==== MANIFEST:BEGIN — generado desde design-manifest.json · no editar a mano ==== -->',
  '  <!-- ==== MANIFEST:END ==== -->',
  `  <script id="ds-manifest" type="application/json">${compact}</script>`
);

/* 2b · logotipo → guía (assets/logo-menorca-connect.svg → tokens fill-logo-mark / fill-logo-text) */
const logoRaw = await readFile(F.logo, 'utf8');
const viewBox = (logoRaw.match(/viewBox="([^"]+)"/) || [])[1];
const logoBody = logoRaw
  .replace(/^[\s\S]*?<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<defs>[\s\S]*?<\/defs>/, '')
  .replace(/class="cls-crest"/g, 'data-logo-crest')
  .replace(/class="cls-wordmark"/g, 'data-logo-wordmark')
  .replace(/class="cls-mark"/g, 'class="fill-logo-mark"')
  .replace(/class="cls-text"/g, 'class="fill-logo-text"')
  .replace(/\s*\n\s*/g, '');
if (!viewBox || /class="cls-/.test(logoBody)) {
  throw new Error('assets/logo-menorca-connect.svg tiene una estructura que no reconozco (viewBox o clases .cls-* nuevas)');
}
guide = splice(
  guide, F.guide,
  '  <!-- ==== LOGO:BEGIN — generado desde assets/logo-menorca-connect.svg · no editar a mano ==== -->',
  '  <!-- ==== LOGO:END ==== -->',
  `  <template id="ds-logo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill-rule="evenodd">${logoBody}</svg></template>`
);

/* 3 · manifest → tablas de MENORCA_CONNECT_DESIGN.md */
let doc = docBefore;
const keys = [
  'styleProfile', 'contexts', 'modules', 'appShell', 'moduleContract', 'views',
  ...Object.keys(manifest.statusModels).map((k) => `status.${k}`),
  'icons', 'vocabulary', 'screenTemplates', 'screenStates', 'screenTemplateMap',
  'componentStates', 'motion', 'responsive', 'domainComponents', 'media',
];
for (const key of keys) {
  const begin = `<!-- GEN:${key} — generado desde design-manifest.json · no editar a mano -->`;
  const end = `<!-- /GEN:${key} -->`;
  if (!doc.includes(begin)) continue;
  const [fn, arg] = key.split('.');
  doc = splice(doc, F.doc, begin, end, GEN[fn](manifest, arg));
}

/* 4 · escribir o comprobar */
const results = [
  ['guia-visual.html', guideBefore, guide, F.guide],
  ['MENORCA_CONNECT_DESIGN.md', docBefore, doc, F.doc],
];
for (const [name, before, after] of results) if (before !== after) changes.push(name);

if (!changes.length) {
  console.log('✓ guía y documento sincronizados con tokens.css + design-manifest.json');
  process.exit(0);
}

if (check) {
  console.error(
    `✗ Desincronizado: ${changes.join(', ')}.\n` +
    '  Ejecuta `node docs/design-system/sync-design-system.mjs` y vuelve a commitear.'
  );
  process.exit(1);
}

for (const [name, before, after, path] of results) {
  if (before !== after) {
    await writeFile(path, after, 'utf8');
    console.log(`✓ → ${name}`);
  }
}
