// T-5.3 | US-10, RF-5.1, RF-5.2, RF-5.3 | presentación
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LibroRepository } from '../../infrastructure/LibroRepository.ts';
import { listarCategorias } from '../../application/categorias/listarCategorias.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { LibroCard } from '../components/LibroCard.tsx';
import { EstadoLectura } from '../../domain/EstadoLectura.ts';
import { ProgresoLecturaRepository } from '../../infrastructure/ProgresoLecturaRepository.ts';
import type { Libro } from '../../domain/Libro.ts';
import type { Categoria } from '../../domain/Categoria.ts';

export function CatalogoPage() {
  const { usuario } = useAuth();
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

  // Cargar el estado de lectura del usuario para cada libro
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

  // Filtrado local por categoría y búsqueda (RF-5.2, RF-5.3)
  const librosFiltrados = libros.filter(l => {
    const matchCategoria = !filtroCategoria || l.categoriaId === filtroCategoria;
    const termino = busqueda.toLowerCase();
    const matchBusqueda = !busqueda
      || l.titulo.toLowerCase().includes(termino)
      || l.autor.toLowerCase().includes(termino);
    return matchCategoria && matchBusqueda;
  });

  function getNombreCategoria(id: string) {
    return categorias.find(c => c.id === id)?.nombre ?? id;
  }

  return (
    <div className="cliente-layout">
      <header className="cliente-header">
        <Link to="/" className="cliente-brand">📚 Biblioteca MTN</Link>
        <nav className="cliente-nav">
          <Link to="/">Inicio</Link>
          <Link to="/perfil">Mi perfil</Link>
        </nav>
      </header>

      <main className="cliente-main">
        <h2 className="cliente-welcome">Catálogo</h2>

        {/* Filtros (T-5.4) */}
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
        </div>

        {cargando && <p className="loading-text">Cargando catálogo...</p>}

        {!cargando && librosFiltrados.length === 0 && (
          <div className="empty-state">
            {libros.length === 0
              ? <p>No hay libros en el catálogo todavía.</p>
              : <p>No se encontraron libros con esos filtros.</p>
            }
          </div>
        )}

        {!cargando && librosFiltrados.length > 0 && (
          <div className="libros-grid">
            {librosFiltrados.map(libro => {
              const estado = progresos[libro.id] ?? EstadoLectura.NO_LEIDO;
              return (
                <div key={libro.id} className="catalogo-libro-wrapper">
                  <LibroCard libro={libro} estado={estado} uid={usuario!.uid} />
                  <p className="libro-categoria">{getNombreCategoria(libro.categoriaId)}</p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
