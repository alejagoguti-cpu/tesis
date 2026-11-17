import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pause, Play, RotateCcw, X } from 'lucide-react';
import { crearEscenaPatrimonio, FASES_CANAL } from '../utils/escenaPatrimonioPuntos';
import './patrimonio-canal.css';

export default function PatrimonioCanal({ onClose }) {
  const [fase,setFase]=useState(0),[pausado,setPausado]=useState(false),[fuentes,setFuentes]=useState(false),[error,setError]=useState(false);
  const [reducida,setReducida]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const canvas=useRef(null),escena=useRef(null),dialogo=useRef(null),cerrar=useRef(null);
  useEffect(()=>{
    const antes=document.activeElement,overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';cerrar.current?.focus();
    const root=document.getElementById('root'),antesInert=root?.inert;
    if(root)root.inert=true;
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const cambiar=e=>setReducida(e.matches);media.addEventListener('change',cambiar);
    const teclado=e=>{
      if(e.key==='Escape'){e.stopImmediatePropagation();e.preventDefault();onClose();return;}
      if(e.key!=='Tab')return;
      const items=[...dialogo.current.querySelectorAll('button,a[href]')].filter(n=>!n.disabled&&n.getClientRects().length);
      const first=items[0],last=items[items.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    };
    document.addEventListener('keydown',teclado,true);
    return()=>{document.body.style.overflow=overflow;if(root)root.inert=antesInert;document.removeEventListener('keydown',teclado,true);media.removeEventListener('change',cambiar);antes?.focus?.();};
  },[onClose]);
  useEffect(()=>{
    setError(false);
    const s=crearEscenaPatrimonio(canvas.current,{onFase:setFase,onError:()=>setError(true),reducida});escena.current=s;
    return()=>{s?.dispose?.();escena.current=null;};
  },[reducida]);
  useEffect(()=>{escena.current?.pausar?.(pausado);},[pausado,reducida]);
  const repetir=()=>{escena.current?.repetir?.();setPausado(false);};
  return createPortal(<div ref={dialogo} className="pc-overlay" role="dialog" aria-modal="true" aria-labelledby="pc-titulo">
    <canvas ref={canvas} className="pc-escena-viva" role="img" aria-label="Escena animada tridimensional en partículas: se forma la batería semicircular de San Fernando, una embarcación navega sobre el oleaje y se revela su relación con San José al otro lado del canal."/>
    <header className="pc-header"><span>Tierra Bomba <b>/ Patrimonio construido</b></span><button ref={cerrar} type="button" onClick={onClose} aria-label="Cerrar San Fernando"><X size={18}/><span>Volver al territorio</span></button></header>
    <div className="pc-titular"><p>Bocachica · Tierra Bomba</p><h1 id="pc-titulo">San Fernando</h1><span>La arquitectura de un paso marítimo.</span></div>
    {error&&<p className="pc-error" role="alert">No se pudo dibujar la escena en este dispositivo. Cierra e intenta abrir San Fernando de nuevo.</p>}
    <div className="pc-instruccion">{reducida?'Vista con movimiento reducido':'El fuerte se forma. El barco atraviesa el canal.'}<span>{reducida?'':'Mueve el cursor para cambiar la perspectiva.'}</span></div>
    <section className="pc-relato-vivo" aria-label="Relato de la animación">
      <div className="pc-secuencia" aria-hidden="true">{FASES_CANAL.map((_,i)=><span key={i} className={fase===i?'activa':''}>0{i+1}<i/></span>)}</div>
      <div className="pc-explicacion" aria-live="polite" aria-atomic="true"><h2>{FASES_CANAL[fase].titulo}</h2><p>{FASES_CANAL[fase].texto}</p></div>
      <div className="pc-controles"><button type="button" onClick={()=>setPausado(v=>!v)} disabled={reducida} aria-label={pausado?'Reanudar animación':'Pausar animación'}>{pausado?<Play size={16}/>:<Pause size={16}/>}<span>{pausado?'Reanudar':'Pausar'}</span></button><button type="button" onClick={repetir} disabled={reducida}><RotateCcw size={16}/><span>Ver de nuevo</span></button><button type="button" onClick={()=>setFuentes(v=>!v)} aria-expanded={fuentes} aria-controls="pc-fuentes">{fuentes?'Cerrar fuentes':'Acerca de esta escena'}</button></div>
    </section>
    {fuentes&&<aside id="pc-fuentes" className="pc-fuentes"><h2>Arquitectura, agua y defensa</h2><p>San Fernando y San José formaban parte del sistema defensivo del paso de Bocachica.</p><p>Fuentes: <a href="https://fortificacionescartagena.com.co/es/servicios/reservas/fortificaciones-de-bocachica/" target="_blank" rel="noreferrer">Fortificaciones de Bocachica</a> y <a href="https://fortificacionescartagena.com.co/es/destination/fuerte-de-san-jose/" target="_blank" rel="noreferrer">Fuerte de San José</a>.</p><p>Reconstrucción volumétrica interpretativa en puntos. No es un levantamiento del monumento. La forma, las posiciones y el trayecto son esquemáticos; las líneas expresan la relación defensiva, sin representar alcances de artillería calculados.</p><button type="button" onClick={()=>setFuentes(false)}>Volver a la animación</button></aside>}
    <div className="pc-nota">Reconstrucción interpretativa · Escena sin escala</div>
  </div>,document.body);
}
