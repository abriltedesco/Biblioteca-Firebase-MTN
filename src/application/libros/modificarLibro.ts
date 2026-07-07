// T-3.5 | US-02 | aplicación
import { LibroRepository } from '../../infrastructure/LibroRepository.ts';
import { Libro } from '../../domain/Libro.ts';

type DatosActualizables = Partial<Omit<Libro, 'id' | 'createdAt' | 'updatedAt'>>;

export async function modificarLibro(id: string, datos: DatosActualizables): Promise<void> {
  if (datos.contenido !== undefined && datos.contenido.length > Libro.MAX_CONTENIDO_CHARS) {
    throw new Error(`El contenido no puede superar ${Libro.MAX_CONTENIDO_CHARS.toLocaleString()} caracteres.`);
  }
  if (datos.titulo !== undefined && !datos.titulo.trim()) {
    throw new Error('El título no puede estar vacío.');
  }
  if (datos.autor !== undefined && !datos.autor.trim()) {
    throw new Error('El autor no puede estar vacío.');
  }
  await LibroRepository.actualizar(id, datos);
}
