// T-4.2 | US-07, US-08, AMB-02 | aplicación
import { ProgresoLectura } from '../../domain/ProgresoLectura.ts';
import { type EstadoLectura } from '../../domain/EstadoLectura.ts';
import { ProgresoLecturaRepository } from '../../infrastructure/ProgresoLecturaRepository.ts';

// Valida la transición en el dominio y persiste el resultado.
export async function marcarEstadoLectura(
  uid: string,
  libroId: string,
  nuevoEstado: EstadoLectura,
): Promise<void> {
  // Obtener progreso existente o crear uno nuevo con estado inicial NO_LEIDO
  const progreso = (await ProgresoLecturaRepository.obtener(uid, libroId))
    ?? ProgresoLectura.crear(libroId);

  // La lógica de transición vive en el dominio (lanza error si es inválida)
  progreso.avanzarEstado(nuevoEstado);

  await ProgresoLecturaRepository.guardar(uid, progreso);
}
