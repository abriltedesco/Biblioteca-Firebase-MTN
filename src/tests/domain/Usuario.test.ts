// T-1.5 & T-1.6 | RF-2.3, RF-2.4
import { describe, it, expect } from 'vitest';
import { Usuario } from '../../domain/Usuario.ts';

describe('Usuario.validarMail', () => {
  it('acepta mail con @ y dominio válido', () => {
    expect(Usuario.validarMail('usuario@mail.com')).toBe(true);
  });

  it('acepta mail con subdominio', () => {
    expect(Usuario.validarMail('usuario@correo.empresa.com')).toBe(true);
  });

  it('rechaza mail sin @', () => {
    expect(Usuario.validarMail('usuariomail.com')).toBe(false);
  });

  it('rechaza mail sin dominio después del @', () => {
    expect(Usuario.validarMail('usuario@')).toBe(false);
  });

  it('rechaza mail con @ pero sin punto en el dominio', () => {
    expect(Usuario.validarMail('usuario@dominio')).toBe(false);
  });

  it('rechaza string vacío', () => {
    expect(Usuario.validarMail('')).toBe(false);
  });

  it('rechaza mail con solo @', () => {
    expect(Usuario.validarMail('@')).toBe(false);
  });
});

describe('Usuario.validarContrasena', () => {
  it('acepta contraseña de exactamente 6 caracteres', () => {
    expect(Usuario.validarContrasena('abc123')).toBe(true);
  });

  it('acepta contraseña de más de 6 caracteres', () => {
    expect(Usuario.validarContrasena('segura1234')).toBe(true);
  });

  it('rechaza contraseña de 5 caracteres', () => {
    expect(Usuario.validarContrasena('abc12')).toBe(false);
  });

  it('rechaza contraseña vacía', () => {
    expect(Usuario.validarContrasena('')).toBe(false);
  });
});
