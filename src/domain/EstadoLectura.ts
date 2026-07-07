// T-0.5 | CONSTITUTION §5 | RF-3.4, AMB-02
export const EstadoLectura = {
  NO_LEIDO: 'NO_LEIDO',
  LEYENDO:  'LEYENDO',
  LEIDO:    'LEIDO',
} as const;

export type EstadoLectura = typeof EstadoLectura[keyof typeof EstadoLectura];
