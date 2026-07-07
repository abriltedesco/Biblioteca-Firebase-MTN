// T-3.6 | US-03, AMB-03 | aplicación
// AMB-03: al eliminar un libro, el historial de readingProgress de los clientes se conserva.
// Solo se borra el documento del libro en la colección 'libros'.
import { LibroRepository } from '../../infrastructure/LibroRepository.ts';

export async function eliminarLibro(id: string): Promise<void> {
  await LibroRepository.eliminar(id);
}
