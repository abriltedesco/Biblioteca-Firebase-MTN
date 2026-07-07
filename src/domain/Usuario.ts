// T-1.2 | RF-2.1, RF-2.3, RF-2.4
import { type Rol } from './Rol.ts';

export class Usuario {
  uid: string;
  nombre: string;
  apellido: string;
  mail: string;
  telefono: string;
  dni: string;
  rol: Rol;
  createdAt: Date;

  constructor(
    uid: string,
    nombre: string,
    apellido: string,
    mail: string,
    telefono: string,
    dni: string,
    rol: Rol,
    createdAt: Date = new Date(),
  ) {
    this.uid       = uid;
    this.nombre    = nombre;
    this.apellido  = apellido;
    this.mail      = mail;
    this.telefono  = telefono;
    this.dni       = dni;
    this.rol       = rol;
    this.createdAt = createdAt;
  }

  // RF-2.4: el mail debe contener al menos un '@' y un dominio después del '@'.
  static validarMail(mail: string): boolean {
    if (!mail || !mail.includes('@')) return false;
    const [, dominio] = mail.split('@');
    if (!dominio || !dominio.includes('.')) return false;
    const partesDominio = dominio.split('.');
    return partesDominio.every(p => p.length > 0);
  }

  // RF-2.3: la contraseña debe tener al menos 6 caracteres.
  static validarContrasena(contrasena: string): boolean {
    return typeof contrasena === 'string' && contrasena.length >= 6;
  }
}
