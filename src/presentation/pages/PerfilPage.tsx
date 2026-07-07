// T-5.5, T-5.6 | US-09, RF-4.1→4.3, AMB-03 | presentación
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { listarLibrosLeidos } from '../../application/lectura/listarLibrosLeidos.ts';
import { LibroCard } from '../components/LibroCard.tsx';
import { EstadoLectura } from '../../domain/EstadoLectura.ts';
import type { LibroLeido } from '../../application/lectura/listarLibrosLeidos.ts';

export function PerfilPage() {
  const { usuario } = useAuth();
  const [leidos, setLeidos] = useState<LibroLeido[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario) return;
    listarLibrosLeidos(usuario.uid)
      .then(setLeidos)
      .finally(() => setCargando(false));
  }, [usuario]);

  return (
    <div className="cliente-layout">
      <header className="cliente-header">
        <Link to="/" className="cliente-brand">📚 Biblioteca MTN</Link>
        <nav className="cliente-nav">
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/">Inicio</Link>
        </nav>
      </header>

      <main className="cliente-main">
        <h2 className="cliente-welcome">Mi perfil</h2>

        {/* Datos personales (RF-4.3) */}
        <section className="perfil-datos">
          <h3 className="seccion-titulo">👤 Datos personales</h3>
          <div className="perfil-card">
            <div className="perfil-row">
              <span className="perfil-label">Nombre</span>
              <span>{usuario?.nombre} {usuario?.apellido}</span>
            </div>
            <div className="perfil-row">
              <span className="perfil-label">Correo</span>
              <span>{usuario?.mail}</span>
            </div>
            <div className="perfil-row">
              <span className="perfil-label">Teléfono</span>
              <span>{usuario?.telefono}</span>
            </div>
          </div>
        </section>

        {/* Historial de leídos (RF-4.2) */}
        <section className="seccion-lectura">
          <h3 className="seccion-titulo">✅ Libros leídos</h3>

          {cargando && <p className="loading-text">Cargando historial...</p>}

          {!cargando && leidos.length === 0 && (
            <p className="seccion-vacia">
              Todavía no marcaste ningún libro como leído.{' '}
              <Link to="/">Explorá tu lista</Link>.
            </p>
          )}

          {!cargando && leidos.length > 0 && (
            <div className="libros-grid">
              {leidos.map(({ libro, libroId }) =>
                libro
                  ? (
                    // Libro existe en el catálogo
                    <LibroCard
                      key={libroId}
                      libro={libro}
                      estado={EstadoLectura.LEIDO}
                      uid={usuario!.uid}
                    />
                  )
                  : (
                    // AMB-03: libro eliminado del catálogo — mostrar gracefully (T-5.6)
                    <LibroCard
                      key={libroId}
                      libro={{ id: libroId, titulo: '', autor: '', categoriaId: '', cantidadPaginas: 0, contenido: '', createdAt: new Date(), updatedAt: new Date() }}
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
