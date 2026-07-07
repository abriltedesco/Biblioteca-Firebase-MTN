// T-3.3 | RF-1.1, RF-1.2, RF-1.3 | infraestructura
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDoc, getDocs, query, orderBy,
  startAfter, limit, serverTimestamp,
  type QueryDocumentSnapshot, type DocumentData,
} from 'firebase/firestore';
import { db } from './firebase.config.ts';
import { Libro } from '../domain/Libro.ts';

const COL = 'libros';
const PAGE_SIZE = 20;

function docToLibro(id: string, data: DocumentData): Libro {
  return new Libro(
    id,
    data.titulo,
    data.autor,
    data.categoriaId,
    data.cantidadPaginas,
    data.contenido,
    new Date(data.createdAt?.toDate?.() ?? data.createdAt),
    new Date(data.updatedAt?.toDate?.() ?? data.updatedAt),
  );
}

export interface PaginaLibros {
  libros: Libro[];
  ultimoDoc: QueryDocumentSnapshot | null;
  hayMas: boolean;
}

export const LibroRepository = {
  async crear(datos: Omit<Libro, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(collection(db, COL), {
      ...datos,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async actualizar(id: string, datos: Partial<Omit<Libro, 'id' | 'createdAt'>>): Promise<void> {
    await updateDoc(doc(db, COL, id), {
      ...datos,
      updatedAt: serverTimestamp(),
    });
  },

  // AMB-03: eliminar solo el documento del libro; no toca readingProgress de ningún usuario.
  async eliminar(id: string): Promise<void> {
    await deleteDoc(doc(db, COL, id));
  },

  async obtenerPorId(id: string): Promise<Libro | null> {
    const snap = await getDoc(doc(db, COL, id));
    if (!snap.exists()) return null;
    return docToLibro(snap.id, snap.data());
  },

  async listar(ultimoDocAnterior?: QueryDocumentSnapshot): Promise<PaginaLibros> {
    const q = ultimoDocAnterior
      ? query(collection(db, COL), orderBy('createdAt', 'desc'), startAfter(ultimoDocAnterior), limit(PAGE_SIZE))
      : query(collection(db, COL), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
    const snap = await getDocs(q);
    const libros = snap.docs.map(d => docToLibro(d.id, d.data()));
    return {
      libros,
      ultimoDoc: snap.docs[snap.docs.length - 1] ?? null,
      hayMas: snap.docs.length === PAGE_SIZE,
    };
  },

  async listarTodos(): Promise<Libro[]> {
    const snap = await getDocs(query(collection(db, COL), orderBy('createdAt', 'desc')));
    return snap.docs.map(d => docToLibro(d.id, d.data()));
  },
};
