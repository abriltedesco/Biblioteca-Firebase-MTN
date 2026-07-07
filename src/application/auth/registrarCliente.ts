// T-2.2 | US-04 | aplicación
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../infrastructure/firebase.config.ts';
import { UsuarioRepository } from '../../infrastructure/UsuarioRepository.ts';
import { Usuario } from '../../domain/Usuario.ts';
import { Rol } from '../../domain/Rol.ts';

interface DatosRegistro {
  nombre: string;
  apellido: string;
  mail: string;
  telefono: string;
  dni: string;
  contrasena: string;
}

export async function registrarCliente(datos: DatosRegistro): Promise<void> {
  // Validaciones de dominio antes de llamar a Firebase
  if (!Usuario.validarMail(datos.mail)) {
    throw new Error('El mail no tiene un formato válido. Debe contener "@" y un dominio.');
  }
  if (!Usuario.validarContrasena(datos.contrasena)) {
    throw new Error('La contraseña debe tener al menos 6 caracteres.');
  }

  // Crear cuenta en Firebase Authentication
  const credencial = await createUserWithEmailAndPassword(auth, datos.mail, datos.contrasena);
  const uid = credencial.user.uid;

  // Guardar datos del usuario en Firestore con rol CLIENTE
  const usuario = new Usuario(
    uid,
    datos.nombre,
    datos.apellido,
    datos.mail,
    datos.telefono,
    datos.dni,
    Rol.CLIENTE,
  );
  await UsuarioRepository.crear(uid, usuario);
}
