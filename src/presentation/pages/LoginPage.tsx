// T-2.5 | US-05 | presentación
import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { iniciarSesion } from '../../application/auth/iniciarSesion.ts';
import { Rol } from '../../domain/Rol.ts';

export function LoginPage() {
  const navigate = useNavigate();
  const [mail, setMail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      // iniciarSesion retorna el rol — la presentación no accede a infraestructura (GAP-01 fix)
      const rol = await iniciarSesion(mail, contrasena);
      if (rol === Rol.ADMINISTRADOR) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">📚 Biblioteca MTN</h1>
        <h2 className="auth-subtitle">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="mail">Correo electrónico</label>
            <input
              id="mail"
              type="email"
              value={mail}
              onChange={e => setMail(e.target.value)}
              placeholder="tu@mail.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-primary" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p className="auth-footer">
          ¿No tenés cuenta?{' '}
          <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  );
}
