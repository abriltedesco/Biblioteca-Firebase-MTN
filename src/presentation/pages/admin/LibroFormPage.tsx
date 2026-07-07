// T-3.7 | US-01, US-02 | presentación — multi-categoría
import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { darDeAltaLibro } from '../../../application/libros/darDeAltaLibro.ts';
import { modificarLibro } from '../../../application/libros/modificarLibro.ts';
import { listarCategorias, crearCategoria } from '../../../application/categorias/listarCategorias.ts';
import { LibroRepository } from '../../../infrastructure/LibroRepository.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { UserAvatar } from '../../components/UserAvatar.tsx';
import type { Categoria } from '../../../domain/Categoria.ts';

interface FormState {
  titulo: string;
  autor: string;
  categoriaIds: string[];
  cantidadPaginas: string;
  contenido: string;
}

const FORM_VACIO: FormState = {
  titulo: '', autor: '', categoriaIds: [], cantidadPaginas: '', contenido: '',
};

export function LibroFormPage() {
  const { id } = useParams<{ id: string }>();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();
  const { usuario, rol } = useAuth();

  const [form, setForm] = useState<FormState>(FORM_VACIO);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(esEdicion);

  useEffect(() => {
    listarCategorias().then(setCategorias);
    if (esEdicion && id) {
      LibroRepository.obtenerPorId(id).then(libro => {
        if (libro) {
          setForm({
            titulo: libro.titulo,
            autor: libro.autor,
            categoriaIds: libro.categoriaIds,
            cantidadPaginas: String(libro.cantidadPaginas),
            contenido: libro.contenido,
          });
        }
        setCargandoDatos(false);
      });
    }
  }, [id, esEdicion]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleCategoria(catId: string) {
    setForm(prev => ({
      ...prev,
      categoriaIds: prev.categoriaIds.includes(catId)
        ? prev.categoriaIds.filter(id => id !== catId)
        : [...prev.categoriaIds, catId],
    }));
  }

  async function handleAgregarCategoria() {
    if (!nuevaCategoria.trim()) return;
    try {
      const catId = await crearCategoria(nuevaCategoria.trim());
      const nuevasCats = await listarCategorias();
      setCategorias(nuevasCats);
      setForm(prev => ({ ...prev, categoriaIds: [...prev.categoriaIds, catId] }));
      setNuevaCategoria('');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (form.categoriaIds.length === 0) {
      setError('Seleccioná al menos una categoría.');
      return;
    }
    setCargando(true);
    try {
      const paginas = parseInt(form.cantidadPaginas, 10);
      if (esEdicion && id) {
        await modificarLibro(id, {
          titulo:          form.titulo,
          autor:           form.autor,
          categoriaIds:    form.categoriaIds,
          cantidadPaginas: paginas,
          contenido:       form.contenido,
        });
      } else {
        await darDeAltaLibro({
          titulo:          form.titulo,
          autor:           form.autor,
          categoriaIds:    form.categoriaIds,
          cantidadPaginas: paginas,
          contenido:       form.contenido,
        });
      }
      navigate('/admin');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }

  if (cargandoDatos) return <div className="loading">Cargando...</div>;

  return (
    <div className="app-layout">
      <header className="app-header">
        <Link to="/admin" className="app-brand">Biblioteca MTN</Link>
        <nav className="app-nav">
          <UserAvatar usuario={usuario} rol={rol ?? undefined} />
        </nav>
      </header>

      <main className="app-main">
        <h1 className="page-title">
          <span className="typewriter">
            {esEdicion ? 'Editar libro' : 'Nuevo libro'}
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="libro-form">
          <div className="form-group">
            <label>Título *</label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              placeholder="El nombre del libro"
            />
          </div>

          <div className="form-group">
            <label>Autor *</label>
            <input
              name="autor"
              value={form.autor}
              onChange={handleChange}
              required
              placeholder="Nombre del autor"
            />
          </div>

          {/* Categorías: multi-selección */}
          <div className="form-group">
            <label>
              Categorías *{' '}
              {form.categoriaIds.length > 0 && (
                <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                  ({form.categoriaIds.length} seleccionada{form.categoriaIds.length > 1 ? 's' : ''})
                </span>
              )}
            </label>
            <div className="cat-check-grid">
              {categorias.map(c => (
                <label
                  key={c.id}
                  className={`cat-check-label${form.categoriaIds.includes(c.id) ? ' checked' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={form.categoriaIds.includes(c.id)}
                    onChange={() => toggleCategoria(c.id)}
                  />
                  {c.nombre}
                </label>
              ))}
            </div>
          </div>

          {/* Crear nueva categoría inline */}
          <div className="form-group form-row-inline">
            <input
              value={nuevaCategoria}
              onChange={e => setNuevaCategoria(e.target.value)}
              placeholder="O escribí una nueva categoría..."
            />
            <button type="button" className="btn-outline btn-sm" onClick={handleAgregarCategoria}>
              Agregar
            </button>
          </div>

          <div className="form-group">
            <label>Cantidad de páginas *</label>
            <input
              name="cantidadPaginas"
              type="number"
              min={1}
              value={form.cantidadPaginas}
              onChange={handleChange}
              required
              placeholder="300"
            />
          </div>

          <div className="form-group">
            <label>
              Contenido *{' '}
              <span className="char-count">
                {form.contenido.length.toLocaleString()} / 500.000 caracteres
              </span>
            </label>
            <textarea
              name="contenido"
              value={form.contenido}
              onChange={handleChange}
              required
              rows={12}
              placeholder="Pegá aquí el texto completo del libro..."
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <Link to="/admin" className="btn-outline">Cancelar</Link>
            <button type="submit" className="btn-primary" disabled={cargando}>
              {cargando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear libro'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

