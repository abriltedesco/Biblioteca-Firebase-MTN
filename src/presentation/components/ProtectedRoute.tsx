// T-2.7 | RNF-3 | presentación
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { type Rol } from '../../domain/Rol.ts';

interface Props {
  children: React.ReactNode;
  rolRequerido?: Rol;
}

export function ProtectedRoute({ children, rolRequerido }: Props) {
  const { usuario, rol, cargando } = useAuth();

  if (cargando) {
    return <div className="loading">Cargando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (rolRequerido && rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
