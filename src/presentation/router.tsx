// T-0.6 | RF-2.5 | presentación
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { Rol } from '../domain/Rol.ts';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { ClienteHomePage } from './pages/ClienteHomePage.tsx';
import { CatalogoPage } from './pages/CatalogoPage.tsx';
import { PerfilPage } from './pages/PerfilPage.tsx';
import { AdminHomePage } from './pages/admin/AdminHomePage.tsx';
import { LibroListPage } from './pages/admin/LibroListPage.tsx';
import { LibroFormPage } from './pages/admin/LibroFormPage.tsx';

const router = createBrowserRouter([
  { path: '/login',    element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: <ProtectedRoute rolRequerido={Rol.CLIENTE}><ClienteHomePage /></ProtectedRoute>,
  },
  {
    path: '/catalogo',
    element: <ProtectedRoute rolRequerido={Rol.CLIENTE}><CatalogoPage /></ProtectedRoute>,
  },
  {
    path: '/perfil',
    element: <ProtectedRoute rolRequerido={Rol.CLIENTE}><PerfilPage /></ProtectedRoute>,
  },
  {
    path: '/admin',
    element: <ProtectedRoute rolRequerido={Rol.ADMINISTRADOR}><AdminHomePage /></ProtectedRoute>,
  },
  {
    path: '/admin/libros',
    element: <ProtectedRoute rolRequerido={Rol.ADMINISTRADOR}><LibroListPage /></ProtectedRoute>,
  },
  {
    path: '/admin/libros/nuevo',
    element: <ProtectedRoute rolRequerido={Rol.ADMINISTRADOR}><LibroFormPage /></ProtectedRoute>,
  },
  {
    path: '/admin/libros/:id/editar',
    element: <ProtectedRoute rolRequerido={Rol.ADMINISTRADOR}><LibroFormPage /></ProtectedRoute>,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
