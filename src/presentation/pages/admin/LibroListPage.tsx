// T-3.8 | US-02, US-03 | presentación
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LibroRepository } from '../../../infrastructure/LibroRepository.ts';
import { eliminarLibro } from '../../../application/libros/eliminarLibro.ts';
import type { Libro } from '../../../domain/Libro.ts';

export function LibroListPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    LibroRepository.listarTodos()
      .then(setLibros)
      .finally(() => setCargando(false));
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

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <Link to="/admin" className="admin-brand">📚 Biblioteca MTN</Link>
        <Link to="/admin/libros/nuevo" className="btn-primary">+ Nuevo libro</Link>
      </header>

      <main className="admin-main">
        <h2 className="admin-welcome">Catálogo de libros</h2>

        {cargando && <p className="loading-text">Cargando libros...</p>}

        {!cargando && libros.length === 0 && (
          <div className="empty-state">
            <p>No hay libros en el catálogo todavía.</p>
            <Link to="/admin/libros/nuevo" className="btn-primary">Agregar el primer libro</Link>
          </div>
        )}

        {!cargando && libros.length > 0 && (
          <div className="libro-table-wrapper">
            <table className="libro-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Páginas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {libros.map(libro => (
                  <tr key={libro.id}>
                    <td>{libro.titulo}</td>
                    <td>{libro.autor}</td>
                    <td>{libro.cantidadPaginas}</td>
                    <td className="libro-actions">
                      <button
                        className="btn-sm btn-outline"
                        onClick={() => navigate(`/admin/libros/${libro.id}/editar`)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-sm btn-danger"
                        disabled={eliminando === libro.id}
                        onClick={() => handleEliminar(libro.id, libro.titulo)}
                      >
                        {eliminando === libro.id ? '...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
