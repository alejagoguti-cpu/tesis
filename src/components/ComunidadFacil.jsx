import React from 'react';
import { MapPin, Landmark, Hammer, Gamepad2 } from 'lucide-react';

export function MenuComunidad({ activo, onElegir }) {
  const opciones = [
    ['corregimientos', MapPin, 'Pueblos', 'Toca un pueblo para conocerlo.'],
    ['patrimonio', Landmark, 'Historias', 'Conoce los fuertes y las historias de la isla.'],
    ['talleres', Hammer, 'Oficios', 'Conoce los talleres y oficios de la comunidad.'],
    ['memorias', Gamepad2, 'Jugar', 'Elige cocinar o bailar. Toca una fotografía para empezar.'],
  ];
  return <nav className="cf-menu" aria-label="Explorar Comunidad">{opciones.map(([id, Icon, titulo, audio]) =>
    <button type="button" key={id} aria-current={activo === id ? 'page' : undefined} onClick={() => { onElegir(id); }}>
      <Icon size={30} aria-hidden="true" /><span>{titulo}</span>
    </button>)}</nav>;
}

