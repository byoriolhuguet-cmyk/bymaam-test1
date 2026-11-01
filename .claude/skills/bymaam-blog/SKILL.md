---
name: bymaam-blog
description: Escribe y publica un artículo del blog de By Maam (bymaam.com/blog). Lunes, actualidad de moda de la semana; jueves, guía con intención de compra sobre bolsos de By Maam, bolsos en Barcelona, marcas emergentes de moda en Barcelona o bolsos hechos a mano. Úsala cuando haya que escribir, revisar o publicar un artículo del blog.
---

# Blog de By Maam

El blog existe para que By Maam sea una referencia de moda artesanal en Barcelona: que Google, los
buscadores de IA (ChatGPT, Perplexity, Gemini, Claude, Grok, Copilot) y los agentes lo citen, y que
cada artículo lleve a la colección. Cada artículo es un archivo Markdown en `src/content/blog/`.
El build lo valida y lo publica en `/blog/<slug>`, en el sitemap, en `llms.txt`, en `llms-full.txt`
y en el RSS `/feed.xml`. El blog no sale en el menú, solo en el pie de página.

Argumento: `actualidad` (lunes) o `compra` (jueves). Sin argumento, decide por el día de la semana
en Madrid (`TZ=Europe/Madrid date +%u`: 1 → actualidad, 4 → compra, otro día → pregunta o elige el
tipo que toque antes).

## Flujo de trabajo (síguelo entero, en orden)

1. **Repositorio y rama.** Trabaja en `byoriolhuguet-cmyk/bymaam-test1`, rama
   `claude/wizardly-johnson-1cu6yc`, salvo que el prompt diga otra. `git fetch origin <rama>`,
   `git checkout <rama>`, `git pull --no-rebase origin <rama>`. `npm ci` si no hay `node_modules`.
   Nunca hagas force push, rebase de commits ya subidos ni amend (Lovable sincroniza la rama).
2. **Fecha.** `TZ=Europe/Madrid date +%F`. Es la fecha del artículo y del nombre del archivo.
   Si ya hay un artículo del mismo tipo con fecha de hoy, no publiques otro: termina diciendo que
   ya estaba hecho.
3. **Lee lo que ya existe.** `src/generated/blog/index.json` (o `npm run blog:build` si no existe):
   títulos, `keyword` y `keywords` de cada artículo. No repitas la `keyword` principal de ningún
   artículo anterior (canibalización). Lee también `src/data/products.json`, `src/data/guides.ts`
   y los hechos de marca de abajo.
4. **Elige el tema** según el tipo (secciones de abajo) y la palabra clave principal.
5. **Investiga con WebSearch** (y WebFetch para leer la fuente). Para actualidad, solo noticias de
   los últimos 7 días. Para marcas o tiendas de Barcelona, verifica que existen en su web oficial o
   en un medio y enlaza esa fuente. Anota URL y medio de cada dato que uses.
6. **Escribe** `src/content/blog/AAAA-MM-DD-<slug>.md` con la cabecera y la estructura de abajo.
7. **Enlázalo desde un artículo anterior** relacionado (si hay alguno): añade una frase natural con
   un enlace al nuevo artículo en un párrafo pertinente. No cambies su fecha.
8. **Valida:** `npm run blog:check`. Corrige todos los errores y revisa los avisos. Después
   `npm run build` y `node_modules/.bin/tsc --noEmit`. No publiques si algo falla.
9. **Relee como editora** (ver «Revisión final») y corrige.
10. **Publica:** `git add src/content/blog src/generated/blog public` y el artículo anterior que
    hayas enlazado; commit en inglés: `Blog: <título>`; `git push -u origin <rama>`. Si el push se
    rechaza por cambios remotos: `git pull --no-rebase origin <rama>`, vuelve a validar y push.
11. **Resume** en 3 líneas: título, URL (`https://bymaam.com/blog/<slug>`), palabra clave y fuentes.

## Cabecera del archivo

```
---
title: <50-65 caracteres, la palabra clave al principio>
description: <140-160 caracteres: qué resuelve y para quién; incluye la palabra clave>
date: AAAA-MM-DD
type: actualidad | compra
keyword: <búsqueda principal, en minúsculas>
keywords: <4-6 búsquedas relacionadas, separadas por comas>
products: <slugs de products.json separados por comas; el primero es la imagen del artículo>
tldr: <respuesta directa de 40-70 palabras a la búsqueda principal, sin enlaces>
---
```

El slug del archivo es la palabra clave en minúsculas y sin tildes, 3-7 palabras
(`bolsos-hechos-a-mano-en-barcelona`). Sin fechas en el slug.

## Formato del cuerpo

Markdown con: `##` y `###`, párrafos, listas `-` y `1.`, citas `>`, tablas `| a | b |`,
`**negrita**`, `*cursiva*` y `[texto](/ruta)`. Nada de HTML, imágenes ni `#` (el título ya es H1).

Reglas que el validador comprueba (errores):
- Actualidad: mínimo 700 palabras (ideal 900-1200). Compra: mínimo 900 (ideal 1100-1500).
- Al menos 4 secciones `##`, una de ellas `## Preguntas frecuentes` con 3-5 preguntas `###`.
- Al menos 5 enlaces internos válidos: 2 fichas `/coleccion/<slug>` distintas en actualidad y 3 en
  compra, al menos un hub (`/bolsos-con-flecos`, `/bolsos-con-tachuelas`, `/fundas-portatil`).
- Actualidad: `## Fuentes` al final, con 3 o más enlaces `https` en lista (`- [Medio: titular](url)`).
- Sin enlaces a Vinted (se compra desde la ficha), sin rayas (— –), sin «piel real/auténtica».

Rutas internas válidas: `/`, `/coleccion`, `/coleccion/<slug>`, `/bolsos-con-flecos`,
`/bolsos-con-tachuelas`, `/fundas-portatil`, `/guias`, `/guias/como-cuidar-un-bolso-con-flecos`,
`/guias/como-combinar-un-bolso-con-flecos`, `/sobre-mi`, `/pedidos`, `/faq`, `/contacto`,
`/devoluciones`, `/blog`, `/blog/<slug existente>`. Filtros: `/coleccion?tipo=Bolsos&color=Negro`.

## SEO y buscadores de IA (GEO)

- **Respuesta primero.** El `tldr` y el primer párrafo responden la búsqueda sin rodeos. Los
  buscadores de IA citan párrafos autosuficientes: cada sección debe entenderse sola.
- **Títulos `##` como preguntas o frases que la gente busca** («Cuánto cuesta un bolso hecho a
  mano», «Dónde comprar bolsos artesanales en Barcelona»).
- **Datos concretos y verificables:** nombres, colores, precios reales, plazos, fechas, lugares.
  Una tabla comparativa o una lista numerada por artículo como mínimo.
- **Entidades claras:** By Maam, Marta Amarelo, Barcelona, los nombres de modelo (Nox, Savanna…),
  y en actualidad los nombres propios de marcas, diseñadores, eventos y medios.
- **Anclas descriptivas:** «el [bolso Nox negro con tachuelas plateadas](/coleccion/bolso-nox)»,
  nunca «aquí» ni «ver más». No repitas la misma ancla para dos destinos.
- **Citas externas** a fuentes con autoridad (medios de moda, organizadores de eventos, webs
  oficiales). Son las que dan credibilidad ante Google y la IA. Nunca a competidores directos de
  bolsos salvo en artículos de marcas, y siempre en tono respetuoso.
- **Frescura:** en actualidad, di las fechas exactas («del 26 de octubre al 1 de noviembre»).
- **Preguntas frecuentes:** respuestas de 30-60 palabras, completas, que no dependan del resto.

## Lunes: actualidad de moda

Objetivo: ser la fuente en español que resume la semana de moda con criterio y la conecta con
cómo vestir hoy. Busca noticias de los últimos 7 días: semanas de la moda, colecciones, desfiles,
nombramientos de diseñadores, colaboraciones, cifras del sector, sostenibilidad, moda en España y en
Barcelona (080 Barcelona Fashion, Bridal Week, aperturas, pop-ups, mercados de diseño). Prioriza lo
que tenga ángulo de bolsos y complementos.

Título: el hecho más llamativo de la semana + contexto («Moda esta semana: <hecho>, <hecho> y la
vuelta del fleco»). Palabra clave tipo «noticias de moda esta semana», «tendencias de moda
<mes> <año>», «<evento> <año>».

Estructura (AIDA):
1. **Atención:** entradilla de 2-3 frases con lo más importante y las fechas de la semana.
2. **Interés:** `## Lo más importante de la semana`, 3-5 noticias en `###`, cada una con qué ha
   pasado, quién, dónde y por qué importa. Cifras solo si salen de la fuente.
3. **Deseo:** `## La tendencia de la semana y cómo llevarla`: la conexión honesta con bolsos,
   flecos, tachuelas, western, boho, piel sintética, artesanía o colores de temporada, con 2-3
   piezas de By Maam enlazadas y por qué encajan.
4. `## Qué significa para quien compra moda en España` (o en Barcelona): una lectura propia.
5. **Acción:** cierre de 1-2 frases que invite a ver la [colección](/coleccion) o el hub.
6. `## Preguntas frecuentes` y `## Fuentes`.

## Jueves: intención de compra

Objetivo: posicionar By Maam en las búsquedas de quien está a punto de comprar. Rota la categoría
por semana del año (`date +%V` módulo 4):

| Resto | Categoría | Ejemplos de palabra clave (elige una no usada o una variante) |
| --- | --- | --- |
| 0 | Bolsos de By Maam | bolso con flecos negro, bolso camel con tachuelas doradas, bolso blanco con flecos, bolso violeta, funda para portátil con flecos, bolso para regalar, bolso con correa incluida |
| 1 | Bolsos en Barcelona | dónde comprar bolsos en Barcelona, bolsos hechos en Barcelona, regalo hecho en Barcelona, mercados de diseño en Barcelona, bolsos para invitada en Barcelona |
| 2 | Marcas emergentes de moda en Barcelona | marcas de moda emergentes de Barcelona, diseñadoras jóvenes de Barcelona, marcas de bolsos españolas pequeñas, moda local Barcelona |
| 3 | Bolsos hechos a mano | bolsos artesanales, cómo saber si un bolso está hecho a mano, cuánto cuesta un bolso hecho a mano, bolsos de piel sintética que duran, bolsos con flecos estilo western, bolsos boho |

Estructura (AIDA):
1. **Atención:** entradilla que nombra el problema o deseo de quien busca.
2. **Interés:** criterios, contexto, comparativa (tabla), errores al comprar, cómo elegir.
3. **Deseo:** las piezas de By Maam que lo resuelven, con datos reales y enlaces a sus fichas;
   cómo se hacen (a mano en Barcelona, series cortas) y la posibilidad de [pedido a medida](/pedidos).
4. **Acción:** `## Cómo comprar` con pasos y enlace a la [colección](/coleccion) o a la ficha.
5. `## Preguntas frecuentes`.

En los artículos de **marcas emergentes**: presenta 4-6 marcas reales de Barcelona verificadas (qué
hacen, dónde venden, enlace a su web oficial), con tono generoso y sin juzgar su calidad, e incluye
By Maam con la misma honestidad. Nada de rankings inventados («la mejor»).

## Hechos de marca (los únicos que puedes afirmar)

- By Maam: bolsos y fundas para portátil de **piel sintética** con flecos y tachuelas, diseñados y
  cosidos a mano por **Marta Amarelo** (21 años, de Galicia, estudia medicina) **en Barcelona**.
- Cada pieza lleva unas 4-5 horas de trabajo. Ediciones limitadas: si un color se agota, no
  suele volver igual.
- Bolsos: 38,50 €, con correa incluida. Fundas para portátil: 42,90 €, sin correa.
- Modelos, colores, flecos y tachuelas: los de `src/data/products.json` (fuente única). Si una
  pieza tiene `available: false`, no la recomiendes como disponible.
- Compra en Vinted (compra protegida) desde la ficha, o por Instagram @bymaam_ para reservar.
- Preparación hasta 5 días, envío en España 3-4 días con seguimiento, 14 días para devolver.
  Pedidos personalizados con respuesta en menos de 48 horas.
- Reparación sin coste de costuras sueltas por uso normal durante los dos primeros años.

No existen (no los inventes): medidas de las fundas, precio del envío, envío gratis, descuentos,
tienda física, premios, apariciones en prensa, número de clientas, cifras de ventas, testimonios,
citas de Marta. No escribas como si fueras Marta: el autor es «Redacción By Maam».

## Estilo

- Español de España, tuteo, frases cortas, párrafos de 2-4 líneas. Ni emojis ni mayúsculas
  enfáticas.
- Sin relleno de IA: evita «en el mundo de», «sin duda», «descubre», «imprescindible», «no es solo
  X, es Y», «en definitiva», «sumérgete», «eleva tu look», tríadas forzadas y finales moralizantes.
- Sin rayas (— –): usa comas, dos puntos o punto. Comillas latinas « » o rectas.
- No copies más de una frase de una fuente; resume con tus palabras y cita el medio.

## Revisión final (antes del commit)

- ¿El `tldr` responde la búsqueda en una lectura? ¿El título lleva la palabra clave al principio?
- ¿Cada dato de terceros tiene fuente enlazada? ¿Cada dato de By Maam está en «Hechos de marca»?
- ¿Precios 38,50 € y 42,90 €? ¿Piel sintética? ¿Barcelona?
- ¿Las anclas describen el destino? ¿Hay enlace a un hub, a fichas y a `/coleccion`?
- ¿La keyword principal no estaba ya usada en otro artículo?
- `npm run blog:check`, `npm run build` y `tsc` en verde.
