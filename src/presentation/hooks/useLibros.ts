// T-4.6 | US-06 | presentación
// Suscripción en tiempo real a readingProgress del usuario autenticado.
import { useState, useEffect } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../infrastructure/firebase.config.ts';
import { LibroRepository } from '../../infrastructure/LibroRepository.ts';
import { EstadoLectura } from '../../domain/EstadoLectura.ts';
import { type Libro } from '../../domain/Libro.ts';
import { useAuth } from './useAuth.ts';

export interface LibroConEstado {
  libro: Libro;
  estado: EstadoLectura;
  libroId: string;
}

export function useLibros() {
  const { usuario } = useAuth();
  const [leyendo, setLeyendo] = useState<LibroConEstado[]>([]);
  const [noLeidos, setNoLeidos] = useState<LibroConEstado[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario) {
      setLeyendo([]);
      setNoLeidos([]);
      setCargando(false);
      return;
    }

    const progressCol = collection(db, 'users', usuario.uid, 'readingProgress');

    // Suscripción en tiempo real a todos los progresos del usuario
    const unsub = onSnapshot(progressCol, async (snap) => {
      const docs = snap.docs.map(d => d.data() as { libroId: string; estado: EstadoLectura });

      const librosLeyendo: LibroConEstado[] = [];
      const librosNoLeidos: LibroConEstado[] = [];

      await Promise.all(docs.map(async (p) => {
        if (p.estado !== EstadoLectura.LEYENDO && p.estado !== EstadoLectura.NO_LEIDO) return;
        const libro = await LibroRepository.obtenerPorId(p.libroId);
        if (!libro) return;
        const item: LibroConEstado = { libro, estado: p.estado, libroId: p.libroId };
        if (p.estado === EstadoLectura.LEYENDO) librosLeyendo.push(item);
        else librosNoLeidos.push(item);
      }));

      setLeyendo(librosLeyendo);
      setNoLeidos(librosNoLeidos);
      setCargando(false);
    });

    return unsub;
  }, [usuario]);

  return { leyendo, noLeidos, cargando };
}
