// T-2.6 | US-04 | presentación
import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarCliente } from '../../application/auth/registrarCliente.ts';

interface Errores {
  nombre?: string;
  apellido?: string;
  mail?: string;
  telefono?: string;
  dni?: string;
  contrasena?: string;
  general?: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    mail: '',
    telefono: '',
    dni: '',
    contrasena: '',
  });
  const [errores, setErrores] = useState<Errores>({});
  const [cargando, setCargando] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Limpiar el error del campo al escribir
    setErrores(prev => ({ ...prev, [e.target.name]: undefined }));
  }

  function validarFormulario(): boolean {
    const nuevosErrores: Errores = {};
    if (!form.nombre.trim())    nuevosErrores.nombre    = 'El nombre es obligatorio.';
    if (!form.apellido.trim())  nuevosErrores.apellido  = 'El apellido es obligatorio.';
    if (!form.mail.trim())      nuevosErrores.mail      = 'El mail es obligatorio.';
    if (!form.telefono.trim())  nuevosErrores.telefono  = 'El teléfono es obligatorio.';
    if (!form.dni.trim())       nuevosErrores.dni       = 'El DNI es obligatorio.';
    if (!form.contrasena.trim()) nuevosErrores.contrasena = 'La contraseña es obligatoria.';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrores({});
    if (!validarFormulario()) return;
    setCargando(true);
    try {
      await registrarCliente(form);
      navigate('/');
    } catch (err) {
      const mensaje = (err as Error).message;
      // Asociar el error al campo correspondiente si es posible
      if (mensaje.toLowerCase().includes('mail')) {
        setErrores({ mail: mensaje });
      } else if (mensaje.toLowerCase().includes('contraseña')) {
        setErrores({ contrasena: mensaje });
      } else {
        setErrores({ general: mensaje });
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">📚 Biblioteca MTN</h1>
        <h2 className="auth-subtitle">Crear cuenta</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                placeholder="María"
                required
              />
              {errores.nombre && <span className="field-error">{errores.nombre}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                value={form.apellido}
                onChange={handleChange}
                placeholder="González"
                required
              />
              {errores.apellido && <span className="field-error">{errores.apellido}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="mail">Correo electrónico</label>
            <input
              id="mail"
              name="mail"
              type="email"
              value={form.mail}
              onChange={handleChange}
              placeholder="tu@mail.com"
              required
              autoComplete="email"
            />
            {errores.mail && <span className="field-error">{errores.mail}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={form.telefono}
                onChange={handleChange}
                placeholder="1112345678"
                required
              />
              {errores.telefono && <span className="field-error">{errores.telefono}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="dni">DNI</label>
              <input
                id="dni"
                name="dni"
                type="text"
                value={form.dni}
                onChange={handleChange}
                placeholder="12345678"
                required
              />
              {errores.dni && <span className="field-error">{errores.dni}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              value={form.contrasena}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
            />
            {errores.contrasena && <span className="field-error">{errores.contrasena}</span>}
          </div>
          {errores.general && <p className="error-message">{errores.general}</p>}
          <button type="submit" className="btn-primary" disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        <p className="auth-footer">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}
