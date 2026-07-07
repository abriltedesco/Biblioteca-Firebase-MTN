// T-4.5 | US-07, US-08 | presentación
import { type Libro } from '../../domain/Libro.ts';
import { type EstadoLectura } from '../../domain/EstadoLectura.ts';
import { EstadoLecturaSelector } from './EstadoLecturaSelector.tsx';

interface Props {
  libro: Libro;
  estado: EstadoLectura;
  uid: string;
  /** Si se proporciona, se muestra como libro eliminado (AMB-03) */
  eliminado?: boolean;
}

export function LibroCard({ libro, estado, uid, eliminado = false }: Props) {
  if (eliminado) {
    return (
      <div className="libro-card libro-card-eliminado">
        <p className="libro-no-disponible">📕 Libro no disponible</p>
        <p className="libro-eliminado-hint">Este libro fue retirado del catálogo.</p>
      </div>
    );
  }

  return (
    <div className="libro-card">
      <div className="libro-card-info">
        <h3 className="libro-titulo">{libro.titulo}</h3>
        <p className="libro-autor">{libro.autor}</p>
        <p className="libro-paginas">{libro.cantidadPaginas} páginas</p>
      </div>
      <EstadoLecturaSelector uid={uid} libroId={libro.id} estadoActual={estado} />
    </div>
  );
}
