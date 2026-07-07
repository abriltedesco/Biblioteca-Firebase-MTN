// T-4.5 | US-07, US-08 | presentación
import { type Libro } from '../../domain/Libro.ts';
import { type EstadoLectura } from '../../domain/EstadoLectura.ts';
import { type Categoria } from '../../domain/Categoria.ts';
import { EstadoLecturaSelector } from './EstadoLecturaSelector.tsx';

interface Props {
  libro: Libro;
  estado?: EstadoLectura;
  uid?: string;
  categorias?: Categoria[];
  /** AMB-03: libro eliminado del catálogo */
  eliminado?: boolean;
  /** Modo admin: muestra botones de editar / eliminar */
  modoAdmin?: boolean;
  onEditar?: () => void;
  onEliminar?: () => void;
  eliminando?: boolean;
}

export function LibroCard({
  libro,
  estado,
  uid,
  categorias = [],
  eliminado = false,
  modoAdmin = false,
  onEditar,
  onEliminar,
  eliminando = false,
}: Props) {
  if (eliminado) {
    return (
      <div className="libro-card libro-card-eliminado">
        <p className="libro-no-disponible">Libro no disponible</p>
        <p className="libro-eliminado-hint">Este título fue retirado del catálogo.</p>
      </div>
    );
  }

  // Resolver nombres de categorías
  const nombresCategorias = libro.categoriaIds
    .map(id => categorias.find(c => c.id === id)?.nombre)
    .filter(Boolean) as string[];

  return (
    <div className="libro-card">
      <div className="libro-card-info">
        <h3 className="libro-titulo">{libro.titulo}</h3>
        <p className="libro-autor">{libro.autor}</p>
        {nombresCategorias.length > 0 && (
          <div className="libro-categorias">
            {nombresCategorias.map(nombre => (
              <span key={nombre} className="libro-cat-tag">{nombre}</span>
            ))}
          </div>
        )}
        <p className="libro-paginas">{libro.cantidadPaginas} páginas</p>
      </div>

      {modoAdmin ? (
        <div className="libro-card-admin-actions">
          <button className="btn-ghost btn-sm" onClick={onEditar}>
            Editar
          </button>
          <button
            className="btn-danger btn-sm"
            disabled={eliminando}
            onClick={onEliminar}
          >
            {eliminando ? '...' : 'Eliminar'}
          </button>
        </div>
      ) : (
        estado !== undefined && uid && (
          <EstadoLecturaSelector uid={uid} libroId={libro.id} estadoActual={estado} />
        )
      )}
    </div>
  );
}

