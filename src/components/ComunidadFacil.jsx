import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, ArrowLeft, RotateCcw, Check, MapPin, Landmark, Hammer, Gamepad2 } from 'lucide-react';

export function decir(texto) {
  if (!('speechSynthesis' in window) || !texto) return false;
  window.speechSynthesis.cancel();
  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = 'es-CO'; voz.rate = 0.88;
  const voces = window.speechSynthesis.getVoices();
  voz.voice = voces.find(v => v.lang === 'es-CO') || voces.find(v => v.lang.startsWith('es')) || null;
  window.speechSynthesis.speak(voz);
  return true;
}

export function Escuchar({ texto, corto = false }) {
  const [disponible, setDisponible] = useState(true);
  useEffect(() => { setDisponible('speechSynthesis' in window); }, []);
  if (!disponible) return null;
  return <button type="button" className="cf-escuchar" onClick={() => decir(texto)} aria-label="Escuchar explicación">
    <Volume2 aria-hidden="true" size={26} /><span>{corto ? 'Oír' : 'Escuchar'}</span>
  </button>;
}

export function MenuComunidad({ activo, onElegir }) {
  const opciones = [
    ['corregimientos', MapPin, 'Pueblos', 'Toca un pueblo para conocerlo.'],
    ['patrimonio', Landmark, 'Historias', 'Conoce los fuertes y las historias de la isla.'],
    ['talleres', Hammer, 'Oficios', 'Conoce los talleres y oficios de la comunidad.'],
    ['memorias', Gamepad2, 'Jugar', 'Elige cocinar o bailar. Toca una fotografía para empezar.'],
  ];
  return <nav className="cf-menu" aria-label="Explorar Comunidad">{opciones.map(([id, Icon, titulo, audio]) =>
    <button type="button" key={id} aria-current={activo === id ? 'page' : undefined} onClick={() => { onElegir(id); decir(audio); }}>
      <Icon size={30} aria-hidden="true" /><span>{titulo}</span>
    </button>)}</nav>;
}

const OPCIONES = [
  { id: 'limon', icono: '🍋', nombre: 'Limón' }, { id: 'sal', icono: '🧂', nombre: 'Sal' },
  { id: 'coco', icono: '🥥', nombre: 'Coco' }, { id: 'panela', icono: '🟫', nombre: 'Panela' },
  { id: 'mezclar', icono: '🥄', nombre: 'Mezclar' }, { id: 'fuego', icono: '🔥', nombre: 'Cocinar' },
  { id: 'plato', icono: '🍽️', nombre: 'Servir' },
];
const RECETAS = {
  mojarra: { titulo: 'Cocina el pescado', foto: 'arroz_coco_pescado.jpg', pasos: [
    ['limon', 'Toca el limón para ponerlo sobre el pescado.'], ['sal', 'Ahora toca la sal.'],
    ['fuego', 'Toca el fuego para cocinar el pescado.'], ['plato', 'Toca el plato para servir.'],
  ] },
  cocada: { titulo: 'Prepara una cocada', foto: 'dulces_isnelia.jpg', pasos: [
    ['coco', 'Toca el coco para ponerlo en la paila.'], ['panela', 'Ahora toca la panela.'],
    ['mezclar', 'Toca la cuchara para mezclar.'], ['fuego', 'Toca el fuego para cocinar la mezcla.'], ['plato', 'Toca el plato para servir las cocadas.'],
  ] },
};

function Plato({ tipo, paso, completo }) {
  const dulce = tipo === 'cocada';
  return <svg viewBox="0 0 360 220" role="img" aria-label={completo ? 'Plato terminado' : dulce ? 'Paila para preparar cocadas' : 'Pescado para cocinar'} className="cf-plato">
    <ellipse cx="180" cy="178" rx="155" ry="27" fill="#000" opacity=".14" />
    <ellipse cx="180" cy="122" rx="148" ry="80" fill={completo ? '#fff8ea' : '#253742'} stroke={completo ? '#dfd5ba' : '#50636b'} strokeWidth="9" />
    {dulce ? (completo ? [110,180,250].map((x,i)=><g key={x}><ellipse cx={x} cy={105+i%2*30} rx="34" ry="25" fill="#c18b45" /><path d={`M${x-20} ${95+i%2*30}l12 15 9-18 15 13`} fill="none" stroke="#edc68c" strokeWidth="4"/></g>) : <>
      <ellipse cx="180" cy="120" rx="105" ry="47" fill={paso > 1 ? '#a8733d' : paso > 0 ? '#e9d8ba' : '#17262e'} />
      {paso > 0 && Array.from({length:18},(_,i)=><path key={i} d={`M${100+i*9} ${105+i%3*12}l9 4`} stroke="#fff2d2" strokeWidth="3" />)}
    </>) : <g>
      <path d="M90 121Q175 40 264 117Q175 185 90 121L58 92V151Z" fill={paso > 2 || completo ? '#d69b42' : '#a8bcc1'} stroke="#546a70" strokeWidth="3" />
      <circle cx="238" cy="111" r="7" fill="#182a32" />
      {[140,167,194].map(x=><path key={x} d={`M${x} 97l-17 44`} stroke={paso>2 ? '#8b5c2b' : '#708b91'} strokeWidth="5" />)}
      {paso>0 && <circle cx="270" cy="154" r="20" fill="#e5cf48" stroke="#fff7a1" strokeWidth="4" />}
    </g>}
    {completo && <text x="180" y="216" textAnchor="middle" fontSize="25" fill="#245e45">✓</text>}
  </svg>;
}

export function JuegoCocinaFacil({ tipo = 'mojarra', onCerrar }) {
  const receta = RECETAS[tipo];
  const [paso, setPaso] = useState(-1);
  const [feedback, setFeedback] = useState('');
  const completo = paso >= receta.pasos.length;
  const objetivo = receta.pasos[paso]?.[0];
  const pista = receta.pasos[paso]?.[1] || (completo ? '¡Lo lograste! Tu plato está listo.' : 'Vamos a cocinar. Toca el botón grande para empezar.');
  const opciones = paso < 0 || completo ? [] : [OPCIONES.find(o=>o.id===objetivo), ...OPCIONES.filter(o=>o.id!==objetivo).slice(paso%3, paso%3+2)].sort((a,b)=>a.id.localeCompare(b.id));
  useEffect(() => {
    const previo = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previo; window.speechSynthesis?.cancel(); };
  }, []);
  function empezar() { setPaso(0); setFeedback(''); decir(receta.pasos[0][1]); }
  function elegir(id) {
    if (id !== objetivo) { setFeedback('Intenta con el dibujo que está arriba.'); decir(pista); return; }
    const siguiente = paso + 1; setPaso(siguiente); setFeedback('¡Bien!');
    if (navigator.vibrate) navigator.vibrate(40);
    decir(siguiente >= receta.pasos.length ? '¡Lo lograste! Tu plato está listo. Puedes jugar otra vez o volver.' : `¡Bien! ${receta.pasos[siguiente][1]}`);
  }
  return createPortal(<section className="cf-juego" role="dialog" aria-modal="true" aria-label={receta.titulo}>
    <header><button type="button" onClick={onCerrar}><ArrowLeft size={28}/><span>Volver</span></button><Escuchar texto={pista}/></header>
    <main>
      <h1>{receta.titulo}</h1>
      {paso < 0 ? <>
        <img className="cf-foto-receta" src={`${import.meta.env.BASE_URL}images/memorias/${receta.foto}`} alt={receta.titulo}/>
        <p>Toca los dibujos. Escucha cada paso.</p>
        <button type="button" className="cf-empezar" onClick={empezar}><span aria-hidden="true">▶</span> Jugar</button>
      </> : <>
        <div className="cf-progreso" aria-label={`Paso ${Math.min(paso+1,receta.pasos.length)} de ${receta.pasos.length}`}>
          {receta.pasos.map((_,i)=><span key={i} className={i< paso ? 'hecho' : ''}/>)}
        </div>
        <Plato tipo={tipo} paso={paso} completo={completo}/>
        {completo ? <>
          <h2>¡Lo lograste! <Check size={32}/></h2>
          <button type="button" className="cf-empezar" onClick={empezar}><RotateCcw/> Otra vez</button>
          <button type="button" className="cf-volver" onClick={onCerrar}><ArrowLeft/> Volver</button>
        </> : <>
          <div className="cf-instruccion"><span aria-hidden="true">{OPCIONES.find(o=>o.id===objetivo)?.icono}</span><p>{pista}</p></div>
          <div className="cf-opciones">{opciones.map(o=><button type="button" key={o.id} onClick={()=>elegir(o.id)} aria-label={o.nombre}><span aria-hidden="true">{o.icono}</span><strong>{o.nombre}</strong></button>)}</div>
          <p role="status" aria-live="polite">{feedback}</p>
        </>}
      </>}
    </main>
  </section>,document.body);
}
