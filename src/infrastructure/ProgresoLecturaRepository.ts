// T-4.1 | RF-3.1→3.4 | infraestructura
// Subcolección: users/{uid}/readingProgress/{libroId}  (AMB-01)
import {
  doc, getDoc, setDoc, collection, query,
  where, getDocs, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase.config.ts';
import { ProgresoLectura } from '../domain/ProgresoLectura.ts';
import { EstadoLectura } from '../domain/EstadoLectura.ts';

function progressPath(uid: string) {
  return collection(db, 'users', uid, 'readingProgress');
}

interface ProgresoDoc {
  libroId: string;
  estado: EstadoLectura;
  updatedAt: { toDate: () => Date } | string;
}

export const ProgresoLecturaRepository = {
  async obtener(uid: string, libroId: string): Promise<ProgresoLectura | null> {
    const snap = await getDoc(doc(progressPath(uid), libroId));
    if (!snap.exists()) return null;
    const d = snap.data() as ProgresoDoc;
    const fecha = typeof d.updatedAt === 'string'
      ? new Date(d.updatedAt)
      : d.updatedAt.toDate();
    return new ProgresoLectura(d.libroId, d.estado, fecha);
  },

  async guardar(uid: string, progreso: ProgresoLectura): Promise<void> {
    await setDoc(doc(progressPath(uid), progreso.libroId), {
      libroId:   progreso.libroId,
      estado:    progreso.estado,
      updatedAt: serverTimestamp(),
    });
  },

  // RNF-2: query indexada — no filtra en memoria
  async listarPorEstado(uid: string, estado: EstadoLectura): Promise<ProgresoLectura[]> {
    const q = query(progressPath(uid), where('estado', '==', estado));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data() as ProgresoDoc;
      const fecha = typeof data.updatedAt === 'string'
        ? new Date(data.updatedAt)
        : (data.updatedAt as { toDate: () => Date })?.toDate?.() ?? new Date();
      return new ProgresoLectura(data.libroId, data.estado, fecha);
    });
  },

  // Trae LEYENDO y NO_LEIDO con dos queries (Firestore no soporta OR en where con índices compuestos)
  async listarEnLectura(uid: string): Promise<ProgresoLectura[]> {
    const [leyendo, noLeidos] = await Promise.all([
      this.listarPorEstado(uid, EstadoLectura.LEYENDO),
      this.listarPorEstado(uid, EstadoLectura.NO_LEIDO),
    ]);
    return [...leyendo, ...noLeidos];
  },
};
