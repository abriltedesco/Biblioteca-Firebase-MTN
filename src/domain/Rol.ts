// T-0.5 | CONSTITUTION §5 | RF-2.5
export const Rol = {
  ADMINISTRADOR: 'ADMINISTRADOR',
  CLIENTE:       'CLIENTE',
} as const;

export type Rol = typeof Rol[keyof typeof Rol];
