import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pause, Play, RotateCcw, X } from 'lucide-react';
import { crearEscenaPatrimonio } from '../utils/escenaPatrimonioPuntos';
import './patrimonio-canal.css';
import { PATRIMONIO_ESCENAS, idPatrimonio } from '../data/patrimonioEscenas';

export default function PatrimonioCanal({ onClose, lugar = 'sanFernando', onElegirLugar }) {
  const id = idPatrimonio(lugar), datos = PATRIMONIO_ESCENAS[id];
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
    const s=crearEscenaPatrimonio(canvas.current,{onFase:setFase,onError:()=>setError(true),reducida,lugar:id});escena.current=s;
    return()=>{s?.dispose?.();escena.current=null;};
  },[reducida,id]);
  useEffect(()=>{escena.current?.pausar?.(pausado);},[pausado,reducida]);
  const repetir=()=>{escena.current?.repetir?.();setPausado(false);};
  return createPortal(<div ref={dialogo} className="pc-overlay" role="dialog" aria-modal="true" aria-labelledby="pc-titulo">
    <canvas ref={canvas} className="pc-escena-viva" role="img" aria-label={datos.descripcion}/>
    <header className="pc-header"><span>Tierra Bomba <b>/ Patrimonio construido</b></span><button ref={cerrar} type="button" onClick={onClose} aria-label={`Cerrar ${datos.nombre}`}><X size={18}/><span>Volver al territorio</span></button></header>
    {onElegirLugar&&<nav className="pc-lugares" aria-label="Animaciones del patrimonio">{Object.entries(PATRIMONIO_ESCENAS).map(([key,d])=><button type="button" key={key} aria-current={id===key?'page':undefined} onClick={()=>onElegirLugar(key)}>{d.nombre}</button>)}</nav>}
    <div className="pc-titular"><p>Bocachica · Tierra Bomba</p><h1 id="pc-titulo">{datos.nombre}</h1><span>{datos.sub}</span></div>
    {error&&<p className="pc-error" role="alert">No se pudo dibujar la escena en este dispositivo. Cierra e intenta abrir el lugar de nuevo.</p>}
    <div className="pc-instruccion">{reducida?'Vista con movimiento reducido':datos.pista}<span>{reducida?'':'Mueve el cursor para cambiar la perspectiva.'}</span></div>
    <section className="pc-relato-vivo" aria-label="Relato de la animación">
      <div className="pc-secuencia" aria-hidden="true">{datos.fases.map((_,i)=><span key={i} className={fase===i?'activa':''}>0{i+1}<i/></span>)}</div>
      <div className="pc-explicacion" aria-live="polite" aria-atomic="true"><h2>{datos.fases[fase].titulo}</h2><p>{datos.fases[fase].texto}</p></div>
      <div className="pc-controles"><button type="button" onClick={()=>setPausado(v=>!v)} disabled={reducida} aria-label={pausado?'Reanudar animación':'Pausar animación'}>{pausado?<Play size={16}/>:<Pause size={16}/>}<span>{pausado?'Reanudar':'Pausar'}</span></button><button type="button" onClick={repetir} disabled={reducida}><RotateCcw size={16}/><span>Ver de nuevo</span></button><button type="button" onClick={()=>setFuentes(v=>!v)} aria-expanded={fuentes} aria-controls="pc-fuentes">{fuentes?'Cerrar fuentes':'Acerca de esta escena'}</button></div>
    </section>
    {fuentes&&<aside id="pc-fuentes" className="pc-fuentes"><h2>{datos.nombre} · Arquitectura y territorio</h2><p>{datos.contexto}</p><p>Fuentes: {datos.fuentes.map(([label,url],i)=><React.Fragment key={url}>{i>0?' · ':''}<a href={url} target="_blank" rel="noreferrer">{label}</a></React.Fragment>)}</p><p>Reconstrucción volumétrica interpretativa en puntos. No es un levantamiento del monumento ni del poblado. Las formas, posiciones, personas y trayectos son esquemáticos; no son rutas reales ni cálculos de visibilidad o alcance de artillería.</p><button type="button" onClick={()=>setFuentes(false)}>Volver a la animación</button></aside>}
    <div className="pc-nota">Reconstrucción interpretativa · Escena sin escala</div>
  </div>,document.body);
}
