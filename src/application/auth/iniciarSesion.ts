// T-2.3 | US-05 | aplicación
import { signInWithEmailAndPassword, type AuthError } from 'firebase/auth';
import { auth } from '../../infrastructure/firebase.config.ts';
import { UsuarioRepository } from '../../infrastructure/UsuarioRepository.ts';
import { type Rol } from '../../domain/Rol.ts';

// Retorna el rol del usuario para que la presentación pueda redirigir sin
// acceder directamente a la infraestructura (CONSTITUTION P3/P4).
export async function iniciarSesion(mail: string, contrasena: string): Promise<Rol | null> {
  try {
    const cred = await signInWithEmailAndPassword(auth, mail, contrasena);
    const usuario = await UsuarioRepository.obtenerPorUid(cred.user.uid);
    return usuario?.rol ?? null;
  } catch (error) {
    const code = (error as AuthError).code;
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      throw new Error('Mail o contraseña incorrectos.');
    }
    if (code === 'auth/too-many-requests') {
      throw new Error('Demasiados intentos fallidos. Intentá de nuevo más tarde.');
    }
    throw new Error('Ocurrió un error al iniciar sesión. Intentá de nuevo.');
  }
}
