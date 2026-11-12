# Design System — Guía genérica

> **Documento portable.** No contiene valores ni decisiones de ningún proyecto concreto: define *cómo*
> se organiza un sistema de diseño, qué piezas tiene y qué reglas se cumplen.
>
> Un proyecto tiene **dos fuentes únicas y un documento**:
>
> | Archivo | Qué contiene |
> |---|---|
> | `tokens.css` | Los **valores**: color, tipografía, espaciado, densidad, radios, profundidad, movimiento. |
> | `design-manifest.json` | Las **decisiones estructuradas**: módulos, iconos, vocabulario, estados, vistas, plantillas, matriz responsive. Lo que no cabe en CSS pero tampoco debe escribirse dos veces en prosa. |
> | `<PROYECTO>_DESIGN.md` | El **motivo**: ADN visual, por qué se decidió cada cosa, deuda y registro. Sus tablas de datos se **generan** desde el manifest. |
>
> Para reutilizarlo en otro proyecto:
> 1. copia este archivo tal cual;
> 2. copia `tokens.css` y sustituye los valores;
> 3. copia `design-manifest.json` y sustituye los datos;
> 4. crea un `<PROYECTO>_DESIGN.md` a partir de la plantilla del §13;
> 5. copia `guia-visual.html`, `sync-design-system.mjs`, `validate-design-system.mjs` y `vendor.mjs`,
>    y ejecuta `node sync-design-system.mjs`;
> 6. añade el bloque del §12 al `AGENTS.md` / `CLAUDE.md` del proyecto.

---

## Cómo leer este documento

No todas las reglas tienen el mismo rango. Mezclarlas es lo que convierte una guía portable en la
estética de un cliente concreto, así que van etiquetadas:

| Etiqueta | Qué significa |
|---|---|
| **`[INV]`** | **Invariante.** Es lo que hace que un design system funcione. No se discute ni se adapta. |
| **`[DEF]`** | **Por defecto.** Recomendación sensata. Se puede romper **si el proyecto lo justifica y lo documenta** en su registro de decisiones. |
| **`[PRY]`** | **Decisión de proyecto.** Aquí aparece la de BSC como ejemplo. En otro proyecto se decide de cero. |

Ejemplos de la diferencia: «semántica antes que valor» es `[INV]`; «máximo 8 pasos tipográficos» es
`[DEF]` (un proyecto editorial puede necesitar más); «nada de monoespaciada» es `[PRY]` (una
plataforma de código la necesita, obviamente).

---

## 0. Principios

1. `[INV]` **Una sola fuente de verdad, y es ejecutable.** Cada decisión visual existe en *un* sitio del
   código: un token en `tokens.css` o un componente en `components/ui/`. La documentación explica
   la decisión y el motivo; **no repite el valor**. Un valor escrito dos veces se desincroniza: es
   cuestión de tiempo.
2. `[INV]` **Semántica antes que valor.** Un componente pide `primary`, `danger` o `ai`, nunca un hex ni un
   color de paleta cruda. Así, cambiar una decisión («la IA pasa de turquesa a amarillo») es cambiar
   **una línea**.
3. `[INV]` **Componentes antes que clases.** Si un patrón aparece 3 veces, se convierte en componente de
   `components/ui/`. Las páginas componen componentes; no reinventan botones ni modales.
4. `[INV]` **Pantallas antes que piezas.** Un catálogo de botones correctos no produce pantallas coherentes.
   El sistema define también **plantillas de pantalla** (§8): dónde va la acción primaria, qué ritmo
   vertical tiene una página, qué se colapsa en móvil. Es la capa que más se improvisa y la que más
   se nota rota.
5. `[INV]` **Escalas cerradas.** Tamaño de texto, radio, espaciado, densidad, sombra, profundidad y duración
   se eligen de una escala finita. Los valores arbitrarios (`text-[11px]`, `rounded-[10px]`,
   `z-40`, `duration-150`, `bg-[#hex]`) están prohibidos fuera de la capa de tokens.
6. `[INV]` **Accesible por defecto.** Los contrastes, el foco visible, el tamaño táctil y los estados vienen
   resueltos en el token o en el componente; quien lo usa no tiene que acordarse.
7. `[INV]` **Documentación viva y verificable.** Si el código y este documento no coinciden, es un bug. El
   protocolo del §11 explica cómo se mantienen sincronizados, y `sync-design-system.mjs --check` lo comprueba
   en CI: una regla que solo depende de la buena voluntad no es una regla.

---

## 1. Arquitectura en tres capas

```
┌──────────────────────────────────────────────────────────────────┐
│ 3. COMPONENTES   <Button variant="ai">  <Modal>  <PageHeader>    │  ← lo que usan las páginas
├──────────────────────────────────────────────────────────────────┤
│ 2. SEMÁNTICOS    --color-primary  --color-ai  --color-danger     │  ← el "significado"
│                  --radius-control  --text-caption  --z-modal     │
├──────────────────────────────────────────────────────────────────┤
│ 1. PRIMITIVOS    --color-<marca>-<familia>   escala de neutros   │  ← la paleta cruda
└──────────────────────────────────────────────────────────────────┘
```

| Capa | Quién la toca | Dónde vive | Ejemplo |
|---|---|---|---|
| Primitivos | Casi nunca (cambio de marca) | `tokens.css` §1 | `--color-brand-yellow: #FFC107` |
| Semánticos | Cuando cambia una **decisión** | `tokens.css` §2–§10 | `--color-ai: var(--color-brand-turquoise)` |
| Componentes | Cuando cambia un **patrón** | `components/ui/*` | `Button` con `variant="ai"` |
| Páginas | Siempre | `app/**` | Solo usan componentes y tokens semánticos |

**Regla de dependencia:** cada capa solo usa la capa inmediatamente inferior. Una página nunca usa un
primitivo; un componente nunca usa un hex.

### 1.1. Dos fuentes únicas, y todo lo demás se genera

`[INV]` Un valor o una decisión **existen en un sitio y se propagan**. Nunca se copian.

```css
/* app/globals.css */
@import "tailwindcss";
@import "../docs/design-system/tokens.css";
```

La guía visual se abre con doble clic (`file://`), y ahí el navegador bloquea `@import` y `fetch` de
archivos vecinos. Por eso lleva **escritos dentro** el bloque de tokens y el del manifest, entre
marcadores, y los **genera** un script. Son copias derivadas y verificables, no copias mantenidas a
mano:

```
tokens.css           ──► guia-visual.html   (bloque TOKENS)
design-manifest.json ──► guia-visual.html   (bloque MANIFEST)
                     └─► <PROYECTO>_DESIGN.md (tablas entre marcadores GEN)
```

```bash
node docs/design-system/sync-design-system.mjs          # propaga
node docs/design-system/sync-design-system.mjs --check  # falla si difieren (pre-commit / CI)
node docs/design-system/validate-design-system.mjs      # comprueba que todo es coherente
```

**Qué va en el manifest y qué no.** Va lo que es **dato del proyecto** y hoy se escribe dos veces:
módulos, iconos, vocabulario, vistas, estados de dominio, mapa de plantillas, matriz responsive,
estados de componente. **No** va el material didáctico de la guía (el árbol de decisión, la galería
Sí/No, el HTML de las plantillas): meter lógica de render en JSON empeora las dos cosas.

### 1.2. Implementación en Tailwind v4

Los tokens se declaran en `@theme` (CSS-first, sin `tailwind.config`). Cada namespace genera utilidades:

| Namespace CSS | Utilidades generadas |
|---|---|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `ring-*`, con opacidad `bg-ai/10` |
| `--text-*` (+ `--text-*--line-height`, `--text-*--font-weight`) | `text-caption`, `text-body`… |
| `--radius-*` | `rounded-control`, `rounded-card`… |
| `--spacing-*` | `p-card`, `gap-block`, `h-control-md`, `min-h-touch`… |
| `--container-*` | `max-w-modal-md`, `max-w-drawer-lg`… |
| `--shadow-*` | `shadow-card`, `shadow-raised`… |
| `--ease-*`, `--animate-*` | `ease-out-expo`, `animate-drawer-in`… |

Lo que **no** tiene namespace propio en Tailwind v4 (profundidad, duraciones, degradados) se declara
en `:root` y se expone con `@utility`, para que tampoco se escriba a mano:

```css
:root { --z-modal: 40; --duration-base: 250ms; }
@utility z-modal { z-index: var(--z-modal); }
@utility duration-base { transition-duration: var(--duration-base); }
```

- Tailwind v4 resuelve los `var()` entre tokens y genera las opacidades (`bg-ai/10`) sin problema.
- Los nombres evitan duplicarse con la utilidad: `bg-page` (no `bg-bg`), `border-line` (no
  `border-border`).
Dos trampas que no dan ningún error y cuestan una tarde:

- ⚠️ **Los estilos base van dentro de `@layer base`.** Las utilidades de Tailwind viven en
  `@layer utilities`, y en la cascada **lo que está fuera de toda capa gana a lo que está dentro de
  una**. Un `a { color: … }` suelto en el archivo de tokens anula `text-fg-muted`, `text-page` y
  cualquier utilidad de color sobre un enlace, en toda la app y sin avisar.
- ⚠️ En la guía visual, el bloque `<style type="text/tailwindcss">` **debe empezar con
  `@import "tailwindcss";`**. El build de navegador solo lo inyecta él si la hoja no contiene la
  cadena `@import` en ningún sitio — y basta un comentario que la mencione para que deje de hacerlo,
  con el resultado de que no se genera **ninguna** utilidad y la página aparece sin estilos.

---

## 2. Color

### 2.1. Esquemas: «fondo» y «encima del fondo», no «oscuro»

Los roles de superficie y texto se nombran por su **posición en la pila**, nunca por su claridad.
`page` es el fondo, `surface` lo que se apoya encima, `fg` el texto principal. Así un esquema claro
es un bloque que redefine esos tokens, no una reescritura del sistema:

```css
[data-theme="light"] { --color-page: …; --color-surface: …; --color-fg: …; }
```

Aunque el proyecto use un solo esquema, se escribe el otro: es lo que demuestra que los roles no
significan «oscuro», y es el 90% del coste de portarlo.

### 2.2. Roles semánticos

Todo proyecto define **como mínimo** estos roles. Cada rol de fondo va con su color de texto (`-fg`):
un token de fondo sin par de texto es un token incompleto.

| Rol | Uso | Pares necesarios |
|---|---|---|
| `page` | Fondo de la página | `fg` |
| `surface` | Tarjetas, paneles | `fg` |
| `surface-sunken` | Contenedores **hundidos**: grupos segmentados, SubNav, ViewSwitcher | `fg` |
| `surface-raised` | Elementos sobre una superficie (dropdown, popover, input) | `fg` |
| `surface-hover` | Hover de superficies y botones secundarios | `fg` |
| `surface-overlay` | Fondo de modales y drawers | `fg` |
| `overlay` | Velo detrás de modales y drawers | — |
| `line` | Límites decorativos | — |
| `line-strong` | Límites funcionales (inputs, controles) — mín. 3:1 | — |
| `fg` / `fg-muted` / `fg-subtle` | Texto principal / secundario / terciario | — |
| `link` / `link-hover` | Enlace en texto corrido | — |
| `primary` | Acción principal (una por vista) | `primary-fg` |
| `danger` | Destruir, error | `danger-fg` |
| `success` | Confirmación, estado positivo | `success-fg` |
| `warning` | Atención, estado degradado | `warning-fg` |
| `focus` | Anillo de foco | — |

**Opcional:** `info` (información neutra). Solo si el proyecto tiene un color libre para ello; con una
paleta de un color por familia suele chocar con otro rol. La alternativa es **neutro + icono `Info`**,
que funciona igual y no gasta un color.

`surface-sunken` es un rol propio y no un apaño: «un contenedor más oscuro que la superficie» deja de
funcionar en cuanto existe un esquema claro o un contexto con fondo distinto.

**Convención para roles con tono** (`success`, `danger`, `ai`…):

| Token | Uso | Ejemplo |
|---|---|---|
| `{rol}` | Texto, iconos, bordes y fondos suaves (con opacidad) | `text-danger`, `bg-danger/10` |
| `{rol}-solid` | Relleno sólido | `bg-danger-solid` |
| `{rol}-fg` | Texto sobre el relleno sólido | `text-danger-fg` |

Un botón sólido usa **siempre** `bg-{rol}-solid text-{rol}-fg`, aunque en el esquema actual `{rol}` y
`{rol}-solid` valgan lo mismo. Es justo la pareja que se separa al añadir un esquema claro: el relleno
sigue siendo el color de marca y solo cambia la versión de texto.

### 2.3. Enlaces

Un enlace en texto corrido se identifica por el **subrayado**, no por el color: así cumple sin
depender del color y no compite con la acción principal. En navegación, sin subrayado y con
`aria-current` marcando la página activa.

### 2.4. Roles de dominio

Cada proyecto puede reservar colores para **conceptos** propios (p. ej. `ai` para todo lo que ejecuta
un modelo). Reglas:

- Un rol de dominio es **exclusivo**: ese color no se usa para nada más.
- Se documenta con una frase de «cuándo sí / cuándo no» en el archivo de tokens del proyecto.
- Se materializa en variantes de componente (`<Button variant="ai">`, `<Badge tone="ai">`), no en
  clases sueltas.

Es también el mecanismo para dar carácter a una parte del producto **sin bifurcar el sistema**: un
concepto transversal recibe un rol, no un tema propio.

### 2.5. Contextos y acentos de módulo

Un producto puede tener zonas con carácter distinto (marketing / herramienta). Se resuelven con
**dos mecanismos acotados**, nunca con un sistema por zona:

| Mecanismo | Qué puede cambiar | Qué no |
|---|---|---|
| **Contexto** (`[data-context="…"]`) | Un puñado de tokens: color y radio del CTA, ritmo de espaciado, énfasis de la escala | El catálogo de componentes, los roles, la iconografía, el vocabulario |
| **Acento de módulo** (`--color-module`) | El icono del módulo en la navegación y en el `PageHeader` | Controles, badges de estado, gráficos, texto |

`[DEF]` Máximo 2 contextos. Si hacen falta 3, casi siempre es que uno de ellos es en realidad un
producto distinto — pero un ecosistema con marketing, aplicación y *backoffice* puede justificar tres.
Lo que **no** es negociable `[INV]` es que un contexto solo redefina tokens, nunca componentes.

**Un design system por sección de la app es el error que este documento intenta evitar.** En cuanto
una sección tiene su propio botón hay dos sistemas y ninguno es fuente de verdad. La identidad de un
módulo son su **icono**, su **nombre** del vocabulario y, como mucho, un **acento** con el alcance de
la tabla de arriba.

### 2.6. Estados derivados

No se inventan colores para hover/active/disabled: se derivan del rol.

| Estado | Regla |
|---|---|
| Hover | Mismo rol, un paso más claro u oscuro (`--color-primary-hover`) o `brightness` |
| Active | Un paso más que el hover, o `scale-[.98]` |
| Disabled | `opacity-50` + `cursor-not-allowed`; nunca un gris inventado |
| Tono suave (fondos de badge, paneles) | Rol con opacidad: `bg-danger/10 border-danger/30 text-danger` |

### 2.7. Una sola base por familia de color

`[PRY]` **Regla:** la paleta tiene **un único color por familia** (un amarillo, un naranja, un rojo, un azul,
un verde). Si dos colores son parecidos, sobra uno.

- Las variantes (hover, texto sobre fondo oscuro, fondos suaves, bordes) se **derivan** de esa base
  con opacidad (`bg-primary/10`), `color-mix()` o `brightness`. Derivar no es añadir un color.
- Nunca se introduce un color «porque queda bien aquí»: o es la base de su familia, o es una
  derivación, o es una entrada de la paleta categórica (§2.8).
- Los neutros son la excepción razonable: una sola escala de grises (no mezclar dos familias de gris).
- Antes de añadir un color, comprobar que ninguno de los existentes sirve. Un color nuevo necesita
  una entrada en el Registro de decisiones.

### 2.8. Paleta categórica (el único sitio con colores extra)

Para categorías **sin significado** (pilares de contenido, series de gráficos, etiquetas de tipo) se
define **una** paleta categórica, cerrada y numerada.

- **Se asigna en orden fijo** (1, 2, 3…) y **nunca se recicla ni se recoloca**: si un filtro reduce
  las series, las que quedan conservan su color. El color sigue a la entidad, no a su posición.
- Sus entradas deben distinguirse entre sí **también para quien no distingue rojo y verde**. Esto no
  se juzga a ojo: **se valida con un script** (§9.2). Dos entradas casi iguales valen como una sola.
- No usa los **tokens** semánticos (`danger`, `success`, `ai`…). Sí puede usar las mismas **familias**
  de color en **pasos distintos**: un gráfico nunca pinta un token semántico, y un estado siempre
  lleva icono y etiqueta, así que no se confunden. Prohibir las familias enteras suele hacer imposible
  una paleta que pase la validación, porque deja fuera medio círculo cromático.
- `[DEF]` Tamaño recomendado: 5–6 entradas. Si hacen falta más categorías, se distinguen con **etiqueta,
  icono o forma**, o se agrupan en «Otros» — nunca con más tonos.

### 2.9. Contraste (WCAG 2.2 AA)

- Texto normal ≥ **4.5:1** · texto grande (≥ 18.66px bold / 24px) ≥ **3:1**
- Límites de controles y focos ≥ **3:1** contra el fondo adyacente
- El archivo de tokens documenta el ratio de cada par `fondo / texto`, y **la guía visual los calcula
  en vivo**: si alguien cambia un token, el número se actualiza solo y delata el problema.

---

## 3. Tipografía

### 3.1. Escala cerrada

`[DEF]` Máximo **8 pasos**. `[INV]` Los nombres describen el **rol**, no el tamaño.

| Token | Rol | Referencia típica |
|---|---|---|
| `text-micro` | Metadatos mínimos, contadores (usar poco) | 10–11px |
| `text-caption` | Etiquetas, ayudas, timestamps | 12px |
| `text-body-sm` | Texto de UI denso (tablas, dashboard) | 13–14px |
| `text-body` | Texto de lectura | 16px |
| `text-title` | Título de tarjeta / sección pequeña | 18–20px |
| `text-heading` | Título de sección | 24–30px |
| `text-display` | Título de página | 36–48px |
| `text-hero` | Solo portadas / heros de marketing | 56px+ (fluido con `clamp`) |

Cada token lleva su `line-height` y, si hace falta, `letter-spacing`. Los tokens de título llevan
también su **peso** (`--text-title--font-weight`), para que el peso no se decida en cada pantalla:
quien usa `text-title` no añade `font-*`.

### 3.2. Reglas

- `[INV]` **Prohibido** `text-[Npx]`. Si ningún paso encaja, se discute añadir un paso; no se improvisa.
- `[PRY]` **Una sola familia tipográfica, sin monoespaciada.** Es la decisión de BSC, y por eso los
  números usan `tabular-nums`. Un proyecto con código, logs o identificadores necesita una segunda
  familia monoespaciada: entonces se declara como token y se documenta **para qué** sirve, que es lo
  que evita que acabe en las métricas por gusto.
- `[DEF]` **Pesos: máximo 6, y cada uno con un rol único y escrito.** Lo que importa no es el número sino que
  ninguno esté «por si acaso». Los pesos de título viven dentro del token de texto; los que quedan
  disponibles para elegir en una pantalla deberían ser 3 o 4.
- **Números y métricas:** `tabular-nums` (cifras de ancho fijo dentro de la propia tipografía) para
  que las columnas no bailen.
- `[PRY]` **Mayúsculas:** solo en etiquetas cortas (`caption`/`micro`) y CTAs, siempre con
  `tracking-wider`. `[INV]` Nunca en texto corrido ni en nombres propios de contenido: no se leen.
- **Jerarquía de encabezados:** `h1` único por página; nunca se salta un nivel por estética. Si un `h3`
  tiene que parecer grande, se usa el token visual, no un `h2`.
- **Comprobar que los pesos usados se cargan de verdad.** Un `font-semibold` que el navegador
  aproxima sintéticamente es un peso que no existe.

---

## 4. Espaciado, densidad, radios, elevación, profundidad y movimiento

### 4.1. Espaciado

Escala base 4px. Además de la escala, se tokenizan los **ritmos**, porque son los que se improvisan:

| Token | Qué fija |
|---|---|
| `gutter` | Margen lateral mínimo en móvil |
| `page` | Padding lateral de página |
| `card` | Padding interno de tarjeta (lo aplica `Card`, prop `padding`) |
| `block` | Hueco entre bloques de una sección |
| `section` | Separación entre secciones de página |

Un contexto puede redefinir `section` y `page` (una landing respira más que un dashboard); el resto
se queda.

### 4.2. Densidad y alturas de control

La altura de los controles es una **decisión de estilo de primer orden** (¿herramienta compacta o
cómoda?), así que es un token y no un `h-10` suelto dentro de un componente:

| Token | Uso |
|---|---|
| `control-sm` | Barras de filtros y tablas densas, **solo en escritorio** |
| `control-md` | Por defecto |
| `control-lg` | Acciones destacadas, formularios cómodos |
| `touch` | Mínimo táctil (44px, WCAG 2.2 *Target Size*) |

En vez de repetir «acuérdate del tamaño táctil», el token sube solo donde el puntero es grueso:

```css
@media (pointer: coarse) {
  :root { --spacing-control-sm: var(--spacing-touch); --spacing-control-md: var(--spacing-touch); }
}
```

Lo mismo vale para el texto del control: un tamaño `micro` en mayúsculas dentro de un botón no es
legible; el tamaño mínimo de texto de un control es `caption`.

### 4.3. Radios

Un radio por **tipo de objeto**, no por gusto:

| Token | Aplica a |
|---|---|
| `rounded-control-inner` | Contenido dentro de un control con padding (pastilla de un grupo segmentado) |
| `rounded-control` | Botones, inputs, selects, chips cuadrados |
| `rounded-card` | Tarjetas, paneles, dropdowns |
| `rounded-panel` | Modales, drawers, contenedores grandes |
| `rounded-full` | Avatares, pills, badges, botones-píldora (si la marca lo usa) |

Regla: **un contenedor nunca tiene menos radio que su contenido.** De ahí `control-inner`: se calcula
a partir de `control`, no se escribe un `rounded-[10px]` a ojo.

### 4.4. Elevación

| Nivel | Uso | Token |
|---|---|---|
| 0 | Plano, dentro de una superficie | — |
| 1 | Tarjeta | `shadow-card` |
| 2 | Dropdown, popover, toast | `shadow-raised` |
| 3 | Modal, drawer | `shadow-overlay` |

Overlay de modales: **un único** valor (`bg-overlay` + un `backdrop-blur-*`). Sobre un fondo muy
oscuro la sombra casi no se lee: se compensa con más alfa, no con una sombra distinta por sitio.

### 4.5. Profundidad (z-index)

Una escala cerrada y nombrada. `z-40` escrito a mano es cómo empiezan los menús por debajo del modal:

| Token | Nivel |
|---|---|
| `z-sticky` | Cabecera pegajosa, `thead` fijo |
| `z-dropdown` | Menús, popovers, tooltips anclados |
| `z-drawer` | Panel lateral |
| `z-modal` | Modal |
| `z-toast` | Avisos efímeros |
| `z-tooltip` | Por encima de todo |

Un `<dialog>` abierto con `showModal()` vive en el *top layer* del navegador y queda por encima de
toda la escala sin necesidad de `z-index`: es una razón más para usarlo en lugar de un `fixed inset-0`.

### 4.6. Movimiento

`[DEF]` Dos escalas de duración —una de entrada y otra de salida— y dos curvas:

| | Token | Valor típico | Qué comunica |
|---|---|---|---|
| Entra | `duration-fast` / `base` / `slow` | 150 / 250 / 350ms | Hover y menús / modal y paneles / drawer |
| Sale | `duration-exit` / `exit-base` / `exit-slow` | 100 / 150 / 250ms | Siempre más corto que su entrada |
| Espera | `delay-tooltip`, `duration-toast-life` | 400ms, 4s | Antes de mostrar / cuánto se queda |
| Curva | `ease-out-expo` | `cubic-bezier(.16,1,.3,1)` | **Entrada**: decelera, la superficie llega |
| Curva | `ease-exit` | `cubic-bezier(.4,0,1,1)` | **Salida**: acelera, se va |

Y cuatro reglas, que son las que de verdad evitan que cada pantalla invente lo suyo:

1. `[INV]` **Toda entrada tiene su salida, y la salida es más rápida.** Una superficie que entra con
   cuidado y desaparece de golpe se siente rota; una que tarda en irse se siente lenta. Media
   animación es peor que ninguna.
2. `[INV]` **Cada superficie crece desde su origen.** El menú desde la esquina de su disparador, el
   drawer desde su borde, el tooltip desde su control. Escalar desde el centro convierte un
   despliegue en un globo que aparece, y le quita al movimiento su única función: decir de dónde
   viene esto.
3. `[DEF]` **Lo que aparece por hover lleva retardo (~400ms); lo que aparece por clic, ninguno.** Sin
   el retardo, recorrer una barra de iconos es un parpadeo constante. Al salir, nunca hay retardo.
4. `[INV]` **El movimiento explica; no decora.** Nada de rebotes ni elásticos, y nada por encima de
   ~400ms en una herramienta.

El sistema mantiene la tabla **superficie → entrada · salida · origen · disparador** en su manifest,
y la guía visual permite **dispararlas todas** — es la única forma de juzgar si 250ms es lo correcto.

**`prefers-reduced-motion`: se quita el movimiento, no el cambio.** `[INV]` La versión habitual
(«todo a 0,01ms») también mata los fundidos de opacidad, y eso es contraproducente: un fundido no
provoca malestar vestibular y es lo que comunica que algo ha aparecido. Sin él, las superficies
parpadean dentro y fuera de la nada. Lo correcto: parar las animaciones decorativas e infinitas,
conservar la opacidad y anular desplazamiento y escala.

Implicación práctica: si un elemento usa `transform` **para colocarse** (centrar un tooltip con
`-translate-x-1/2`), colócalo con la propiedad independiente `translate` y reserva `transform` para
la animación. Si no, al anular el movimiento se descoloca.

---

## 5. Catálogo de componentes

Cada componente de `components/ui/` tiene un **contrato**: props, variantes, tamaños y estados. Las
páginas **no** pasan clases de color o tipografía por `className`; solo layout (`w-full`, `mt-4`…).

### 5.1. AppShell (el marco)

Es lo primero que ve el usuario en todas las pantallas y lo primero que se olvida documentar.

```
┌──────────┬───────────────────────────────────────────────┐
│ marca    │ breadcrumb        buscador   avisos   usuario │  ← Topbar
├──────────┼───────────────────────────────────────────────┤
│ nav      │                                               │
│ módulo ● │   PageHeader                                  │
│ módulo   │   [SubNav]                                    │
│ módulo   │   contenido                                   │
│          │                                               │
│ ajustes  │                                               │
└──────────┴───────────────────────────────────────────────┘
```

- **Sidebar:** un ítem por módulo, con icono del diccionario + etiqueta del vocabulario. Activo
  marcado con `aria-current="page"` y un indicador que no dependa solo del color.
- **Colapsado:** `[DEF]` un ancho desplegado y otro colapsado, los dos tokenizados; el colapsado es
  el de un control cuadrado más su padding, para que los iconos queden alineados con el resto de la
  interfaz. El estado se recuerda por usuario. Y hay cinco decisiones que casi siempre se olvidan:
  1. `[INV]` **Es presentación, no otra vista.** Se resuelve con un atributo y CSS. Si se vuelve a
     renderizar la barra al colapsar, el elemento nuevo nace ya estrecho y **la transición de anchura
     no se ve nunca**. Es el fallo clásico de este patrón.
  2. `[INV]` **Las etiquetas se funden antes de que la barra se estreche** (≈100ms contra 250). Si no,
     el texto se ve comprimido y cortado a media palabra. Al desplegar, al revés: primero abre y
     después aparecen, con retardo.
  3. `[INV]` **Sin etiqueta hace falta tooltip.** Cada elemento colapsado lleva el suyo con el nombre.
     Es la razón principal por la que el sistema tiene un tooltip.
  4. `[INV]` **El estado activo se mueve.** Desplegado puede marcarse al final de la fila; colapsado
     ahí no hay sitio, así que va sobre el cuadrado del icono. `aria-current` sigue estando en los dos.
  5. `[DEF]` **Los contadores pasan a ser un punto.** Un «12» dentro de 64px no se lee.
- **Disparador:** `[PRY]` si es el logotipo, lleva `aria-expanded` y una etiqueta que cambia, y revela
  el icono de panel al pasar por encima o al enfocar: que un logotipo sea un botón no es evidente.
  Contrapartida que hay que escribir: un logotipo es por convención el enlace a la portada, y no puede
  ser las dos cosas. O se elige, o el colapso va a un botón propio.
- **Móvil:** `[INV]` por debajo del breakpoint de escritorio **no hay colapso**: la sidebar es un
  `Drawer`. Colapsar es una comodidad de escritorio, no un estado responsive.
- **Topbar:** breadcrumb (o título de módulo en móvil), buscador global opcional, avisos y menú de
  usuario. Alto = `control-lg`.
- **Breadcrumb:** se omite en las pantallas raíz de módulo; el último elemento no es un enlace y
  lleva `aria-current="page"`.

### 5.2. PageHeader (cabecera de pantalla)

Estructura fija para **todas** las pantallas:

```
[breadcrumb opcional]
[icono]  Título (h1)  [badge de estado opcional]      [acciones secundarias] [acción primaria]
         Descripción de una línea (fg-muted)
[subnav opcional]
```

- Props: `title`, `description`, `icon`, `badge`, `actions`, `breadcrumb`, `subnav`, `tone`.
- El icono usa el **acento de módulo** (§2.5); nada más en la cabecera lleva color de módulo.
- En móvil las acciones pasan debajo del título, a ancho completo; la primaria queda la última.

### 5.3. SectionHeader (cabecera de bloque)

Para secciones dentro de una página: `eyebrow` (caption en mayúsculas) + `title` (`heading`) +
`description` opcional + `actions` opcionales. Alineación configurable (`left` / `center`).

### 5.4. Button

| Prop | Valores |
|---|---|
| `variant` | `primary` · `secondary` · `ghost` · `danger` · `danger-soft` · *(dominio: `ai`, `ai-soft`…)* |
| `size` | `sm` · `md` · `lg` |
| `loading` | Muestra spinner, bloquea clics, mantiene el ancho |
| `disabled` / `disabledReason` | `disabledReason` se muestra como tooltip/texto de ayuda |
| `leftIcon` / `rightIcon` | Iconos del set del proyecto a tamaño fijo por `size` |
| `asChild` / `href` | Renderiza `<a>` / `Link` con el mismo aspecto |

Reglas:
- **Una** acción `primary` por vista o modal. El resto, `secondary`/`ghost`.
- Los rellenos usan `bg-{rol}-solid text-{rol}-fg` (§2.2), nunca `bg-{rol}`.
- Acciones destructivas: `danger` + confirmación.
- El alto sale de `control-{size}`; `sm` solo en barras de escritorio (§4.2).
- Texto = verbo en infinitivo o imperativo, no «OK».

### 5.5. IconButton, Link, Badge / Chip

- **IconButton:** cuadrado, tamaños `sm/md/lg` ligados a `control-*`, `aria-label` obligatorio.
- **Link:** subrayado en texto corrido; sin subrayado en navegación (§2.3).
- **Badge:** `tone` = `neutral | primary | success | warning | danger | <dominio>`;
  `variant` = `soft | solid | outline | quiet`. Texto `caption` o `micro`, `rounded-full`.
  - `quiet` es el estado **que ya no pide nada** (archivado, publicado, descartado): se apaga a
    propósito para que el ojo vaya a lo que todavía puede cambiar. Sin él, la gente acaba usando un
    color vivo para algo cerrado.
  - No se añaden más variantes. Un chip «de sugerencia» no necesita un borde discontinuo propio:
    es `outline` + el icono que ya significa eso en el diccionario.

### 5.6. Campos de formulario

`Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, envueltos por **`Field`**:

```tsx
<Field label="Email" hint="No lo compartiremos" error={errors.email} required>
  <Input type="email" />
</Field>
```

- `Field` gestiona `label`, `id`, `aria-describedby`, `aria-invalid` y el texto de error.
- Fondo `surface-raised`, borde `line-strong`, foco con anillo `focus` separado del control.
- Mismo alto que `Button` del mismo `size` (`control-*`).
- Error = borde `danger` + mensaje debajo + icono; **nunca solo color**.
- `Switch` para ajustes que se aplican al momento; `Checkbox` para selección múltiple dentro de un
  formulario que se guarda. El indeterminado del checkbox usa el icono de «menos» del diccionario.
- ⚠️ **Un `Switch` construido con `<button role="switch">` no se envuelve en `<label>`.** Un `<button>`
  es un elemento *labelable*, así que el `<label>` lo adopta como su control y cada clic dentro
  provoca **dos activaciones**: el switch vuelve a su estado y parece que no funciona. Su etiqueta va
  en un `<span id>` + `aria-labelledby`. El `<label>` solo envuelve controles nativos (`input`).
- Placeholder ≠ etiqueta: el placeholder es un ejemplo, no sustituye al `label`.
- Ancho máximo de un campo = `container-form`; un input de 1200px de ancho no se lee mejor.

### 5.7. Card / Panel

- `Card`: `surface` + `line` + `rounded-card` + padding `sm | md | lg`.
- Subpartes opcionales: `Card.Header` (título + acciones), `Card.Body`, `Card.Footer`.
- Variante `interactive` (hover + foco) cuando toda la tarjeta es clicable.

### 5.8. Modal (Dialog)

- Tamaños: `sm` (confirmaciones), `md` (formularios), `lg` (editores), `full` (móvil/lightbox).
  Los anchos salen de `container-modal-*`; no se escriben en la página.
- Estructura: `Modal.Header` (título + cerrar) · `Modal.Body` (scroll interno) · `Modal.Footer`
  (acciones alineadas a la derecha, primaria a la derecha del todo).
- Implementado sobre `<dialog>` + `showModal()`: foco atrapado, `Esc`, top layer y `::backdrop`
  gratis. Comportamiento obligatorio: cierre con `Esc` y clic en overlay (salvo formularios con
  cambios sin guardar), foco devuelto al disparador, `aria-labelledby`, scroll del `body` bloqueado.
- **ConfirmDialog** es un Modal `sm` predefinido: título en pregunta, consecuencia, `Cancelar` +
  acción (`danger` si destruye).

### 5.9. Drawer (panel lateral)

- Lados: `right` (por defecto) / `left` / `bottom` (móvil).
- Anchos `sm | md | lg | xl` desde `container-drawer-*`; en móvil siempre 100%.
- Mismas reglas de accesibilidad y estructura que Modal.
- Cuándo Modal y cuándo Drawer: **Modal** = decisión corta que bloquea; **Drawer** = editar o
  consultar un elemento sin perder el contexto de la lista.
- Con cambios sin guardar: barra de guardado persistente + confirmación al cerrar.

### 5.10. SubNav y Tabs — mismo aspecto, distinta semántica

`[INV]` **Una sola variante visual en todo el producto.** Si la navegación de sección son pastillas, no hay
pestañas subrayadas en ninguna pantalla (ni al revés). Dos estilos de navegación equivalentes son el
caso más visible de sistema roto.

`[PRY]` Patrón recomendado en herramientas densas: **grupo segmentado** — contenedor `surface-sunken` con
borde `line` y radio de tarjeta, y el elemento activo **invertido** (fondo `fg`, texto `page`).

Y dos componentes distintos por debajo, porque la accesibilidad no es la misma:

| | `SubNav` | `Tabs` |
|---|---|---|
| Qué hace | Cambia de **ruta** | Cambia de panel en la **misma ruta** |
| Marcado | `<nav>` + `<a>` + `aria-current="page"` | `role="tablist"` + `role="tab"`/`tabpanel` |
| Teclado | Tabulación normal | Flechas, `Home`/`End`, foco gestionado |

Usar `role="tablist"` para navegar entre rutas es incorrecto y rompe los lectores de pantalla.

Contador opcional, siempre **neutro**: dentro del elemento activo invierte con él. Un contador de
color compite con el estado activo. En móvil el grupo envuelve o se desplaza horizontalmente, nunca
comprime el texto.

### 5.11. Toolbar, ViewSwitcher y filtros

- **Toolbar:** fila que agrupa buscador + filtros + `ViewSwitcher` + acciones. Buscador a la
  izquierda, acciones a la derecha, mismo alto de controles, `flex-wrap` en móvil.
- **ViewSwitcher:** control segmentado de solo iconos para cambiar cómo se ve la misma lista.
  `aria-label` y `title` con el nombre completo de la vista; activo con `surface-hover` + `fg`. El
  nombre y el icono de cada vista son **fijos en todo el producto** (§6.1). La vista elegida se
  recuerda por usuario y pantalla.
- **FilterChip / FilterSelect:** inactivo en neutro; **activo** con color de rol y borde marcado.
  Botón de limpiar filtros visible solo si hay alguno activo, con el número aplicado. Los filtros
  activos se reflejan en la URL cuando la pantalla es compartible.

### 5.12. SearchInput (buscador)

El buscador es un componente, no un `<input>` suelto: aparece en casi todas las pantallas de lista.

| Prop | Valores |
|---|---|
| `value` / `onChange` | Controlado |
| `placeholder` | Formato fijo del proyecto (§15), p. ej. `Buscar <qué>…` |
| `size` | `sm` (barras de filtros) · `md` (cabeceras) |
| `resultCount` | Opcional: «12 resultados» a la derecha o debajo |
| `autoFocusShortcut` | Opcional (`/` o `⌘K`) |

Reglas: icono de búsqueda a la izquierda; botón de **limpiar** en cuanto hay texto; `type="search"`;
`aria-label` si no hay etiqueta visible; filtrado con *debounce* (~250 ms); nunca buscar solo al
pulsar Enter sin indicarlo; si no hay resultados, `EmptyState` con el término buscado y la acción de
limpiar filtros.

### 5.13. DropdownMenu

- Disparador: `IconButton` con el icono de «más acciones» (§6.1).
- Ítems con icono + etiqueta; las destructivas al final, separadas y en `danger`.
- Teclado completo (flechas, `Esc`, `Home`/`End`) y cierre al hacer clic fuera.
- Si hay 1 o 2 acciones, no se usa menú: van como botones.

### 5.14. Feedback

| Componente | Uso |
|---|---|
| `Toast` | Resultado de una acción. Desaparece solo. Máx. 1 línea + acción opcional. |
| `Alert` / `Banner` | Estado persistente de la página (mantenimiento, errores de carga). `tone` semántico + icono. |
| `EmptyState` | Lista vacía: icono + título + texto + acción primaria. |
| `ErrorState` | Fallo de carga: icono `danger` + qué ha pasado + **botón de reintentar**. |
| `Skeleton` | Carga de contenido con forma conocida. |
| `Spinner` | Acción en curso dentro de un control. |
| `Tooltip` | Aclaración breve de un control. Nunca información imprescindible. |

### 5.15. Datos

- `Table`: cabecera `caption` en mayúsculas `fg-muted`, filas `body-sm`, números a la derecha con
  `tabular-nums`, columna ordenable con icono de orden y `aria-sort`, estado vacío con `EmptyState`.
- `Pagination`: «X–Y de Z», anterior/siguiente, salto a primera/última; se mantiene al filtrar.
- `Stat` / KPI: etiqueta `caption` + valor `heading` con `tabular-nums` + variación con
  `success`/`danger` **e icono** (nunca solo el color).

### 5.16. Los estados de una pantalla

`[INV]` Toda lista o panel define **todos los estados que puede alcanzar**, no solo el feliz. Cuatro
es el mínimo; en un producto real son diez, y el proyecto declara en su manifest cuáles le tocan a
cada plantilla:

| Estado | Componente | Por qué existe por separado |
|---|---|---|
| Con datos | — | El caso normal |
| Cargando | `Skeleton` | Con la forma real del contenido, no un spinner al centro |
| Vacío | `EmptyState` | No hay datos **todavía**. El CTA es «crear» |
| Primer uso | `EmptyState` | Misma forma, pero el texto explica el módulo y el CTA es de *onboarding* |
| **Sin resultados** | `EmptyState` | Hay datos, pero los filtros dejan cero. **No es lo mismo que vacío**: el CTA es «limpiar filtros», no «crear». Es el que más se olvida |
| Error de carga | `ErrorState` | Qué ha fallado + reintentar |
| **Sin permisos (403)** | `ErrorState` | Tono neutro, no de error: el sistema funciona, el usuario no tiene acceso. Dice a quién pedirlo |
| No existe (404) | `ErrorState` | Con salida clara |
| **Degradado / parcial** | `Alert` | Una zona falla y el resto sigue. Aviso **dentro** del bloque afectado, nunca una pantalla de error entera |
| **Cambios sin guardar** | Barra de guardado | Estado transversal: barra persistente + confirmación al cerrar |

### 5.17. Matriz de estados de componente

`[INV]` Ningún componente está terminado hasta estar definido en **todos** los estados que puede
alcanzar: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading` y `error` donde
aplique. El proyecto mantiene esa matriz en su manifest y la guía visual la renderiza, para que
revisarla sea mirar, no recordar.

---

## 6. Iconografía

- **Un solo set de iconos** por proyecto.
- Tamaños ligados al texto: `sm` 14px · `md` 16px · `lg` 20px · `xl` 24px.
- El icono hereda el color del texto (`currentColor`), salvo iconos de rol (`ai`, `danger`…).
- Iconos decorativos: `aria-hidden`. Iconos que son el único contenido de un control: `aria-label`
  en el control.
- **Sin emojis como iconos de interfaz** (se renderizan distinto en cada sistema).

### 6.1. Diccionario de iconos: un concepto, un icono

El archivo de tokens del proyecto incluye una tabla **concepto → icono → etiqueta**. Reglas:

- **Un concepto, un único icono** en todo el producto; y **un icono, un único concepto**.
- Prohibidos los sinónimos del set (editar con lápiz en una pantalla y con cuadrado-lápiz en otra;
  cerrar con aspa y con aspa-en-círculo).
- El diccionario incluye la familia de **navegación y divulgación** (chevrons, flechas, menú, paneles,
  paginación, orden de tabla, avisos, salir): es la más usada de todas y la que más se olvida.
- Antes de usar un icono nuevo, buscarlo en el diccionario. Si el concepto no está, se añade al
  diccionario en la misma tarea (protocolo §11).
- Si el set renombra iconos entre versiones (alias heredados), el diccionario guarda el **nombre
  canónico de la versión instalada**.
- Un icono nunca va solo si su significado no es evidente: lleva etiqueta visible o `title`.

---

## 7. Layout y responsive

- Breakpoints: los del framework (`sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`); mobile-first.
- Contenedor de contenido: un ancho máximo por zona, tokenizado (`container-*`).
- Gutter lateral mínimo en móvil = token `gutter`. Sin scroll horizontal a nivel de página.
- Objetivos táctiles ≥ 44×44px: resuelto en los tokens de densidad (§4.2), no a mano.
- Todo se comprueba a **375px** de ancho.

### 7.1. Matriz de comportamiento

`[INV]` No basta con «es responsive». El sistema declara **qué se transforma en qué**, porque si no
lo decide cada pantalla y el móvil sale distinto en cada módulo. Como mínimo: sidebar, acciones del
`PageHeader`, toolbar, tabla, drawer, modal, navegación de sección, rejilla de métricas y formulario.

El proyecto la mantiene en su manifest y la guía la renderiza junto a un conmutador de anchura real,
para poder comprobarla en vez de creérsela.

### 7.2. Las dos causas del scroll horizontal

Casi todo el «no funciona en móvil» sale de aquí, y las dos son contraintuitivas:

1. **Los elementos de una rejilla o de un flex tienen `min-width: auto`.** La pista crece hasta el
   min-content de lo que hay dentro, y el contenedor desborda en vez de encogerse. Basta un texto con
   `truncate` (que es `white-space: nowrap`) para que la pista mida lo que mide la frase entera.
   `min-w-0` hay que ponerlo en el **elemento de la rejilla**, no en el texto: `min-width` fija un
   suelo, no un techo, así que en el texto no reduce nada. Un reset razonable es
   `.grid > *, .flex > * { min-width: 0 }`.
2. **Las tablas no se encogen por debajo de su contenido.** Una tabla ancha va dentro de un contenedor
   con `overflow-x-auto` y un `min-width` propio, para que la tabla se desplace dentro de su tarjeta
   en vez de estirar la página. `overflow-hidden` la recorta y esconde datos: no es lo mismo.

---

## 8. Plantillas de pantalla

Aquí es donde un sistema deja de ser un catálogo. Sin esto, cada pantalla nueva reinventa el orden de
los elementos y el producto se descuadra aunque todos los botones sean correctos.

Cada proyecto **renderiza estas plantillas a tamaño real en su guía visual** y las nombra, para que
una tarea pueda decir «esto es una pantalla de lista» en vez de describirla entera.

| Plantilla | Qué fija |
|---|---|
| **Lista** | AppShell + PageHeader + SubNav + Toolbar + tabla/tarjetas + paginación. Dónde va la primaria y qué se colapsa en móvil |
| **Detalle / editor** | Drawer o página completa, barra de guardado, aviso de cambios sin guardar |
| **Formulario largo** | Ancho máximo de campo, agrupación en secciones, footer pegajoso, orden y resumen de errores |
| **Panel de métricas** | Rejilla de `Stat`, altura de gráfico, qué gráfico para qué dato, rango de fechas |
| **Vacío / primer uso** | `EmptyState` y onboarding de módulo |
| **Error de carga y 404** | `ErrorState` con reintento; 404 con salida clara |
| **Autenticación** | Login y recuperación: dónde cae entre el contexto público y la herramienta |

Reglas comunes a todas:

- **Una sola acción primaria visible**, y está en el `PageHeader` (o en el footer del formulario).
- El **orden vertical** es siempre cabecera → navegación de sección → herramientas → contenido.
- El ritmo vertical sale de `section` y `block`; no se escriben huecos sueltos.
- En móvil: acciones a ancho completo debajo del título, toolbar envuelta, tabla → tarjetas.

---

## 9. Gráficos y datos

Un gráfico es lo que más fácil se inventa en cada módulo, porque no es «un componente». Necesita
contrato propio.

### 9.1. Qué forma usar

| La pregunta es… | Forma |
|---|---|
| Un solo número que importa | `Stat`, no un gráfico |
| Comparar categorías | Barras horizontales (etiquetas legibles, sin rotar) |
| Evolución en el tiempo | Línea; área solo si el volumen acumulado importa |
| Parte de un total | Barra apilada al 100%; tarta solo con 2–3 partes |
| Relación entre dos medidas | Dispersión (tope de 3 series con color, §2.8) |

- **Nunca dos ejes Y.** Dos medidas de escala distinta = dos gráficos o índice base 100.
- Las barras **empiezan en cero**, siempre. Una línea puede no hacerlo si se anota.
- El color de una serie sigue a la entidad, no a su valor ni a su posición.

### 9.2. Colores y elementos

| Elemento | Token |
|---|---|
| Serie | `cat-1…n` en orden fijo |
| Rejilla | `line` |
| Eje, etiquetas y leyenda | `fg-muted` |
| Línea de cero / base | `line-strong` |
| Tooltip | `surface-raised` + `line` + `shadow-raised` |
| Estado (bien/mal) | Roles semánticos **con icono y etiqueta**, nunca solo el color |

- El texto de valores y etiquetas va en tokens de texto, **nunca en el color de la serie**.
- Con 2 o más series, leyenda siempre; con 4 o menos, además etiqueta directa.
- Toda serie tiene alternativa no visual: tabla de datos o `aria-label` con el resumen.
- **La paleta se valida con un script, no a ojo.** Banda de luminosidad, suelo de croma, separación
  bajo protanopia/deuteranopia (ΔE ≥ 8 en OKLab ×100), suelo de visión normal (ΔE ≥ 15) y ≥3:1 de
  contraste contra la superficie — en **cada esquema**. El resultado se anota en el archivo de tokens.

### 9.3. Imagen, vídeo e ilustración

`[INV]` Si el producto tiene una cara pública, el sistema visual **no está completo solo con UI**. Un
proyecto solo-dashboard puede saltarse esta sección; uno con marketing, no.

El archivo del proyecto declara:

| Bloque | Qué fija |
|---|---|
| **Fotografía** | Encuadre, presencia de personas, tratamiento (contraste, temperatura, saturación), recorte preferente y ratios autorizados |
| **Overlays** | `[INV]` Texto sobre foto: siempre con un velo que garantice 4,5:1. Esto no es opinable |
| **Vídeo** | Ratios, autoplay (si lo hay: silenciado y con control de pausa, WCAG 2.2.2) y *poster frame* obligatorio |
| **Ilustración** | Permitida o no, estilo, grosor de línea, paleta y **relación con la iconografía**: una cosa o la otra, no ambas compitiendo |
| **Logos de terceros** | Tamaño mínimo, fondos permitidos y la excepción a los colores del sistema, marcada con `DS-EXCEPTION` |

Estas son decisiones de **marca**: no se deducen del código. Mientras estén sin decidir se marcan
⚠️ en el manifest, que es más honesto que dejar el hueco en blanco y que cada pantalla improvise.

---

## 10. Reglas y prohibiciones (checklist de revisión)

Antes de dar por terminada una pieza de UI:

- [ ] ¿Usa componentes de `components/ui/` en vez de reimplementar botones, modales o cabeceras?
- [ ] ¿Sigue una **plantilla de pantalla** del §8?
- [ ] ¿Cero hex, `rgb()` o colores de paleta cruda en el componente?
- [ ] ¿Cero valores arbitrarios: `text-[Npx]`, `rounded-[…]`, `z-40`, `duration-150`, `h-9`?
- [ ] ¿Cada color de dominio (p. ej. IA) se usa **solo** para su concepto?
- [ ] ¿Cero colores nuevos? (¿es la base de su familia, una derivación o la paleta categórica?)
- [ ] ¿Cero `font-mono`? ¿Los números usan `tabular-nums`?
- [ ] ¿Los iconos salen del diccionario (§6.1) y las etiquetas del vocabulario (§15)?
- [ ] ¿Una única acción primaria visible?
- [ ] ¿Los rellenos sólidos usan `{rol}-solid` + `{rol}-fg`?
- [ ] ¿Ninguna información depende solo del color (estado, error, serie de gráfico)?
- [ ] ¿Foco visible en todos los controles? ¿Todo accesible con teclado?
- [ ] ¿Contrastes dentro de AA?
- [ ] ¿Estados cubiertos: con datos, cargando, vacío, error, deshabilitado?
- [ ] ¿Funciona a 375px de ancho sin scroll horizontal y con objetivos táctiles de 44px?
- [ ] ¿Si has creado un patrón nuevo, está documentado (§11)?

**Excepciones:** si algo *tiene* que saltarse una regla (p. ej. el color exacto de un logo de terceros),
se marca en el código con un comentario `// DS-EXCEPTION: <motivo>` para que sea localizable con grep.

---

## 11. Protocolo de cambios (cómo se mantiene vivo)

El sistema solo funciona si **código y documento cambian a la vez**. Esto aplica a personas y a agentes
de IA por igual.

### 11.1. Cuándo se dispara

Se considera **decisión de diseño** cualquier instrucción que afecte a más de un elemento o que fije un
criterio, aunque se diga de pasada:

- «Los botones que llaman a un agente, en amarillo en lugar de turquesa» → cambia un rol de dominio.
- «Los modales, más anchos» → cambia un token/tamaño de componente.
- «Quiero un chip para marcar contenido patrocinado» → componente o variante nueva.
- «Este título que se vea más pequeño», en una sola pantalla → **no** es decisión de sistema: se
  resuelve eligiendo otro paso de la escala. Si se repite en más pantallas, sí lo es.

En caso de duda, preguntar: *«¿Lo aplico solo aquí o como regla general del sistema?»*

### 11.2. Pasos

1. **Localizar la regla** en `tokens.css`, en `design-manifest.json`, en el documento del proyecto o
   en este documento.
2. **Cambiar el valor en su única fuente:** `tokens.css` si es un valor; `design-manifest.json` si es
   una decisión estructurada (un icono, una etiqueta, un estado, una plantilla); el componente si es
   un patrón. Nunca en las páginas, y nunca en una tabla generada.
3. **Ejecutar `node sync-design-system.mjs`** y después `node validate-design-system.mjs`.
4. **Anotar la decisión** en el *Registro de decisiones* del archivo de tokens (fecha, qué, por qué).
   Solo se documenta el valor cuando aporta contexto (un ratio de contraste, a qué sustituye).
5. **Buscar desviaciones**: grep de los valores antiguos (clases crudas, hex) que se salten el token y
   migrarlos o listarlos como pendientes.
6. **Resolver conflictos**: si otro documento (arquitectura de módulo, specs) repite la regla antigua,
   **borrar su texto** y sustituirlo por un enlace al archivo de tokens. Mientras la tabla vieja exista,
   alguien la leerá.

### 11.3. Elementos nuevos

Si una tarea necesita un patrón que no existe:
1. Comprobar que no se resuelve con un componente o variante existente.
2. Crearlo en `components/ui/` siguiendo las reglas de este documento.
3. Añadirlo al catálogo (§5 si es genérico; archivo de tokens si es propio del proyecto) y **a la
   guía visual**.
4. Anotarlo en el Registro de decisiones.

---

## 12. Bloque para `AGENTS.md` / `CLAUDE.md`

Pegar en cada proyecto que adopte esta guía (ajustando las rutas):

```markdown
## Design system

**Orden de lectura antes de crear o modificar UI.** De lo general a lo concreto; no bajes de nivel
hasta que lo necesites:

1. **ADN visual** — `docs/design-system/<PROYECTO>_DESIGN.md` §0. Treinta segundos. Dice qué
   sensación tiene que producir la pantalla, que es lo que los tokens no dicen.
2. **`docs/design-system/design-manifest.json`** — el módulo en el que estás: su icono, su acento,
   sus plantillas permitidas, sus estados de dominio, el vocabulario y la matriz responsive.
3. **`docs/design-system/DESIGN_SYSTEM.md`** — el contrato del patrón o componente que vas a usar.
   Respeta lo marcado `[INV]`; lo marcado `[DEF]` se puede discutir documentándolo.
4. **`docs/design-system/tokens.css`** — los valores. Nunca inventes uno.
5. **`guia-visual.html`** — abre la plantilla de pantalla que te toca y **cópiala** en vez de
   decidir de nuevo dónde va la acción primaria.
6. Si falta un patrón, **no lo improvises en la pantalla**: aplica el protocolo de cambios (§11).
7. Antes de terminar: `node docs/design-system/validate-design-system.mjs`.

**Reglas duras**
- Usa los componentes de `components/ui/` y los tokens semánticos. Prohibido: hex, colores de
  paleta cruda y valores arbitrarios (`text-[11px]`, `z-40`, `duration-150`, `h-9`) en componentes
  o páginas.
- Un módulo **puede añadir dominio y nunca redefinir infraestructura visual**: ni un Button, ni una
  escala, ni un espaciado, ni un estilo de navegación propios.
- Toda pantalla cubre los estados que su plantilla declara, incluido **«sin resultados»**, que no es
  lo mismo que «vacío».
- Nunca edites a mano un bloque marcado `GEN:`, `TOKENS:` o `MANIFEST:`: se regeneran.

**Cuando el usuario cambia un criterio visual general** (colores por rol, tamaños, radios,
variantes, un componente nuevo, un icono, una etiqueta): aplica el **protocolo de cambios** (§11).
Cambia `tokens.css` o `design-manifest.json` o el componente, ejecuta `sync-design-system.mjs`,
actualiza el Registro de decisiones en la misma tarea y busca usos que se lo salten. Si no está
claro si es un cambio puntual o una regla, **pregunta**.

Si el usuario pega «Cambios de design system desde la guía visual», es una lista de cambios de
tokens: aplícalos con el mismo protocolo.

Estos documentos prevalecen sobre las tablas de clases que aparezcan en otros documentos del repo.
Si encuentras una, bórrala y enlaza aquí.
```

---

## 13. Plantilla de archivo de tokens del proyecto

```markdown
# <Proyecto> — Diseño y decisiones

## 0. ADN visual           ← lo primero que lee un agente. Generado del manifest
## 1. Contextos            (zonas con estética distinta) + módulos + contrato de módulo
## 2. Paleta               (un color por familia, con hex y a qué sustituye)
## 3. Roles semánticos     (rol → primitivo, par de texto, ratio real) + roles de dominio + estados
## 4. Esquemas de color    (claro/oscuro, aunque solo se use uno)
## 5. Paleta categórica    (entradas, orden fijo y RESULTADO DE LA VALIDACIÓN)
## 6. Tipografía           (familia, escala con px reales, pesos y su rol)
## 7. Espaciado, densidad y anchos canónicos de página
## 8. Radios, elevación, profundidad y movimiento
## 9. Componentes propios + matriz de estados de componente
## 10. Plantillas de pantalla + estados de pantalla
## 11. Responsive          (qué se transforma en qué)
## 12. Gráficos            (qué forma para qué pregunta, ejes, tooltips)
## 13. Imagen y media      (fotografía, vídeo, ilustración, logos de terceros)
## 14. Diccionario de iconos, vistas y vocabulario
## 15. Componentes de dominio
## 16. Inventario del estado actual
## 17. Deuda / migración pendiente
## 18. Registro de decisiones   (fecha · decisión · motivo)
## 19. Prototipo / estado de la implementación
```

**Las tablas de datos de §0, §1, §3, §9, §10, §11, §13, §14 y §15 se generan** desde
`design-manifest.json` entre marcadores `<!-- GEN:clave -->`. Este documento aporta la **prosa**: el
motivo, los ratios, a qué sustituye cada token, qué se retiró y por qué.

**Referencias internas por nombre, no por número.** «ver §9» se queda obsoleto en cuanto alguien
inserta una sección; «ver «CONTEXTO: WEB PÚBLICA»» no. El validador comprueba las anclas.

---

## 14. Guía visual (`guia-visual.html`)

Página HTML estática, **fuera de la app**, que muestra el sistema entero renderizado. Se abre con
doble clic en el navegador.

Contiene, como mínimo:

- **Plantillas de pantalla** (§8) a tamaño real — la sección más importante y la que suele faltar.
- El AppShell.
- Colores con **contraste calculado en vivo**, tipografía, espaciado, densidad, radios, profundidad.
- Cada componente del §5 con sus variantes, tamaños y estados.
- Los gráficos con su contrato.
- El diccionario de iconos y el vocabulario.
- Un **conmutador de contexto** si el proyecto tiene más de uno, y una muestra del esquema alternativo.
- Una galería **Sí / No** con los errores habituales, y el **árbol de decisión** («¿necesito un color
  nuevo?», «¿icono nuevo?», «¿patrón nuevo?»).
- **Editor de tokens:** permite cambiar colores, radios y tamaños y ver el efecto en todos los
  componentes a la vez. Los cambios solo afectan a esa página. «Copiar cambios» genera una lista
  `token: valor anterior → valor nuevo` para pegarla en el chat con el agente, que la aplica con el
  protocolo del §11.

**Sincronía:** sus bloques de tokens y de manifest los genera `sync-design-system.mjs`; no se editan a mano.

**Dependencias externas:** la guía carga Tailwind, la fuente y los iconos. Para que la referencia
visual del proyecto no dependa de que un CDN siga existiendo, se guarda una copia local en `vendor/`
(`node vendor.mjs`) y **la página la intenta primero, con el CDN como reserva**. Es el orden correcto
para algo que debe seguir funcionando dentro de cinco años. Si no carga ninguna de las dos, la página
lo dice con un aviso en vez de aparecer rota.

**Regresión visual:** la guía es, de hecho, un banco de pruebas visuales completo. `visual-check.mjs`
captura las plantillas canónicas y las compara con una referencia para detectar los estropicios
grandes —la fuente que deja de cargar, tokens que desaparecen, una vista que se rompe, desbordamiento
en móvil—, no diferencias de un píxel.

Para otro proyecto: copiar el archivo, ejecutar `sync-design-system.mjs` con los tokens y el manifest
nuevos, y ajustar las listas de tokens editables y los textos de ejemplo.

---

## 15. Vocabulario de interfaz

Un sistema de diseño no es solo color y forma: si la misma acción se llama «Guardar» en una pantalla
y «Aplicar» en otra, el producto se siente hecho por tres personas distintas.

**Reglas:**

- **Una acción, una etiqueta.** El archivo de tokens mantiene la tabla de acciones estándar
  (guardar, cancelar, eliminar, duplicar, publicar…) en el idioma del producto. No se inventan
  sinónimos ni se traduce a mitad.
- **Una vista, un nombre y un icono.** Los modos de vista (compacta, lista, ampliada, tabla,
  calendario…) se llaman igual en todas las pantallas y usan el mismo icono (§6.1).
- **Verbos en los botones, sustantivos en los títulos.** «Crear formulario», no «Nuevo»;
  «Formularios», no «Gestiona tus formularios».
- **Confirmaciones en pregunta** («¿Eliminar la publicación?») + consecuencia («Esta acción no se
  puede deshacer»), y el botón repite el verbo («Eliminar»), nunca «OK».
- **Estados y mensajes con plantilla fija**: cargando, vacío («Todavía no hay X» + acción), error
  («No se ha podido X. Vuelve a intentarlo.»), sin resultados («Ningún resultado para “<término>”»
  + limpiar filtros).
- **Misma capitalización**: primera letra mayúscula y el resto en minúscula, salvo las etiquetas en
  versalitas del propio sistema (`caption`/`micro`).
- **Placeholders de búsqueda** con un único formato, y **placeholder ≠ etiqueta**.
