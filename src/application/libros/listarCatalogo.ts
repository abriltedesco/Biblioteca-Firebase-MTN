// T-3.3 (listar) | RF-5.1 | aplicación
import { LibroRepository, type PaginaLibros } from '../../infrastructure/LibroRepository.ts';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

export async function listarCatalogo(ultimoDoc?: QueryDocumentSnapshot): Promise<PaginaLibros> {
  return LibroRepository.listar(ultimoDoc);
}
