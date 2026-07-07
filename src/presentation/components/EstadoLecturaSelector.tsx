// T-4.5 | US-07, US-08 | presentación
// Los estados "LEYENDO" y "LEIDO" tienen mayor jerarquía visual que "NO_LEIDO"
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

const BADGE_CLASS: Record<EstadoLectura, string> = {
  [EstadoLectura.NO_LEIDO]: 'estado-badge estado-no-leido',
  [EstadoLectura.LEYENDO]:  'estado-badge estado-leyendo',
  [EstadoLectura.LEIDO]:    'estado-badge estado-leido',
};

// Transiciones válidas
const SIGUIENTE: Record<EstadoLectura, EstadoLectura[]> = {
  [EstadoLectura.NO_LEIDO]: [EstadoLectura.LEYENDO, EstadoLectura.LEIDO],
  [EstadoLectura.LEYENDO]:  [EstadoLectura.LEIDO],
  [EstadoLectura.LEIDO]:    [],
};

// "LEYENDO" es la acción primaria; "LEIDO" desde LEYENDO es secundaria
function esAccionPrimaria(desde: EstadoLectura, hacia: EstadoLectura): boolean {
  return desde === EstadoLectura.NO_LEIDO && hacia === EstadoLectura.LEYENDO;
}

const ETIQUETAS_BOTON: Record<string, string> = {
  [`${EstadoLectura.NO_LEIDO}->${EstadoLectura.LEYENDO}`]: 'Comenzar lectura',
  [`${EstadoLectura.NO_LEIDO}->${EstadoLectura.LEIDO}`]:   'Marcar como leído',
  [`${EstadoLectura.LEYENDO}->${EstadoLectura.LEIDO}`]:    'Marcar como leído',
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
      {/* Solo mostramos el badge si no hay botón de acción primaria disponible */}
      {(estadoActual === EstadoLectura.LEIDO || estadoActual === EstadoLectura.LEYENDO) && (
        <span className={BADGE_CLASS[estadoActual]}>
          {ETIQUETAS[estadoActual]}
        </span>
      )}

      {/* Badge muted para "sin empezar" cuando no hay acciones */}
      {estadoActual === EstadoLectura.NO_LEIDO && siguientes.length === 0 && (
        <span className={BADGE_CLASS[estadoActual]}>
          {ETIQUETAS[estadoActual]}
        </span>
      )}

      {/* Botones de transición con jerarquía */}
      {siguientes.map(sig => {
        const key = `${estadoActual}->${sig}`;
        const label = ETIQUETAS_BOTON[key] ?? `Marcar como ${ETIQUETAS[sig]}`;
        const isPrimaria = esAccionPrimaria(estadoActual, sig);
        return (
          <button
            key={sig}
            className={isPrimaria ? 'btn-accion-primaria' : 'btn-accion-secundaria'}
            disabled={guardando}
            onClick={() => handleCambiar(sig)}
          >
            {guardando ? 'Guardando...' : label}
          </button>
        );
      })}

      {error && <p className="estado-error">{error}</p>}
    </div>
  );
}

