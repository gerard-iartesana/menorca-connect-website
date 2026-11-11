# Menorca Connect · Documento de decisiones del sistema de diseño

> **Estado:** v0.1 · Propuesta (solo guía; ni la web pública en la raíz `index.html` / `styles.css` / `app.js` ni el futuro panel `/dashboard` importan todavía `./tokens.css`).
>
> **Fuentes únicas de verdad:**
> - Valores visuales (colores, tipografía, radios, densidad, sombras, movimiento): [`tokens.css`](./tokens.css)
> - Decisiones estructuradas (módulos, estados, iconos, vocabulario, plantillas): [`design-manifest.json`](./design-manifest.json)
> - Reglas portables de arquitectura de sistema de diseño: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)
> - Referencia interactiva y banco de pruebas con **Editor de tokens**: [`guia-visual.html`](./guia-visual.html)

---

## 1. Propósito y ADN visual

**Menorca Connect** es la operadora local de telecomunicaciones nacida en Menorca para ofrecer **Fibra Óptica simétrica hasta 1 Gb**, **Móvil 5G**, **Menorca TV (+80 canales)**, **Combos convergentes** y conectividad a medida para **empresas, comercios, hoteles y segundas residencias** en los **8 municipios de la isla** (*Maó, Ciutadella, Alaior, Es Mercadal, Ferreries, Es Castell, Sant Lluís y Es Migjorn Gran*).

El sistema de diseño formaliza la identidad visual definida desde el boceto fundacional —cabecera limpia con logotipo de doble pico y ondas de señal, el **Faro de Favàritx** como emblema territorial, cinco tarjetas de servicio superpuestas, franja marina de cuatro compromisos y precios claros sin letra pequeña— en una arquitectura rigurosa capaz de sostener **dos contextos con un único catálogo de componentes**:

1. **La web comercial pública (`/` y sus secciones de Tarifas, Cobertura y Empresas)**, donde mandan la claridad de precios, la cercanía local y la conversión inmediata hacia comprobación de cobertura o WhatsApp (`671 123 456`).
2. **La plataforma privada de gestión (`/dashboard`)**, donde el equipo local de Menorca Connect coordina solicitudes de alta, portabilidades, agenda de técnicos propios en 24-48h, catálogo de tarifas (incluido el conmutador *Modo Boceto `XX,XX €` / PVP real*), huella FTTH por municipio y analítica comercial.

<!-- GEN:styleProfile — generado desde design-manifest.json · no editar a mano -->
**Carácter**

- Cercano, insular y técnicamente fiable: una operadora hecha en Menorca para Menorca, alejada de las telecos agresivas con letra pequeña y centralitas impersonales.
- Luminoso y directo: el Faro de Favàritx, la brisa clara de la costa y el azul marino profundo del Mediterráneo enmarcan precios definitivos con IVA incluido.
- Transparencia radical: lo que ves es lo que pagas, sin permanencia, con técnicos propios en los 8 municipios y atención real por WhatsApp o en tienda.
- La web pública convierte consultas de cobertura y tarifas sin fricción; el panel /dashboard coordina altas, portabilidades, instalaciones en 24-48h y catálogo con la misma claridad.

**Jerarquía**

- Una acción principal por bloque: en la web es el botón turquesa («Ver tarifas», «Comprobar cobertura»); en el panel operativo es marino profundo («Guardar tarifa», «Agendar técnico»).
- Titulares en Montserrat (700–800) y cifras con tabular-nums para que velocidades (300 Mb, 600 Mb, 1 Gb) y cuotas mensuales (24,90 €/mes) se comparen de un vistazo.
- Lo cerrado o histórico se apaga (variante quiet): solicitudes archivadas o campañas retiradas.

**Geometría**

- Geometría cercana y técnica fiel al boceto original: 8px en controles y botones, 14px en las 5 tarjetas de servicio y fichas de tarifa, 18px en paneles, modales y drawers.
- Las 5 tarjetas de categoría cabalgan limpiamente entre la fotografía del Faro de Favàritx y la franja marina de confianza.
- Un contenedor nunca tiene menos radio que su contenido (control-inner 6px dentro de control 8px).
- Píldora completa reservada a badges de estado, pestañas de filtro de tarifa y avatares.

**Superficies**

- Lienzo general en brisa insular (#F3F7F9), fresco y luminoso, nunca gris industrial frío.
- Tarjetas de tarifas, comprobador de cobertura y tablas sobre blanco puro (#FFFFFF) con filete sutil teñido de marino.
- Bandas alternas, SubNav y conmutadores en surface-sunken (brisa con 5% de marino).
- El azul marino profundo (#072140) es superficie estructural de marca: portada con velo bg-scrim, franja de 4 compromisos, bloque Empresas, pie de página y menú lateral de /dashboard (data-theme="dark").

**Tipografía**

- Dos familias coordinadas: Plus Jakarta Sans para lectura, tablas y formularios; Montserrat (700–800) para titulares, precios y velocidades. Sin monoespaciada y sin cursiva sintética.
- Precios (32,90 €), velocidades (1 Gb, 600 Mb), datos móviles (80 GB) y teléfonos (671 123 456) siempre con tabular-nums.
- Antetítulos breves en versalitas turquesa con tracking abierto («HECHA PARA MENORCA», «TARIFAS CLARAS»).
- Nombres de tarifa y secciones en frase natural («Combo Isla 600 Mb + 50 GB», «Una compañía local, para una isla única.»).

**Uso del color**

- Marino (#072140) = tinta principal, franja de confianza, pie, menú lateral y CTA operativo · Brisa (#F3F7F9) = lienzo · Blanco (#FFFFFF) = tarjetas.
- Turquesa Menorca Connect (#0A7275) = acción primaria, anillo de foco, CTA comercial web, ondas del isotipo y palabra CONNECT (calibrado AA ≥5,3:1).
- Verde cobertura (#2D7A1F) = fibra activa / 5G · Ámbar faro (#E5960A) = en portabilidad / modo boceto · Coral (#B42929) = incidencia / eliminar.
- Paleta categórica (cat-1..4) = identidad de las cuatro líneas comerciales (Fibra, Móvil 5G, Menorca TV, Combos) en analítica y fichas comparativas.
- El acceso a WhatsApp usa turquesa de marca o botón secundario marino/brisa con contraste AA verificado (nunca verde #25D366 con texto blanco a 2,1:1).

**Densidad**

- Gestión (/dashboard): controles de 40px por defecto y 32px en barras de filtro de escritorio.
- Web pública: los mismos componentes pasan a 48px de alto y secciones de 80px de aire vertical.
- La diferencia entre panel operativo y escaparate comercial vive en [data-context="web"], sin duplicar componentes.

**Movimiento**

- Dos curvas: entrada ágil que asienta (ease-out-expo) y salida limpia que recoge (ease-exit).
- La salida siempre dura menos que la entrada.
- Cambio instantáneo entre pestañas de tarifa y entre Modo Boceto (XX,XX €) y PVP real sin saltos de altura.
- Respeto íntegro a prefers-reduced-motion en revelados al hacer scroll, diálogos y skeletons.

**Datos y gráficos**

- Precios siempre con IVA incluido explícito y unidad «/mes» alineada en tabular-nums.
- En analítica del panel: barras desde cero, un solo eje y series cat-1..4 en el orden fijo Fibra · Móvil · TV · Combos.
- Ningún estado de solicitud, instalación o cobertura depende solo del color: siempre color + icono + etiqueta.

**Nunca hacemos**

- Asteriscos con letra pequeña, cuotas promocionales engañosas («3 meses y luego sube») o cargos ocultos de instalación.
- Contadores de urgencia falsos («¡Oferta termina en 04:59!») o pop-ups intrusivos de captación.
- Texto blanco sobre verde WhatsApp (#25D366) o sobre turquesa claro sin verificar ≥4,5:1.
- Fotografía sin el velo plano bg-scrim cuando lleva titular blanco encima.
- Dos botones principales compitiendo en la misma tarjeta o cabecera.
- Grises neutros fríos de Tailwind (gray-*, slate-*) desconectados del azul marino menorquín.
- Cursiva sintética o tipografía monoespaciada para precios, velocidades o teléfonos.
- Traducir o deformar topónimos oficiales menorquines (Maó, Ciutadella, Es Mercadal, Es Migjorn Gran).
- Valores arbitrarios sueltos en producción: z-index: 1000, hex directos fuera de tokens.css o degradados improvisados.
<!-- /GEN:styleProfile -->

---

## 2. Sistema gráfico de marca

El lenguaje gráfico de Menorca Connect se apoya en **tres piezas propias**, sin artificios de gran teleco impersonal:

1. **El logotipo vectorial horizontal (`assets/logo-menorca-connect.svg`):** combina el símbolo de doble cumbre en forma de `M` coronado por dos ondas de conectividad con el logotipo tipográfico en dos líneas (`MENORCA` / `CONNECT`). `sync-design-system.mjs` tokeniza el pico izquierdo y `MENORCA` en `fill-logo-text` y el pico derecho, las ondas y `CONNECT` en `fill-logo-mark`: sobre brisa o blanco se renderiza en **marino `#072140` + turquesa `#0A7275`**, y sobre bloques `data-theme="dark"` invierte automáticamente a **brisa `#F3F7F9` + turquesa luminoso** sin duplicar archivos ni usar filtros CSS.
2. **El isotipo autónomo (`viewBox="0 0 116 76"`):** el doble pico con las dos ondas de señal funciona de forma independiente como disparador del menú lateral contraído de `/dashboard`, sello en marcos de carga de fotografía y favicon de aplicación.
3. **La cifra clara de velocidad y cuota (`tabular-nums` + filete `bg-accent`):** velocidades (`300 Mb`, `600 Mb`, `1 Gb`), franquicias móviles (`30 GB`, `80 GB`, `Ilimitados`) y cuotas mensuales (`24,90 €/mes`, IVA incl.) se alinean siempre con cifras tabulares en `Montserrat` sin asteriscos ocultos.

---

## 3. Dos contextos, un solo sistema

<!-- GEN:contexts — generado desde design-manifest.json · no editar a mano -->
| Contexto | Dónde | Carácter |
|---|---|---|
| **Panel de gestión** | /dashboard/** · plataforma privada: resumen, altas y cobertura, catálogo de tarifas, instalaciones FTTH, cobertura insular, empresas y analítica | Operativo, ágil y nítido sobre brisa insular, menú lateral marino profundo y CTA institucional en marino |
| **Web pública** | /, /#tarifas, /#cobertura, /#empresas, /#contacto · escaparate comercial para hogares, segundas residencias y negocios de Menorca | Luminosa, cercana y directa: cabecera blanca limpia, Hero del Faro de Favàritx con 5 tarjetas de servicio, franja marina de confianza y CTA turquesa |
<!-- /GEN:contexts -->

La diferencia entre ambos contextos se gobierna exclusivamente mediante `[data-context="web"]` en [`tokens.css`](./tokens.css):

- **En el panel (`/dashboard`, contexto por defecto):** el CTA principal (`--color-cta`) adopta el **Marino profundo (`#072140`)** para dar sobriedad institucional a acciones administrativas («Guardar cambios», «Agendar técnico»), con controles de `40px` (`32px` en barras de filtro) y separación de `36px` entre secciones.
- **En la web pública (`[data-context="web"]`):** el CTA principal (`--color-cta`) se enciende en el **Turquesa Menorca Connect (`#0A7275`)** característico del boceto («Ver tarifas», «Comprobar cobertura ahora»), el botón secundario usa **Marino `#072140`** sobre brisa y **Brisa `#F3F7F9`** contorneada sobre el Hero oscuro («Hablar por WhatsApp»), y `--color-accent` ilumina antetítulos (`HECHA PARA MENORCA`) y filetes divisorios, con controles táctiles amplios de `48px` y secciones de `80px`.

---

## 4. Paleta, esquemas y contraste verificado

### 4.1. Primitivos de marca (`--color-mc-*`)

Siete primitivos con un único color por familia; ningún gris industrial frío (`gray-*` / `slate-*`):

- **`--color-mc-marino` (`#072140`):** azul marino mediterráneo profundo (tinta principal `15,0:1` sobre brisa, franja de confianza, bloque Empresas, pie de página, menú lateral de `/dashboard` y CTA operativo).
- **`--color-mc-brisa` (`#F3F7F9`):** brisa costera luminosa (lienzo general del panel y la web, tomado de `--bg-light` en la web actual).
- **`--color-mc-blanco` (`#FFFFFF`):** blanco puro (las 5 tarjetas de categoría, fichas de tarifa, comprobador de cobertura y modales).
- **`--color-mc-turquesa` (`#0A7275`):** turquesa Menorca Connect calibrado para accesibilidad AA (`5,30:1` como texto/icono sobre brisa y `5,71:1` como botón sólido con texto blanco).
- **`--color-mc-verde` (`#2D7A1F`):** verde cobertura e isla (`4,97:1` sobre brisa y `5,36:1` con texto blanco; línea activa, FTTH directa disponible e instalación completada).
- **`--color-mc-ambar` (`#E5960A`):** ámbar cálido del Faro de Favàritx y ofertas convergentes (portabilidad en curso, modo boceto `XX,XX €`, relleno sólido con texto marino a `6,69:1`).
- **`--color-mc-coral` (`#B42929`):** coral de alerta (`5,92:1` sobre brisa y `6,38:1` con blanco; incidencia de acometida, error de validación, baja o eliminación).

### 4.2. Decisiones clave de accesibilidad (WCAG 2.2 AA)

1. **Calibración del turquesa y de los botones temáticos:** en `styles.css` actual, `--teal-500` (`#149A9C`), `--green-500` (`#68B42E`) y `--orange-500` (`#F3A115`) con texto blanco quedan entre `2,1:1` y `3,4:1` (por debajo del mínimo `4,5:1` de WCAG AA para texto normal). En `tokens.css`, `--color-mc-turquesa` (`#0A7275`) y `--color-mc-verde` (`#2D7A1F`) superan `5,3:1` con texto blanco, y `--color-warning-solid` (`#E5960A`) usa tinta marina `#072140` (`6,7:1`).
2. **Corrección de botones de WhatsApp:** el orbe flotante actual con degradado `#25D366 → #149A9C` y los botones verdes estándar de mensajería incumplen contraste con blanco. El sistema canaliza todo acceso a WhatsApp (`671 123 456`) mediante el botón primario turquesa AA o el secundario marino/brisa con el icono `message-circle`.
3. **Velo único sobre el Faro de Favàritx (`bg-scrim`):** sustituye el `linear-gradient` lateral por marino `#072140` al 76 %, garantizando `~7,0:1` de contraste para el texto claro incluso sobre espuma blanca de rompiente o cielo iluminado.
4. **Esquema marino (`[data-theme="dark"]`):** actúa como superficie arquitectónica de marca para el Hero, la franja de los 4 compromisos, la sección Empresas, el pie de la web y el menú lateral de `/dashboard`. `validate-design-system.mjs` verifica automáticamente los 4 cruces (`brisa`, `marino`, `web·brisa`, `web·marino`).

### 4.3. Paleta categórica de familias de producto

Cuatro series (`--color-cat-1..4`) alineadas con el orden comercial de la operadora —`cat-1` Fibra óptica (`#0D89E0`), `cat-2` Móvil 5G (`#3B9468`), `cat-3` Menorca TV (`#CB65A9`) y `cat-4` Combos (`#BA7316`)— calibradas en luminancia media para cumplir simultáneamente `≥3:1` sobre brisa, blanco y marino, con separación `ΔE ≥ 17` en visión normal y `ΔE ≥ 8,4` bajo protanopia y deuteranopia.

---

## 5. Tipografía, geometría y densidad

- **Pareja tipográfica actual consolidada:** `Plus Jakarta Sans` (`--font-sans`) aporta legibilidad limpia en listas de prestaciones, tablas de cobertura y formularios; `Montserrat` (`--font-display`, pesos `700` y `800`) sostiene la rotundidad comercial de titulares, precios y velocidades. Sin cursiva sintética ni fuente monoespaciada.
- **Números tabulares (`tabular-nums`):** obligatorios en cuotas mensuales (`24,90 €`, `39,90 €`, `XX,XX €`), velocidades (`300 Mb`, `600 Mb`, `1 Gb`), datos móviles (`30 GB`, `80 GB`), teléfonos (`671 123 456`) y métricas del panel.
- **Geometría cercana (`8 · 14 · 18px`):** controles a `8px`, tarjetas de servicio y tarifas a `14px` y paneles/modales a `18px`, preservando exactamente la silueta amable y limpia de las cinco tarjetas del boceto fundacional.

---

## 6. Arquitectura de módulos y AppShell (`/dashboard`)

### 6.1. Módulos del panel de gestión

<!-- GEN:modules — generado desde design-manifest.json · no editar a mano -->
| Módulo | Icono | Plantillas permitidas | Vistas | Estados | Componentes de dominio |
|---|---|---|---|---|---|
| **Resumen** | `layout-dashboard` | metrics | list | — | `TrustBar` |
| **Altas y cobertura** | `inbox` | list · detail-drawer · empty | table · list | `solicitudes` | `StatusBadge` · `InquiryRow` · `MunicipalityBadge` |
| **Catálogo de tarifas** | `tag` | long-form · list | cards · table | `tarifas` | `ServiceCategoryCard` · `PlanCard` · `PriceModeSwitch` · `StatusBadge` |
| **Instalaciones y red** | `router` | list · detail-drawer | table · calendar | `instalaciones` | `StatusBadge` · `MunicipalityBadge` |
| **Cobertura insular** | `map-pin` | list · empty | cards · table | `cobertura` | `CoverageChecker` · `MunicipalityBadge` · `StatusBadge` |
| **Empresas y hostelería** | `building-2` | list · long-form | table · list | `solicitudes` | `BusinessQuoteCard` · `StatusBadge` |
| **Analítica** | `bar-chart-3` | metrics | list · table | — | `CategoryLegend` |
<!-- /GEN:modules -->

### 6.2. Contrato de módulo

<!-- GEN:moduleContract — generado desde design-manifest.json · no editar a mano -->
**Puede añadir:**

- un icono registrado en iconDictionary
- una fórmula del vocabulario común
- estados propios mapeados a neutral, primary, success, warning o danger
- componentes de dominio documentados en domainComponents
- combinaciones de plantillas canónicas de screenTemplates
- gráficos con las series cat-1..4 en el orden fijo Fibra · Móvil · TV · Combos

**No puede redefinir:**

- `Button`
- `IconButton`
- `Field`
- `Card`
- `Modal`
- `Drawer`
- `Lightbox`
- `escala tipográfica`
- `radios de marca`
- `escala de espaciado`
- `densidad`
- `colores semánticos`
- `estructura de navegación`
- `diccionario de iconos`
- `vocabulario`
<!-- /GEN:moduleContract -->

### 6.3. Marco de navegación (`AppShell`)

<!-- GEN:appShell — generado desde design-manifest.json · no editar a mano -->
**Contexto exclusivo:** gestion. Navegación exclusiva del panel privado /dashboard. La web pública mantiene su cabecera superior blanca con logotipo Menorca Connect, enlaces directos a servicios y botón turquesa «WhatsApp 671 123 456». Al pie del menú lateral viven «Ver web pública» y «Cerrar sesión».

| Sección | Ruta | Subsecciones |
|---|---|---|
| **Resumen** · `layout-dashboard` | `/dashboard` | — |
| **Altas y cobertura** · `inbox` | `/dashboard/solicitudes` | Pendientes · En portabilidad · Activas · Archivadas |
| **Catálogo de tarifas** · `tag` | `/dashboard/tarifas` | Combos · Ofertas Fibra+Móvil+TV · Fibra Óptica · Móvil 5G · Menorca TV |
| **Instalaciones y red** · `router` | `/dashboard/instalaciones` | Agenda hoy · Técnicos en ruta · Completadas |
| **Cobertura insular** · `map-pin` | `/dashboard/cobertura` | 8 municipios · Urbanizaciones · Nodos FTTH |
| **Empresas y hostelería** · `building-2` | `/dashboard/empresas` | Comercios y pymes · Hoteles y agroturismos · Temporada |
| **Analítica** · `bar-chart-3` | `/dashboard/analitica` | Altas por producto · Municipios · Canal WhatsApp |

Anchos: **desplegado 15,5rem (248px)** · **contraído 4rem (64px)**.

| Aspecto | Regla |
|---|---|
| **Superficie** | El menú lateral usa el esquema marino (data-theme="dark") conectando con la franja de confianza y el pie de la web, mientras el área operativa descansa sobre brisa (#F3F7F9). |
| **Disparador** | El isotipo de Menorca Connect (el doble pico 'M' con ondas de señal extraído de logo-menorca-connect.svg) con aria-expanded y etiqueta dinámica («Contraer el menú» / «Desplegar el menú»). |
| **Descubrimiento** | Al pasar el ratón o enfocar el isotipo aparece el icono panel-left. |
| **Etiquetas** | Se funden en 100 ms antes de que la barra reduzca su ancho en 250 ms. |
| **Estado activo** | Fondo surface-hover + filete vertical turquesa claro a la izquierda + aria-current="page". |
| **Contadores** | Desplegado muestra el número de solicitudes de alta pendientes con tabular-nums; contraído muestra un punto turquesa sobre el icono. |
| **Tooltip** | En modo contraído cada icono despliega su tooltip con el nombre del módulo. |
| **Memoria** | El estado contraído/desplegado persiste en localStorage. |
| **Móvil** | Por debajo de 1024px el menú pasa a Drawer lateral desde el botón menu; nunca queda una tira fija estrecha en móvil. |
<!-- /GEN:appShell -->

### 6.4. Modos de vista

<!-- GEN:views — generado desde design-manifest.json · no editar a mano -->
| Vista | Icono | Etiqueta | Cuándo |
|---|---|---|---|
| `list` | `list` | Vista de lista | Resumen de módulos, bloques editables y solicitudes compactas |
| `table` | `table-2` | Vista de tabla | Bandeja de altas y cobertura, tarifas y despliegues por municipio |
| `cards` | `layout-grid` | Vista de fichas | Catálogo visual de tarifas y tarjetas de los 8 municipios |
| `calendar` | `calendar-days` | Vista de agenda | Planificación diaria de técnicos propios e instalaciones en 24-48h |
<!-- /GEN:views -->

---

## 7. Modelos de estado

Ningún estado se comunica únicamente con color: todo `StatusBadge` une **tono semántico + variante + icono + etiqueta verbal**.

### 7.1. Solicitudes de alta y cobertura

<!-- GEN:status.solicitudes — generado desde design-manifest.json · no editar a mano -->
**Solicitudes desde web y WhatsApp (671 123 456)** — Comprobaciones de cobertura y altas entrantes en los 8 municipios y urbanizaciones

| Estado | Etiqueta | Rol · variante | Icono | Significado |
|---|---|---|---|---|
| `nueva` | Nueva | **`primary`** · soft | `mail` | Recibida desde el comprobador o WhatsApp; pendiente de verificar CTO/cobertura |
| `portabilidad` | En portabilidad | **`warning`** · soft | `clock` | Ventana de cambio de operador o cita de instalación en curso (24-48h) |
| `activa` | Línea activa | **`success`** · soft | `circle-check` | Fibra o línea 5G operativa y facturando sin permanencia |
| `archivada` | Archivada | **`neutral`** · quiet | `archive` | Consulta resuelta o descartada; no reclama acción |

Regla que se lee sola: **turquesa = nueva por validar · ámbar = portabilidad en curso · verde = línea activa · apagado = archivada**.

`whatsapp_handoff` — En la web estática actual el formulario construye un enlace directo wa.me con municipio y dirección; al conectar /dashboard se registrará además en base de datos con estos cuatro estados.
<!-- /GEN:status.solicitudes -->

### 7.2. Instalaciones técnicas FTTH

<!-- GEN:status.instalaciones — generado desde design-manifest.json · no editar a mano -->
**Órdenes de equipo técnico propio en Menorca** — Instalación de acometida óptica, ONT y Router Wi-Fi 6

| Estado | Etiqueta | Rol · variante | Icono | Significado |
|---|---|---|---|---|
| `programada` | Cita agendada | **`primary`** · soft | `calendar` | Franja confirmada con el titular en Maó, Ciutadella o resto de municipios |
| `en_ruta` | Técnico en ruta | **`warning`** · soft | `wrench` | Instalador local desplazándose o realizando tendido en fachada/conducto |
| `instalada` | Fibra instalada | **`success`** · soft | `wifi` | Velocidad simétrica verificada y Wi-Fi 6 operativo |
| `incidencia` | Incidencia acceso | **`danger`** · soft | `triangle-alert` | Conducto obstruido o permiso de comunidad pendiente; requiere reprogramar |

Regla que se lee sola: **turquesa = cita agendada · ámbar = técnico en ruta · verde = fibra instalada · coral = incidencia de acceso**.
<!-- /GEN:status.instalaciones -->

### 7.3. Catálogo de tarifas y modo boceto

<!-- GEN:status.tarifas — generado desde design-manifest.json · no editar a mano -->
**Visibilidad comercial y modo presentación** — Recoge el conmutador real de index.html entre modo boceto (XX,XX €) y precios definitivos con IVA

| Estado | Etiqueta | Rol · variante | Icono | Significado |
|---|---|---|---|---|
| `publicada` | PVP publicado | **`success`** · soft | `eye` | Visible en la web con cuota definitiva en euros IVA incluido |
| `boceto` | Modo boceto | **`warning`** · soft | `eye-off` | Muestra marcador XX,XX €/mes para presentaciones previas al cierre comercial |
| `borrador` | Borrador | **`neutral`** · soft | `pencil-line` | Tarifa de campaña o temporada en preparación interna |

Regla que se lee sola: **verde = PVP publicado · ámbar = modo boceto XX,XX € · neutro = borrador interno**.
<!-- /GEN:status.tarifas -->

### 7.4. Cobertura insular (FTTH y 5G)

<!-- GEN:status.cobertura — generado desde design-manifest.json · no editar a mano -->
**Disponibilidad por municipio y urbanización** — Cubre los 8 municipios de Menorca y núcleos costeros (Fornells, Son Bou, Binibèquer, Cala en Blanes…)

| Estado | Etiqueta | Rol · variante | Icono | Significado |
|---|---|---|---|---|
| `ftth_activa` | Fibra 1 Gb directa | **`success`** · soft | `zap` | CTO activa con alta e instalación disponible en 24-48h |
| `despliegue` | En despliegue | **`warning`** · soft | `gauge` | Ampliación de red en curso; permite pre-reserva sin compromiso |
| `solo_5g` | Cobertura 5G | **`primary`** · soft | `smartphone` | Núcleo o finca rústica cubierta mediante red móvil 5G de alta capacidad |

Regla que se lee sola: **verde = fibra 1 Gb directa · ámbar = en despliegue · turquesa = cobertura 5G**.
<!-- /GEN:status.cobertura -->

---

## 8. Diccionario de iconos (1 icono ↔ 1 concepto)

Todos los iconos proceden de `lucide` (`v1.47`) en `currentColor`, unificando los SVG sueltos incrustados hoy en `index.html`. Queda prohibido reutilizar un mismo icono para dos conceptos distintos.

<!-- GEN:icons — generado desde design-manifest.json · no editar a mano -->
### Acciones

| Concepto | Icono | Etiqueta estándar | Alias en el código actual |
|---|---|---|---|
| Buscar | `search` | Buscar… | — |
| Filtrar | `list-filter` | Filtros | — |
| Quitar filtros | `funnel-x` | Quitar filtros | — |
| Crear · dar de alta | `plus` | Nueva tarifa | — |
| Guardar | `save` | Guardar cambios | — |
| Eliminar | `trash-2` | Eliminar | — |
| Copiar | `copy` | Copiar cambios | — |
| Subir documento | `upload` | Subir factura / plano | — |
| Descargar · exportar | `download` | Exportar CSV | — |
| Enviar solicitud | `send` | Comprobar cobertura | — |
| Responder al cliente | `reply` | Responder por WhatsApp | — |
| Archivar · archivada | `archive` | Archivar | — |
| Restablecer · deshacer | `rotate-ccw` | Restablecer | — |
| Reintentar | `refresh-cw` | Volver a intentarlo | — |
| Ajustar parámetros · editor de tokens | `sliders-horizontal` | Editor de tokens | — |
| Más acciones | `ellipsis` | Más acciones | — |
| Abrir web pública | `external-link` | Ver web pública | — |
| Cerrar sesión | `log-out` | Cerrar sesión | — |
| Editar · borrador | `pencil-line` | Editar tarifa | — |

### Navegación y despliegue

| Concepto | Icono | Etiqueta estándar | Alias en el código actual |
|---|---|---|---|
| Desplegar | `chevron-down` | — (aria-expanded) | — |
| Plegar | `chevron-up` | — (aria-expanded) | — |
| Siguiente · ruta | `chevron-right` | Siguiente | — |
| Anterior | `chevron-left` | Anterior | — |
| Primera página | `chevrons-left` | Primera | — |
| Última página | `chevrons-right` | Última | — |
| Ver detalle · ir a tarifas | `arrow-right` | Ver tarifas | — |
| Volver | `arrow-left` | Volver al inicio | — |
| Ordenar (sin orden) | `arrow-up-down` | — (aria-sort) | — |
| Orden ascendente | `arrow-up` | — (aria-sort) | — |
| Orden descendente | `arrow-down` | — (aria-sort) | — |
| Ampliar imagen (Lightbox) | `maximize-2` | Ampliar fotografía | — |
| Abrir menú móvil | `menu` | Abrir menú | `mobileMenuBtn` |
| Contraer o desplegar menú lateral | `panel-left` | Contraer el menú | — |
| Cerrar · limpiar | `x` | Cerrar | — |

### Estado y operaciones técnicas

| Concepto | Icono | Etiqueta estándar | Alias en el código actual |
|---|---|---|---|
| Línea activa · completado | `circle-check` | Línea activa | — |
| En portabilidad · pendiente | `clock` | En portabilidad | — |
| Incidencia · aviso | `triangle-alert` | Incidencia | — |
| Error de carga o validación | `circle-alert` | Error | — |
| Información | `info` | Información | — |
| Acceso privado · sin permisos | `lock` | Acceso restringido | — |
| Cargando | `loader-circle` | Cargando… | — |
| Incluido en tarifa · seleccionado | `check` | Incluido | `check-icon ✓` |
| Selección parcial | `minus` | — | — |
| Solicitud nueva · correo | `mail` | Nueva | — |
| PVP publicado · visible | `eye` | PVP publicado | — |
| Modo boceto XX,XX € · oculto | `eye-off` | Modo boceto | — |
| Cita técnica agendada | `calendar` | Cita agendada | — |
| Técnico propio en ruta | `wrench` | Técnico en ruta | — |

### Servicios de telecomunicaciones y compromisos de Menorca Connect

| Concepto | Icono | Etiqueta estándar | Alias en el código actual |
|---|---|---|---|
| Fibra óptica simétrica · instalada | `wifi` | Fibra Óptica | `SVG wifi inline` |
| Móvil 5G · cobertura 5G | `smartphone` | Móvil 5G | `SVG mobile inline` |
| Menorca TV (+80 canales) | `tv` | Menorca TV | `SVG tv inline` |
| Combos Fibra + Móvil | `layers` | Fibra + Móvil | `SVG home+signal inline` |
| Velocidad hasta 1 Gb · FTTH directa | `zap` | Hasta 1 Gb | `SVG bolt inline` |
| Atención cercana y equipo local | `users` | Atención cercana | `trust-icon people` |
| Precios claros sin letra pequeña | `badge-euro` | Precios claros | `trust-icon tag` |
| Conexión rápida · red en despliegue | `gauge` | Conexión rápida | `trust-icon speed` |
| Sin permanencia | `shield-check` | Sin permanencia | `trust-icon shield` |
| Modo vacaciones / segunda residencia | `sun` | Segunda residencia | — |

### Contacto directo e isla

| Concepto | Icono | Etiqueta estándar | Alias en el código actual |
|---|---|---|---|
| Teléfono local de atención | `phone` | 671 123 456 | — |
| Atención directa por WhatsApp | `message-circle` | Hablar por WhatsApp | `SVG wa inline` |
| Cobertura insular (8 municipios) | `map-pin` | Cobertura en Menorca | — |

### Reservados para los módulos de /dashboard y documentación

| Concepto | Icono | Etiqueta estándar | Alias en el código actual |
|---|---|---|---|
| Resumen operativo | `layout-dashboard` | Resumen | — |
| Bandeja de altas y cobertura | `inbox` | Altas y cobertura | — |
| Catálogo de tarifas | `tag` | Catálogo de tarifas | — |
| Instalaciones FTTH y equipos Wi-Fi 6 | `router` | Instalaciones y red | — |
| Empresas, comercios y hostelería | `building-2` | Empresas y hostelería | — |
| Analítica comercial | `bar-chart-3` | Analítica | — |
| Condiciones legales y contrato | `file-text` | Condiciones legales | — |
| Guía visual del sistema de diseño | `book-open` | Guía visual | — |
<!-- /GEN:icons -->

---

## 9. Vocabulario de interfaz y criterio comercial

<!-- GEN:vocabulary — generado desde design-manifest.json · no editar a mano -->
| Situación | Fórmula |
|---|---|
| Tono de marca | Cercano, claro y 100 % local: «Conectados a tu isla. Fibra, móvil y TV al mejor precio, con atención cercana y local.» Sin jerga críptica ni letra pequeña |
| Tratamiento | Segunda persona singular cercana («Tu fibra en Menorca», «Tú eliges cuándo y cómo», «Habla con personas de aquí, no con robots») |
| Botón de acción | Verbo directo + objeto claro: «Ver tarifas», «Comprobar cobertura», «Hablar por WhatsApp», «Guardar cambios» |
| CTA principal web | «Ver tarifas» (portada) · «Lo quiero» (ficha de tarifa) · «Comprobar cobertura ahora» (formulario insular) · «Solicitar estudio gratuito» (Empresas). Uno por bloque |
| Precios y cuotas | Coma decimal española, símbolo € unido con espacio fino o directo coherente y siempre «/mes · IVA incluido»: «24,90 €/mes», «39,90 €/mes» |
| Modo presentación / boceto | Cuando una tarifa aún no tiene PVP cerrado se activa «Modo boceto» mostrando «XX,XX €/mes» sin alterar la estructura de la tarjeta |
| Velocidades y datos | Espacio antes de la unidad: «300 Mb», «600 Mb», «1 Gb», «50 GB», «80 GB», «GB ilimitados», «5G incluido» |
| Topónimos menorquines | Siempre en su forma oficial: «Maó», «Ciutadella», «Alaior», «Es Mercadal», «Ferreries», «Es Castell», «Sant Lluís», «Es Migjorn Gran», «Far de Favàritx» |
| Permanencia | «Sin permanencia» de forma explícita y llana; nunca «sujeto a condiciones de instalación» escondido al pie |
| Cancelar | Siempre «Cancelar» en modales y confirmaciones |
| Guardar | «Guardar cambios»; notificación efímera «Cambios guardados» |
| Eliminar | «Eliminar» + pregunta concreta («¿Eliminar la tarifa Combo Isla 600 Mb?») + consecuencia («Dejará de ofrecerse en la web pública») |
| Buscador | «Buscar <qué>…»: «Buscar solicitudes…», «Buscar municipio o calle…», «Buscar tarifas…» |
| Vacío | «Todavía no hay <elemento>» + explicación útil: «Todavía no hay solicitudes en este filtro. Las consultas de cobertura desde la web o WhatsApp aparecerán aquí.» |
| Sin resultados | «Ningún resultado para “<término>”» + botón «Quitar filtros» |
| Error | «No se ha podido cargar <qué>. Vuelve a intentarlo.» + acción «Volver a intentarlo» |
| Sin permisos | «Acceso reservado al equipo de Menorca Connect» + «Inicia sesión con tu cuenta corporativa» |
| Cobertura enviada | «¡Solicitud recibida! Nuestro equipo técnico en Menorca comprobará tu dirección y te responderá por WhatsApp en menos de 15 minutos.» |
| Consentimiento | «He leído y acepto la política de privacidad» enlazando a /privacidad |
<!-- /GEN:vocabulary -->

---

## 10. Plantillas de pantalla y estados

### 10.1. Plantillas canónicas

<!-- GEN:screenTemplates — generado desde design-manifest.json · no editar a mano -->
| Plantilla | Qué fija | Estados que debe cubrir |
|---|---|---|
| **Lista** `list` | PageHeader → SubNav → Toolbar → tabla/tarjetas → paginación. Sirve para la bandeja de altas y cobertura, órdenes de instalación y listado de nodos. | `data` `loading` `empty` `no-results` `error` `forbidden` |
| **Detalle / solicitud** `detail-drawer` | Drawer lateral para revisar una petición de alta o portabilidad (municipio, dirección, CTO cercana, tarifa elegida) y responder por WhatsApp sin salir de la tabla. | `data` `loading` `error` `unsaved` |
| **Editor de tarifas** `long-form` | Formulario estructurado (container-form) para editar cuotas mensuales, velocidades FTTH, datos 5G, conmutador Modo Boceto/PVP y barra fija de guardado. | `data` `loading` `error` `unsaved` `degraded` |
| **Resumen y analítica** `metrics` | Rejilla de Stat (altas del mes, líneas activas, tiempo medio de instalación, consultas WhatsApp) + gráficos con las series cat-1..4. | `data` `loading` `empty` `error` `degraded` |
| **Vacío / primer uso** `empty` | EmptyState centrado con icono, explicación directa y acción única; nunca tablas vacías con solo cabeceras. | `empty` `first-run` |
| **Error y 404** `error` | ErrorState claro con salida directa: reintentar en /dashboard o volver a tarifas y cobertura en la web pública. | `error` `forbidden` `not-found` |
| **Acceso** `auth` | Tarjeta limpia (container-modal-sm) sobre lienzo brisa con el logotipo oficial de Menorca Connect arriba, correo corporativo y contraseña. | `data` `error` |
| **Portada web** `public-landing` | Cabecera blanca → Hero del Faro de Favàritx con bg-scrim + 5 tarjetas de servicio superpuestas → franja marina de 4 compromisos → «Hecha para Menorca» → configurador de tarifas → comprobador de cobertura → pie marino. | `data` |
| **Cobertura y empresas** `coverage-page` | Cabecera marina → estado de fibra y 5G en los 8 municipios → galería del equipo local con Lightbox → bloque de soluciones para Empresas, hoteles y segundas residencias. | `data` `not-found` |
| **Condiciones / legal** `legal-page` | Lectura diáfana en container-prose con índice lateral para Condiciones generales sin permanencia, Aviso legal, Privacidad y Cookies. | `data` `not-found` |
<!-- /GEN:screenTemplates -->

### 10.2. Estados de pantalla

<!-- GEN:screenStates — generado desde design-manifest.json · no editar a mano -->
| Estado | Componente | Nota |
|---|---|---|
| **Con datos** `data` | `—` | Estado habitual de operación o escaparate comercial |
| **Cargando** `loading` | `Skeleton` | Reserva exacta de altura en filas o tarjetas de tarifa para evitar saltos de layout |
| **Vacío** `empty` | `EmptyState` | Sin registros todavía; icono, contexto y acción principal |
| **Primer uso** `first-run` | `EmptyState` | Bienvenida de módulo recién activado con acción guiada |
| **Sin resultados** `no-results` | `EmptyState` | Búsqueda de calle, municipio o cliente sin coincidencias; ofrece «Quitar filtros» |
| **Error de carga** `error` | `ErrorState` | Explica qué falló y ofrece «Volver a intentarlo» |
| **Sin permisos** `forbidden` | `ErrorState` | Icono lock en tono neutro cuando el perfil no tiene acceso al módulo |
| **No existe** `not-found` | `ErrorState` | 404 en web con accesos directos a Tarifas, Cobertura y WhatsApp local |
| **Degradado / parcial** `degraded` | `Alert` | Si el servicio automático de nodos FTTH no responde, permite enviar la consulta igualmente al equipo local |
| **Cambios sin guardar** `unsaved` | `Barra de guardado` | Barra fija inferior y aviso antes de salir con tarifas editadas sin publicar |
<!-- /GEN:screenStates -->

### 10.3. Mapa de pantallas del producto

<!-- GEN:screenTemplateMap — generado desde design-manifest.json · no editar a mano -->
| Vista | Plantilla |
|---|---|
| Gestión · Acceso (/dashboard/login) | `auth` |
| Gestión · Resumen operativo (/dashboard) | `metrics` |
| Gestión · Altas y cobertura, bandeja | `list` |
| Gestión · Detalle de solicitud / portabilidad | `detail-drawer` |
| Gestión · Bandeja sin solicitudes nuevas | `empty` |
| Gestión · Catálogo de tarifas (editor de planes y precios) | `long-form` |
| Gestión · Instalaciones FTTH y agenda técnica | `list` |
| Gestión · Cobertura insular por municipio | `list` |
| Gestión · Empresas y hostelería | `long-form` |
| Gestión · Analítica comercial | `metrics` |
| Gestión · Error de carga o permisos | `error` |
| Web · Portada comercial (/) | `public-landing` |
| Web · Cobertura en los 8 municipios y Empresas | `coverage-page` |
| Web · Condiciones sin permanencia, Privacidad y Cookies | `legal-page` |
| Web · 404 | `error` |
<!-- /GEN:screenTemplateMap -->

---

## 11. Matriz de estados de componente

<!-- GEN:componentStates — generado desde design-manifest.json · no editar a mano -->
| Componente | default | hover | focus-visible | active | disabled | loading | error |
|---|---|---|---|---|---|---|---|
| `Button` | ✓ | cta-hover / secondary-hover | anillo focus turquesa | scale-[.99] | opacity-50 | spinner manteniendo ancho | — |
| `IconButton` | ✓ | surface-hover | anillo focus | aria-pressed | opacity-50 | spinner | — |
| `Input / Textarea` | ✓ | borde fuerte | borde focus + anillo | — | opacity-50 | — | borde danger + mensaje + icono |
| `Select (Municipio)` | ✓ | borde fuerte | anillo focus | abierto | opacity-50 | skeleton | borde danger |
| `Checkbox / Radio` | ✓ | borde fuerte | anillo focus | marcado | opacity-50 | — | borde danger |
| `Switch (Modo Boceto / PVP)` | ✓ | ✓ | anillo focus | on/off | opacity-50 | — | — |
| `PlanCategoryTabs` | ✓ | surface-hover | anillo focus | aria-selected (cápsula marina) | opacity-50 | — | — |
| `FilterChip` | ✓ | borde fuerte | anillo focus | tono primary | opacity-50 | — | — |
| `Table row` | ✓ | surface-hover | anillo focus | seleccionada | — | Skeleton | — |
| `ServiceCategoryCard (×5)` | ✓ | elevación shadow-raised | anillo focus en su CTA | filtra pestaña de tarifa | — | Skeleton | — |
| `CoverageChecker / Formulario` | ✓ | — | anillo focus por campo | — | envío bloqueado | «Comprobando…» con spinner | alerta superior + error por campo |
<!-- /GEN:componentStates -->

---

## 12. Contrato de movimiento

<!-- GEN:motion — generado desde design-manifest.json · no editar a mano -->
> La entrada asienta con agilidad (ease-out-expo) y la salida recoge en menos tiempo (ease-exit). Ninguna animación retrasa consultar un precio o comprobar cobertura.

| Superficie | Clase | Entrada | Salida | Origen | Disparador |
|---|---|---|---|---|---|
| **Modal y Lightbox** | `ds-dialog + ds-surface` | 250 ms · fundido + escala 0,98→1 | 150 ms · inversa | centro | `showModal()` |
| **Drawer de solicitud / alta** | `ds-dialog + ds-surface--right` | 350 ms · desliza desde borde derecho | 240 ms · recoge hacia borde derecho | borde derecho | `showModal()` |
| **Menú móvil de la web** | `ds-dialog + ds-surface--right` | 350 ms · desde la derecha | 240 ms · hacia la derecha | borde derecho | `botón menu` |
| **Velo (overlay)** | `ds-dialog` | 250 ms · fundido | 150 ms · fundido | — | `con su diálogo` |
| **Menú contextual / Filtro** | `ds-popover` | 150 ms · fundido + escala 0,97→1 | 100 ms · inversa | esquina del disparador (--ds-origin) | `[data-open]` |
| **Tooltip** | `ds-tooltip` | 150 ms tras 400 ms de espera | 100 ms sin espera | el control | `hover / focus-within` |
| **Toast** | `ds-toast` | 250 ms · desde abajo | 150 ms · hacia abajo | borde inferior | `inserción en DOM · 4 s` |
| **Menú lateral (/dashboard)** | `ds-sidebar + ds-sidebar-label` | 250 ms · ancho; etiquetas después | 250 ms · etiquetas se funden antes (100 ms) | borde izquierdo | `clic en isotipo · [data-collapsed]` |
| **Revelado comercial (web)** | `ds-reveal` | 600 ms · fundido + 14px arriba, una sola vez | permanece visible | posición final | `IntersectionObserver · [data-revealed]` |

**Con `prefers-reduced-motion`:**

- El pulso de Skeleton y de indicadores en vivo se detiene.
- Los desplazamientos y escalas se anulan; permanecen únicamente los fundidos de opacidad.
- Los tooltips muestran ayuda sin retardo.
- El scroll suave se convierte en salto directo instantáneo.

**Nunca:**

- Salidas más lentas que las entradas.
- Botones flotantes con latidos o rebotes continuos que distraigan la lectura de tarifas.
- Transiciones lentas al cambiar entre pestañas de Fibra, Móvil, TV y Combos.
- Parallax pesado en móvil sobre la imagen del Faro de Favàritx.
- Bloquear el scroll del documento tras cerrar un modal o menú móvil.
<!-- /GEN:motion -->

---

## 13. Adaptación responsive

<!-- GEN:responsive — generado desde design-manifest.json · no editar a mano -->
| Patrón | Móvil (<640) | Tableta (640–1024) | Escritorio (>1024) |
|---|---|---|---|
| **Cabecera web** | Barra blanca h-16: logotipo + acceso WhatsApp compacto + botón Drawer | Barra h-20 + Drawer | Barra blanca h-20: logotipo completo, 7 enlaces y botón turquesa «WhatsApp 671 123 456» |
| **Portada (Hero Favàritx)** | Titular 36px, 2 CTA apilados y tarjetas debajo | Titular 44px, CTA en fila | Titular 52px a la izquierda sobre el faro + las 5 tarjetas en fila única abajo |
| **Tarjetas de categoría (×5)** | 1 columna apilada con CTA ancho completo | 2–3 columnas equilibradas | 5 columnas iguales (Fibra, Móvil, TV, Fibra+Móvil, Fibra+Móvil+TV) |
| **Franja marina de confianza** | 1–2 columnas sin divisores verticales | 2×2 con iconos turquesa | 4 pilares en una sola banda sobre marino (#072140) |
| **Configurador de tarifas** | Pestañas con scroll horizontal limpio + 1 tarjeta por fila | 2 columnas | Pestañas centradas + 3 tarjetas comparativas con plan central destacado |
| **Comprobador de cobertura** | Chips de 8 municipios + formulario en 1 columna | 1 columna amplia | 2 columnas: mapa textual de 8 municipios a la izquierda + formulario directo a la derecha |
| **Menú de /dashboard** | Drawer desde botón menu | Drawer desde botón menu | Barra lateral marina fija, contraíble a 64px |
| **Tabla de altas y cobertura** | Tarjetas apiladas con municipio, tarifa y estado | Scroll horizontal limpio | Tabla completa con filtro por municipio y apertura en Drawer |
<!-- /GEN:responsive -->

---

## 14. Componentes de dominio de Menorca Connect

<!-- GEN:domainComponents — generado desde design-manifest.json · no editar a mano -->
| Componente | Ámbito | Nota |
|---|---|---|
| `ServiceCategoryCard` | web · tarifas | Las 5 tarjetas superpuestas del boceto original (Fibra Óptica, Móvil, TV, Fibra+Móvil, Fibra+Móvil+TV) con medallón de icono, cuota «desde», 3 ventajas y CTA temático accesible |
| `TrustBar` | web · resumen | Banda estructural en esquema marino con los 4 compromisos de Menorca Connect: Atención cercana, Precios claros, Conexión rápida y Sin permanencia |
| `PlanCard` | web · tarifas | Ficha detallada de tarifa con etiqueta superior, título, velocidad/GB, cuota mensual en tabular-nums (IVA incl.), lista de prestaciones y CTA a WhatsApp/contratación |
| `PriceModeSwitch` | web · tarifas | Conmutador entre «Modo Boceto (XX,XX €)» y «Precios Demo (€)» para validar diseño o publicar tarifas definitivas sin tocar el HTML |
| `CoverageChecker` | web · cobertura | Selector de los 8 municipios menorquines + calle/número + teléfono que verifica huella o envía consulta inmediata al equipo técnico local |
| `MunicipalityBadge` | solicitudes · instalaciones · cobertura | Etiqueta compacta de municipio oficial (Maó, Ciutadella, Alaior, Es Mercadal, Ferreries, Es Castell, Sant Lluís, Es Migjorn Gran) |
| `BusinessQuoteCard` | web · empresas | Bloque sobre superficie marina para pymes, hoteles, agroturismos y villas con IP fija, simetría garantizada y soporte prioritario |
| `WhatsAppAction` | web | Acceso directo a atención local (671 123 456) resuelto con tokens AA del sistema (turquesa #0A7275 o secundario marino/brisa), nunca #25D366 con blanco |
| `StatusBadge` | gestión | Insignia semántica conectada a statusModels (tono + variante + icono + etiqueta) |
| `InquiryRow` | solicitudes | Fila/tarjeta de petición entrante con cliente, municipio, tarifa deseada, origen (Web / WhatsApp) y estado |
| `CategoryLegend` | analitica | Leyenda de series cat-1..4 en orden fijo: Fibra óptica, Móvil 5G, Menorca TV y Combos |
<!-- /GEN:domainComponents -->

---

## 15. Política de fotografía, vídeo e iconografía

<!-- GEN:media — generado desde design-manifest.json · no editar a mano -->
**Fotografía**

| Aspecto | Decisión |
|---|---|
| encuadre | Paisajes reconocibles de Menorca y escenas reales de conectividad local: el Faro de Favàritx al atardecer (assets/hero-favaritx.jpg), equipo cercano en arquitectura menorquina (assets/menorca-local-team.jpg) y teletrabajo frente a calas turquesa (assets/menorca-cala-connected.jpg). |
| personas | Trato natural, cotidiano y cercano en calles encaladas, comercios y terrazas de la isla; prohibidas las fotos de call-center corporativo con auriculares de stock. |
| tratamiento | Luz mediterránea limpia donde dialogan el azul marino del mar y los tonos turquesa y cálidos del atardecer menorquín, sin filtros neón artificiales. |
| overlay | Toda fotografía con titular o texto claro encima aplica bg-scrim (marino #072140 al 76%), garantizando ~7,0:1 incluso sobre espuma blanca o cielo luminoso. |
| ratios | 16:9 panorámico en Hero de portada · 4:3 en secciones editoriales («Hecha para Menorca», «Empresas») · 16:10 en visor Lightbox. |

**Vídeo**

| Aspecto | Decisión |
|---|---|
| ratios | 16:9 horizontal para piezas de marca o cobertura insular |
| autoplay | Solo ambiental silenciado, con pausa visible y desactivado automáticamente con prefers-reduced-motion |
| posterFrame | Obligatorio con fotograma real de Menorca (por ejemplo assets/hero-favaritx.jpg) |

**Ilustración**

| Aspecto | Decisión |
|---|---|
| permitida | Únicamente el isotipo vectorial oficial (doble pico 'M' con ondas de señal en logo-menorca-connect.svg). Sin mascotas 3D ni clip-art tecnológico. |
| relacionConIconos | Lucide 1.47 en currentColor para toda la interfaz, sustituyendo progresivamente los SVG inline sueltos de index.html. |

**Logos de terceros**

| Aspecto | Decisión |
|---|---|
| regla | Cualquier logotipo externo (canales de TV, fabricantes de routers Wi-Fi 6 o sellos oficiales CNMC) se aísla con // DS-EXCEPTION si exige color oficial propio. |
| tamanoMinimo | Altura mínima 24px con área de respeto equivalente a la mitad de su altura |
<!-- /GEN:media -->

---

## 16. Inventario del estado actual (`index.html` / `styles.css` / `app.js`) y deuda visual detectada

Al auditar la portada desplegada actualmente en la raíz del proyecto frente a este sistema se identifican los puntos concretos que resolverá la migración progresiva:

| Archivo actual | Hallazgo | Solución en el sistema |
|---|---|---|
| `styles.css` (`:root`) | Declara 17 variables ad-hoc (`--navy-800`, `--teal-500`, `--text-muted: #6c7d90`, etc.) y decenas de hex/rgba directos en reglas sueltas | Importar `docs/design-system/tokens.css`, activar `<body data-context="web">` y consumir tokens semánticos (`--color-page`, `--color-fg-muted`, `--color-cta`) |
| `styles.css` (`.card-btn` / `.header-whatsapp-btn`) | Rellenos `#149a9c` (`3,4:1`), `#68b42e` (`2,6:1`) y `#f3a115` (`2,1:1`) con texto blanco por debajo de WCAG AA | Calibrar a `--color-primary-solid` (`#0A7275`, `5,7:1`), `--color-success-solid` (`#2D7A1F`, `5,4:1`) y `--color-warning-solid` con tinta marina (`6,7:1`) |
| `styles.css` (`.hero-overlay`) | `linear-gradient` lateral artesanal sobre `assets/hero-favaritx.jpg` | Sustituir por velo uniforme `bg-scrim` (marino al 76 %, `~7,0:1` garantizado en cualquier encuadre) |
| `styles.css` (`.site-header`, `.whatsapp-float`) | `z-index: 1000` y `z-index: 1200` arbitrarios; orbe flotante con `#25d366` y animación infinita | Escala semántica cerrada (`z-sticky`, `z-drawer`, `z-modal`) y acceso WhatsApp accesible sin pulso intrusivo |
| `index.html` | Más de 15 `<svg>` inline manuales para Wi-Fi, móvil, TV, rayo, escudo y WhatsApp, además del logo repetido en cabecera y pie | Extraer el logo oficial a `assets/logo-menorca-connect.svg` tokenizado y unificar iconos sobre el diccionario Lucide (§8) |
| `app.js` (`PLANS_DATA`) | Catálogo de tarifas e interruptor `XX,XX € / PVP` embebidos en cliente con clases de color sueltas (`teal`, `orange`, `green`, `purple`) | Conectar al modelo `status.tarifas` (§7.3) y a las series/roles del sistema manteniendo `PriceModeSwitch` |

---

## 17. Plan de adopción sin roturas

1. **Fase 0 · Guía y validación (completada en v0.1):** `tokens.css`, `design-manifest.json`, `assets/logo-menorca-connect.svg`, `guia-visual.html` (con **Editor de tokens** interactivo) y validación matemática con `validate-design-system.mjs`.
2. **Fase 1 · Tokenización de la web pública:** importar `tokens.css` en `styles.css`, añadir `data-context="web"` en `index.html`, aplicar `data-theme="dark"` a Hero, franja de confianza, sección Empresas y pie, y corregir los contrastes AA de botones de tarifa y WhatsApp.
3. **Fase 2 · Iconografía y diálogos nativos:** sustituir los SVG artesanales por el diccionario Lucide (§8) y convertir el menú móvil en `<dialog class="ds-dialog">` con `ds-surface--right` y atrapado de foco nativo.
4. **Fase 3 · Persistencia de solicitudes y catálogo:** respaldar el comprobador de cobertura y el catálogo `PLANS_DATA` en backend conservando el desvío inmediato a WhatsApp local.
5. **Fase 4 · Construcción de `/dashboard`:** levantar el `AppShell` en contexto `gestion` reutilizando las primitivas y las 10 plantillas de §6 y §10, activando `node docs/design-system/validate-design-system.mjs --src .` en CI.

---

## 18. Registro de decisiones

| Fecha | Versión | Decisión y motivo |
|---|---|---|
| 2026-11-11 | v0.1 | Creación inicial del sistema de diseño de Menorca Connect con arquitectura de doble fuente (`tokens.css` + `design-manifest.json`), paleta insular brisa (`#F3F7F9`) + marino profundo (`#072140`) + turquesa calibrado AA (`#0A7275`), pareja tipográfica `Plus Jakarta Sans` + `Montserrat` con `tabular-nums`, radios cercanos (`8/14/18px`), vectorización tokenizada de `logo-menorca-connect.svg` (doble pico `M` + ondas de señal), catálogo de 10 plantillas para `/dashboard` y web comercial (incluyendo las 5 tarjetas de servicio, comprobador en los 8 municipios y conmutador Modo Boceto `XX,XX €`), y guía interactiva con Editor de tokens lateral en vivo. |
