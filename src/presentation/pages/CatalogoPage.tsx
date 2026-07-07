// T-5.3 | US-10, RF-5.1, RF-5.2, RF-5.3 | presentación
// CatalogoPage es la HOME del cliente: "/" 
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LibroRepository } from '../../infrastructure/LibroRepository.ts';
import { listarCategorias } from '../../application/categorias/listarCategorias.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { Typewriter } from '../components/Typewriter.tsx';
import { UserAvatar } from '../components/UserAvatar.tsx';
import { LibroCard } from '../components/LibroCard.tsx';
import { EstadoLectura } from '../../domain/EstadoLectura.ts';
import { ProgresoLecturaRepository } from '../../infrastructure/ProgresoLecturaRepository.ts';
import type { Libro } from '../../domain/Libro.ts';
import type { Categoria } from '../../domain/Categoria.ts';

export function CatalogoPage() {
  const { usuario, rol } = useAuth();
  const location = useLocation();
  const [libros, setLibros] = useState<Libro[]>([]);
  const [progresos, setProgresos] = useState<Record<string, EstadoLectura>>({});
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      LibroRepository.listarTodos(),
      listarCategorias(),
    ]).then(([librosData, categoriasData]) => {
      setLibros(librosData);
      setCategorias(categoriasData);
      setCargando(false);
    });
  }, []);

  useEffect(() => {
    if (!usuario || libros.length === 0) return;
    const cargarProgresos = async () => {
      const entries = await Promise.all(
        libros.map(async (l) => {
          const p = await ProgresoLecturaRepository.obtener(usuario.uid, l.id);
          return [l.id, p?.estado ?? EstadoLectura.NO_LEIDO] as [string, EstadoLectura];
        }),
      );
      setProgresos(Object.fromEntries(entries));
    };
    cargarProgresos();
  }, [usuario, libros]);

  // Filtro: un libro aparece si tiene AL MENOS UNA de sus categorías coincidiendo
  const librosFiltrados = libros.filter(l => {
    const matchCategoria = !filtroCategoria || l.categoriaIds.includes(filtroCategoria);
    const termino = busqueda.toLowerCase();
    const matchBusqueda = !busqueda
      || l.titulo.toLowerCase().includes(termino)
      || l.autor.toLowerCase().includes(termino);
    return matchCategoria && matchBusqueda;
  });

  return (
    <div className="app-layout">
      <header className="app-header">
        <Link to="/" className="app-brand">
          Biblioteca MTN
        </Link>
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
          <Typewriter text="Catálogo" />
        </h1>

        {/* Filtros */}
        <div className="catalogo-filtros">
          <input
            className="catalogo-busqueda"
            type="search"
            placeholder="Buscar por título o autor..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <select
            className="catalogo-select"
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          {!cargando && (
            <span className="catalogo-count">
              {librosFiltrados.length} {librosFiltrados.length === 1 ? 'título' : 'títulos'}
            </span>
          )}
        </div>

        {cargando && <p className="loading-text">Cargando catálogo...</p>}

        {!cargando && librosFiltrados.length === 0 && (
          <div className="empty-state">
            {libros.length === 0
              ? <p>El catálogo aún no tiene títulos disponibles.</p>
              : <p>No se encontraron títulos con esos filtros.</p>
            }
          </div>
        )}

        {!cargando && librosFiltrados.length > 0 && (
          <div className="libros-grid">
            {librosFiltrados.map(libro => {
              const estado = progresos[libro.id] ?? EstadoLectura.NO_LEIDO;
              return (
                <LibroCard
                  key={libro.id}
                  libro={libro}
                  estado={estado}
                  uid={usuario!.uid}
                  categorias={categorias}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}



