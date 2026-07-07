// T-4.3 | US-06, RF-3.1 | aplicación
import { ProgresoLecturaRepository } from '../../infrastructure/ProgresoLecturaRepository.ts';
import { LibroRepository } from '../../infrastructure/LibroRepository.ts';
import { type Libro } from '../../domain/Libro.ts';
import { type EstadoLectura } from '../../domain/EstadoLectura.ts';

export interface LibroConEstado {
  libro: Libro;
  estado: EstadoLectura;
  libroId: string;
}

export async function listarLibrosEnLectura(uid: string): Promise<LibroConEstado[]> {
  const progresos = await ProgresoLecturaRepository.listarEnLectura(uid);
  const resultados: LibroConEstado[] = [];

  await Promise.all(
    progresos.map(async (p) => {
      const libro = await LibroRepository.obtenerPorId(p.libroId);
      if (libro) {
        resultados.push({ libro, estado: p.estado, libroId: p.libroId });
      }
    }),
  );

  return resultados;
}
