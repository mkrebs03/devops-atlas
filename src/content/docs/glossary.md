---
title: Glosario
description: Los términos que aparecen en el Atlas, definidos en una línea y con la página donde se explican de verdad.
---

Cada término está definido en el momento en que hace falta dentro de su página. Esto es el atajo: la definición mínima para no perder el hilo, y el enlace a donde se explica completo. Para herramientas concretas, usa el [índice de herramientas A–Z](/tools/).

**Alerta** — Un aviso automático de que alguien está sufriendo algo y hay algo que hacer. Se define sobre síntomas, no sobre causas. → [Observabilidad](/scaling/observability/)

**Área de preparación** — El paso intermedio entre tus archivos y el commit, donde `git add` coloca lo que sí quieres guardar. Explica por qué existen dos diffs distintos. → [El modelo de Git](/collaboration/git-model/)

**Artefacto** — El resultado empaquetado de una construcción: una imagen de contenedor, un `.jar`, una carpeta de archivos estáticos. Es lo que se despliega, y no es el código del que salió. → [Integración continua](/integration/)

**Balanceo de carga** — Repartir las peticiones entre varias instancias iguales del mismo servicio. → [Balanceo de carga](/deployment/load-balancing/)

**Almacenamiento de objetos** — Guardar archivos como recursos que se piden por HTTP a un servicio, en lugar de en el disco de una máquina concreta. → [Sacar el estado de la máquina](/scaling/managed-services/)

**Bind mount** — Montar una carpeta de la máquina anfitriona dentro de un contenedor. Útil en desarrollo; en producción ata el contenido a esa máquina. → [Varios contenedores con Compose](/containers/compose/)

**Blue-green** — Estrategia de despliegue con dos entornos completos: uno sirve tráfico y el otro recibe la versión nueva; el cambio es instantáneo y la vuelta atrás también. → [Estrategias de despliegue](/deployment/strategies/)

**Canary** — Estrategia de despliegue que expone la versión nueva a una fracción del tráfico y solo la extiende si las métricas se mantienen sanas. → [Estrategias de despliegue](/deployment/strategies/)

**CD** — Entrega continua: el artefacto queda siempre listo para desplegar. Despliegue continuo: ese último paso además ocurre solo cuando las comprobaciones pasan. → [Del build al release](/deployment/pipeline/)

**Certificado** — La prueba de que un dominio es tuyo, emitida por una autoridad en la que el navegador ya confía. Caduca, así que lo que importa es que se renueve solo. → [Proxy inverso y certificados](/server/proxy-tls/)

**Chequeo de salud** — La comprobación periódica que hace un balanceador para saber si una instancia puede atender, y retirarla de rotación si no. → [Balanceo de carga](/deployment/load-balancing/)

**CI** — Integración continua: cada cambio propuesto se integra y se valida automáticamente en un servidor limpio, no solo en la máquina de quien lo escribió. → [Pruebas en CI](/integration/tests-in-ci/)

**Cobertura** — El porcentaje del código que ejecutan tus pruebas. Mide líneas recorridas, no comportamiento verificado. → [Pruebas en CI](/integration/tests-in-ci/)

**Commit** — Una instantánea del proyecto que apunta a su predecesor. La unidad mínima de historia. → [El modelo de Git](/collaboration/git-model/)

**Compuerta de aprobación** — El punto donde una persona autoriza explícitamente el paso a producción. Es lo único que separa entrega continua de despliegue continuo. → [Del build al release](/deployment/pipeline/)

**Conflicto** — El momento en que dos ramas cambian la misma línea y Git se detiene para que decidas tú. No es un error: es una decisión delegada. → [El modelo de Git](/collaboration/git-model/)

**Contenedor** — Un proceso creado a partir de una imagen, con su propio entorno de ejecución. Es desechable; sus datos no deberían serlo. → [Docker sin magia](/containers/docker/)

**Dirección privada** — Una IP válida solo dentro de una red concreta —`10.x`, `172.16–31.x`, `192.168.x`— y sin significado fuera de ella. → [Redes esenciales](/foundations/networking/)

**Distribución** — Un sistema Linux completo: el núcleo empaquetado con programas base, gestor de paquetes y política de versiones. Debian, Ubuntu, Alpine. → [Linux](/foundations/linux/)

**DNS** — El sistema que traduce un nombre en direcciones. No transporta tu petición; solo dice a dónde ir. → [Redes esenciales](/foundations/networking/)

**Docker Compose** — El archivo que describe varios contenedores y la red que comparten, en lugar de encadenar comandos `docker run`. → [Docker sin magia](/containers/docker/)

**Entorno** — Una instalación completa del sistema con su propia configuración y sus propios datos: desarrollo, staging, producción. → [Integración continua](/integration/)

**Escalado horizontal** — Correr varias copias iguales de la aplicación y repartir el tráfico. No tiene techo, pero exige que las instancias no guarden estado. → [Cuándo escalar y cómo](/scaling/when-to-scale/)

**Escalado vertical** — Cambiar la máquina por una más grande. No toca el código ni la arquitectura, pero tiene techo y deja un único punto de fallo. → [Cuándo escalar y cómo](/scaling/when-to-scale/)

**Feature flag** — Una condición en el código que decide en tiempo de ejecución si una función está activa. Separa desplegar el código de activar la función. → [Estrategias de ramas](/integration/branching-strategy/)

**Firewall** — Un filtro que decide qué conexiones se aceptan antes de que lleguen al proceso. Explica por qué una conexión se queda colgada en vez de ser rechazada. → [Redes esenciales](/foundations/networking/)

**Gateway** — La puerta de salida de una red: a donde una máquina entrega los paquetes cuyo destino cae fuera de su subred. → [Redes esenciales](/foundations/networking/)

**GitFlow** — Un modelo de ramas con `main` y `develop` permanentes más `feature/*`, `release/*` y `hotfix/*`. Devuelve su coste solo si sostienes varias versiones publicadas a la vez. → [Estrategias de ramas](/integration/branching-strategy/)

**Grupo** — Una identidad compartida que permite a varios usuarios acceder a las mismas cosas. La terna del medio en los permisos de un archivo. → [Linux](/foundations/linux/)

**HEAD** — La referencia que indica dónde estás trabajando ahora: el commit sobre el que se construirá el siguiente. → [El modelo de Git](/collaboration/git-model/)

**Imagen** — Un paquete inmutable de capas del que se crean contenedores. Se identifica por etiqueta, y en producción por SHA. → [Docker sin magia](/containers/docker/)

**IP** — La dirección de una máquina en la red: el número al que hay que enviar los paquetes para que lleguen. → [Redes esenciales](/foundations/networking/)

**Issue** — La unidad con la que se registra un trabajo pendiente —un fallo, una mejora— con su discusión y su número. → [Pull requests y revisión](/collaboration/pull-requests/)

**Job** — Una unidad de un workflow que corre en su propia máquina. Los jobs van en paralelo salvo que declares dependencias con `needs`. → [GitHub Actions](/integration/github-actions/)

**Lint** — La comprobación más barata: un programa lee el código sin ejecutarlo y marca lo que rompe una convención o huele a error. → [GitHub Actions](/integration/github-actions/)

**Log** — El registro evento a evento de lo que hizo el sistema. Estructurado y con un identificador de correlación, sirve para reconstruir un caso concreto. → [Observabilidad](/scaling/observability/)

**Merge** — Integrar una rama en otra creando un commit que une ambas líneas y conserva la historia tal como ocurrió. → [El modelo de Git](/collaboration/git-model/)

**Métrica** — Un número medido en el tiempo: peticiones por segundo, errores por minuto, milisegundos de respuesta. Barata de guardar y buena para alertas. → [Observabilidad](/scaling/observability/)

**Observabilidad** — La propiedad de poder responder preguntas que no anticipaste sobre lo que está haciendo el sistema, sin desplegar código nuevo para averiguarlo. → [Observabilidad](/scaling/observability/)

**Orquestador** — Un programa que mantiene el sistema en un estado declarado —tantas réplicas, con estos límites— comparándolo sin parar con el real. → [Orquestación](/scaling/orchestration/)

**OIDC** — El mecanismo por el que un workflow presenta un token firmado que dice quién es y recibe credenciales temporales, en vez de guardar una clave de larga vida. → [Secretos y permisos](/integration/secrets/)

**Percentil** — El valor que deja por debajo a un porcentaje de las mediciones. El p99 describe la peor experiencia real mejor que cualquier promedio. → [Observabilidad](/scaling/observability/)

**Pipeline** — La secuencia automática de etapas que recorre un cambio desde el commit hasta quedar publicado. → [Integración continua](/integration/)

**Producción** — El entorno donde hay usuarios reales. El único donde un fallo le pasa a alguien. → [Integración continua](/integration/)

**Proxy inverso** — El servidor que recibe todo el tráfico y lo reparte entre tus servicios. Donde vive el certificado TLS y la decisión de enrutado. → [Proxy inverso y certificados](/server/proxy-tls/)

**Prueba de extremo a extremo (E2E)** — Prueba el sistema como lo usa una persona. Lenta y valiosa: responde si el recorrido completo funciona. → [La pirámide de pruebas](/testing/pyramid/)

**Prueba de humo** — La comprobación mínima de que una versión está viva: responde el endpoint de salud, carga la página, conecta con la base de datos. → [Del build al release](/deployment/pipeline/)

**Prueba de integración** — Prueba que varias piezas colaboran entre sí, por ejemplo código más base de datos. Responde si encajan. → [La pirámide de pruebas](/testing/pyramid/)

**Prueba de unidad** — Prueba una función o módulo aislado. Rápida, precisa y barata: la base de la pirámide. → [La pirámide de pruebas](/testing/pyramid/)

**Prueba frágil** — Una prueba que falla por razones ajenas al comportamiento: un timeout, un selector que cambió, un dato aleatorio. Cuesta más de lo que protege. → [La pirámide de pruebas](/testing/pyramid/)

**Puerto** — El número que decide a cuál de los programas de una máquina entra cada conexión. → [Redes esenciales](/foundations/networking/)

**Pull request** — La superficie donde se propone un cambio, se explica su intención y se revisa antes de integrarlo. → [Pull requests y revisión](/collaboration/pull-requests/)

**Rama** — Una referencia móvil que nombra una línea de commits. Aísla una intención concreta durante poco tiempo. → [El modelo de Git](/collaboration/git-model/)

**Rotar** — Invalidar una credencial y emitir otra. La única respuesta que detiene el daño de una filtración; borrar el commit no lo hace. → [Secretos y permisos](/integration/secrets/)

**Rama protegida** — Una rama con reglas: exigir revisión, exigir que CI pase, impedir empujar directo. Convierte los acuerdos del equipo en algo que se cumple. → [Pull requests y revisión](/collaboration/pull-requests/)

**Rebase** — Reaplicar tus commits sobre otra base para obtener una historia lineal. Reescribe identificadores, así que se usa en historia privada. → [El modelo de Git](/collaboration/git-model/)

**Recreate** — Estrategia de despliegue que apaga la versión vieja y enciende la nueva. Simple, pero con downtime. → [Estrategias de despliegue](/deployment/strategies/)

**Registro de imágenes** — El repositorio remoto donde se publican las imágenes y del que las descargan los servidores. Docker Hub, GHCR, el de tu nube. → [Docker sin magia](/containers/docker/)

**Remoto** — Una referencia a otra copia del repositorio. `fetch` trae su información; `pull` la combina con tu rama local. → [El modelo de Git](/collaboration/git-model/)

**Rollback** — Volver a la versión anterior. Lo que hace reversible un despliegue, y lo que conviene ensayar antes de necesitarlo. → [Estrategias de despliegue](/deployment/strategies/)

**Rolling** — Estrategia de despliegue que reemplaza instancias de a poco: sin downtime, pero con dos versiones conviviendo un rato. → [Estrategias de despliegue](/deployment/strategies/)

**Runner** — La máquina que ejecuta un job. Se crea limpia y se destruye al terminar, así que nada sobrevive entre ejecuciones. → [GitHub Actions](/integration/github-actions/)

**Secreto** — Un valor que da acceso a algo: un token, una clave de API, una contraseña de despliegue. Nunca vive en el repositorio. → [GitHub Actions](/integration/github-actions/)

**Servicio** — Un proceso que el sistema arranca al encender la máquina, reinicia si se cae y registra por ti. → [Linux](/foundations/linux/)

**SHA** — La huella criptográfica del contenido. Como identificador de imagen, garantiza que siempre son exactamente los mismos bytes. → [Docker sin magia](/containers/docker/)

**Socket** — La pareja IP + puerto: la dirección real a la que se conecta un cliente. → [Redes esenciales](/foundations/networking/)

**Subred** — El tramo de direcciones que cuentan como "mi red". La máscara (`/24`) marca dónde termina, y con eso si un destino se alcanza directo o por el gateway. → [Redes esenciales](/foundations/networking/)

**TLS** — La capa que cifra la conexión y prueba que el servidor es quien dice ser. La `s` de HTTPS. → [Redes esenciales](/foundations/networking/)

**Traza** — El recorrido de una misma petición por todos los servicios que atraviesa, con el tiempo de cada tramo. → [Observabilidad](/scaling/observability/)

**Trunk-based** — Un modelo de ramas donde todo el mundo integra en `main` al menos una vez al día y lo inacabado viaja apagado detrás de un feature flag. → [Estrategias de ramas](/integration/branching-strategy/)

**Unidad de systemd** — El archivo que le dice al sistema qué ejecutar, con qué usuario y bajo qué condiciones reintentarlo. Lo que convierte un proceso tuyo en un servicio. → [Mantener la aplicación viva](/server/processes/)

**Volumen** — Almacenamiento que vive fuera del contenedor y sobrevive a su borrado. Donde van los datos que no puedes perder. → [Docker sin magia](/containers/docker/)

**VPS** — Una máquina virtual con Linux y una IP pública, entregada arrancada y sin configurar. El sitio más simple donde una aplicación corre de verdad. → [Aprovisionar una VPS](/server/provisioning/)

**Workflow** — La descripción de qué debe ocurrir ante un evento del repositorio: qué jobs corren, en qué orden y con qué permisos. → [GitHub Actions](/integration/github-actions/)
