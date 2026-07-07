// T-3.4 | US-01, AMB-06 | aplicación
import { Libro } from '../../domain/Libro.ts';
import { LibroRepository } from '../../infrastructure/LibroRepository.ts';

interface DatosLibro {
  titulo: string;
  autor: string;
  categoriaId: string;
  cantidadPaginas: number;
  contenido: string;
}

export async function darDeAltaLibro(datos: DatosLibro): Promise<string> {
  // El constructor de Libro valida todos los campos incluyendo el límite de 500k chars (AMB-06)
  const libro = new Libro('_', datos.titulo, datos.autor, datos.categoriaId, datos.cantidadPaginas, datos.contenido);
  return LibroRepository.crear({
    titulo:          libro.titulo,
    autor:           libro.autor,
    categoriaId:     libro.categoriaId,
    cantidadPaginas: libro.cantidadPaginas,
    contenido:       libro.contenido,
  });
}
