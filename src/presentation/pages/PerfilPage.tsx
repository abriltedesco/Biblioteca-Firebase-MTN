// T-5.5, T-5.6 | US-09, RF-4.1→4.3, AMB-03 | presentación
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { listarLibrosLeidos } from '../../application/lectura/listarLibrosLeidos.ts';
import { listarCategorias } from '../../application/categorias/listarCategorias.ts';
import { LibroCard } from '../components/LibroCard.tsx';
import { UserAvatar } from '../components/UserAvatar.tsx';
import { EstadoLectura } from '../../domain/EstadoLectura.ts';
import type { LibroLeido } from '../../application/lectura/listarLibrosLeidos.ts';
import type { Categoria } from '../../domain/Categoria.ts';

export function PerfilPage() {
  const { usuario, rol } = useAuth();
  const location = useLocation();
  const [leidos, setLeidos] = useState<LibroLeido[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario) return;
    Promise.all([
      listarLibrosLeidos(usuario.uid),
      listarCategorias(),
    ]).then(([leidosData, catsData]) => {
      setLeidos(leidosData);
      setCategorias(catsData);
      setCargando(false);
    });
  }, [usuario]);

  return (
    <div className="app-layout">
      <header className="app-header">
        <Link to="/" className="app-brand">Biblioteca MTN</Link>
        <nav className="app-nav">
          <Link
            to="/lecturas"
            className={location.pathname === '/lecturas' ? 'active' : ''}
          >
            Tus lecturas
          </Link>
          <UserAvatar usuario={usuario} rol={rol ?? undefined} />
        </nav>
      </header>

      <main className="app-main">
        <h1 className="page-title">
          <span className="typewriter">Mi perfil</span>
        </h1>

        {/* Datos personales (RF-4.3) */}
        <section className="perfil-datos">
          <h2 className="section-title">Datos personales</h2>
          <div className="perfil-card">
            <div className="perfil-row">
              <span className="perfil-label">Nombre</span>
              <span className="perfil-valor">{usuario?.nombre} {usuario?.apellido}</span>
            </div>
            <div className="perfil-row">
              <span className="perfil-label">Correo</span>
              <span className="perfil-valor">{usuario?.mail}</span>
            </div>
            <div className="perfil-row">
              <span className="perfil-label">Teléfono</span>
              <span className="perfil-valor">{usuario?.telefono}</span>
            </div>
          </div>
        </section>

        {/* Historial de leídos (RF-4.2) */}
        <section className="seccion-lectura">
          <h2 className="section-title">Libros leídos</h2>

          {cargando && <p className="loading-text">Cargando historial...</p>}

          {!cargando && leidos.length === 0 && (
            <p className="section-empty">
              Todavía no marcaste ningún libro como leído.{' '}
              <Link to="/lecturas">Explorá tu lista</Link>.
            </p>
          )}

          {!cargando && leidos.length > 0 && (
            <div className="libros-grid">
              {leidos.map(({ libro, libroId }) =>
                libro ? (
                  <LibroCard
                    key={libroId}
                    libro={libro}
                    estado={EstadoLectura.LEIDO}
                    uid={usuario!.uid}
                    categorias={categorias}
                  />
                ) : (
                  // AMB-03: libro eliminado del catálogo
                  <LibroCard
                    key={libroId}
                    libro={{ id: libroId, titulo: '', autor: '', categoriaIds: [], cantidadPaginas: 0, contenido: '', createdAt: new Date(), updatedAt: new Date() }}
                    estado={EstadoLectura.LEIDO}
                    uid={usuario!.uid}
                    eliminado
                  />
                )
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
