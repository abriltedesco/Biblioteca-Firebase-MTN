// T-3.7 | US-01, US-02 | presentación
import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { darDeAltaLibro } from '../../../application/libros/darDeAltaLibro.ts';
import { modificarLibro } from '../../../application/libros/modificarLibro.ts';
import { listarCategorias, crearCategoria } from '../../../application/categorias/listarCategorias.ts';
import { LibroRepository } from '../../../infrastructure/LibroRepository.ts';
import type { Categoria } from '../../../domain/Categoria.ts';

interface FormState {
  titulo: string;
  autor: string;
  categoriaId: string;
  cantidadPaginas: string;
  contenido: string;
}

const FORM_VACIO: FormState = { titulo: '', autor: '', categoriaId: '', cantidadPaginas: '', contenido: '' };

export function LibroFormPage() {
  const { id } = useParams<{ id: string }>();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();

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
            categoriaId: libro.categoriaId,
            cantidadPaginas: String(libro.cantidadPaginas),
            contenido: libro.contenido,
          });
        }
        setCargandoDatos(false);
      });
    }
  }, [id, esEdicion]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleAgregarCategoria() {
    if (!nuevaCategoria.trim()) return;
    try {
      const catId = await crearCategoria(nuevaCategoria.trim());
      const nuevasCats = await listarCategorias();
      setCategorias(nuevasCats);
      setForm(prev => ({ ...prev, categoriaId: catId }));
      setNuevaCategoria('');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.categoriaId) { setError('Seleccioná una categoría.'); return; }
    setCargando(true);
    try {
      const paginas = parseInt(form.cantidadPaginas, 10);
      if (esEdicion && id) {
        await modificarLibro(id, {
          titulo: form.titulo,
          autor: form.autor,
          categoriaId: form.categoriaId,
          cantidadPaginas: paginas,
          contenido: form.contenido,
        });
      } else {
        await darDeAltaLibro({
          titulo: form.titulo,
          autor: form.autor,
          categoriaId: form.categoriaId,
          cantidadPaginas: paginas,
          contenido: form.contenido,
        });
      }
      navigate('/admin/libros');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }

  if (cargandoDatos) return <div className="loading">Cargando...</div>;

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <Link to="/admin/libros" className="admin-brand">📚 Biblioteca MTN</Link>
      </header>
      <main className="admin-main">
        <h2 className="admin-welcome">{esEdicion ? 'Editar libro' : 'Nuevo libro'}</h2>

        <form onSubmit={handleSubmit} className="libro-form">
          <div className="form-group">
            <label>Título *</label>
            <input name="titulo" value={form.titulo} onChange={handleChange} required placeholder="El nombre del libro" />
          </div>
          <div className="form-group">
            <label>Autor *</label>
            <input name="autor" value={form.autor} onChange={handleChange} required placeholder="Nombre del autor" />
          </div>

          <div className="form-group">
            <label>Categoría *</label>
            <select name="categoriaId" value={form.categoriaId} onChange={handleChange} required>
              <option value="">— Seleccioná una categoría —</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>

          <div className="form-group form-row-inline">
            <input
              value={nuevaCategoria}
              onChange={e => setNuevaCategoria(e.target.value)}
              placeholder="O creá una nueva categoría..."
            />
            <button type="button" className="btn-outline btn-sm" onClick={handleAgregarCategoria}>
              Agregar categoría
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
            <Link to="/admin/libros" className="btn-outline">Cancelar</Link>
            <button type="submit" className="btn-primary" disabled={cargando}>
              {cargando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear libro'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
