// T-2.4 | US-05, RF-2.5 | presentación
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../infrastructure/firebase.config.ts';
import { UsuarioRepository } from '../../infrastructure/UsuarioRepository.ts';
import { type Usuario } from '../../domain/Usuario.ts';
import { type Rol } from '../../domain/Rol.ts';

interface AuthState {
  usuario: Usuario | null;
  rol: Rol | null;
  cargando: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    usuario: null,
    rol: null,
    cargando: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setState({ usuario: null, rol: null, cargando: false });
        return;
      }
      const usuario = await UsuarioRepository.obtenerPorUid(firebaseUser.uid);
      setState({
        usuario,
        rol: usuario?.rol ?? null,
        cargando: false,
      });
    });

    return unsubscribe;
  }, []);

  return state;
}
