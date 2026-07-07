// T-4.4 | US-06 | presentación
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../infrastructure/firebase.config.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { useLibros } from '../hooks/useLibros.ts';
import { LibroCard } from '../components/LibroCard.tsx';

export function ClienteHomePage() {
  const { usuario } = useAuth();
  const { leyendo, noLeidos, cargando } = useLibros();

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="cliente-layout">
      <header className="cliente-header">
        <h1 className="cliente-brand">📚 Biblioteca MTN</h1>
        <nav className="cliente-nav">
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/perfil">Mi perfil</Link>
          <button className="btn-outline btn-sm" onClick={handleLogout}>Salir</button>
        </nav>
      </header>

      <main className="cliente-main">
        <h2 className="cliente-welcome">
          Hola, {usuario?.nombre} 👋
        </h2>

        {cargando && <p className="loading-text">Cargando tus libros...</p>}

        {!cargando && (
          <>
            {/* Sección LEYENDO */}
            <section className="seccion-lectura">
              <h3 className="seccion-titulo">📖 Estoy leyendo</h3>
              {leyendo.length === 0
                ? <p className="seccion-vacia">No tenés libros en curso. ¡Explorá el catálogo!</p>
                : (
                  <div className="libros-grid">
                    {leyendo.map(({ libro, estado, libroId }) => (
                      <LibroCard
                        key={libroId}
                        libro={libro}
                        estado={estado}
                        uid={usuario!.uid}
                      />
                    ))}
                  </div>
                )}
            </section>

            {/* Sección NO_LEIDO */}
            <section className="seccion-lectura">
              <h3 className="seccion-titulo">🔖 Sin empezar</h3>
              {noLeidos.length === 0
                ? <p className="seccion-vacia">No tenés libros pendientes. ¡Agregá uno desde el catálogo!</p>
                : (
                  <div className="libros-grid">
                    {noLeidos.map(({ libro, estado, libroId }) => (
                      <LibroCard
                        key={libroId}
                        libro={libro}
                        estado={estado}
                        uid={usuario!.uid}
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
