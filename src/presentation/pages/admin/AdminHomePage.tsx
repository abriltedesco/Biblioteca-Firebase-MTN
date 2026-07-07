// T-3.9 | US-01→03 | presentación
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../infrastructure/firebase.config.ts';
import { useAuth } from '../../hooks/useAuth.ts';

export function AdminHomePage() {
  const { usuario } = useAuth();

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1 className="admin-brand">📚 Biblioteca MTN</h1>
        <div className="admin-header-right">
          <span className="admin-user">
            {usuario?.nombre} {usuario?.apellido}
          </span>
          <button className="btn-outline" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <main className="admin-main">
        <h2 className="admin-welcome">Panel de administración</h2>
        <p className="admin-subtitle">Gestioná el catálogo de libros de la biblioteca.</p>

        <div className="admin-cards">
          <Link to="/admin/libros" className="admin-card">
            <span className="admin-card-icon">📖</span>
            <h3>Catálogo de libros</h3>
            <p>Ver, editar y eliminar libros del catálogo.</p>
          </Link>
          <Link to="/admin/libros/nuevo" className="admin-card admin-card-accent">
            <span className="admin-card-icon">➕</span>
            <h3>Nuevo libro</h3>
            <p>Agregar un nuevo libro al catálogo.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
