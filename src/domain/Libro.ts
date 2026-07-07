// T-1.1 | RF-1.4, AMB-06
// Libro NO tiene campo 'estado': el estado de lectura pertenece a ProgresoLectura (AMB-01).
export class Libro {
  static readonly MAX_CONTENIDO_CHARS = 500_000;

  id: string;
  titulo: string;
  autor: string;
  categoriaId: string;
  cantidadPaginas: number;
  contenido: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    titulo: string,
    autor: string,
    categoriaId: string,
    cantidadPaginas: number,
    contenido: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    if (!titulo.trim())       throw new Error('El título no puede estar vacío.');
    if (!autor.trim())        throw new Error('El autor no puede estar vacío.');
    if (!categoriaId.trim())  throw new Error('La categoría es obligatoria.');
    if (!Number.isInteger(cantidadPaginas) || cantidadPaginas <= 0) {
      throw new Error('La cantidad de páginas debe ser un entero positivo.');
    }
    if (!contenido.trim())    throw new Error('El contenido no puede estar vacío.');
    if (contenido.length > Libro.MAX_CONTENIDO_CHARS) {
      throw new Error(
        `El contenido no puede superar ${Libro.MAX_CONTENIDO_CHARS.toLocaleString()} caracteres. ` +
        `Actual: ${contenido.length.toLocaleString()}.`,
      );
    }

    this.id            = id;
    this.titulo        = titulo;
    this.autor         = autor;
    this.categoriaId   = categoriaId;
    this.cantidadPaginas = cantidadPaginas;
    this.contenido     = contenido;
    this.createdAt     = createdAt;
    this.updatedAt     = updatedAt;
  }
}
