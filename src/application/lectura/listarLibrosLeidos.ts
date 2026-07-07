// T-5.2 | US-09, RF-4.2 | aplicación
// AMB-03: si el libro fue eliminado del catálogo, libro = null (no rompe el historial)
import { ProgresoLecturaRepository } from '../../infrastructure/ProgresoLecturaRepository.ts';
import { LibroRepository } from '../../infrastructure/LibroRepository.ts';
import { EstadoLectura } from '../../domain/EstadoLectura.ts';
import { type Libro } from '../../domain/Libro.ts';

export interface LibroLeido {
  libro: Libro | null;  // null si el libro fue eliminado del catálogo (AMB-03)
  libroId: string;
}

export async function listarLibrosLeidos(uid: string): Promise<LibroLeido[]> {
  const progresos = await ProgresoLecturaRepository.listarPorEstado(uid, EstadoLectura.LEIDO);
  const resultados: LibroLeido[] = [];

  await Promise.all(
    progresos.map(async (p) => {
      const libro = await LibroRepository.obtenerPorId(p.libroId);
      resultados.push({ libro, libroId: p.libroId });
    }),
  );

  return resultados;
}
