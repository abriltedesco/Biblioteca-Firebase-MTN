// Componente de avatar circular con dropdown de usuario
import { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../infrastructure/firebase.config.ts';
import type { Usuario } from '../../domain/Usuario.ts';

interface Props {
  usuario: Usuario | null;
  rol?: string;
}

export function UserAvatar({ usuario, rol }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    setOpen(false);
    await signOut(auth);
  }

  return (
    <div className="user-avatar-wrap" ref={wrapRef}>
      <button
        className="user-avatar-btn"
        onClick={() => setOpen(prev => !prev)}
        aria-label="Menú de usuario"
        aria-expanded={open}
      >
        {/* Icono persona SVG */}
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 12c2.486 0 4.5-2.014 4.5-4.5S14.486 3 12 3 7.5 5.014 7.5 7.5 9.514 12 12 12zm0 2.25c-3.004 0-9 1.508-9 4.5v1.75h18V18.75c0-2.992-5.996-4.5-9-4.5z"/>
        </svg>
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          {usuario && (
            <div className="user-dropdown-info">
              <p className="user-dropdown-name">
                {usuario.nombre} {usuario.apellido}
              </p>
              {rol && (
                <p className="user-dropdown-role">
                  {rol === 'ADMINISTRADOR' ? 'Administrador' : 'Lector'}
                </p>
              )}
            </div>
          )}
          <button role="menuitem" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
