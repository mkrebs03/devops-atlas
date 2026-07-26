---
title: Glosario
description: Los términos que aparecen en el Atlas, definidos en una línea y con la página donde se explican de verdad.
---

Cada término está definido en el momento en que hace falta dentro de su página. Esto es el atajo: la definición mínima para no perder el hilo, y el enlace a donde se explica completo. Para herramientas concretas, usa el [índice de herramientas A–Z](/tools/).

**Área de preparación** — El paso intermedio entre tus archivos y el commit, donde `git add` coloca lo que sí quieres guardar. Explica por qué existen dos diffs distintos. → [El modelo de Git](/collaboration/git-model/)

**Artefacto** — El resultado empaquetado de una construcción: una imagen de contenedor, un `.jar`, una carpeta de archivos estáticos. Es lo que se despliega, y no es el código del que salió. → [Entrega](/delivery/)

**Balanceo de carga** — Repartir las peticiones entre varias instancias iguales del mismo servicio. → [Proxy inverso y balanceo](/deployment/proxy/)

**Blue-green** — Estrategia de despliegue con dos entornos completos: uno sirve tráfico y el otro recibe la versión nueva; el cambio es instantáneo y la vuelta atrás también. → [Estrategias de despliegue](/deployment/strategies/)

**Canary** — Estrategia de despliegue que expone la versión nueva a una fracción del tráfico y solo la extiende si las métricas se mantienen sanas. → [Estrategias de despliegue](/deployment/strategies/)

**CD** — Entrega continua: el artefacto queda siempre listo para desplegar. Despliegue continuo: ese último paso además ocurre solo cuando las comprobaciones pasan. → [Del build al release](/deployment/pipeline/)

**Chequeo de salud** — La comprobación periódica que hace un balanceador para saber si una instancia puede atender, y retirarla de rotación si no. → [Proxy inverso y balanceo](/deployment/proxy/)

**CI** — Integración continua: cada cambio propuesto se integra y se valida automáticamente en un servidor limpio, no solo en la máquina de quien lo escribió. → [Pruebas en CI](/testing/in-ci/)

**Cobertura** — El porcentaje del código que ejecutan tus pruebas. Mide líneas recorridas, no comportamiento verificado. → [Pruebas en CI](/testing/in-ci/)

**Commit** — Una instantánea del proyecto que apunta a su predecesor. La unidad mínima de historia. → [El modelo de Git](/collaboration/git-model/)

**Compuerta de aprobación** — El punto donde una persona autoriza explícitamente el paso a producción. Es lo único que separa entrega continua de despliegue continuo. → [Del build al release](/deployment/pipeline/)

**Contenedor** — Un proceso creado a partir de una imagen, con su propio entorno de ejecución. Es desechable; sus datos no deberían serlo. → [Docker sin magia](/delivery/docker/)

**Distribución** — Un sistema Linux completo: el núcleo empaquetado con programas base, gestor de paquetes y política de versiones. Debian, Ubuntu, Alpine. → [Linux](/foundations/linux/)

**DNS** — El sistema que traduce un nombre en direcciones. No transporta tu petición; solo dice a dónde ir. → [Redes esenciales](/foundations/networking/)

**Entorno** — Una instalación completa del sistema con su propia configuración y sus propios datos: desarrollo, staging, producción. → [Entrega](/delivery/)

**Firewall** — Un filtro que decide qué conexiones se aceptan antes de que lleguen al proceso. Explica por qué una conexión se queda colgada en vez de ser rechazada. → [Redes esenciales](/foundations/networking/)

**Grupo** — Una identidad compartida que permite a varios usuarios acceder a las mismas cosas. La terna del medio en los permisos de un archivo. → [Linux](/foundations/linux/)

**Imagen** — Un paquete inmutable de capas del que se crean contenedores. Se identifica por etiqueta, y en producción por SHA. → [Docker sin magia](/delivery/docker/)

**IP** — La dirección de una máquina en la red: el número al que hay que enviar los paquetes para que lleguen. → [Redes esenciales](/foundations/networking/)

**Issue** — La unidad con la que se registra un trabajo pendiente —un fallo, una mejora— con su discusión y su número. → [GitHub Flow](/collaboration/github-flow/)

**Job** — Una unidad de un workflow que corre en su propia máquina. Los jobs van en paralelo salvo que declares dependencias con `needs`. → [GitHub Actions](/delivery/github-actions/)

**Lint** — La comprobación más barata: un programa lee el código sin ejecutarlo y marca lo que rompe una convención o huele a error. → [GitHub Actions](/delivery/github-actions/)

**Merge** — Integrar una rama en otra creando un commit que une ambas líneas y conserva la historia tal como ocurrió. → [El modelo de Git](/collaboration/git-model/)

**Pipeline** — La secuencia automática de etapas que recorre un cambio desde el commit hasta quedar publicado. → [Entrega](/delivery/)

**Producción** — El entorno donde hay usuarios reales. El único donde un fallo le pasa a alguien. → [Entrega](/delivery/)

**Proxy inverso** — El servidor que recibe todo el tráfico y lo reparte entre tus servicios. Donde vive el certificado TLS y la decisión de enrutado. → [Proxy inverso y balanceo](/deployment/proxy/)

**Prueba de humo** — La comprobación mínima de que una versión está viva: responde el endpoint de salud, carga la página, conecta con la base de datos. → [Del build al release](/deployment/pipeline/)

**Puerto** — El número que decide a cuál de los programas de una máquina entra cada conexión. → [Redes esenciales](/foundations/networking/)

**Pull request** — La superficie donde se propone un cambio, se explica su intención y se revisa antes de integrarlo. → [GitHub Flow](/collaboration/github-flow/)

**Rama** — Una referencia móvil que nombra una línea de commits. Aísla una intención concreta durante poco tiempo. → [El modelo de Git](/collaboration/git-model/)

**Rama protegida** — Una rama con reglas: exigir revisión, exigir que CI pase, impedir empujar directo. Convierte los acuerdos del equipo en algo que se cumple. → [GitHub Flow](/collaboration/github-flow/)

**Rebase** — Reaplicar tus commits sobre otra base para obtener una historia lineal. Reescribe identificadores, así que se usa en historia privada. → [El modelo de Git](/collaboration/git-model/)

**Registro de imágenes** — El repositorio remoto donde se publican las imágenes y del que las descargan los servidores. Docker Hub, GHCR, el de tu nube. → [Docker sin magia](/delivery/docker/)

**Rollback** — Volver a la versión anterior. Lo que hace reversible un despliegue, y lo que conviene ensayar antes de necesitarlo. → [Estrategias de despliegue](/deployment/strategies/)

**Runner** — La máquina que ejecuta un job. Se crea limpia y se destruye al terminar, así que nada sobrevive entre ejecuciones. → [GitHub Actions](/delivery/github-actions/)

**Secreto** — Un valor que da acceso a algo: un token, una clave de API, una contraseña de despliegue. Nunca vive en el repositorio. → [GitHub Actions](/delivery/github-actions/)

**Servicio** — Un proceso que el sistema arranca al encender la máquina, reinicia si se cae y registra por ti. → [Linux](/foundations/linux/)

**SHA** — La huella criptográfica del contenido. Como identificador de imagen, garantiza que siempre son exactamente los mismos bytes. → [Docker sin magia](/delivery/docker/)

**Socket** — La pareja IP + puerto: la dirección real a la que se conecta un cliente. → [Redes esenciales](/foundations/networking/)

**TLS** — La capa que cifra la conexión y prueba que el servidor es quien dice ser. La `s` de HTTPS. → [Redes esenciales](/foundations/networking/)

**Volumen** — Almacenamiento que vive fuera del contenedor y sobrevive a su borrado. Donde van los datos que no puedes perder. → [Docker sin magia](/delivery/docker/)

**Workflow** — La descripción de qué debe ocurrir ante un evento del repositorio: qué jobs corren, en qué orden y con qué permisos. → [GitHub Actions](/delivery/github-actions/)
