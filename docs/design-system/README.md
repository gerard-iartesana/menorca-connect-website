# Design System · Menorca Connect

Sistema de diseño canónico para la web comercial pública de **Menorca Connect** (`index.html`, Fibra Óptica hasta 1 Gb, Móvil 5G, Menorca TV, Combos y Empresas en los 8 municipios de la isla) y la plataforma privada de operaciones y atención local (`/dashboard`).

> **Estado actual:** `v0.1 · Propuesta (solo guía)`. La portada comercial actual en la raíz (`index.html` + `styles.css` + `app.js`) no importa todavía `tokens.css`; toda la exploración visual, prueba de contraste y ajuste en vivo se realiza primero sobre [`guia-visual.html`](./guia-visual.html).

## Estructura de archivos

| Archivo | Qué es | ¿Se edita a mano? |
|---|---|---|
| [`tokens.css`](./tokens.css) | **Fuente única de valores visuales:** primitivos `--color-mc-*`, esquemas brisa y marino, contextos `gestion` y `web`, paleta categórica de familias de producto, tipografía `Plus Jakarta Sans` + `Montserrat`, radios (`8 · 14 · 18px`), densidad y contrato de movimiento | **Sí** |
| [`design-manifest.json`](./design-manifest.json) | **Fuente única de decisiones estructuradas:** ADN visual, módulos de `/dashboard`, modelos de estado, diccionario 1↔1 de iconos Lucide, vocabulario local menorquín, plantillas de pantalla, responsive y política fotográfica | **Sí** |
| [`guia-visual.html`](./guia-visual.html) | **Guía visual interactiva y banco de pruebas:** las 10 plantillas de pantalla completas (panel y web), catálogo de componentes, contraste WCAG calculado en vivo y **Editor de tokens** lateral con exportación de cambios | Solo su estructura; los bloques `TOKENS`, `MANIFEST` y `LOGO` los inyecta `sync-design-system.mjs` |
| [`MENORCA_CONNECT_DESIGN.md`](./MENORCA_CONNECT_DESIGN.md) | **Documento del proyecto:** motivos, auditoría del código actual (`index.html` / `styles.css` / `app.js`), plan de migración y registro de decisiones | La prosa sí; las tablas `<!-- GEN:... -->` las genera `sync-design-system.mjs` |
| [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | **Reglas generales portables** del sistema de diseño (arquitectura, accesibilidad, visualización de datos, protocolo de cambios) | No (reglas base transversales) |
| [`assets/logo-menorca-connect.svg`](./assets/logo-menorca-connect.svg) | Logotipo vectorial oficial del que se extraen el logotipo horizontal tokenizado y el isotipo (doble pico `M` + ondas de señal) | Solo si cambia la marca |
| [`sync-design-system.mjs`](./sync-design-system.mjs) | Propaga `tokens.css`, `design-manifest.json` y `logo-menorca-connect.svg` a `guia-visual.html` y `MENORCA_CONNECT_DESIGN.md` | Script |
| [`validate-design-system.mjs`](./validate-design-system.mjs) | Valida contrastes WCAG en los 4 esquemas×contextos, separación OKLab ΔE con daltonismo, iconos en Lucide, integridad del manifest, enlaces y sincronía (y lint opcional de código) | Script |
| [`vendor.mjs`](./vendor.mjs) | Descarga copias locales de Tailwind Browser y Lucide en `vendor/` para que `guia-visual.html` funcione sin internet | Script |
| [`visual-check.mjs`](./visual-check.mjs) | Regresión visual con Playwright sobre las plantillas canónicas en escritorio (`1440px`) y móvil (`390px`) | Script |

## Cómo usar la guía y el Editor de tokens

1. Abre `docs/design-system/guia-visual.html` en el navegador (doble clic local sobre `file://` gracias a `vendor/`, o directamente desde la URL desplegada en Vercel).
2. Pulsa **Editor de tokens** (arriba a la derecha) para abrir el menú lateral de edición en vivo:
   - Ajusta **paleta de marca** (`mc-marino`, `mc-brisa`, `mc-blanco`, `mc-turquesa`, `mc-verde`, `mc-ambar`, `mc-coral`), **colores derivados / series categóricas**, **radios**, **densidad de controles** y **tamaños de texto**.
   - Todos los componentes, plantillas de pantalla y medidores de contraste WCAG se recalculan al instante (marcando en rojo cualquier par que baje del mínimo AA).
   - Pulsa **Copiar cambios** para obtener el resumen listo para pegar en el chat y aplicarlo con el protocolo oficial, o **Restablecer** para volver a los valores de `tokens.css`.

## Comandos habituales

```bash
# Propagar cambios de tokens.css o design-manifest.json a la guía y al documento
node docs/design-system/sync-design-system.mjs

# Comprobar que todo está sincronizado y cumple contraste, iconos y enlaces (CI / pre-commit)
node docs/design-system/validate-design-system.mjs

# Auditar además el código actual de la web frente al sistema
node docs/design-system/validate-design-system.mjs --src .

# Regenerar copias locales de Tailwind y Lucide en vendor/
node docs/design-system/vendor.mjs
```
