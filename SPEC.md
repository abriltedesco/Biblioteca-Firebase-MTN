# SPEC — Biblioteca Digital MTN

> **Fase:** Especificación  
> **Metodología:** Specification-Driven Development (SDD)  
> **Fecha:** 2026-07-07  
> **Estado:** ✅ Clarificaciones completas — listo para `/speckit.plan`  
> **Documento base:** [CONSTITUTION.md](./CONSTITUTION.md)  
> **Clarificaciones:** [CLARIFICATIONS.md](./CLARIFICATIONS.md)

---

## Objetivo

Desarrollar un sistema de biblioteca digital, inspirado en la experiencia de Wattpad, que permita a un
administrador gestionar el catálogo de libros (alta, baja y modificación) y a los clientes llevar el
seguimiento de su propia lectura: qué libros están leyendo actualmente, cuáles no han empezado, y consultar
en su perfil el historial de libros que ya leyeron. El sistema se construye íntegramente sobre Firebase
(Authentication, Cloud Firestore y Hosting), sin backend propio ni Cloud Functions, según lo establecido en
la Constitución del proyecto.

---

## Actores principales

| Actor | Descripción |
|---|---|
| **Administrador** | Se loguea, gestiona el ABM de libros del catálogo. Existen exactamente **3 administradores** cargados manualmente en Firestore; no es posible registrar nuevos administradores desde la aplicación. |
| **Cliente** | Se registra, inicia sesión, visualiza los libros que está leyendo y los que no ha leído, actualiza el estado de lectura de un libro, y consulta desde su perfil el historial de libros leídos. |
| **Sistema (Firebase)** | Valida credenciales mediante Firebase Authentication, aplica las reglas de seguridad de acceso a los datos en Firestore, y persiste la información de usuarios y libros. |

---

## Requisitos funcionales

### 1. Gestión de libros (Administrador)

| ID  | Requisito |
|-----|-----------|
| RF-1.1 | El administrador debe poder registrar un nuevo libro. |
| RF-1.2 | El administrador debe poder modificar los datos de un libro existente. |
| RF-1.3 | El administrador debe poder dar de baja (eliminar) un libro del catálogo. |
| RF-1.4 | Para cada libro se debe cargar: título, autor, categoría, estado de lectura inicial, cantidad de páginas y contenido (texto anidado del libro). |

### 2. Gestión de usuarios y autenticación

| ID  | Requisito |
|-----|-----------|
| RF-2.1 | Un cliente debe poder registrarse indicando: nombre, apellido, mail, teléfono, DNI y contraseña. |
| RF-2.2 | El sistema debe autenticar mediante mail y contraseña usando Firebase Authentication. |
| RF-2.3 | La contraseña no puede tener menos de 6 caracteres. |
| RF-2.4 | El mail debe tener formato válido (debe contener al menos un `@` y un dominio). |
| RF-2.5 | Cada usuario tiene un rol: `ADMINISTRADOR` o `CLIENTE`. |

### 3. Seguimiento de lectura (Cliente)

| ID  | Requisito |
|-----|-----------|
| RF-3.1 | Al iniciar sesión, el cliente debe ver el listado de libros que tiene en estado `LEYENDO` y los libros en estado `NO_LEIDO`. |
| RF-3.2 | El cliente debe poder marcar un libro como `LEYENDO`. |
| RF-3.3 | El cliente debe poder marcar un libro como `LEIDO`. |
| RF-3.4 | El estado de lectura de un libro para un cliente debe seguir el flujo: `NO_LEIDO → LEYENDO → LEIDO`. |

### 4. Perfil del cliente

| ID  | Requisito |
|-----|-----------|
| RF-4.1 | El cliente debe poder acceder a su perfil. |
| RF-4.2 | Desde el perfil, el cliente debe poder consultar el historial de libros marcados como `LEIDO`. |
| RF-4.3 | El perfil debe mostrar los datos personales del cliente (nombre, apellido, mail, teléfono). |

### 5. Catálogo y búsqueda

| ID  | Requisito |
|-----|-----------|
| RF-5.1 | El sistema debe permitir listar el catálogo completo de libros. |
| RF-5.2 | El cliente debe poder filtrar el catálogo por categoría. |
| RF-5.3 | El cliente debe poder buscar libros por título o autor. |

---

## Requisitos no funcionales

### RNF-1 — Usabilidad
- La interfaz debe ser amigable y estar inspirada en la experiencia visual de Wattpad.
- Debe ser simple y rápido encontrar un libro y ver su estado de lectura.

### RNF-2 — Performance
- El sistema debe poder manejar al menos **100.000 libros** y **10.000 clientes**.
- Los listados de libros (catálogo, `LEYENDO`, `NO_LEIDO`, `LEIDO`) deben resolverse con consultas indexadas de Firestore (`where`, `orderBy`, paginación con `startAfter`), sin traer colecciones completas a memoria.

### RNF-3 — Seguridad
- El acceso a los datos se controla exclusivamente mediante **Reglas de Seguridad de Firestore**.
- Un cliente no puede modificar el catálogo de libros (acción exclusiva del administrador).
- Un cliente solo puede ver y modificar su propio estado de lectura, no el de otros clientes.

### RNF-4 — Calidad
- Las reglas de negocio deben estar separadas de la interfaz (arquitectura en capas: dominio / aplicación / infraestructura / presentación, según la Constitución).
- Las validaciones importantes deben estar explicitadas como criterios de aceptación.

---

## Fuera de alcance inicial

- Préstamos físicos de libros y gestión de disponibilidad de ejemplares.
- Multas económicas o pagos de cualquier tipo.
- Compra de libros.
- Recomendaciones automáticas de lectura.
- Asignación automática de foto de perfil.
- Sistema de puntos o recompensas.
- Login social (Google, Facebook, etc.) — solo mail/contraseña.
- Recuperación de contraseña — se evalúa en una iteración posterior.
- Campos de libro no mencionados en la Constitución (ISBN, editorial, saga, estado de copyright).
- **Registro de nuevos administradores desde la aplicación** — los 3 administradores se crean manualmente en Firestore.

---

## Historias de usuario

### US-01 — Alta de libro (Administrador) — `P0 crítica`

> Como administrador, quiero registrar un nuevo libro con sus datos básicos, para que quede disponible en el catálogo para los clientes.

**Criterios de aceptación:**
- ✅ Dado que estoy logueado como administrador, cuando completo título, autor, categoría, cantidad de páginas y contenido, y confirmo el alta, entonces el libro se guarda en Firestore y aparece en el catálogo.
- ✅ Dado que dejo un campo obligatorio vacío, cuando intento confirmar el alta, entonces el sistema muestra un error y no guarda el libro.

---

### US-02 — Modificación de libro (Administrador) — `P0`

> Como administrador, quiero modificar los datos de un libro existente, para corregir errores o actualizar información.

**Criterios de aceptación:**
- ✅ Dado un libro existente, cuando el administrador edita uno o más campos y guarda, entonces los cambios se reflejan en Firestore y en el catálogo visible para los clientes.

---

### US-03 — Baja de libro (Administrador) — `P1`

> Como administrador, quiero eliminar un libro del catálogo, para retirar contenido que ya no corresponde ofrecer.

**Criterios de aceptación:**
- ✅ Dado un libro existente, cuando el administrador confirma la baja, entonces el libro deja de aparecer en el catálogo.
- ⚠️ *Ver AMB-03 (abierta): qué ocurre con los clientes que tenían ese libro en `LEYENDO` o `LEIDO`.*

---

### US-04 — Registro de cliente — `P0`

> Como visitante, quiero registrarme con mis datos personales y una contraseña, para poder acceder al sistema como cliente.

**Criterios de aceptación:**
- ✅ Dado que completo nombre, apellido, mail, teléfono, DNI y contraseña, cuando la contraseña tiene 6 o más caracteres y el mail tiene formato válido, entonces la cuenta se crea con rol `CLIENTE`.
- ✅ Dado que ingreso una contraseña de menos de 6 caracteres, cuando intento registrarme, entonces el sistema rechaza el registro y muestra el motivo.
- ✅ Dado que ingreso un mail sin `@` o sin dominio, cuando intento registrarme, entonces el sistema rechaza el registro y muestra el motivo.

---

### US-05 — Inicio de sesión — `P0`

> Como cliente registrado, quiero iniciar sesión con mi mail y contraseña, para acceder a mi lista de lectura.

**Criterios de aceptación:**
- ✅ Dado un mail y contraseña correctos, cuando envío el formulario de login, entonces accedo a mi vista principal con mis libros en `LEYENDO` y `NO_LEIDO`.
- ✅ Dado un mail o contraseña incorrectos, cuando envío el formulario, entonces el sistema muestra un error y no otorga acceso.

---

### US-06 — Ver libros "leyendo" y "no leído" al iniciar sesión — `P0`

> Como cliente, quiero ver apenas inicio sesión los libros que estoy leyendo y los que todavía no empecé, para retomar mi lectura fácilmente.

**Criterios de aceptación:**
- ✅ Dado que tengo libros en estado `LEYENDO`, cuando inicio sesión, entonces los veo listados en una sección destacada.
- ✅ Dado que tengo libros en estado `NO_LEIDO`, cuando inicio sesión, entonces también los veo listados, separados de los que estoy leyendo.

---

### US-07 — Marcar libro como "leyendo" — `P0`

> Como cliente, quiero marcar un libro como "leyendo", para indicar que empecé a leerlo.

**Criterios de aceptación:**
- ✅ Dado un libro en estado `NO_LEIDO`, cuando lo marco como `LEYENDO`, entonces pasa a aparecer en mi sección de libros en lectura.

---

### US-08 — Marcar libro como "leído" — `P0`

> Como cliente, quiero marcar un libro como "leído", para llevar registro de mi historial de lectura.

**Criterios de aceptación:**
- ✅ Dado un libro en estado `LEYENDO`, cuando lo marco como `LEIDO`, entonces desaparece de mi sección de lectura activa y pasa a mi historial de leídos.
- ⚠️ *Ver AMB-02 (abierta): si se puede pasar directamente de `NO_LEIDO` a `LEIDO`.*

---

### US-09 — Ver historial de leídos en el perfil — `P1`

> Como cliente, quiero ver en mi perfil todos los libros que ya marqué como leídos, para tener un registro de mi historial de lectura.

**Criterios de aceptación:**
- ✅ Dado que tengo libros en estado `LEIDO`, cuando entro a mi perfil, entonces veo el listado completo de esos libros.
- ✅ Dado que no tengo ningún libro leído todavía, cuando entro a mi perfil, entonces veo un estado vacío claro (ej.: *"Todavía no marcaste ningún libro como leído"*).

---

### US-10 — Buscar y filtrar el catálogo — `P1`

> Como cliente, quiero buscar libros por título o autor, y filtrar por categoría, para encontrar contenido de forma simple y rápida.

**Criterios de aceptación:**
- ✅ Dado que escribo un término de búsqueda, cuando el término coincide con un título o autor, entonces el catálogo muestra solo los libros que coinciden.
- ✅ Dado que selecciono una categoría, cuando aplico el filtro, entonces el catálogo muestra solo libros de esa categoría.

---

## Casos borde

| # | Caso |
|---|------|
| CB-01 | Un cliente intenta marcar como `LEYENDO` un libro que fue eliminado del catálogo mientras lo tenía abierto. |
| CB-02 | Un cliente sin conexión a internet intenta cambiar el estado de un libro (comportamiento con la persistencia offline de Firestore). |
| CB-03 | El catálogo está vacío porque el administrador todavía no cargó ningún libro. |
| CB-04 | Dos administradores editan el mismo libro al mismo tiempo (última escritura gana, comportamiento por defecto de Firestore). |
| CB-05 | Un cliente intenta registrarse con un mail que ya existe en el sistema. |
| CB-06 | Un cliente con cientos de libros en `LEIDO` — el listado del perfil debe paginar en lugar de traer todo de una vez. |
| CB-07 | Un administrador intenta eliminar un libro que actualmente tiene clientes con progreso de lectura sobre él (relacionado con AMB-03). |

---

## Ambigüedades

| ID | Estado | Descripción |
|----|--------|-------------|
| **AMB-01** | ✅ **RESUELTA** | El estado de lectura es **por cliente**: cada cliente tiene su propio progreso, almacenado en `users/{uid}/readingProgress/{libroId}`. El documento `Libro` no tiene campo `estado`. |
| **AMB-02** | ✅ **RESUELTA** | Se permite la transición directa `NO_LEIDO → LEIDO`. Transiciones válidas: `NO_LEIDO → LEYENDO`, `NO_LEIDO → LEIDO`, `LEYENDO → LEIDO`. |
| **AMB-03** | ✅ **RESUELTA** | Al eliminar un libro, el progreso histórico del cliente **se conserva**. La baja no está bloqueada. La UI muestra *"Libro no disponible"* si el documento del libro ya no existe. |
| **AMB-04** | ✅ **RESUELTA** | Los administradores no se registran desde la aplicación. Existen exactamente **3 administradores**, creados manualmente en Firestore. El registro público (US-04) crea únicamente cuentas con rol `CLIENTE`. |
| **AMB-05** | ✅ **RESUELTA** | Las categorías son **dinámicas**: el administrador las gestiona libremente. Se almacenan en la colección `categorias` de Firestore. No son un enum fijo; se modelan como value object `Categoria`. |
| **AMB-06** | ✅ **RESUELTA** | El contenido se guarda directamente en el documento Firestore con un **límite de 500.000 caracteres**. Superar ese límite genera un error de validación al guardar. |
| **AMB-07** | ✅ **AUTO-RESUELTA** | Como el estado es por cliente (AMB-01), dos clientes operando sobre el mismo libro afectan únicamente sus propios documentos. No existe condición de carrera entre clientes. |

---

## Próximos pasos

1. ✅ Todas las ambigüedades resueltas — ver [CLARIFICATIONS.md](./CLARIFICATIONS.md).
2. Avanzar a `/speckit.plan`.

> ⚠️ **No se ha implementado código en esta fase.**

---

*Trazabilidad: este documento se deriva de [CONSTITUTION.md](./CONSTITUTION.md) y es insumo directo de la fase de planificación.*
