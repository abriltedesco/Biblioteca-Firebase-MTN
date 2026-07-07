// T-1.9 | RNF-3
import { describe, it, expect } from 'vitest';
import { Administrador } from '../../domain/Administrador.ts';
import { Cliente } from '../../domain/Cliente.ts';
import { Rol } from '../../domain/Rol.ts';

const makeAdmin = () => new Administrador('uid-admin', 'Ana', 'Pérez', 'ana@mail.com', '1234', '12345678');
const makeCliente = () => new Cliente('uid-cli', 'Juan', 'García', 'juan@mail.com', '5678', '87654321');

describe('Roles y permisos', () => {
  it('Administrador.puedeGestionarLibros() retorna true', () => {
    expect(makeAdmin().puedeGestionarLibros()).toBe(true);
  });

  it('Cliente no tiene el método puedeGestionarLibros', () => {
    const cliente = makeCliente();
    expect(typeof (cliente as unknown as Record<string, unknown>)['puedeGestionarLibros']).toBe('undefined');
  });

  it('El rol del Administrador es Rol.ADMINISTRADOR', () => {
    expect(makeAdmin().rol).toBe(Rol.ADMINISTRADOR);
  });

  it('El rol del Cliente es Rol.CLIENTE', () => {
    expect(makeCliente().rol).toBe(Rol.CLIENTE);
  });
});
