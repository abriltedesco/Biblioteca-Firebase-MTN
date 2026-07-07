# CONSTITUTION — Biblioteca Digital MTN

> **Metodología:** Specification-Driven Development (SDD)  
> **Fecha de creación:** 2026-07-07  
> **Estado:** Activa — no modificar sin consenso del equipo

---

## 1. Descripción del sistema

Sistema de **biblioteca digital** inspirado en la experiencia de Wattpad, construido con:

- **Frontend:** React + TypeScript
- **Backend:** Firebase (sin servidor propio ni Cloud Functions)
  - Firebase Authentication
  - Cloud Firestore
  - Firebase Hosting

Toda interacción con Firebase se realiza directamente desde el frontend mediante el SDK cliente (`firebase/auth`, `firebase/firestore`). La seguridad de los datos se garantiza exclusivamente mediante **Reglas de Seguridad de Firestore**, no mediante lógica de servidor intermedia.

---

## 2. Modelo de dominio

### 2.1 Usuarios

| Campo       | Tipo   | Notas                          |
|-------------|--------|--------------------------------|
| nombre      | string |                                |
| apellido    | string |                                |
| mail        | string | Formato válido obligatorio     |
| teléfono    | string |                                |
| DNI         | string |                                |
| rol         | enum   | `ADMINISTRADOR` \| `CLIENTE`   |

### 2.2 Libro

| Campo          | Tipo   | Notas                                        |
|----------------|--------|----------------------------------------------|
| título         | string |                                              |
| autor          | string |                                              |
| categoría      | enum   | Valores cerrados (ver §5)                    |
| estado         | enum   | `NO_LEIDO` \| `LEYENDO` \| `LEIDO`          |
| cantidad_páginas | number |                                            |
| contenido      | string | Texto anidado del libro                      |

### 2.3 Roles y responsabilidades

| Actor          | Responsabilidad                                                                 |
|----------------|---------------------------------------------------------------------------------|
| Administrador  | ABM de libros (alta, baja, modificación)                                        |
| Cliente        | Visualizar libros en estado `LEYENDO` y `NO_LEIDO`; consultar historial `LEIDO` |

---

## 3. Autenticación

- Mecanismo: **Firebase Authentication** con mail y contraseña.
- Firebase administra internamente el hasheo de credenciales y la emisión de tokens JWT de sesión.
- **No se implementa** ningún mecanismo propio de hasheo ni de emisión de JWT fuera del SDK de Firebase Auth.

### Reglas de validación de dominio

| Campo       | Regla                                                                  |
|-------------|------------------------------------------------------------------------|
| contraseña  | Mínimo 6 caracteres                                                    |
| mail        | Debe contener al menos un `@` y un dominio válido                      |

---

## 4. Arquitectura en capas

> Todas las capas viven dentro del proyecto frontend. No existe servidor propio.

```
src/
├── domain/          # Entidades y reglas de negocio (independientes de Firebase)
│   ├── Libro.ts
│   ├── Usuario.ts
│   ├── Cliente.ts
│   ├── Administrador.ts
│   ├── EstadoLectura.ts    # enum: NO_LEIDO | LEYENDO | LEIDO
│   ├── Categoria.ts        # enum de categorías cerradas
│   └── Rol.ts              # enum: ADMINISTRADOR | CLIENTE
│
├── application/     # Casos de uso (orquestan dominio + infraestructura)
│   ├── registrarUsuario.ts
│   ├── marcarLibroComoLeido.ts
│   ├── darDeAltaLibro.ts
│   ├── listarLibrosEnLectura.ts
│   └── ...
│
├── infrastructure/  # Repositorios que envuelven el SDK de Firebase
│   ├── firebase.config.ts
│   ├── LibroRepository.ts
│   └── UsuarioRepository.ts
│
└── presentation/    # Componentes React, navegación, estado de UI
    ├── components/
    ├── pages/
    └── hooks/
```

### Restricciones de capas

- Los **componentes React** no acceden directamente al SDK de Firebase; siempre pasan por la capa de aplicación/servicios.
- El **dominio** no importa nada de Firebase ni de React.
- La **infraestructura** no contiene lógica de negocio.

---

## 5. Valores cerrados (enums / value objects)

| Concepto          | Valores permitidos                        |
|-------------------|-------------------------------------------|
| Estado del libro  | `NO_LEIDO`, `LEYENDO`, `LEIDO`            |
| Rol de usuario    | `ADMINISTRADOR`, `CLIENTE`               |
| Categoría de libro | Valores definidos en `Categoria.ts`      |

**Prohibido** representar estos valores como strings libres dispersos en el código.

---

## 6. Transición de estados de un libro

```
NO_LEIDO ──► LEYENDO ──► LEIDO
```

- Un `Libro` encapsula y valida su propia transición de estado.
- No se permiten transiciones fuera de este flujo.

---

## 7. Escalabilidad y consultas

El sistema debe soportar hasta **100.000 libros** y **10.000 clientes**.

- Los listados y búsquedas (libros en lectura, no leídos, catálogo por categoría) se resuelven con **consultas indexadas de Firestore** (`where`, `orderBy`, paginación con `startAfter`).
- **Prohibido** traer colecciones completas a memoria para filtrar del lado del cliente.
- El control de acceso a los datos se resuelve con **Reglas de Seguridad de Firestore**, no con lógica de servidor.

---

## 8. Tests obligatorios

| Caso de prueba                                              | Capa       |
|-------------------------------------------------------------|------------|
| Validación de formato de mail                               | Dominio    |
| Validación de longitud mínima de contraseña (≥ 6 caracteres) | Dominio  |
| Transición de estados: `NO_LEIDO → LEYENDO → LEIDO`        | Dominio    |
| Solo el administrador puede ejecutar ABM de libros          | Aplicación |

---

## 9. Experiencia de usuario (UX)

Inspirada en **Wattpad**:

- Encontrar un libro, ver el progreso de lectura y continuar leyendo debe ser **simple, rápido y visualmente claro**.
- El perfil del cliente muestra de forma directa su **historial de libros leídos**.
- La interfaz prioriza la usabilidad sobre la complejidad técnica visual.

---

## 10. Principios obligatorios (resumen)

| # | Principio                                                                                      |
|---|-----------------------------------------------------------------------------------------------|
| 1 | **La especificación manda.** No se implementa nada que no esté trazado a una historia de usuario o requisito explícito. |
| 2 | **Orientación a objetos real.** Las entidades encapsulan sus propias reglas de negocio. Prohibidas las clases anémicas. |
| 3 | **Separación en capas** dentro del frontend: dominio → aplicación → infraestructura → presentación. |
| 4 | **Sin lógica de negocio en componentes UI.** Sin duplicación. Sin llamadas directas a Firebase desde la presentación. |
| 5 | **Enums para valores cerrados.** Estado, categoría y rol son enums; no strings libres. |
| 6 | **Patrones de diseño solo si aportan valor** real al tamaño y complejidad del proyecto. |
| 7 | **Toda regla de negocio importante tiene tests.** |
| 8 | **Consultas Firestore indexadas** para escalabilidad. Sin filtrado en memoria. |
| 9 | **UX inspirada en Wattpad:** simple, rápida y visualmente clara. |
| 10 | **Fases de especificación separadas de la implementación.** Durante spec/plan solo se crean documentos. |

---

## 11. Fases del proceso SDD

```
CONSTITUCIÓN → ESPECIFICACIÓN → ACLARACIÓN → CHECKLIST → PLANIFICACIÓN → TAREAS → IMPLEMENTACIÓN
```

> Durante las fases 1–6 **solo se crean o actualizan documentos**. La implementación ocurre únicamente en la fase 7, una vez aprobada la especificación.

---

*Este documento es la fuente de verdad del proyecto. Cualquier decisión técnica o de diseño que lo contradiga debe ser primero revisada aquí.*
