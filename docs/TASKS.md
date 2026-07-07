# TASKS — Biblioteca Digital MTN

> **Fase:** Tareas de implementación  
> **Metodología:** Specification-Driven Development (SDD)  
> **Fecha:** 2026-07-07  
> **Estado:** ✅ **TODAS LAS TAREAS COMPLETADAS — 40/40**  
> **Documentos base:** [PLAN.md](./PLAN.md) · [SPEC.md](./SPEC.md) · [CLARIFICATIONS.md](./CLARIFICATIONS.md)

---

## Leyenda de estado

| Ícono | Estado |
|-------|--------|
| ⬜ | TODO — no iniciada |
| 🔄 | IN PROGRESS — en curso |
| ✅ | DONE — completada y verificada |
| 🔒 | BLOQUEADA — esperando dependencia |

---

## ITERACIÓN 0 — Fundación del proyecto

> **Objetivo:** proyecto funcional vacío con la arquitectura en capas establecida y herramientas configuradas.  
> **Prerrequisito:** ninguno.

---

### ⬜ T-0.1 — Inicializar proyecto Vite + React + TypeScript

**Capa:** —  
**Trazabilidad:** —  
**Depende de:** —

**Qué hacer:**
- Ejecutar `npm create vite@latest . -- --template react-ts` en la raíz del repositorio.
- Verificar que `npm install` y `npm run dev` funcionan sin errores.
- Eliminar el contenido de ejemplo generado por Vite (`App.tsx`, `App.css`, `index.css`) dejando solo la estructura vacía.

**Archivos resultantes:**
- `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`
- `src/main.tsx`, `src/App.tsx` (vaciados)
- `index.html`

**Criterio de done:** `npm run dev` levanta la app sin errores en el navegador.

---

### ⬜ T-0.2 — Instalar dependencias del proyecto

**Capa:** —  
**Trazabilidad:** —  
**Depende de:** T-0.1

**Qué hacer:**
- Instalar Firebase SDK: `npm install firebase`
- Instalar React Router: `npm install react-router-dom`
- Instalar Vitest y utilidades de testing: `npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom`
- Agregar script de test en `package.json`: `"test": "vitest"` y `"test:ui": "vitest --ui"`
- Configurar Vitest en `vite.config.ts` (agregar bloque `test: { environment: 'jsdom' }`)

**Archivos modificados:**
- `package.json`
- `vite.config.ts`

**Criterio de done:** `npm test` corre sin errores (sin tests aún, solo la suite vacía).

---

### ⬜ T-0.3 — Crear estructura de carpetas del proyecto

**Capa:** —  
**Trazabilidad:** CONSTITUTION.md §4  
**Depende de:** T-0.1

**Qué hacer:**
- Crear las siguientes carpetas vacías dentro de `src/` (con un archivo `.gitkeep` o un `index.ts` de barril vacío en cada una):

```
src/
├── domain/
├── application/
│   ├── auth/
│   ├── libros/
│   ├── categorias/
│   └── lectura/
├── infrastructure/
└── presentation/
    ├── hooks/
    ├── pages/
    │   └── admin/
    └── components/
```

- Crear también `src/tests/domain/` y `src/tests/application/`.

**Archivos resultantes:** estructura de carpetas con archivos `.gitkeep` o barriles vacíos.

**Criterio de done:** la estructura de carpetas coincide exactamente con la definida en PLAN.md §Estructura de carpetas.

---

### ⬜ T-0.4 — Configurar Firebase (`firebase.config.ts`)

**Capa:** infraestructura  
**Trazabilidad:** —  
**Depende de:** T-0.3

**Qué hacer:**
- Crear el proyecto en Firebase Console (o usar el existente).
- Copiar las credenciales del proyecto (apiKey, authDomain, projectId, etc.).
- Crear `src/infrastructure/firebase.config.ts` que inicializa la app Firebase y exporta `auth` (Firebase Auth) y `db` (Firestore).

```typescript
// src/infrastructure/firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  // ...
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

**Archivos resultantes:**
- `src/infrastructure/firebase.config.ts`

**Criterio de done:** el archivo importa sin errores de TypeScript y no expone credenciales en el repo (usar variables de entorno `.env` si es necesario).

---

### ⬜ T-0.5 — Definir enums `EstadoLectura` y `Rol`

**Capa:** dominio  
**Trazabilidad:** RF-2.5, RF-3.4, CONSTITUTION.md §5  
**Depende de:** T-0.3

**Qué hacer:**
- Crear `src/domain/EstadoLectura.ts`:

```typescript
export enum EstadoLectura {
  NO_LEIDO = 'NO_LEIDO',
  LEYENDO  = 'LEYENDO',
  LEIDO    = 'LEIDO',
}
```

- Crear `src/domain/Rol.ts`:

```typescript
export enum Rol {
  ADMINISTRADOR = 'ADMINISTRADOR',
  CLIENTE       = 'CLIENTE',
}
```

**Archivos resultantes:**
- `src/domain/EstadoLectura.ts`
- `src/domain/Rol.ts`

**Criterio de done:** ambos enums importan correctamente desde otros módulos sin errores de TypeScript.

---

### ⬜ T-0.6 — Configurar React Router con rutas base y `ProtectedRoute` vacío

**Capa:** presentación  
**Trazabilidad:** RF-2.5  
**Depende de:** T-0.3, T-0.5

**Qué hacer:**
- Crear `src/presentation/router.tsx` con React Router v6 (`createBrowserRouter`).
- Definir las rutas del sistema (páginas vacías por ahora como placeholders):
  - `/login` → `LoginPage`
  - `/register` → `RegisterPage`
  - `/` → `ClienteHomePage` (protegida, rol CLIENTE)
  - `/catalogo` → `CatalogoPage` (protegida, rol CLIENTE)
  - `/perfil` → `PerfilPage` (protegida, rol CLIENTE)
  - `/admin` → `AdminHomePage` (protegida, rol ADMINISTRADOR)
  - `/admin/libros` → `LibroListPage` (protegida, rol ADMINISTRADOR)
  - `/admin/libros/nuevo` → `LibroFormPage` (protegida, rol ADMINISTRADOR)
  - `/admin/libros/:id/editar` → `LibroFormPage` (protegida, rol ADMINISTRADOR)
- Crear `src/presentation/components/ProtectedRoute.tsx` como componente vacío/placeholder.
- Crear todos los archivos de páginas como componentes vacíos (solo `export default function XPage() { return <div>XPage</div>; }`).

**Archivos resultantes:**
- `src/presentation/router.tsx`
- `src/presentation/components/ProtectedRoute.tsx`
- `src/presentation/pages/LoginPage.tsx`
- `src/presentation/pages/RegisterPage.tsx`
- `src/presentation/pages/ClienteHomePage.tsx`
- `src/presentation/pages/CatalogoPage.tsx`
- `src/presentation/pages/PerfilPage.tsx`
- `src/presentation/pages/admin/AdminHomePage.tsx`
- `src/presentation/pages/admin/LibroListPage.tsx`
- `src/presentation/pages/admin/LibroFormPage.tsx`

**Criterio de done:** la app navega entre rutas sin errores; `npm run dev` funciona.

---

## ITERACIÓN 1 — Dominio y tests de negocio

> **Objetivo:** entidades del dominio con sus reglas de negocio, cubiertas por tests. Sin Firebase.  
> **Prerrequisito:** T-0.3, T-0.5 completadas.

---

### ⬜ T-1.1 — Implementar entidad `Libro`

**Capa:** dominio  
**Trazabilidad:** RF-1.4  
**Depende de:** T-0.5

**Qué hacer:**
- Crear `src/domain/Libro.ts`.
- La clase `Libro` encapsula: `id`, `titulo`, `autor`, `categoriaId`, `cantidadPaginas`, `contenido`.
- **No tiene campo `estado`** (el estado es de `ProgresoLectura`, no del libro).
- Validar en el constructor o en un método estático `crear(...)`:
  - `titulo`, `autor`, `contenido` no pueden ser vacíos.
  - `cantidadPaginas` debe ser un entero positivo.
  - `contenido` no puede superar 500.000 caracteres (lanza error si se excede).
- Exponer método `esValido(): boolean` o lanzar errores descriptivos.

**Archivos resultantes:**
- `src/domain/Libro.ts`

**Criterio de done:** la clase compila sin errores y las validaciones son testeables de forma aislada.

---

### ⬜ T-1.2 — Implementar `Usuario`, `Cliente` y `Administrador`

**Capa:** dominio  
**Trazabilidad:** RF-2.1, RF-2.3, RF-2.4  
**Depende de:** T-0.5

**Qué hacer:**
- Crear `src/domain/Usuario.ts`: clase base con `uid`, `nombre`, `apellido`, `mail`, `telefono`, `dni`, `rol`.
  - Método estático `validarMail(mail: string): boolean` → debe contener `@` y al menos un punto después del `@`.
  - Método estático `validarContrasena(contrasena: string): boolean` → longitud mínima 6 caracteres.
- Crear `src/domain/Cliente.ts`: extiende `Usuario`, fija `rol = Rol.CLIENTE`.
- Crear `src/domain/Administrador.ts`: extiende `Usuario`, fija `rol = Rol.ADMINISTRADOR`.
  - Exponer método `puedeGestionarLibros(): true` (siempre retorna `true` para el admin).

**Archivos resultantes:**
- `src/domain/Usuario.ts`
- `src/domain/Cliente.ts`
- `src/domain/Administrador.ts`

**Criterio de done:** las clases compilan y las validaciones son testeables de forma aislada.

---

### ⬜ T-1.3 — Implementar `ProgresoLectura` con transición de estados

**Capa:** dominio  
**Trazabilidad:** RF-3.4, AMB-02  
**Depende de:** T-0.5

**Qué hacer:**
- Crear `src/domain/ProgresoLectura.ts`.
- La clase `ProgresoLectura` tiene: `libroId: string`, `estado: EstadoLectura`, `updatedAt: Date`.
- Método `avanzarEstado(nuevoEstado: EstadoLectura): void`:
  - Transiciones **válidas**: `NO_LEIDO → LEYENDO`, `NO_LEIDO → LEIDO`, `LEYENDO → LEIDO`.
  - Transiciones **inválidas**: cualquier cambio desde `LEIDO`, o retroceder estados.
  - Si la transición es inválida, lanza `Error` con mensaje descriptivo.
- Método estático `crear(libroId: string): ProgresoLectura` → crea con estado inicial `NO_LEIDO`.

**Archivos resultantes:**
- `src/domain/ProgresoLectura.ts`

**Criterio de done:** la clase compila y el método `avanzarEstado` es testeable de forma aislada.

---

### ⬜ T-1.4 — Implementar value object `Categoria`

**Capa:** dominio  
**Trazabilidad:** RF-1.4, AMB-05  
**Depende de:** T-0.3

**Qué hacer:**
- Crear `src/domain/Categoria.ts`.
- `Categoria` es un value object con `id: string` y `nombre: string`.
- El `nombre` no puede ser vacío (validar en constructor o factory).
- No es un enum: los valores vienen de Firestore dinámicamente.

```typescript
export class Categoria {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
  ) {
    if (!nombre.trim()) throw new Error('El nombre de la categoría no puede estar vacío.');
  }
}
```

**Archivos resultantes:**
- `src/domain/Categoria.ts`

**Criterio de done:** la clase compila y valida el nombre vacío correctamente.

---

### ⬜ T-1.5 — Tests: validación de mail

**Capa:** dominio  
**Trazabilidad:** RF-2.4  
**Depende de:** T-1.2

**Qué hacer:**
- Crear `src/tests/domain/Usuario.test.ts`.
- Escribir los siguientes casos con Vitest:

```typescript
describe('Usuario.validarMail', () => {
  it('acepta mail con @ y dominio válido', ...)       // 'usuario@mail.com' → true
  it('rechaza mail sin @', ...)                       // 'usuariomail.com' → false
  it('rechaza mail sin dominio después del @', ...)   // 'usuario@' → false
  it('rechaza string vacío', ...)                     // '' → false
  it('rechaza mail con solo @', ...)                  // '@' → false
})
```

**Archivos resultantes:**
- `src/tests/domain/Usuario.test.ts`

**Criterio de done:** `npm test` pasa todos los casos sin errores.

---

### ⬜ T-1.6 — Tests: validación de contraseña

**Capa:** dominio  
**Trazabilidad:** RF-2.3  
**Depende de:** T-1.2

**Qué hacer:**
- Agregar al archivo `src/tests/domain/Usuario.test.ts`:

```typescript
describe('Usuario.validarContrasena', () => {
  it('acepta contraseña de exactamente 6 caracteres', ...)  // 'abc123' → true
  it('acepta contraseña de más de 6 caracteres', ...)       // 'segura1234' → true
  it('rechaza contraseña de 5 caracteres', ...)             // 'abc12' → false
  it('rechaza contraseña vacía', ...)                       // '' → false
})
```

**Archivos modificados:**
- `src/tests/domain/Usuario.test.ts`

**Criterio de done:** `npm test` pasa todos los casos sin errores.

---

### ⬜ T-1.7 — Tests: transiciones válidas de estado de lectura

**Capa:** dominio  
**Trazabilidad:** RF-3.4, AMB-02  
**Depende de:** T-1.3

**Qué hacer:**
- Crear `src/tests/domain/ProgresoLectura.test.ts`:

```typescript
describe('ProgresoLectura.avanzarEstado — transiciones válidas', () => {
  it('NO_LEIDO → LEYENDO es válido', ...)
  it('NO_LEIDO → LEIDO es válido (transición directa permitida)', ...)
  it('LEYENDO → LEIDO es válido', ...)
})
```

**Archivos resultantes:**
- `src/tests/domain/ProgresoLectura.test.ts`

**Criterio de done:** `npm test` pasa los 3 casos.

---

### ⬜ T-1.8 — Tests: transiciones inválidas de estado de lectura

**Capa:** dominio  
**Trazabilidad:** RF-3.4  
**Depende de:** T-1.3

**Qué hacer:**
- Agregar al archivo `src/tests/domain/ProgresoLectura.test.ts`:

```typescript
describe('ProgresoLectura.avanzarEstado — transiciones inválidas', () => {
  it('LEIDO → LEYENDO lanza error', ...)
  it('LEIDO → NO_LEIDO lanza error', ...)
  it('LEYENDO → NO_LEIDO lanza error', ...)
})
```

**Archivos modificados:**
- `src/tests/domain/ProgresoLectura.test.ts`

**Criterio de done:** `npm test` pasa los 3 casos; cada uno verifica que se lanza un `Error`.

---

### ⬜ T-1.9 — Tests: solo Administrador puede gestionar libros

**Capa:** dominio  
**Trazabilidad:** RNF-3  
**Depende de:** T-1.2

**Qué hacer:**
- Crear `src/tests/domain/Rol.test.ts`:

```typescript
describe('Roles y permisos', () => {
  it('Administrador.puedeGestionarLibros() retorna true', ...)
  it('Cliente no tiene el método puedeGestionarLibros', ...)
  it('El rol del Administrador es Rol.ADMINISTRADOR', ...)
  it('El rol del Cliente es Rol.CLIENTE', ...)
})
```

**Archivos resultantes:**
- `src/tests/domain/Rol.test.ts`

**Criterio de done:** `npm test` pasa los 4 casos.

---

## ITERACIÓN 2 — Autenticación

> **Objetivo:** registro e inicio de sesión funcionales contra Firebase Auth + Firestore.  
> **Prerrequisito:** Iteración 0 y Iteración 1 completas.

---

### ⬜ T-2.1 — Implementar `UsuarioRepository`

**Capa:** infraestructura  
**Trazabilidad:** RF-2.1  
**Depende de:** T-0.4, T-1.2

**Qué hacer:**
- Crear `src/infrastructure/UsuarioRepository.ts`.
- Métodos:
  - `crear(uid: string, datos: Omit<Usuario, 'uid'>): Promise<void>` → escribe en `users/{uid}`.
  - `obtenerPorUid(uid: string): Promise<Usuario | null>` → lee `users/{uid}`.
- Usar `setDoc` y `getDoc` del SDK de Firestore (`firebase/firestore`).
- El repositorio no contiene lógica de negocio; solo traduce entre el dominio y Firestore.

**Archivos resultantes:**
- `src/infrastructure/UsuarioRepository.ts`

**Criterio de done:** el archivo compila sin errores de TypeScript.

---

### ⬜ T-2.2 — Caso de uso `registrarCliente`

**Capa:** aplicación  
**Trazabilidad:** US-04  
**Depende de:** T-2.1, T-1.2

**Qué hacer:**
- Crear `src/application/auth/registrarCliente.ts`.
- Flujo:
  1. Validar mail con `Usuario.validarMail()` → si falla, lanzar error descriptivo.
  2. Validar contraseña con `Usuario.validarContrasena()` → si falla, lanzar error descriptivo.
  3. Llamar a `createUserWithEmailAndPassword(auth, mail, contrasena)`.
  4. Guardar el documento del usuario en Firestore con rol `CLIENTE` usando `UsuarioRepository.crear()`.
- Firma sugerida:

```typescript
export async function registrarCliente(datos: {
  nombre: string; apellido: string; mail: string;
  telefono: string; dni: string; contrasena: string;
}): Promise<void>
```

**Archivos resultantes:**
- `src/application/auth/registrarCliente.ts`

**Criterio de done:** el caso de uso compila y el flujo de validación → auth → Firestore está completo.

---

### ⬜ T-2.3 — Caso de uso `iniciarSesion`

**Capa:** aplicación  
**Trazabilidad:** US-05  
**Depende de:** T-0.4

**Qué hacer:**
- Crear `src/application/auth/iniciarSesion.ts`.
- Llama a `signInWithEmailAndPassword(auth, mail, contrasena)`.
- Si Firebase Auth lanza error (`auth/user-not-found`, `auth/wrong-password`, etc.), relanzar con un mensaje amigable para la UI.

```typescript
export async function iniciarSesion(mail: string, contrasena: string): Promise<void>
```

**Archivos resultantes:**
- `src/application/auth/iniciarSesion.ts`

**Criterio de done:** el caso de uso compila y maneja los errores de Auth correctamente.

---

### ⬜ T-2.4 — Hook `useAuth`

**Capa:** presentación  
**Trazabilidad:** US-05, RF-2.5  
**Depende de:** T-2.1, T-0.4

**Qué hacer:**
- Crear `src/presentation/hooks/useAuth.ts`.
- Usa `onAuthStateChanged` de Firebase Auth para observar cambios de sesión.
- Al detectar un usuario autenticado, lee su documento de `users/{uid}` para obtener el `rol`.
- Expone: `{ usuario: Usuario | null, rol: Rol | null, cargando: boolean }`.

**Archivos resultantes:**
- `src/presentation/hooks/useAuth.ts`

**Criterio de done:** el hook retorna el rol correcto tras el login y `null` tras el logout.

---

### ⬜ T-2.5 — Implementar `LoginPage`

**Capa:** presentación  
**Trazabilidad:** US-05  
**Depende de:** T-2.3, T-2.4

**Qué hacer:**
- Implementar `src/presentation/pages/LoginPage.tsx`.
- Formulario con campos: mail, contraseña.
- Al enviar: llama al caso de uso `iniciarSesion`.
- Si hay error: muestra el mensaje de error debajo del formulario.
- Si es exitoso: redirige según el rol (`/` para CLIENTE, `/admin` para ADMINISTRADOR).

**Archivos modificados:**
- `src/presentation/pages/LoginPage.tsx`

**Criterio de done:** login exitoso redirige correctamente; credenciales incorrectas muestran error.

---

### ⬜ T-2.6 — Implementar `RegisterPage`

**Capa:** presentación  
**Trazabilidad:** US-04  
**Depende de:** T-2.2

**Qué hacer:**
- Implementar `src/presentation/pages/RegisterPage.tsx`.
- Formulario con campos: nombre, apellido, mail, teléfono, DNI, contraseña.
- Al enviar: llama al caso de uso `registrarCliente`.
- Muestra errores de validación por campo (mail inválido, contraseña corta).
- Si es exitoso: redirige a `/login` o directamente a `/`.

**Archivos modificados:**
- `src/presentation/pages/RegisterPage.tsx`

**Criterio de done:** registro exitoso crea el usuario en Auth y en Firestore; errores se muestran correctamente.

---

### ⬜ T-2.7 — Implementar `ProtectedRoute`

**Capa:** presentación  
**Trazabilidad:** RNF-3  
**Depende de:** T-2.4

**Qué hacer:**
- Implementar `src/presentation/components/ProtectedRoute.tsx`.
- Recibe `rolRequerido?: Rol` como prop.
- Si `cargando === true`: muestra spinner o pantalla de carga.
- Si no hay sesión: redirige a `/login`.
- Si hay sesión pero el rol no coincide: redirige a `/` (o muestra pantalla de acceso denegado).
- Usado en `router.tsx` para envolver las rutas protegidas.

**Archivos modificados:**
- `src/presentation/components/ProtectedRoute.tsx`
- `src/presentation/router.tsx` (usar `ProtectedRoute` en las rutas correspondientes)

**Criterio de done:** un cliente que navega a `/admin` es redirigido; un admin que navega a `/admin` accede correctamente.

---

## ITERACIÓN 3 — ABM de libros y categorías (Administrador)

> **Objetivo:** el administrador puede gestionar el catálogo completo.  
> **Prerrequisito:** Iteración 2 completa.

---

### ⬜ T-3.1 — Implementar `CategoriaRepository`

**Capa:** infraestructura  
**Trazabilidad:** AMB-05  
**Depende de:** T-0.4, T-1.4

**Qué hacer:**
- Crear `src/infrastructure/CategoriaRepository.ts`.
- Métodos:
  - `crear(nombre: string): Promise<string>` → agrega doc a `categorias/`, retorna el id generado.
  - `listar(): Promise<Categoria[]>` → trae todos los documentos de `categorias/`.
  - `eliminar(id: string): Promise<void>`.

**Archivos resultantes:**
- `src/infrastructure/CategoriaRepository.ts`

**Criterio de done:** compila sin errores; los métodos usan `addDoc`, `getDocs`, `deleteDoc` del SDK.

---

### ⬜ T-3.2 — Casos de uso `crearCategoria` y `listarCategorias`

**Capa:** aplicación  
**Trazabilidad:** RF-5.2  
**Depende de:** T-3.1

**Qué hacer:**
- Crear `src/application/categorias/crearCategoria.ts`:
  - Valida que el nombre no sea vacío (usando `new Categoria(...)`).
  - Llama a `CategoriaRepository.crear(nombre)`.
- Crear `src/application/categorias/listarCategorias.ts`:
  - Llama a `CategoriaRepository.listar()` y retorna el array de `Categoria[]`.

**Archivos resultantes:**
- `src/application/categorias/crearCategoria.ts`
- `src/application/categorias/listarCategorias.ts`

**Criterio de done:** ambos casos de uso compilan y orquestan correctamente dominio + repositorio.

---

### ⬜ T-3.3 — Implementar `LibroRepository`

**Capa:** infraestructura  
**Trazabilidad:** RF-1.1, RF-1.2, RF-1.3  
**Depende de:** T-0.4, T-1.1

**Qué hacer:**
- Crear `src/infrastructure/LibroRepository.ts`.
- Métodos:
  - `crear(libro: Omit<Libro, 'id'>): Promise<string>` → `addDoc` en `libros/`.
  - `actualizar(id: string, datos: Partial<Omit<Libro, 'id'>>): Promise<void>` → `updateDoc`.
  - `eliminar(id: string): Promise<void>` → `deleteDoc`. **No toca `readingProgress`** de ningún usuario.
  - `obtenerPorId(id: string): Promise<Libro | null>` → `getDoc`.
  - `listar(pagina?: QueryDocumentSnapshot): Promise<{ libros: Libro[], ultimoDoc: QueryDocumentSnapshot | null }>` → `getDocs` con paginación `startAfter`.

**Archivos resultantes:**
- `src/infrastructure/LibroRepository.ts`

**Criterio de done:** compila sin errores; `eliminar` solo borra el documento del libro y nada más.

---

### ⬜ T-3.4 — Caso de uso `darDeAltaLibro`

**Capa:** aplicación  
**Trazabilidad:** US-01, AMB-06  
**Depende de:** T-3.3, T-1.1

**Qué hacer:**
- Crear `src/application/libros/darDeAltaLibro.ts`.
- Flujo:
  1. Construir instancia `Libro` con los datos recibidos (la validación de 500k chars ocurre en el constructor de `Libro`).
  2. Si la construcción falla: relanzar el error para que la UI lo muestre.
  3. Llamar a `LibroRepository.crear(libro)`.
- Firma sugerida:

```typescript
export async function darDeAltaLibro(datos: {
  titulo: string; autor: string; categoriaId: string;
  cantidadPaginas: number; contenido: string;
}): Promise<string>  // retorna el id del libro creado
```

**Archivos resultantes:**
- `src/application/libros/darDeAltaLibro.ts`

**Criterio de done:** si el contenido supera 500k caracteres, la función lanza error antes de escribir en Firestore.

---

### ⬜ T-3.5 — Caso de uso `modificarLibro`

**Capa:** aplicación  
**Trazabilidad:** US-02  
**Depende de:** T-3.3

**Qué hacer:**
- Crear `src/application/libros/modificarLibro.ts`.
- Valida que los campos modificados sean válidos (reutiliza la lógica de `Libro`).
- Llama a `LibroRepository.actualizar(id, datos)`.
- Agrega `updatedAt: new Date()` automáticamente.

**Archivos resultantes:**
- `src/application/libros/modificarLibro.ts`

**Criterio de done:** la función compila y actualiza solo los campos provistos.

---

### ⬜ T-3.6 — Caso de uso `eliminarLibro`

**Capa:** aplicación  
**Trazabilidad:** US-03, AMB-03  
**Depende de:** T-3.3

**Qué hacer:**
- Crear `src/application/libros/eliminarLibro.ts`.
- Llama a `LibroRepository.eliminar(id)`.
- **No borra** los documentos de `readingProgress` de los usuarios (comportamiento definido en AMB-03).
- Agregar comentario en el código que documente esta decisión: `// AMB-03: el historial de lectura de los clientes se conserva al eliminar el libro.`

**Archivos resultantes:**
- `src/application/libros/eliminarLibro.ts`

**Criterio de done:** la función solo borra el documento del libro; el comentario de trazabilidad está presente.

---

### ⬜ T-3.7 — Implementar `LibroFormPage` (alta y edición)

**Capa:** presentación  
**Trazabilidad:** US-01, US-02  
**Depende de:** T-3.4, T-3.5, T-3.2

**Qué hacer:**
- Implementar `src/presentation/pages/admin/LibroFormPage.tsx`.
- Modo **alta**: formulario vacío; al guardar llama a `darDeAltaLibro`.
- Modo **edición**: carga datos del libro por `id` de la URL; al guardar llama a `modificarLibro`.
- Campos: título, autor, selector de categoría (cargado desde `listarCategorias`), cantidad de páginas, textarea para contenido.
- Muestra errores de validación (campo vacío, contenido > 500k caracteres).
- Botón "Cancelar" vuelve a `/admin/libros`.

**Archivos modificados:**
- `src/presentation/pages/admin/LibroFormPage.tsx`

**Criterio de done:** alta y edición funcionan; los errores de validación se muestran en la UI.

---

### ⬜ T-3.8 — Implementar `LibroListPage`

**Capa:** presentación  
**Trazabilidad:** US-02, US-03  
**Depende de:** T-3.3, T-3.5, T-3.6

**Qué hacer:**
- Implementar `src/presentation/pages/admin/LibroListPage.tsx`.
- Lista todos los libros del catálogo (paginado).
- Cada fila tiene botones: **Editar** (navega a `/admin/libros/:id/editar`) y **Eliminar** (con confirmación).
- Estado vacío: muestra *"No hay libros en el catálogo todavía."*

**Archivos modificados:**
- `src/presentation/pages/admin/LibroListPage.tsx`

**Criterio de done:** listado muestra los libros; eliminar quita el libro de la lista; editar navega al formulario precargado.

---

### ⬜ T-3.9 — Implementar `AdminHomePage`

**Capa:** presentación  
**Trazabilidad:** US-01, US-02, US-03  
**Depende de:** T-3.8

**Qué hacer:**
- Implementar `src/presentation/pages/admin/AdminHomePage.tsx`.
- Panel de bienvenida con acceso rápido a:
  - Gestionar libros → `/admin/libros`
  - Nuevo libro → `/admin/libros/nuevo`

**Archivos modificados:**
- `src/presentation/pages/admin/AdminHomePage.tsx`

**Criterio de done:** la página carga correctamente con el usuario admin autenticado.

---

## ITERACIÓN 4 — Seguimiento de lectura (Cliente)

> **Objetivo:** el cliente ve sus libros y puede cambiar su estado de lectura.  
> **Prerrequisito:** Iteración 2 completa; Iteración 3 no es bloqueante.

---

### ⬜ T-4.1 — Implementar `ProgresoLecturaRepository`

**Capa:** infraestructura  
**Trazabilidad:** RF-3.1, RF-3.2, RF-3.3, RF-3.4  
**Depende de:** T-0.4, T-1.3

**Qué hacer:**
- Crear `src/infrastructure/ProgresoLecturaRepository.ts`.
- Métodos:
  - `obtener(uid: string, libroId: string): Promise<ProgresoLectura | null>` → `getDoc` en `users/{uid}/readingProgress/{libroId}`.
  - `guardar(uid: string, progreso: ProgresoLectura): Promise<void>` → `setDoc` (upsert).
  - `listarPorEstado(uid: string, estado: EstadoLectura): Promise<ProgresoLectura[]>` → `getDocs` con `where('estado', '==', estado)`.

**Archivos resultantes:**
- `src/infrastructure/ProgresoLecturaRepository.ts`

**Criterio de done:** compila sin errores; las queries usan `where` indexado (no filtrado en memoria).

---

### ⬜ T-4.2 — Caso de uso `marcarEstadoLectura`

**Capa:** aplicación  
**Trazabilidad:** US-07, US-08, AMB-02  
**Depende de:** T-4.1, T-1.3

**Qué hacer:**
- Crear `src/application/lectura/marcarEstadoLectura.ts`.
- Flujo:
  1. Obtener el `ProgresoLectura` actual del usuario para ese libro (o crear uno nuevo con `NO_LEIDO` si no existe).
  2. Llamar a `progreso.avanzarEstado(nuevoEstado)` → si la transición es inválida, el error de dominio se propaga.
  3. Guardar el progreso actualizado con `ProgresoLecturaRepository.guardar()`.

```typescript
export async function marcarEstadoLectura(
  uid: string, libroId: string, nuevoEstado: EstadoLectura
): Promise<void>
```

**Archivos resultantes:**
- `src/application/lectura/marcarEstadoLectura.ts`

**Criterio de done:** la función usa la lógica de transición del dominio y persiste el resultado.

---

### ⬜ T-4.3 — Caso de uso `listarLibrosEnLectura`

**Capa:** aplicación  
**Trazabilidad:** US-06, RF-3.1  
**Depende de:** T-4.1, T-3.3

**Qué hacer:**
- Crear `src/application/lectura/listarLibrosEnLectura.ts`.
- Trae los `ProgresoLectura` del usuario con estado `LEYENDO` y `NO_LEIDO`.
- Para cada progreso, obtiene el documento del libro desde `LibroRepository.obtenerPorId()`.
- Retorna un array de `{ libro: Libro, estado: EstadoLectura }[]`.

**Archivos resultantes:**
- `src/application/lectura/listarLibrosEnLectura.ts`

**Criterio de done:** la función retorna correctamente los libros separados por estado.

---

### ⬜ T-4.4 — Implementar `ClienteHomePage`

**Capa:** presentación  
**Trazabilidad:** US-06  
**Depende de:** T-4.3, T-4.5, T-4.6

**Qué hacer:**
- Implementar `src/presentation/pages/ClienteHomePage.tsx`.
- Sección **"Estoy leyendo"**: lista los libros con estado `LEYENDO`.
- Sección **"Sin empezar"**: lista los libros con estado `NO_LEIDO`.
- Estado vacío en cada sección si no hay libros.
- Cada libro se muestra con `LibroCard`.

**Archivos modificados:**
- `src/presentation/pages/ClienteHomePage.tsx`

**Criterio de done:** la página muestra las dos secciones diferenciadas visualmente; actualiza en tiempo real.

---

### ⬜ T-4.5 — Implementar `LibroCard` con `EstadoLecturaSelector`

**Capa:** presentación  
**Trazabilidad:** US-07, US-08  
**Depende de:** T-4.2

**Qué hacer:**
- Crear `src/presentation/components/LibroCard.tsx`:
  - Muestra: título, autor, categoría.
  - Incluye `EstadoLecturaSelector` para cambiar el estado.
- Crear `src/presentation/components/EstadoLecturaSelector.tsx`:
  - Muestra el estado actual del libro.
  - Botones para avanzar al siguiente estado permitido.
  - Al hacer clic, llama al caso de uso `marcarEstadoLectura`.
  - Muestra error si la transición falla.

**Archivos resultantes:**
- `src/presentation/components/LibroCard.tsx`
- `src/presentation/components/EstadoLecturaSelector.tsx`

**Criterio de done:** el selector muestra solo las transiciones válidas y actualiza el estado en Firestore.

---

### ⬜ T-4.6 — Hook `useLibros` con suscripción en tiempo real

**Capa:** presentación  
**Trazabilidad:** US-06  
**Depende de:** T-4.1

**Qué hacer:**
- Crear `src/presentation/hooks/useLibros.ts`.
- Usa `onSnapshot` de Firestore para suscribirse a cambios en `users/{uid}/readingProgress`.
- Expone: `{ leyendo: ProgresoLectura[], noLeidos: ProgresoLectura[], cargando: boolean }`.
- Desuscribe automáticamente al desmontar el componente.

**Archivos resultantes:**
- `src/presentation/hooks/useLibros.ts`

**Criterio de done:** el hook actualiza la UI en tiempo real sin necesidad de recargar la página.

---

## ITERACIÓN 5 — Catálogo, búsqueda y perfil

> **Objetivo:** catálogo navegable con filtros y perfil del cliente con historial.  
> **Prerrequisito:** Iteraciones 3 y 4 completas.

---

### ⬜ T-5.1 — Caso de uso `listarCatalogo`

**Capa:** aplicación  
**Trazabilidad:** RF-5.1, RNF-2  
**Depende de:** T-3.3

**Qué hacer:**
- Crear `src/application/libros/listarCatalogo.ts`.
- Soporta paginación con cursor (`startAfter`): parámetro `ultimoDoc` opcional.
- Soporta filtro por `categoriaId` (aplica `where('categoriaId', '==', categoriaId)` si se provee).
- Tamaño de página: 20 libros.
- Retorna `{ libros: Libro[], ultimoDoc: QueryDocumentSnapshot | null, hayMas: boolean }`.

**Archivos resultantes:**
- `src/application/libros/listarCatalogo.ts`

**Criterio de done:** la paginación funciona correctamente; no trae toda la colección a memoria.

---

### ⬜ T-5.2 — Caso de uso `listarLibrosLeidos`

**Capa:** aplicación  
**Trazabilidad:** US-09, RF-4.2  
**Depende de:** T-4.1, T-3.3

**Qué hacer:**
- Crear `src/application/lectura/listarLibrosLeidos.ts`.
- Trae los `ProgresoLectura` con estado `LEIDO` para el `uid` dado (paginado, 20 por página).
- Para cada progreso, intenta obtener el libro con `LibroRepository.obtenerPorId()`.
- Si el libro no existe en Firestore (fue eliminado), retorna `{ progreso, libro: null }` → **no lanza error** (AMB-03).

**Archivos resultantes:**
- `src/application/lectura/listarLibrosLeidos.ts`

**Criterio de done:** libros eliminados aparecen en el historial con `libro: null` sin romper la UI.

---

### ⬜ T-5.3 — Implementar `CatalogoPage`

**Capa:** presentación  
**Trazabilidad:** US-10, RF-5.2, RF-5.3  
**Depende de:** T-5.1, T-5.4, T-3.2

**Qué hacer:**
- Implementar `src/presentation/pages/CatalogoPage.tsx`.
- Lista el catálogo paginado (botón "Cargar más" o scroll infinito).
- Incluye el componente `CatalogoFiltros`.
- Muestra estado vacío si el catálogo está vacío: *"No hay libros en el catálogo todavía."* (CB-03).

**Archivos modificados:**
- `src/presentation/pages/CatalogoPage.tsx`

**Criterio de done:** la paginación y el filtro por categoría funcionan correctamente.

---

### ⬜ T-5.4 — Implementar `CatalogoFiltros`

**Capa:** presentación  
**Trazabilidad:** US-10  
**Depende de:** T-3.2

**Qué hacer:**
- Crear `src/presentation/components/CatalogoFiltros.tsx`.
- Selector de categoría (carga opciones desde `listarCategorias`).
- Input de búsqueda por título o autor (filtrado sobre los resultados de la query, o nueva query si el backend lo soporta).
- Al cambiar filtros: llama al callback provisto por `CatalogoPage` para recargar resultados.

**Archivos resultantes:**
- `src/presentation/components/CatalogoFiltros.tsx`

**Criterio de done:** filtro por categoría actualiza el listado; búsqueda por texto filtra los resultados.

---

### ⬜ T-5.5 — Implementar `PerfilPage`

**Capa:** presentación  
**Trazabilidad:** US-09, RF-4.1, RF-4.2, RF-4.3  
**Depende de:** T-5.2

**Qué hacer:**
- Implementar `src/presentation/pages/PerfilPage.tsx`.
- Sección de datos personales: nombre, apellido, mail, teléfono (leídos desde `useAuth`).
- Sección de historial: lista de libros con estado `LEIDO`, paginada.
- Estado vacío: *"Todavía no marcaste ningún libro como leído."*

**Archivos modificados:**
- `src/presentation/pages/PerfilPage.tsx`

**Criterio de done:** los datos personales y el historial paginado se muestran correctamente.

---

### ⬜ T-5.6 — Manejar libro eliminado en el historial (CB-07 / AMB-03)

**Capa:** presentación  
**Trazabilidad:** AMB-03, CB-07  
**Depende de:** T-5.5, T-5.2

**Qué hacer:**
- En `PerfilPage`, cuando `listarLibrosLeidos` retorna un item con `libro: null`:
  - Renderizar una tarjeta degradada con el texto *"Libro no disponible"* (el libro fue eliminado del catálogo).
  - No lanzar error ni romper el listado.

**Archivos modificados:**
- `src/presentation/pages/PerfilPage.tsx`

**Criterio de done:** si existe un `ProgresoLectura` con `libroId` cuyo documento no existe en `libros/`, la UI lo muestra gracefully.

---

## ITERACIÓN 6 — Reglas de seguridad y despliegue

> **Objetivo:** sistema seguro y desplegado en Firebase Hosting.  
> **Prerrequisito:** Iteración 5 completa; Firebase Hosting habilitado en el proyecto.

---

### ⬜ T-6.1 — Reglas Firestore: colecciones `libros` y `categorias`

**Capa:** infraestructura  
**Trazabilidad:** RNF-3  
**Depende de:** T-0.4

**Qué hacer:**
- En `firestore.rules`, agregar:
  - `libros/{libroId}`: `read` si autenticado; `create/update/delete` solo si `isAdmin()`.
  - `categorias/{categoriaId}`: ídem `libros`.

**Archivos resultantes / modificados:**
- `firestore.rules`

**Criterio de done:** un cliente autenticado no puede crear/editar/eliminar libros ni categorías desde la consola de Firestore o el SDK.

---

### ⬜ T-6.2 — Reglas Firestore: subcolección `readingProgress`

**Capa:** infraestructura  
**Trazabilidad:** RNF-3  
**Depende de:** T-6.1

**Qué hacer:**
- En `firestore.rules`, agregar:
  - `users/{uid}/readingProgress/{libroId}`: `read/write` solo si `request.auth.uid == uid`.

**Archivos modificados:**
- `firestore.rules`

**Criterio de done:** el cliente A no puede leer ni modificar el `readingProgress` del cliente B.

---

### ⬜ T-6.3 — Reglas Firestore: colección `users`

**Capa:** infraestructura  
**Trazabilidad:** RNF-3  
**Depende de:** T-6.1

**Qué hacer:**
- En `firestore.rules`, agregar:
  - `users/{uid}`: `read/write` solo si `request.auth.uid == uid`.
  - Excepción: la función helper `isAdmin()` necesita leer `users/{uid}` de otro usuario → permitir `get` desde reglas de servidor (ya funciona con `get(...)` en las reglas).

**Archivos modificados:**
- `firestore.rules`

**Criterio de done:** un usuario no puede leer ni modificar el documento de otro usuario.

---

### ⬜ T-6.4 — Configurar índices Firestore

**Capa:** infraestructura  
**Trazabilidad:** RNF-2  
**Depende de:** T-4.1

**Qué hacer:**
- Crear o actualizar `firestore.indexes.json` con los índices necesarios:
  - Índice compuesto en `users/{uid}/readingProgress`: campos `estado ASC` + `updatedAt DESC`.
  - Índice en `libros`: campo `categoriaId ASC` + `createdAt DESC` (para filtro por categoría paginado).
- Desplegar índices con `firebase deploy --only firestore:indexes`.

**Archivos resultantes:**
- `firestore.indexes.json`

**Criterio de done:** las queries de Firestore no generan errores de índice faltante en la consola.

---

### ⬜ T-6.5 — Configurar `firebase.json` para Firebase Hosting (SPA)

**Capa:** infraestructura  
**Trazabilidad:** —  
**Depende de:** T-0.1

**Qué hacer:**
- Asegurar que `firebase.json` tenga la configuración de hosting con el redirect SPA:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

**Archivos modificados:**
- `firebase.json`

**Criterio de done:** rutas como `/perfil` o `/admin` no dan 404 al refrescar la página en el hosting.

---

### ⬜ T-6.6 — Build y deploy a Firebase Hosting

**Capa:** infraestructura  
**Trazabilidad:** —  
**Depende de:** T-6.1, T-6.2, T-6.3, T-6.4, T-6.5

**Qué hacer:**
- Ejecutar `npm run build` → genera la carpeta `dist/`.
- Ejecutar `firebase deploy --only hosting` → despliega la app.
- Verificar que la URL de Firebase Hosting carga la app correctamente.
- Verificar que el login, registro y navegación funcionan en producción.

**Criterio de done:** la app está accesible en la URL de Firebase Hosting y todas las rutas funcionan correctamente.

---

## Tablero de progreso

### Iteración 0 — Fundación
| Tarea | Estado |
|-------|--------|
| T-0.1 Inicializar Vite + React + TS | ✅ |
| T-0.2 Instalar dependencias | ✅ |
| T-0.3 Crear estructura de carpetas | ✅ |
| T-0.4 Configurar Firebase | ✅ |
| T-0.5 Definir enums | ✅ |
| T-0.6 Configurar React Router + placeholders | ✅ |

### Iteración 1 — Dominio
| Tarea | Estado |
|-------|--------|
| T-1.1 Entidad `Libro` | ✅ |
| T-1.2 `Usuario`, `Cliente`, `Administrador` | ✅ |
| T-1.3 `ProgresoLectura` + transiciones | ✅ |
| T-1.4 Value object `Categoria` | ✅ |
| T-1.5 Test: validación de mail | ✅ |
| T-1.6 Test: validación de contraseña | ✅ |
| T-1.7 Test: transiciones válidas | ✅ |
| T-1.8 Test: transiciones inválidas | ✅ |
| T-1.9 Test: permisos por rol | ✅ |

### Iteración 2 — Autenticación
| Tarea | Estado |
|-------|--------|
| T-2.1 `UsuarioRepository` | ✅ |
| T-2.2 Caso de uso `registrarCliente` | ✅ |
| T-2.3 Caso de uso `iniciarSesion` | ✅ |
| T-2.4 Hook `useAuth` | ✅ |
| T-2.5 `LoginPage` | ✅ |
| T-2.6 `RegisterPage` | ✅ |
| T-2.7 `ProtectedRoute` | ✅ |

### Iteración 3 — ABM Libros
| Tarea | Estado |
|-------|--------|
| T-3.1 `CategoriaRepository` | ✅ |
| T-3.2 Casos de uso categorías | ✅ |
| T-3.3 `LibroRepository` | ✅ |
| T-3.4 Caso de uso `darDeAltaLibro` | ✅ |
| T-3.5 Caso de uso `modificarLibro` | ✅ |
| T-3.6 Caso de uso `eliminarLibro` | ✅ |
| T-3.7 `LibroFormPage` | ✅ |
| T-3.8 `LibroListPage` | ✅ |
| T-3.9 `AdminHomePage` | ✅ |

### Iteración 4 — Seguimiento de lectura
| Tarea | Estado |
|-------|--------|
| T-4.1 `ProgresoLecturaRepository` | ✅ |
| T-4.2 Caso de uso `marcarEstadoLectura` | ✅ |
| T-4.3 Caso de uso `listarLibrosEnLectura` | ✅ |
| T-4.4 `ClienteHomePage` | ✅ |
| T-4.5 `LibroCard` + `EstadoLecturaSelector` | ✅ |
| T-4.6 Hook `useLibros` | ✅ |

### Iteración 5 — Catálogo y perfil
| Tarea | Estado |
|-------|--------|
| T-5.1 Caso de uso `listarCatalogo` | ✅ |
| T-5.2 Caso de uso `listarLibrosLeidos` | ✅ |
| T-5.3 `CatalogoPage` | ✅ |
| T-5.4 `CatalogoFiltros` | ✅ |
| T-5.5 `PerfilPage` | ✅ |
| T-5.6 Libro eliminado en historial | ✅ |

### Iteración 6 — Seguridad y deploy
| Tarea | Estado |
|-------|--------|
| T-6.1 Reglas Firestore: libros y categorías | ✅ |
| T-6.2 Reglas Firestore: readingProgress | ✅ |
| T-6.3 Reglas Firestore: users | ✅ |
| T-6.4 Índices Firestore | ✅ |
| T-6.5 firebase.json para SPA | ✅ |
| T-6.6 Build y deploy | ✅ |

---

*Total: **40 tareas** — 6 iteraciones — MVP cubre las primeras 5 iteraciones (It-0 a It-4).*
