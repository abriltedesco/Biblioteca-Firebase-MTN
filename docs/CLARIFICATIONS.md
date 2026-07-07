# CLARIFICATIONS — Biblioteca Digital MTN

> **Fase:** Clarificación  
> **Metodología:** Specification-Driven Development (SDD)  
> **Fecha:** 2026-07-07  
> **Estado:** ✅ Todas las ambigüedades resueltas — se puede avanzar a `/speckit.plan`  
> **Documentos relacionados:** [SPEC.md](./SPEC.md) · [CONSTITUTION.md](./CONSTITUTION.md)

---

## Resumen

| ID | Estado | Resolución breve |
|----|--------|-----------------|
| AMB-01 | ✅ Resuelta | Estado de lectura **por cliente** (progreso individual) |
| AMB-02 | ✅ Resuelta | Se permite la transición directa `NO_LEIDO → LEIDO` |
| AMB-03 | ✅ Resuelta | Al eliminar un libro, el progreso histórico del cliente **se conserva** |
| AMB-04 | ✅ Resuelta (fase anterior) | 3 administradores fijos, creados manualmente en Firestore |
| AMB-05 | ✅ Resuelta | El administrador **gestiona las categorías libremente** desde la app |
| AMB-06 | ✅ Resuelta | El contenido se guarda **en el documento Firestore** con límite de caracteres |
| AMB-07 | ✅ Auto-resuelta por AMB-01 | No existe conflicto entre clientes; cada uno tiene su propio estado |

---

## Detalle de cada resolución

---

### AMB-01 — Estado de lectura: por cliente ✅

**Decisión:** El estado de lectura (`NO_LEIDO` / `LEYENDO` / `LEIDO`) es una relación **individual por cliente**. Cada cliente tiene su propio progreso sobre cada libro, completamente independiente del progreso de los demás clientes.

**Impacto en el modelo de datos:**
- El documento de un `Libro` en Firestore **no contiene** un campo `estado`.
- El progreso de lectura se almacena en una subcolección por usuario:

```
users/{uid}/readingProgress/{libroId}
  └── estado: "NO_LEIDO" | "LEYENDO" | "LEIDO"
  └── libroId: string
  └── updatedAt: timestamp
```

- Los listados de "leyendo" y "no leído" se resuelven con consultas `where("estado", "==", ...)` sobre la subcolección del usuario autenticado.

**Impacto en la Constitución:**
- La entidad `Libro` en el dominio **no tiene** campo `estado`.
- Se introduce la entidad de dominio `ProgresoLectura` (o `EstadoLectura`) que relaciona un `Usuario` con un `Libro` y tiene el estado.

---

### AMB-02 — Transición directa `NO_LEIDO → LEIDO` ✅

**Decisión:** Se **permite** la transición directa de `NO_LEIDO` a `LEIDO`, sin pasar obligatoriamente por `LEYENDO`.

**Flujo de estados actualizado:**

```
NO_LEIDO ──► LEYENDO ──► LEIDO
   └─────────────────────────►┘  (transición directa permitida)
```

**Impacto en los criterios de aceptación de US-08:**
- Se agrega el criterio: *"Dado un libro en estado `NO_LEIDO`, cuando el cliente lo marca como `LEIDO`, entonces pasa directamente a su historial de leídos."*

**Regla de dominio resultante:**
- Las transiciones válidas son: `NO_LEIDO → LEYENDO`, `NO_LEIDO → LEIDO`, `LEYENDO → LEIDO`.
- La transición `LEIDO → cualquier estado` queda fuera de alcance (un libro leído no vuelve atrás).

---

### AMB-03 — Baja de libro con progreso activo ✅

**Decisión:** Cuando un administrador elimina un libro del catálogo, el **registro de progreso de lectura de los clientes se conserva** como dato histórico.

**Consecuencias:**
- El documento del libro se elimina de la colección `libros`.
- Los documentos de `readingProgress` en la subcolección de cada usuario **no se eliminan**.
- En la UI del perfil del cliente, un libro leído cuyo documento ya no exista en el catálogo debe mostrarse con un estado degradado (ej.: *"Libro no disponible"*) en lugar de fallar.
- **No se bloquea la baja** por existir clientes con progreso sobre ese libro.

**Impacto en CB-07:** Caso borde resuelto. El admin puede eliminar el libro libremente; la UI del cliente maneja la ausencia del documento de forma graceful.

---

### AMB-04 — Alta de administradores ✅ *(resuelta en fase anterior)*

**Decisión:** Existen exactamente **3 administradores**, creados manualmente directamente en Firestore y Firebase Authentication. No existe ningún flujo en la aplicación para registrar nuevos administradores. El registro público (US-04) crea únicamente cuentas con rol `CLIENTE`.

---

### AMB-05 — Categorías de libro: gestión dinámica ✅

**Decisión:** El administrador puede **crear y gestionar categorías libremente** desde la aplicación. Las categorías no son un enum fijo en el código.

**Impacto en el modelo de datos:**
- Se agrega una colección `categorias` en Firestore:

```
categorias/{categoriaId}
  └── nombre: string
  └── createdAt: timestamp
```

- El campo `categoria` de un `Libro` almacena la referencia o el ID de la categoría.
- El administrador puede crear nuevas categorías al dar de alta o modificar un libro.

**Impacto en la Constitución — nota importante:**
> La Constitución (§5) indica usar enums para valores cerrados. Como las categorías son ahora dinámicas, **no se representan como un enum en el dominio**, sino como un value object `Categoria` con un `id` y un `nombre` que se carga desde Firestore. El resto de los enums (`EstadoLectura`, `Rol`) permanecen como enums fijos.

**Impacto en RF-5.2:** El filtro por categoría en el catálogo debe cargar la lista de categorías disponibles desde Firestore.

---

### AMB-06 — Almacenamiento del contenido del libro ✅

**Decisión:** El contenido (texto del libro) se almacena **directamente en el documento Firestore** del libro.

**Límite definido:**
- Máximo **500.000 caracteres** por libro (≈ 500 KB en texto UTF-8 estándar), lo que deja margen suficiente respecto al límite de 1 MB por documento de Firestore.
- El campo se llama `contenido` y es de tipo `string`.
- Si en el futuro el contenido supera este límite, se evaluará migrar a Firebase Storage o subcolecciones de capítulos (fuera del alcance inicial).

**Impacto en RF-1.4 y US-01:**
- Se agrega el criterio de aceptación: *"Dado que el contenido supera 500.000 caracteres, cuando el administrador intenta guardar el libro, entonces el sistema muestra un error de validación."*

---

### AMB-07 — Conflicto entre clientes sobre el mismo libro ✅ *(auto-resuelta por AMB-01)*

**Decisión:** No existe conflicto. Como el estado de lectura es **por cliente** (AMB-01, Opción B), dos clientes distintos operando sobre el mismo libro afectan únicamente sus propios documentos en `users/{uid}/readingProgress/{libroId}`. Sus operaciones son completamente independientes en Firestore y no generan condiciones de carrera entre ellos.

---

## Impactos transversales sobre SPEC.md

Los siguientes requisitos y criterios de aceptación deben actualizarse en `SPEC.md` como consecuencia de estas resoluciones:

| Ítem afectado | Cambio requerido |
|---|---|
| Modelo de datos (nuevo) | Agregar subcolección `users/{uid}/readingProgress/{libroId}` |
| Entidad `Libro` | No tiene campo `estado`; ese campo pasa a `ProgresoLectura` |
| US-08 criterios | Agregar transición directa `NO_LEIDO → LEIDO` |
| RF-1.4 / US-01 | Agregar límite de 500.000 caracteres para el campo `contenido` |
| RF-5.2 | El filtro por categoría carga categorías dinámicas desde Firestore |
| CB-07 | Resuelto: baja permitida, UI del cliente maneja libro ausente gracefully |
| `Categoria` en dominio | No es enum; es value object dinámico cargado desde Firestore |

---

*Con todas las ambigüedades resueltas, este documento habilita el avance a la fase `/speckit.plan`.*
