// T-1.2 | RF-2.1, RF-2.5
import { Usuario } from './Usuario.ts';
import { Rol } from './Rol.ts';

export class Cliente extends Usuario {
  constructor(
    uid: string,
    nombre: string,
    apellido: string,
    mail: string,
    telefono: string,
    dni: string,
    createdAt: Date = new Date(),
  ) {
    super(uid, nombre, apellido, mail, telefono, dni, Rol.CLIENTE, createdAt);
  }
}
