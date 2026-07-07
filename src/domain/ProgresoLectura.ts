// T-1.3 | RF-3.4, AMB-02
// El estado de lectura es POR CLIENTE (AMB-01): esta entidad vive en
// users/{uid}/readingProgress/{libroId} en Firestore.
import { EstadoLectura } from './EstadoLectura.ts';

// Transiciones válidas (AMB-02):
//   NO_LEIDO → LEYENDO ✅
//   NO_LEIDO → LEIDO   ✅  (transición directa permitida)
//   LEYENDO  → LEIDO   ✅
//   LEIDO    → *       ❌  (un libro leído no vuelve atrás)
const TRANSICIONES_VALIDAS: Record<EstadoLectura, EstadoLectura[]> = {
  [EstadoLectura.NO_LEIDO]: [EstadoLectura.LEYENDO, EstadoLectura.LEIDO],
  [EstadoLectura.LEYENDO]:  [EstadoLectura.LEIDO],
  [EstadoLectura.LEIDO]:    [],
};

export class ProgresoLectura {
  libroId: string;
  estado: EstadoLectura;
  updatedAt: Date;

  constructor(libroId: string, estado: EstadoLectura, updatedAt: Date = new Date()) {
    this.libroId   = libroId;
    this.estado    = estado;
    this.updatedAt = updatedAt;
  }

  // Crea un ProgresoLectura con estado inicial NO_LEIDO.
  static crear(libroId: string): ProgresoLectura {
    return new ProgresoLectura(libroId, EstadoLectura.NO_LEIDO);
  }

  // Avanza al nuevo estado validando que la transición sea válida.
  avanzarEstado(nuevoEstado: EstadoLectura): void {
    const permitidos = TRANSICIONES_VALIDAS[this.estado];
    if (!permitidos.includes(nuevoEstado)) {
      throw new Error(
        `Transición inválida: no se puede pasar de "${this.estado}" a "${nuevoEstado}".`,
      );
    }
    this.estado    = nuevoEstado;
    this.updatedAt = new Date();
  }
}
