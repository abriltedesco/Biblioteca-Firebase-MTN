// T-0.6 | RF-2.5 | presentación
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { Rol } from '../domain/Rol.ts';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { ClienteHomePage } from './pages/ClienteHomePage.tsx';
import { CatalogoPage } from './pages/CatalogoPage.tsx';
import { PerfilPage } from './pages/PerfilPage.tsx';
import { AdminCatalogoPage } from './pages/admin/AdminCatalogoPage.tsx';
import { LibroFormPage } from './pages/admin/LibroFormPage.tsx';

const router = createBrowserRouter([
  { path: '/login',    element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // ── Cliente ─────────────────────────────────────
  // Home del cliente = catálogo
  {
    path: '/',
    element: <ProtectedRoute rolRequerido={Rol.CLIENTE}><CatalogoPage /></ProtectedRoute>,
  },
  // Mis lecturas (en curso + sin empezar)
  {
    path: '/lecturas',
    element: <ProtectedRoute rolRequerido={Rol.CLIENTE}><ClienteHomePage /></ProtectedRoute>,
  },
  {
    path: '/perfil',
    element: <ProtectedRoute rolRequerido={Rol.CLIENTE}><PerfilPage /></ProtectedRoute>,
  },
  // Ruta legacy → redirige al catálogo
  {
    path: '/catalogo',
    element: <Navigate to="/" replace />,
  },

  // ── Admin ────────────────────────────────────────
  // Home del admin = catálogo con controles de edición
  {
    path: '/admin',
    element: <ProtectedRoute rolRequerido={Rol.ADMINISTRADOR}><AdminCatalogoPage /></ProtectedRoute>,
  },
  {
    path: '/admin/libros/nuevo',
    element: <ProtectedRoute rolRequerido={Rol.ADMINISTRADOR}><LibroFormPage /></ProtectedRoute>,
  },
  {
    path: '/admin/libros/:id/editar',
    element: <ProtectedRoute rolRequerido={Rol.ADMINISTRADOR}><LibroFormPage /></ProtectedRoute>,
  },
  // Ruta legacy → redirige al catálogo admin
  {
    path: '/admin/libros',
    element: <Navigate to="/admin" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

