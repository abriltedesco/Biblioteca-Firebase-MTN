// T-1.1 | RF-1.4, AMB-06
// Libro NO tiene campo 'estado': el estado de lectura pertenece a ProgresoLectura (AMB-01).
// categoriaIds es un array: un libro puede pertenecer a múltiples categorías.
export class Libro {
  static readonly MAX_CONTENIDO_CHARS = 500_000;

  id: string;
  titulo: string;
  autor: string;
  categoriaIds: string[];
  cantidadPaginas: number;
  contenido: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    titulo: string,
    autor: string,
    categoriaIds: string[],
    cantidadPaginas: number,
    contenido: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    if (!titulo.trim())                    throw new Error('El título no puede estar vacío.');
    if (!autor.trim())                     throw new Error('El autor no puede estar vacío.');
    if (!categoriaIds.length)              throw new Error('Debe asignarse al menos una categoría.');
    if (!Number.isInteger(cantidadPaginas) || cantidadPaginas <= 0) {
      throw new Error('La cantidad de páginas debe ser un entero positivo.');
    }
    if (!contenido.trim())                 throw new Error('El contenido no puede estar vacío.');
    if (contenido.length > Libro.MAX_CONTENIDO_CHARS) {
      throw new Error(
        `El contenido no puede superar ${Libro.MAX_CONTENIDO_CHARS.toLocaleString()} caracteres. ` +
        `Actual: ${contenido.length.toLocaleString()}.`,
      );
    }

    this.id              = id;
    this.titulo          = titulo;
    this.autor           = autor;
    this.categoriaIds    = categoriaIds;
    this.cantidadPaginas = cantidadPaginas;
    this.contenido       = contenido;
    this.createdAt       = createdAt;
    this.updatedAt       = updatedAt;
  }
}
