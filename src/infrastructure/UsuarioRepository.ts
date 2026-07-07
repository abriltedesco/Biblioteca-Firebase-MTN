// T-2.1 | RF-2.1 | infraestructura
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase.config.ts';
import { Usuario } from '../domain/Usuario.ts';
import { type Rol } from '../domain/Rol.ts';

interface UsuarioDoc {
  nombre: string;
  apellido: string;
  mail: string;
  telefono: string;
  dni: string;
  rol: Rol;
  createdAt: string;
}

export const UsuarioRepository = {
  async crear(uid: string, datos: Omit<Usuario, 'uid'>): Promise<void> {
    const ref = doc(db, 'users', uid);
    const docData: UsuarioDoc = {
      nombre:    datos.nombre,
      apellido:  datos.apellido,
      mail:      datos.mail,
      telefono:  datos.telefono,
      dni:       datos.dni,
      rol:       datos.rol,
      createdAt: datos.createdAt.toISOString(),
    };
    await setDoc(ref, docData);
  },

  async obtenerPorUid(uid: string): Promise<Usuario | null> {
    const ref  = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const d = snap.data() as UsuarioDoc;
    return new Usuario(
      uid,
      d.nombre,
      d.apellido,
      d.mail,
      d.telefono,
      d.dni,
      d.rol,
      new Date(d.createdAt),
    );
  },
};
