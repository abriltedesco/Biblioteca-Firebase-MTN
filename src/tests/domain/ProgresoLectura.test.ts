// T-1.7 & T-1.8 | RF-3.4, AMB-02
import { describe, it, expect } from 'vitest';
import { ProgresoLectura } from '../../domain/ProgresoLectura.ts';
import { EstadoLectura } from '../../domain/EstadoLectura.ts';

describe('ProgresoLectura.avanzarEstado — transiciones válidas', () => {
  it('NO_LEIDO → LEYENDO es válido', () => {
    const progreso = ProgresoLectura.crear('libro-1');
    expect(() => progreso.avanzarEstado(EstadoLectura.LEYENDO)).not.toThrow();
    expect(progreso.estado).toBe(EstadoLectura.LEYENDO);
  });

  it('NO_LEIDO → LEIDO es válido (transición directa permitida, AMB-02)', () => {
    const progreso = ProgresoLectura.crear('libro-2');
    expect(() => progreso.avanzarEstado(EstadoLectura.LEIDO)).not.toThrow();
    expect(progreso.estado).toBe(EstadoLectura.LEIDO);
  });

  it('LEYENDO → LEIDO es válido', () => {
    const progreso = ProgresoLectura.crear('libro-3');
    progreso.avanzarEstado(EstadoLectura.LEYENDO);
    expect(() => progreso.avanzarEstado(EstadoLectura.LEIDO)).not.toThrow();
    expect(progreso.estado).toBe(EstadoLectura.LEIDO);
  });
});

describe('ProgresoLectura.avanzarEstado — transiciones inválidas', () => {
  it('LEIDO → LEYENDO lanza error', () => {
    const progreso = ProgresoLectura.crear('libro-4');
    progreso.avanzarEstado(EstadoLectura.LEIDO);
    expect(() => progreso.avanzarEstado(EstadoLectura.LEYENDO)).toThrow();
  });

  it('LEIDO → NO_LEIDO lanza error', () => {
    const progreso = ProgresoLectura.crear('libro-5');
    progreso.avanzarEstado(EstadoLectura.LEIDO);
    expect(() => progreso.avanzarEstado(EstadoLectura.NO_LEIDO)).toThrow();
  });

  it('LEYENDO → NO_LEIDO lanza error', () => {
    const progreso = ProgresoLectura.crear('libro-6');
    progreso.avanzarEstado(EstadoLectura.LEYENDO);
    expect(() => progreso.avanzarEstado(EstadoLectura.NO_LEIDO)).toThrow();
  });
});
