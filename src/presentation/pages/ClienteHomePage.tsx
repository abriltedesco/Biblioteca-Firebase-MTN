// T-4.4 | US-06 | presentación
// ClienteHomePage vive en "/lecturas" — muestra libros en curso y sin empezar
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { useLibros } from '../hooks/useLibros.ts';
import { LibroCard } from '../components/LibroCard.tsx';
import { UserAvatar } from '../components/UserAvatar.tsx';
import { listarCategorias } from '../../application/categorias/listarCategorias.ts';
import { useState, useEffect } from 'react';
import type { Categoria } from '../../domain/Categoria.ts';

export function ClienteHomePage() {
  const { usuario, rol } = useAuth();
  const { leyendo, noLeidos, cargando } = useLibros();
  const location = useLocation();
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => { listarCategorias().then(setCategorias); }, []);

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
          <span className="typewriter">
            {usuario?.nombre ? `Hola, ${usuario.nombre}` : 'Tus lecturas'}
          </span>
        </h1>

        {cargando && <p className="loading-text">Cargando tus libros...</p>}

        {!cargando && (
          <>
            {/* En curso */}
            <section className="seccion-lectura">
              <h2 className="section-title">En curso</h2>
              {leyendo.length === 0
                ? (
                  <p className="section-empty">
                    No tenés libros en curso.{' '}
                    <Link to="/">Explorá el catálogo</Link>.
                  </p>
                )
                : (
                  <div className="libros-grid">
                    {leyendo.map(({ libro, estado, libroId }) => (
                      <LibroCard
                        key={libroId}
                        libro={libro}
                        estado={estado}
                        uid={usuario!.uid}
                        categorias={categorias}
                      />
                    ))}
                  </div>
                )}
            </section>

            {/* Sin empezar */}
            <section className="seccion-lectura">
              <h2 className="section-title">Sin empezar</h2>
              {noLeidos.length === 0
                ? (
                  <p className="section-empty">
                    No tenés libros pendientes.{' '}
                    <Link to="/">Agregá uno desde el catálogo</Link>.
                  </p>
                )
                : (
                  <div className="libros-grid">
                    {noLeidos.map(({ libro, estado, libroId }) => (
                      <LibroCard
                        key={libroId}
                        libro={libro}
                        estado={estado}
                        uid={usuario!.uid}
                        categorias={categorias}
                      />
                    ))}
                  </div>
                )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

