// T-1.4 | RF-1.4, AMB-05
// Categoria es un value object dinámico (no enum): los valores vienen de Firestore.
export class Categoria {
  id: string;
  nombre: string;

  constructor(id: string, nombre: string) {
    if (!nombre.trim()) {
      throw new Error('El nombre de la categoría no puede estar vacío.');
    }
    this.id = id;
    this.nombre = nombre;
  }
}
