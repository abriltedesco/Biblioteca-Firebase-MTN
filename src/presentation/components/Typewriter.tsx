// Componente de tipeo letra a letra con cursor parpadeante
import { useState, useEffect } from 'react';

interface Props {
  text: string;
  /** Velocidad en ms por carácter (default: 45) */
  speed?: number;
  /** Cuántas veces parpadea el cursor al terminar (default: 4) */
  cursorBlinks?: number;
}

export function Typewriter({ text, speed = 45, cursorBlinks = 4 }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [done, setDone] = useState(false);

  // Reiniciar si cambia el texto
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    setCursorVisible(true);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  // Parpadeo del cursor al terminar
  useEffect(() => {
    if (!done) return;

    let blinks = 0;
    const total = cursorBlinks * 2; // encendido/apagado
    const blink = setInterval(() => {
      setCursorVisible(v => !v);
      blinks++;
      if (blinks >= total) {
        clearInterval(blink);
        setCursorVisible(false); // ocultar cursor al final
      }
    }, 400);

    return () => clearInterval(blink);
  }, [done, cursorBlinks]);

  return (
    <span className="typewriter-text">
      {displayed}
      <span
        className="typewriter-cursor"
        style={{ opacity: cursorVisible ? 1 : 0 }}
        aria-hidden="true"
      >
        |
      </span>
    </span>
  );
}
