// Admin home: catálogo completo con opciones de edición y eliminación por libro
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LibroRepository } from '../../../infrastructure/LibroRepository.ts';
import { listarCategorias } from '../../../application/categorias/listarCategorias.ts';
import { eliminarLibro } from '../../../application/libros/eliminarLibro.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { LibroCard } from '../../components/LibroCard.tsx';
import { UserAvatar } from '../../components/UserAvatar.tsx';
import { Typewriter } from '../../components/Typewriter.tsx';
import type { Libro } from '../../../domain/Libro.ts';
import type { Categoria } from '../../../domain/Categoria.ts';

export function AdminCatalogoPage() {
  const { usuario, rol } = useAuth();
  const navigate = useNavigate();
  const [libros, setLibros] = useState<Libro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      LibroRepository.listarTodos(),
      listarCategorias(),
    ]).then(([librosData, catsData]) => {
      setLibros(librosData);
      setCategorias(catsData);
      setCargando(false);
    });
  }, []);

  async function handleEliminar(id: string, titulo: string) {
    if (!confirm(`¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`)) return;
    setEliminando(id);
    try {
      await eliminarLibro(id);
      setLibros(prev => prev.filter(l => l.id !== id));
    } finally {
      setEliminando(null);
    }
  }

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
        <Link to="/admin" className="app-brand">Biblioteca MTN</Link>
        <nav className="app-nav">
          <Link to="/admin/libros/nuevo" className="btn-primary btn-sm">
            + Nuevo libro
          </Link>
          <UserAvatar usuario={usuario} rol={rol ?? undefined} />
        </nav>
      </header>

      <main className="app-main">
        <div className="admin-main-header">
          <h1 className="page-title">
          <Typewriter text="Catálogo" />          </h1>
        </div>

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
            {libros.length === 0 ? (
              <>
                <p>El catálogo está vacío.</p>
                <Link to="/admin/libros/nuevo" className="btn-primary">
                  Agregar el primer libro
                </Link>
              </>
            ) : (
              <p>No se encontraron títulos con esos filtros.</p>
            )}
          </div>
        )}

        {!cargando && librosFiltrados.length > 0 && (
          <div className="libros-grid">
            {librosFiltrados.map(libro => (
              <LibroCard
                key={libro.id}
                libro={libro}
                categorias={categorias}
                modoAdmin
                onEditar={() => navigate(`/admin/libros/${libro.id}/editar`)}
                onEliminar={() => handleEliminar(libro.id, libro.titulo)}
                eliminando={eliminando === libro.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
