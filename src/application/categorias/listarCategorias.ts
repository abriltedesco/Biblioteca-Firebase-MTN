// T-3.2 | RF-5.2 | aplicación
import { Categoria } from '../../domain/Categoria.ts';
import { CategoriaRepository } from '../../infrastructure/CategoriaRepository.ts';

export async function crearCategoria(nombre: string): Promise<string> {
  // Valida que el nombre no sea vacío usando el constructor del value object
  new Categoria('_', nombre);
  return CategoriaRepository.crear(nombre);
}

export async function listarCategorias(): Promise<Categoria[]> {
  return CategoriaRepository.listar();
}
