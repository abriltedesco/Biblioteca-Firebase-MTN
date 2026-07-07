// T-4.5 | US-07, US-08 | presentación
import { useState } from 'react';
import { EstadoLectura } from '../../domain/EstadoLectura.ts';
import { marcarEstadoLectura } from '../../application/lectura/marcarEstadoLectura.ts';

interface Props {
  uid: string;
  libroId: string;
  estadoActual: EstadoLectura;
}

const ETIQUETAS: Record<EstadoLectura, string> = {
  [EstadoLectura.NO_LEIDO]: 'Sin empezar',
  [EstadoLectura.LEYENDO]:  'Leyendo',
  [EstadoLectura.LEIDO]:    'Leído',
};

const COLORES: Record<EstadoLectura, string> = {
  [EstadoLectura.NO_LEIDO]: 'estado-no-leido',
  [EstadoLectura.LEYENDO]:  'estado-leyendo',
  [EstadoLectura.LEIDO]:    'estado-leido',
};

// Muestra solo las transiciones válidas desde el estado actual
const SIGUIENTE: Record<EstadoLectura, EstadoLectura[]> = {
  [EstadoLectura.NO_LEIDO]: [EstadoLectura.LEYENDO, EstadoLectura.LEIDO],
  [EstadoLectura.LEYENDO]:  [EstadoLectura.LEIDO],
  [EstadoLectura.LEIDO]:    [],
};

export function EstadoLecturaSelector({ uid, libroId, estadoActual }: Props) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  async function handleCambiar(nuevoEstado: EstadoLectura) {
    setError('');
    setGuardando(true);
    try {
      await marcarEstadoLectura(uid, libroId, nuevoEstado);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  const siguientes = SIGUIENTE[estadoActual];

  return (
    <div className="estado-selector">
      <span className={`estado-badge ${COLORES[estadoActual]}`}>
        {ETIQUETAS[estadoActual]}
      </span>
      {siguientes.map(sig => (
        <button
          key={sig}
          className="btn-estado"
          disabled={guardando}
          onClick={() => handleCambiar(sig)}
          title={`Marcar como "${ETIQUETAS[sig]}"`}
        >
          {guardando ? '...' : `→ ${ETIQUETAS[sig]}`}
        </button>
      ))}
      {error && <p className="estado-error">{error}</p>}
    </div>
  );
}
