# PLAN — Biblioteca Digital MTN

> **Fase:** Planificación  
> **Metodología:** Specification-Driven Development (SDD)  
> **Fecha:** 2026-07-07  
> **Estado:** ✅ Listo para iniciar implementación  
> **Documentos base:** [CONSTITUTION.md](./CONSTITUTION.md) · [SPEC.md](./SPEC.md) · [CLARIFICATIONS.md](./CLARIFICATIONS.md)

---

## Modelo de datos en Firestore

Estructura definitiva de colecciones, derivada de las clarificaciones:

```
firestore/
│
├── users/{uid}
│     └── nombre: string
│     └── apellido: string
│     └── mail: string
│     └── telefono: string
│     └── dni: string
│     └── rol: "ADMINISTRADOR" | "CLIENTE"
│     └── createdAt: timestamp
│     │
│     └── readingProgress/{libroId}          ← subcolección por cliente
│           └── libroId: string
│           └── estado: "NO_LEIDO" | "LEYENDO" | "LEIDO"
│           └── updatedAt: timestamp
│
├── libros/{libroId}
│     └── titulo: string
│     └── autor: string
│     └── categoriaId: string               ← referencia a categorias/{id}
│     └── cantidadPaginas: number
│     └── contenido: string                 ← máx. 500.000 caracteres
│     └── createdAt: timestamp
│     └── updatedAt: timestamp
│
└── categorias/{categoriaId}
      └── nombre: string
      └── createdAt: timestamp
```

---

## Estructura de carpetas del proyecto

```
src/
│
├── domain/                        ← Entidades y reglas de negocio puras (sin Firebase)
│   ├── Libro.ts                   ← Entidad Libro (sin estado)
│   ├── Usuario.ts                 ← Clase base Usuario
│   ├── Cliente.ts                 ← Extiende Usuario, rol CLIENTE
│   ├── Administrador.ts           ← Extiende Usuario, rol ADMINISTRADOR
│   ├── ProgresoLectura.ts         ← Entidad: relación cliente ↔ libro + estado
│   ├── Categoria.ts               ← Value object dinámico (id + nombre)
│   ├── EstadoLectura.ts           ← Enum: NO_LEIDO | LEYENDO | LEIDO
│   └── Rol.ts                     ← Enum: ADMINISTRADOR | CLIENTE
│
├── application/                   ← Casos de uso (orquestan dominio + infraestructura)
│   ├── auth/
│   │   ├── registrarCliente.ts
│   │   └── iniciarSesion.ts
│   ├── libros/
│   │   ├── darDeAltaLibro.ts
│   │   ├── modificarLibro.ts
│   │   ├── eliminarLibro.ts
│   │   └── listarCatalogo.ts
│   ├── categorias/
│   │   ├── crearCategoria.ts
│   │   └── listarCategorias.ts
│   └── lectura/
│       ├── marcarEstadoLectura.ts
│       ├── listarLibrosEnLectura.ts
│       └── listarLibrosLeidos.ts
│
├── infrastructure/                ← Repositorios que envuelven el SDK de Firebase
│   ├── firebase.config.ts         ← Inicialización de Firebase
│   ├── LibroRepository.ts
│   ├── UsuarioRepository.ts
│   ├── CategoriaRepository.ts
│   └── ProgresoLecturaRepository.ts
│
├── presentation/                  ← React: componentes, páginas, hooks, rutas
│   ├── router.tsx                 ← React Router con rutas protegidas por rol
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useLibros.ts
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ClienteHomePage.tsx    ← libros LEYENDO + NO_LEIDO
│   │   ├── CatalogoPage.tsx       ← catálogo completo + filtros + búsqueda
│   │   ├── PerfilPage.tsx         ← datos personales + historial LEIDO
│   │   └── admin/
│   │       ├── AdminHomePage.tsx
│   │       ├── LibroFormPage.tsx  ← alta y modificación
│   │       └── LibroListPage.tsx
│   └── components/
│       ├── LibroCard.tsx
│       ├── EstadoLecturaSelector.tsx
│       ├── CatalogoFiltros.tsx
│       └── ProtectedRoute.tsx
│
└── tests/
    ├── domain/
    │   ├── Libro.test.ts
    │   ├── Usuario.test.ts
    │   └── ProgresoLectura.test.ts
    └── application/
        ├── registrarCliente.test.ts
        └── marcarEstadoLectura.test.ts
```

---

## Iteraciones de desarrollo

### Iteración 0 — Fundación del proyecto
> Objetivo: proyecto funcional vacío con la arquitectura en capas establecida.

| # | Tarea | Capa | US / RF trazado |
|---|-------|------|-----------------|
| T-0.1 | Inicializar proyecto Vite + React + TypeScript | — | — |
| T-0.2 | Instalar dependencias: Firebase SDK, React Router, Vitest | — | — |
| T-0.3 | Crear estructura de carpetas `domain/`, `application/`, `infrastructure/`, `presentation/` | — | — |
| T-0.4 | Configurar `firebase.config.ts` con credenciales del proyecto | infraestructura | — |
| T-0.5 | Configurar React Router con rutas protegidas por rol (`ProtectedRoute`) | presentación | RF-2.5 |
| T-0.6 | Definir enums `EstadoLectura` y `Rol` | dominio | RF-2.5, RF-3.4 |

---

### Iteración 1 — Dominio y tests de negocio
> Objetivo: entidades del dominio con sus reglas de negocio, cubiertas por tests. Sin Firebase aún.

| # | Tarea | Capa | US / RF trazado |
|---|-------|------|-----------------|
| T-1.1 | Implementar entidad `Libro` (título, autor, categoría, páginas, contenido; sin estado) | dominio | RF-1.4 |
| T-1.2 | Implementar `Usuario`, `Cliente` y `Administrador` con validación de mail y contraseña | dominio | RF-2.1, RF-2.3, RF-2.4 |
| T-1.3 | Implementar `ProgresoLectura` con lógica de transición de estados | dominio | RF-3.4, AMB-02 |
| T-1.4 | Implementar value object `Categoria` (id + nombre, dinámico) | dominio | RF-1.4, AMB-05 |
| T-1.5 | **Test:** validación de formato de mail (con y sin `@`, con y sin dominio) | dominio | RF-2.4 |
| T-1.6 | **Test:** validación de longitud mínima de contraseña (< 6 rechaza, ≥ 6 acepta) | dominio | RF-2.3 |
| T-1.7 | **Test:** transiciones válidas `NO_LEIDO→LEYENDO`, `NO_LEIDO→LEIDO`, `LEYENDO→LEIDO` | dominio | RF-3.4, AMB-02 |
| T-1.8 | **Test:** transición inválida `LEIDO→cualquier estado` lanza error | dominio | RF-3.4 |
| T-1.9 | **Test:** solo `Administrador` puede ejecutar ABM de libros (por rol) | dominio | RNF-3 |

---

### Iteración 2 — Autenticación
> Objetivo: registro e inicio de sesión funcionales contra Firebase Auth.

| # | Tarea | Capa | US / RF trazado |
|---|-------|------|-----------------|
| T-2.1 | Implementar `UsuarioRepository` (crear usuario en Firestore, obtener por uid) | infraestructura | RF-2.1 |
| T-2.2 | Implementar caso de uso `registrarCliente` (Auth + Firestore, rol CLIENTE) | aplicación | US-04 |
| T-2.3 | Implementar caso de uso `iniciarSesion` (Firebase Auth signInWithEmailAndPassword) | aplicación | US-05 |
| T-2.4 | Implementar `useAuth` hook (observador `onAuthStateChanged`, leer rol desde Firestore) | presentación | US-05, RF-2.5 |
| T-2.5 | Implementar `LoginPage` (formulario mail + contraseña, mensajes de error) | presentación | US-05 |
| T-2.6 | Implementar `RegisterPage` (formulario con todos los campos del cliente) | presentación | US-04 |
| T-2.7 | Implementar `ProtectedRoute` (redirige si no hay sesión o si el rol no coincide) | presentación | RNF-3 |

---

### Iteración 3 — ABM de libros y categorías (Administrador)
> Objetivo: el administrador puede gestionar el catálogo completo.

| # | Tarea | Capa | US / RF trazado |
|---|-------|------|-----------------|
| T-3.1 | Implementar `CategoriaRepository` (CRUD en Firestore) | infraestructura | AMB-05 |
| T-3.2 | Implementar casos de uso `crearCategoria` y `listarCategorias` | aplicación | RF-5.2 |
| T-3.3 | Implementar `LibroRepository` (CRUD en Firestore, sin campo `estado`) | infraestructura | RF-1.1→1.3 |
| T-3.4 | Implementar caso de uso `darDeAltaLibro` (con validación de 500k caracteres) | aplicación | US-01, AMB-06 |
| T-3.5 | Implementar caso de uso `modificarLibro` | aplicación | US-02 |
| T-3.6 | Implementar caso de uso `eliminarLibro` (borra doc; no toca readingProgress) | aplicación | US-03, AMB-03 |
| T-3.7 | Implementar `LibroFormPage` (formulario alta/edición con selector de categoría) | presentación | US-01, US-02 |
| T-3.8 | Implementar `LibroListPage` (listado con acciones editar / eliminar) | presentación | US-02, US-03 |
| T-3.9 | Implementar `AdminHomePage` con navegación al catálogo de administración | presentación | US-01→03 |

---

### Iteración 4 — Seguimiento de lectura (Cliente)
> Objetivo: el cliente ve sus libros y puede cambiar su estado de lectura.

| # | Tarea | Capa | US / RF trazado |
|---|-------|------|-----------------|
| T-4.1 | Implementar `ProgresoLecturaRepository` (leer/escribir `users/{uid}/readingProgress`) | infraestructura | RF-3.1→3.4 |
| T-4.2 | Implementar caso de uso `marcarEstadoLectura` (valida transición con `ProgresoLectura`) | aplicación | US-07, US-08, AMB-02 |
| T-4.3 | Implementar caso de uso `listarLibrosEnLectura` (query `where estado in [LEYENDO, NO_LEIDO]`) | aplicación | US-06, RF-3.1 |
| T-4.4 | Implementar `ClienteHomePage` con secciones separadas `LEYENDO` / `NO_LEIDO` | presentación | US-06 |
| T-4.5 | Implementar `LibroCard` con selector de estado de lectura integrado | presentación | US-07, US-08 |
| T-4.6 | Implementar `useLibros` hook con suscripción en tiempo real (onSnapshot) | presentación | US-06 |

---

### Iteración 5 — Catálogo, búsqueda y perfil
> Objetivo: catálogo navegable con filtros y perfil del cliente con historial.

| # | Tarea | Capa | US / RF trazado |
|---|-------|------|-----------------|
| T-5.1 | Implementar caso de uso `listarCatalogo` con paginación `startAfter` | aplicación | RF-5.1, RNF-2 |
| T-5.2 | Implementar caso de uso `listarLibrosLeidos` (query `where estado == LEIDO`, paginado) | aplicación | US-09, RF-4.2 |
| T-5.3 | Implementar `CatalogoPage` con listado, filtro por categoría y búsqueda por título/autor | presentación | US-10, RF-5.2, RF-5.3 |
| T-5.4 | Implementar `CatalogoFiltros` (selector de categoría + input de búsqueda) | presentación | US-10 |
| T-5.5 | Implementar `PerfilPage` (datos personales + historial `LEIDO` paginado) | presentación | US-09, RF-4.1→4.3 |
| T-5.6 | Manejar caso borde: libro en historial cuyo documento no existe en `libros/` → mostrar "Libro no disponible" | presentación | AMB-03, CB-07 |

---

### Iteración 6 — Reglas de seguridad de Firestore y despliegue
> Objetivo: sistema seguro y desplegado en Firebase Hosting.

| # | Tarea | Capa | US / RF trazado |
|---|-------|------|-----------------|
| T-6.1 | Escribir reglas de seguridad Firestore: solo admin escribe en `libros/` y `categorias/` | infraestructura | RNF-3 |
| T-6.2 | Escribir reglas: cliente solo lee/escribe su propia subcolección `readingProgress` | infraestructura | RNF-3 |
| T-6.3 | Escribir reglas: usuario autenticado puede leer `libros/` y `categorias/` | infraestructura | RF-5.1 |
| T-6.4 | Escribir reglas: usuario solo puede leer/escribir su propio documento en `users/` | infraestructura | RNF-3 |
| T-6.5 | Configurar índices Firestore para queries de `readingProgress` por `estado` | infraestructura | RNF-2 |
| T-6.6 | Configurar `firebase.json` para Firebase Hosting (SPA redirect a `index.html`) | infraestructura | — |
| T-6.7 | Deploy a Firebase Hosting (`firebase deploy`) | infraestructura | — |

---

## Reglas de seguridad Firestore (diseño)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helpers
    function isAuth() { return request.auth != null; }
    function isAdmin() {
      return isAuth() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.rol == 'ADMINISTRADOR';
    }
    function isOwner(uid) { return isAuth() && request.auth.uid == uid; }

    // Colección libros: todos los auth leen; solo admin escribe
    match /libros/{libroId} {
      allow read: if isAuth();
      allow create, update, delete: if isAdmin();
    }

    // Colección categorias: todos los auth leen; solo admin escribe
    match /categorias/{categoriaId} {
      allow read: if isAuth();
      allow create, update, delete: if isAdmin();
    }

    // Colección users: cada usuario lee/escribe solo su documento
    match /users/{uid} {
      allow read, write: if isOwner(uid);
    }

    // Subcolección readingProgress: solo el propio usuario
    match /users/{uid}/readingProgress/{libroId} {
      allow read, write: if isOwner(uid);
    }
  }
}
```

---

## Prioridades de entrega

| Prioridad | Iteraciones incluidas | Historias de usuario cubiertas |
|---|---|---|
| **MVP (P0)** | 0 → 1 → 2 → 3 → 4 | US-01, US-02, US-04, US-05, US-06, US-07, US-08 |
| **Completo (P1)** | + 5 → 6 | US-03, US-09, US-10 + seguridad + deploy |

---

## Dependencias entre iteraciones

```
It-0 (fundación)
  └─► It-1 (dominio + tests)
        └─► It-2 (autenticación)
              └─► It-3 (ABM libros/categorías)  ──┐
              └─► It-4 (seguimiento lectura)     ──┤
                                                   └─► It-5 (catálogo + perfil)
                                                         └─► It-6 (seguridad + deploy)
```

---

## Tests obligatorios (trazabilidad)

| Test | Iteración | Tarea | Requisito |
|------|-----------|-------|-----------|
| Validación mail formato inválido | It-1 | T-1.5 | RF-2.4 |
| Validación mail formato válido | It-1 | T-1.5 | RF-2.4 |
| Contraseña < 6 caracteres rechazada | It-1 | T-1.6 | RF-2.3 |
| Contraseña ≥ 6 caracteres aceptada | It-1 | T-1.6 | RF-2.3 |
| Transición `NO_LEIDO → LEYENDO` | It-1 | T-1.7 | RF-3.4 |
| Transición `NO_LEIDO → LEIDO` | It-1 | T-1.7 | AMB-02 |
| Transición `LEYENDO → LEIDO` | It-1 | T-1.7 | RF-3.4 |
| Transición `LEIDO → *` lanza error | It-1 | T-1.8 | RF-3.4 |
| Solo admin puede crear/editar/eliminar libro | It-1 | T-1.9 | RNF-3 |

---

*Con este plan aprobado, la implementación puede comenzar por la Iteración 0. Cada tarea en `/speckit.task` debe referenciar su ID de plan (ej.: `T-0.1`).*
