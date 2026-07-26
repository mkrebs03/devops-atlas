# Auditoría de contenido — Atlas

Revisión completa de las 22 páginas ES (`src/content/docs/`), la landing (`src/components/AtlasLanding.astro`) y la taxonomía (`src/data/curriculum.mjs`).
Los hallazgos aplican igual a `src/content/docs/en/`: son problemas de contenido, no de traducción, y arreglar uno obliga a arreglar su par.

Orden: primero lo estructural (por qué el contenido "se siente suelto"), después lo puntual por página.

**Regla de redacción que atraviesa todo lo demás:** el texto se escribe desde lo que el lector viene a conseguir, nunca desde la historia interna del proyecto. Nada de definirse por lo que se quitó ("sin progreso", "ninguna página bloqueada", "sin insignias"), por decisiones editoriales ("el Atlas prefiere decirlo a fingir lo contrario") ni por hoja de ruta interna ("parte del plan del proyecto"). Quien llega no conoce esa historia: para esa persona son frases sin referente. Se dice qué hay, qué falta y cómo encontrarlo, en términos de su beneficio.

---

## A · Huecos estructurales

### A1 · No existe ninguna página que explique qué es DevOps

**Severidad: alta.** Es la causa raíz de la sensación de "información suelta".

El sitio se llama DevOps Atlas, la landing dice "Aprende DevOps" y el primer módulo abre con *"DevOps no empieza con una herramienta, sino con la capacidad de hacer preguntas concretas sobre un sistema"* (`foundations/index.md:19`). Nunca se dice **qué es**. No hay página, sección ni párrafo que cubra:

- Qué problema resuelve DevOps (el muro entre desarrollo y operaciones; el ciclo entregar → operar → aprender).
- Qué hace una persona en ese rol un día cualquiera, y qué *no* hace.
- Cuál es el ciclo de vida completo y qué partes cubre el Atlas.
- Por qué los cinco módulos son esos cinco, en ese orden.

El lector con base de desarrollo llega, ve "Fundamentos → Linux y terminal" y no tiene marco para saber por qué empieza ahí.

**Arreglo propuesto:** página nueva `que-es-devops` (módulo 00 o página raíz fuera de módulos), enlazada desde la landing como primer destino. Debe contener el ciclo de vida como diagrama y el mapa explícito "esta etapa se cubre aquí / esta todavía no".

> **Hecho.** `src/content/docs/what-is-devops.md` + `en/what-is-devops.md`, como página suelta (no módulo), enlazada desde la barra lateral, la landing y el índice de Fundamentos. Cubre: el muro y su bucle, definición, qué no es, el ciclo completo con diagrama, las tres ideas de fondo (flujo, retroalimentación, reversibilidad), el día a día del rol, qué cubre el Atlas y qué no, y cómo usar el sitio.
> Con eso, **A3 queda cubierto a nivel de página** (la tabla de etapas y la lista de lo que falta) y **parte de A2** (prerrequisito, orden sugerido no obligatorio, uso suelto vs en orden). Falta llevar esa declaración a la landing.

### A2 · La landing nunca declara propósito, audiencia ni límites

`AtlasLanding.astro:34` — la lede dice *"Referencia de DevOps para quien ya programa"*. Es lo único. Falta:

- **Para quién no es** (no enseña a programar; `PRODUCT.md:46` lo dice, la web no).
- **Qué te llevas** al terminar de leer.
- **Cómo se usa el sitio**: se puede leer en orden o consultar suelto. El orden es sugerido, no obligatorio — eso está decidido en `curriculum.mjs:5-8` pero nunca se le comunica al lector.
- **Qué no está cubierto todavía** (ver A3).

Las cinco tarjetas de módulo (`AtlasLanding.astro:65-77`) muestran etiquetas y herramientas sin ninguna frase que las una como recorrido.

> **Hecho.** La landing abre con "Qué es DevOps" como acción principal; "Qué hay dentro" lleva una entradilla que nombra el recorrido (leer la máquina, colaborar, empaquetar, probar, producción); hay una sección nueva **Cómo usarlo** con tres columnas —en orden o suelto, para quien ya programa, en español y en inglés—; y el pie dice hasta dónde llega el contenido y qué no vas a encontrar todavía. Estilos nuevos en `landing.css` (`.landing__intro`, `.landing__use`), sin componentes ni colores nuevos.

### A3 · El alcance real no se declara en ninguna parte

`PRODUCT.md:47` compromete IaC, cloud, Kubernetes, observabilidad y seguridad como cobertura futura. En la web no hay ni una palabra. El lector no puede distinguir "el Atlas decidió no cubrir Kubernetes" de "el Atlas cubre todo DevOps y Kubernetes no es importante".

Peor: hay contenido que **depende** de lo que falta.

- `deployment/strategies.md:38` — canary: *"si las métricas están sanas, subes"*. No existe ninguna página sobre métricas, logs ni observabilidad. El lector no sabe de dónde salen esas métricas ni qué mirar.
- `deployment/strategies.md` completo describe cambiar tráfico entre versiones. El mecanismo que cambia tráfico (proxy inverso, balanceador de carga) no se explica en ningún lado del sitio.
- `deployment/lab-release.md` se vende como blue-green pero en realidad para un contenedor y arranca otro en el mismo puerto. Sin capa de enrutamiento, el lab no puede mostrar lo que la página conceptual describe.

**Arreglo propuesto:** sección "Qué falta todavía" en la landing, honesta y fechada; y una página de proxy inverso / balanceo en Fundamentos o Despliegue, que es la pieza que hace falta para cerrar el módulo 5.

> **Hecho.** La declaración de alcance está en la landing y en la página de qué es DevOps (ver A1 y A2).
> La pieza que faltaba es `deployment/proxy` (orden 20, antes de estrategias): un solo 443 para muchos servicios, qué resuelve un proxy inverso —enrutado, terminación TLS, superficie mínima, reglas y logs en un punto—, balanceo entre instancias, el chequeo de salud como lo que lo hace útil, y una tabla que enlaza cada estrategia con lo que cambia en el proxy. Cierra con drenaje de conexiones y por qué el estado en memoria rompe el balanceo.
> `strategies` ahora depende de esa página y lo dice en su primer párrafo; `lab-release` explica que el puerto 8080 hace de proxy y que por eso hay un corte que en producción no habría; el índice del módulo gana la fila "Tráfico".
> El otro hueco era canary diciendo "si las métricas están sanas" sin ninguna página detrás. Lo cubre `deployment/observability` (orden 22): monitorizar frente a observar, las tres señales con qué pregunta responde y qué cuesta cada una, las cuatro señales doradas medidas en la frontera del usuario, por qué el promedio miente y se usan percentiles, qué comparar entre versión nueva y vieja en los primeros minutos —que es literalmente lo que significaba "métricas sanas"—, y alertas sobre síntomas en vez de sobre causas. La línea del canary ahora enlaza ahí.
> Con eso, las afirmaciones de alcance de la landing y de qué es DevOps ya no listan observabilidad como ausente.

### A4 · La columna vertebral aparece una sola vez, en el módulo 4

`testing/index.md:23` — *"En Fundamentos aprendiste a observar; en Colaboración, a revisar; en Entrega, a empaquetar."* Es la mejor frase del sitio para explicar la estructura, y está enterrada en la cuarta página índice. `foundations/index.md:47` intenta algo parecido (*"la base de Git, Docker y CI/CD"*) pero nombra herramientas, no los módulos que existen.

**Arreglo:** subir esa idea a la landing y a `que-es-devops`, y que cada índice de módulo abra con una línea de "vienes de X, esto te prepara para Y".

---

## B · La página de Linux es sobre la terminal, no sobre Linux

**Severidad: alta.** Es el ejemplo que levantaste y se confirma: `foundations/linux-cli.md` se titula "Linux y terminal" y todo el cuerpo es shell, tuberías, permisos y `systemd`. Nunca responde:

1. **Por qué Linux.** No hay una sola frase que explique por qué los servidores corren Linux y no Windows o macOS. Es la pregunta que el título promete y no cumple.
2. **Qué es una distribución.** Aparecen `systemctl`, `journalctl` y `ss` sin decir que son de Linux moderno con systemd, ni que los gestores de paquetes (`apt` / `dnf`) difieren por familia. El lector que abra una terminal de macOS y escriba `ss` no encontrará el comando.
3. **Dónde practicar.** No se dice cómo conseguir un Linux: WSL, máquina virtual, contenedor, VPS. El lab de Fundamentos asume una terminal con `ss` disponible y no advierte nada.
4. **Jerarquía del sistema de archivos.** `/etc`, `/var/log`, `/opt` se usan en ejemplos (`linux-cli.md`, sección de comprobación) sin haberlos presentado.
5. **Usuarios y grupos.** Se leen permisos `deploy web` y se ejecuta `chown deploy:web` (`linux-cli.md:41`) sin explicar antes qué es un usuario del sistema, un grupo, o por qué un servicio corre como usuario propio.
6. **Qué es un servicio / init.** `systemd` aparece nombrado como hecho consumado: *"muchos programas se ejecutan como servicios gestionados por systemd"*. Nunca se explica qué significa "servicio" ni por qué importa (arranque, reinicio, logs centralizados).

**Arreglo propuesto:** partir en dos páginas — `linux` (por qué, distribuciones, sistema de archivos, usuarios/grupos, paquetes, servicios, cómo conseguir un entorno) y `terminal` (shell, canales, tuberías, bucle de diagnóstico, que es el contenido actual y es bueno). Es la mayor reescritura de la lista.

> **Hecho.** `foundations/linux-cli` ya no existe; en su lugar hay `foundations/linux` (02) y `foundations/terminal` (03), en ambos idiomas.
> `linux` responde los seis puntos: por qué Linux (servidores, contenedores, runners, y que se administra por texto y por eso se puede versionar), qué es una distribución con tabla de familias y gestores, cómo conseguir un entorno (contenedor, WSL 2, máquina virtual, VPS) con el aviso de que macOS es Unix pero no Linux, el árbol de archivos con qué buscar en cada ruta, el modelo de usuarios/grupos/permisos con diagrama de cómo se resuelve el acceso, y qué es un servicio gestionado por `systemd`.
> `terminal` conserva lo que ya estaba bien —shell como intérprete, los tres canales, tuberías, `ps` frente a `ss`, el bucle de diagnóstico— y remite a `linux` para permisos y servicios.
> Efectos: todas las páginas se renumeraron (20 → 21), los prerrequisitos que apuntaban a `foundations.linux-cli` ahora apuntan a `foundations.terminal`, y `astro.config.mjs` redirige la URL antigua a `/foundations/terminal/` en los dos idiomas.

---

## C · Términos usados antes de definirse

Este es el segundo motor de la sensación de "suelto": vocabulario que aparece funcionando como si ya se conociera. Ordenado por gravedad.

| Término | Primer uso sin definir | Se define en |
| --- | --- | --- |
| **Artefacto** | `delivery/index.md:24` y takeaway de esa misma página | Nunca. La página promete "distinguir código fuente, artefacto y entorno" y no define ninguno de los tres |
| **Pipeline** | `delivery/index.md:19` (*"Una pipeline no existe para verse automatizada"*) | Nunca de forma directa |
| **CI / CD** | `collaboration/github-flow.md:63` (módulo 2) | `deployment/index.md:22` (módulo 5) |
| **Producción / entorno / staging** | `delivery/index.md:39` | Nunca. `deployment/pipeline.md` usa dev/staging/producción como categorías conocidas |
| **Registro de imágenes (registry)** | `deployment/pipeline.md:43` (`docker push registry/app`) y `ghcr.io/...` en `delivery/docker.md:88` | Nunca |
| **SHA como identificador** | `delivery/docker.md:30` (*"usa un identificador inmutable como un SHA"*) | Nunca se explica de dónde sale ni por qué es inmutable |
| **Lint** | `delivery/github-actions.md:33`, `testing/in-ci.md:31` | Nunca |
| **Pruebas de humo** | `deployment/pipeline.md:50` | Nunca |
| **Runner / `runs-on`** | `delivery/github-actions.md` (todos los YAML) | Nunca se dice qué máquina es `ubuntu-latest` ni quién la provee |
| **Secreto** | `delivery/github-actions.md:88` | Se menciona dónde viven, no qué son ni por qué no van al repo |
| **Firewall** | `foundations/lab-shell-and-network.md`, tabla de síntomas | Nunca |
| **Área de preparación (staging area)** | Implícita en `git diff --cached` (`collaboration/git-model.md:47`) y en `git add` de los labs | Nunca se nombra ni se explica |
| **Issue** | `collaboration/github-flow.md:39` (`Closes #42`) | Nunca |

**Arreglo propuesto:** dos frentes. (1) Definir en el lugar donde primero hace falta — casi todos caben en una frase. (2) Una página de **glosario** de conceptos, distinta del A–Z de herramientas, que hoy no existe.

> **Hecho.** Los trece términos quedan definidos donde primero aparecen:
> - `delivery/index.md` abre con **pipeline**, **artefacto** y **entorno** (con producción y staging dentro).
> - `delivery/github-actions.md` define **runner** al presentar los jobs, **lint** al ordenar las comprobaciones, y **secreto** separado de **permisos**, que antes iban en el mismo párrafo.
> - `delivery/docker.md` explica por qué `latest` no es fiable, qué es un **SHA** y qué es un **registro de imágenes** —que era de dónde salía el `ghcr.io` sin presentar.
> - `deployment/pipeline.md` define **prueba de humo**.
> - `collaboration/git-model.md` nombra el **área de preparación** y con eso explica por qué hay dos diffs.
> - `collaboration/github-flow.md` define **issue** y **CI** en su primera aparición, tres módulos antes de donde estaba.
> - `foundations/networking.md` define **IP**, **puerto**, **socket** y **firewall** —este último explica de paso por qué una conexión se cuelga en vez de ser rechazada, que era una fila sin respaldo en la tabla del lab.
>
> Y hay página nueva de **[glosario](/glossary/)** en ambos idiomas, enlazada en la barra lateral junto al A–Z: 37 términos, una línea cada uno y el enlace a donde se explica completo. Queda claro el reparto: el A–Z lista herramientas, el glosario lista conceptos.

---

## D · Referencias sueltas heredadas del despliegue del propio autor

- ~~`delivery/docker.md:85` y `:99` — **Caddy** aparece dos veces, sin presentación.~~ **Hecho:** ahora la sección habla de "un proxy inverso" y enlaza a `deployment/proxy`, donde Caddy se presenta junto a nginx y Traefik. La red del ejemplo pasó de `caddy-net` a `edge`.
- ~~`delivery/docker.md:88` — bloque YAML de **Docker Compose** sin una sola línea que introduzca qué es Compose.~~ **Hecho:** una frase lo presenta como la forma de describir varios contenedores y su red en lugar de encadenar `docker run`.
- `delivery/index.md:39` y `delivery/lab-container-pipeline.md:91` — **VPS** mencionada dos veces como si fuera el destino conocido del despliegue. Es la arquitectura del autor, no un concepto presentado.

**Arreglo:** o se generalizan (proxy inverso, servidor), o se introducen de verdad.

---

## E · Otros huecos de concepto por módulo

**Fundamentos · redes** (`foundations/networking.md`)
- ~~No se explica qué es una IP.~~ ~~"Puerto" se usa sin definirse realmente.~~ Hechos, junto con **socket** y **firewall** (ver C). Sigue sin cubrirse la diferencia entre dirección local y pública, ni gateway/subred.
- Falta proxy inverso y balanceador, que después hacen falta en Entrega y Despliegue (ver A3).

**Colaboración · Git** (`collaboration/git-model.md`)
- Mismo problema que Linux, en pequeño: **por qué Git** y no otro control de versiones, nunca se dice.
- No se explica qué es un repositorio, ni `clone`, ni el área de preparación. El módulo abre en commits/ramas/HEAD asumiendo instalación y repo ya existentes.
- No se dice qué es GitHub frente a Git (plataforma vs herramienta), aunque `github` está en el frontmatter de dos páginas.

**Entrega · Docker** (`delivery/docker.md`)
- **Por qué contenedores** y no máquinas virtuales: no aparece. Tampoco el problema que resuelven ("funciona en mi máquina").
- No se explica qué aísla un contenedor ni en qué se apoya, ni siquiera a nivel de modelo mental.

**Pruebas** (`testing/`)
- El módulo está bien escrito pero no dice **qué tiene de DevOps**. Para un lector que ya programa y ya escribe tests, el ángulo distintivo (la prueba como compuerta del pipeline) solo aparece en `in-ci`, no en el índice.

**Despliegue** (`deployment/`)
- ~~Sin observabilidad ni mecanismo de tráfico, el módulo describe decisiones que el lector no puede ejecutar ni verificar.~~ **Resuelto** con `deployment/proxy` y `deployment/observability` (ver A3).

---

## F · Inconsistencias de nomenclatura y metadata

1. ~~**Tres nombres para lo mismo.**~~ **Arreglado:** todo es **Práctica** / **Practice** —títulos, tablas de los índices y la cifra de la portada. El hallazgo original: Los títulos dicen `Práctica · …`, las tablas de los índices enlazan como `[Lab de shell y red]`, `[Lab de ramas]`, `[Lab de pipeline]` (`foundations/index.md:41`, `collaboration/index.md:38`, `delivery/index.md:33`), la landing los cuenta como "prácticas" (`AtlasLanding.astro:58`) y `PRODUCT.md` los llama *walkthroughs*. Elegir uno.

2. ~~**El A–Z mezcla herramientas con conceptos.**~~ **Arreglado.** El índice se genera del frontmatter `tools:`, que arrastraba nueve entradas que no son herramientas: `ci`, `ci-cd`, `containers`, `deployment`, `networking`, `terminal`, `testing`, `logs` y `pull-requests`. Fuera las nueve. Con el glosario ya en pie, el reparto queda limpio —el A–Z lista herramientas y tecnologías, incluidos protocolos como DNS, HTTP y TLS; el glosario lista conceptos— y la descripción de la página lo dice.

3. ~~**Kubernetes figura como herramienta del Atlas sin contenido.**~~ **Arreglado.** `deployment/strategies.md` declaraba `tools: [deployment, kubernetes]`, así que el A–Z listaba Kubernetes apuntando a una página que solo lo menciona en un enlace externo — la única afirmación del sitio que no se podía respaldar. Ahora declara `[deployment, nginx]`, que es lo que la página realmente usa.

4. **Tensión curso/wiki en la redacción.** Cada índice cierra con "Resultado esperado · Al terminar podrás…" y el frontmatter usa `learningObjectives`. Posicionamiento decidido (`PRODUCT.md:21`) es wiki de referencia, no curso. La página lee como curso y navega como wiki; parte de la confusión de propósito que notaste sale de ahí.

5. ~~**Grafo de prerrequisitos incoherente.**~~ **Arreglado.** `testing/pyramid.md` declaraba un prerrequisito de Fundamentos que la página no necesita: entender la pirámide de pruebas no exige saber shell. Ahora no declara ninguno, que es la verdad, y los prerrequisitos que sí se muestran al lector son reales.

6. ~~**Estructura desigual en los labs.**~~ **Arreglado.** Las cinco prácticas siguen la misma forma: Objetivo → Requisitos → Pasos → Verificación → Comprueba lo que entendiste → Limpieza. Dos metían la limpieza a mitad de página, dos no tenían Requisitos, a `testing` le faltaba Verificación y ninguna declaraba cuánto lleva. Resuelto en las cinco.

7. **~~Los títulos de los avisos no se mostraban.~~ Arreglado.** Las 32 llamadas `:::note`, `:::tip` y `:::caution` del sitio usaban la sintaxis antigua (`:::tip Título`), que Starlight 0.41 ya no reconoce: el título se descartaba en silencio y el aviso salía rotulado con el genérico "Consejo" / "Nota" / "Precaución". Se perdía texto escrito a propósito —"Una imagen es un artefacto", "Falla rápido, falla claro", "Desplegar no es un evento, es una capacidad"— en todas las páginas. Convertidas a `:::tip[Título]`.

8. **Resuelto por construcción.** `PRODUCT.md:29` pide presentar las prácticas honestamente, sin fingir que algo corrige al lector. La sección **Verificación** hace justo eso sin hablar de las limitaciones del sitio: enuncia la afirmación comprobable que el lector puede demostrar por su cuenta. Las cinco la tienen ahora. Decir además "esto no lo revisa nadie" sería describir el sitio desde su propia historia, que es justo lo que la regla de redacción de arriba descarta.

---

## Orden de trabajo sugerido

1. ~~**A1** — página "Qué es DevOps" + ciclo de vida.~~ **Hecho.**
2. ~~**A2** — landing: propósito, audiencia, cómo usar el sitio, qué falta todavía.~~ **Hecho.**
3. ~~**B** — partir Linux en `linux` + `terminal`.~~ **Hecho.**
4. ~~**C** — definiciones en sitio + página de glosario.~~ **Hecho.**
5. ~~**A3 (segunda mitad)** — proxy inverso / balanceo y observabilidad.~~ **Hecho.**
6. **D + F** — limpiar Caddy/VPS/Compose, unificar nomenclatura, quitar `kubernetes` del frontmatter, alinear prerrequisitos.
7. **E** — "por qué Git", "por qué contenedores", IP/puertos, ángulo DevOps de Pruebas.

Todo cambio se replica en `src/content/docs/en/`; `scripts/validate-content.mjs` exige paridad de objetivos y takeaways.
