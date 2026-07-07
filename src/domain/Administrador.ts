// T-1.2 | RF-2.5, RNF-3
import { Usuario } from './Usuario.ts';
import { Rol } from './Rol.ts';

export class Administrador extends Usuario {
  constructor(
    uid: string,
    nombre: string,
    apellido: string,
    mail: string,
    telefono: string,
    dni: string,
    createdAt: Date = new Date(),
  ) {
    super(uid, nombre, apellido, mail, telefono, dni, Rol.ADMINISTRADOR, createdAt);
  }

  // Solo el Administrador puede gestionar libros (RNF-3).
  puedeGestionarLibros(): true {
    return true;
  }
}
