// T-3.1 | AMB-05 | infraestructura
import {
  collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase.config.ts';
import { Categoria } from '../domain/Categoria.ts';

const COL = 'categorias';

export const CategoriaRepository = {
  async crear(nombre: string): Promise<string> {
    const ref = await addDoc(collection(db, COL), {
      nombre,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },

  async listar(): Promise<Categoria[]> {
    const snap = await getDocs(collection(db, COL));
    return snap.docs.map(d => new Categoria(d.id, (d.data() as { nombre: string }).nombre));
  },

  async eliminar(id: string): Promise<void> {
    await deleteDoc(doc(db, COL, id));
  },
};
