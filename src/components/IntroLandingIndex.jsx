import React, { Suspense, lazy, useState, useCallback, useEffect, useRef } from 'react';
import { MapPin, Utensils, Music, Hammer, ArrowRight, ArrowUpRight, Search, ArrowUp, Compass } from 'lucide-react';
import HeroTerritorio from './HeroTerritorio';
import VistaPatrimonio from './VistaPatrimonio';
import { Reveal } from './Motion';
import { PATRIMONIO_ESCENAS } from '../data/patrimonioEscenas';
import './comunidad-facil.css';
import './experiencia-comunidad.css';
let patrimonioPromise;
const cargarPatrimonio=()=>patrimonioPromise||(patrimonioPromise=import('./PatrimonioCanal'));
const PatrimonioCanal=lazy(cargarPatrimonio);
let aulaPromise;
const cargarAula=()=>aulaPromise||(aulaPromise=import('./AulaAmbientalBocachica'));
const AulaAmbientalBocachica=lazy(cargarAula);
const BASE=import.meta.env.BASE_URL;
const ACTIVIDADES=[
  {id:'pescado',categoria:'cocina',titulo:'Del mar a la mesa',sub:'Prepara pescado y arroz con coco.',Icon:Utensils,foto:'arroz_coco_pescado.jpg'},
  {id:'cocada',categoria:'cocina',titulo:'El sabor de las cocadas',sub:'Descubre una preparación tradicional.',Icon:Utensils,foto:'dulces_isnelia.jpg'},
  {id:'bullerengue',categoria:'baile',titulo:'Entra a la rueda',sub:'Acércate al ritmo del bullerengue.',Icon:Music,foto:'bullerengue.jpg'},
  {id:'mapale',categoria:'baile',titulo:'Sigue el movimiento',sub:'Explora el baile del mapalé.',Icon:Music,foto:'mapale_cumbia.jpg'},
  {id:'oficios',categoria:'oficios',titulo:'Manos que construyen',sub:'Conoce los talleres y los saberes locales.',Icon:Hammer,foto:'carpinteria_ribera.jpg'},
];
const SUBS={sanFernando:'La forma de defender un paso',sanJose:'La batería junto al agua',casco:'Calles para encontrarse',sanRafael:'La fortificación y el cerro'};
const normal=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export default function IntroLandingIndex({onNavigateModule,onBackToThesis}){
  const [accion,setAccion]=useState(null),[enPortada,setEnPortada]=useState(true);
  const [canalAbierto,setCanalAbierto]=useState(()=>{const id=new URLSearchParams(window.location.search).get('experiencia');return id==='canal'?'sanFernando':Object.hasOwn(PATRIMONIO_ESCENAS,id)?id:null;});
  const [filtro,setFiltro]=useState('todo'),[busqueda,setBusqueda]=useState(''),[seccion,setSeccion]=useState('inicio');
  const portada=useRef(null);
  const abrirCanal=useCallback((nodo='sanFernando')=>{const id=Object.hasOwn(PATRIMONIO_ESCENAS,nodo)?nodo:'sanFernando';setCanalAbierto(id);const url=new URL(window.location.href);url.searchParams.set('experiencia',id);window.history.replaceState(null,'',url);},[]);
  const cerrarCanal=useCallback(()=>{setCanalAbierto(null);const url=new URL(window.location.href);if(['canal',...Object.keys(PATRIMONIO_ESCENAS)].includes(url.searchParams.get('experiencia'))){url.searchParams.delete('experiencia');window.history.replaceState(null,'',url);}},[]);
  const saltar=useCallback(id=>{const el=document.getElementById(id);if(!el)return;const heading=el.querySelector('h1,h2');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});el.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});},[]);
  const entrar=useCallback(id=>{cargarAula();setAccion({id,turno:Date.now()});setEnPortada(false);window.scrollTo({top:0,behavior:'instant'});},[]);
  const volver=useCallback(()=>{setEnPortada(true);setAccion(null);window.scrollTo({top:0,behavior:'instant'});},[]);
  useEffect(()=>{
    if(!enPortada)return undefined;
    const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)setSeccion(e.target.id);},{rootMargin:'-12% 0px -65% 0px',threshold:0});
    portada.current?.querySelectorAll('[data-ex-seccion]').forEach(el=>io.observe(el));
    return()=>io.disconnect();
  },[enPortada]);
  const resultados=ACTIVIDADES.filter(a=>(filtro==='todo'||a.categoria===filtro)&&normal(`${a.titulo} ${a.sub} ${a.categoria}`).includes(normal(busqueda)));
  return <div className="community-entry ex-root" ref={portada}>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500&family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap"/>
    {enPortada?<>
      <HeroTerritorio suspendida={Boolean(canalAbierto)} onExplorar={()=>entrar('isla')} onPatrimonio={()=>saltar('patrimonio')} onActividades={()=>saltar('experiencias')} onBackToThesis={onBackToThesis}/>
      <nav className="ex-section-nav" aria-label="Recorrer la página"><span><i/>Descubre Tierra Bomba</span><div>{[['inicio','Inicio'],['patrimonio','Patrimonio'],['experiencias','Experiencias']].map(([id,label])=><button type="button" key={id} aria-current={seccion===id?'location':undefined} onClick={()=>saltar(id)}>{label}</button>)}<button type="button" className="ex-nav-mapa" onPointerEnter={cargarAula} onFocus={cargarAula} onClick={()=>entrar('isla')}>Abrir el mapa <ArrowUpRight size={14}/></button></div></nav>
      <section id="patrimonio" className="ex-section" data-ex-seccion>
        <Reveal><div className="ex-section-heading"><div><p className="ex-eyebrow">01 / Arquitectura y territorio</p><h2>La historia<br/><span>se pone en movimiento.</span></h2></div><p>Cuatro lugares. Cuatro formas de entender cómo se construye y se habita este territorio. Elige uno para entrar.</p></div></Reveal>
        <div className="ex-patrimonio-grid">{Object.entries(PATRIMONIO_ESCENAS).map(([id,d],i)=><Reveal key={id} delay={i*65}><button type="button" className="ex-patrimonio-card" onPointerEnter={cargarPatrimonio} onFocus={cargarPatrimonio} onClick={()=>abrirCanal(id)} aria-label={`Explorar ${d.nombre}`}><div className="ex-card-visual"><VistaPatrimonio lugar={id}/><span className="ex-card-number">0{i+1}</span><span className="ex-card-open"><ArrowUpRight size={20}/></span></div><div className="ex-card-info"><h3>{d.nombre}</h3><p>{SUBS[id]}</p><span>Entrar a la animación <ArrowRight size={13}/></span></div></button></Reveal>)}</div>
      </section>
      <section className="ex-territorio-band" aria-label="Explorar los pueblos"><Reveal><div className="ex-band-copy"><p className="ex-eyebrow">02 / El territorio habitado</p><h2>La isla se conoce<br/>recorriéndola.</h2><p>Bocachica, Tierra Bomba, Caño de Loro y Punta Arena. Entra al mapa y elige por dónde empezar.</p><button type="button" className="ex-primary" onPointerEnter={cargarAula} onFocus={cargarAula} onClick={()=>entrar('isla')}>Conocer los pueblos <Compass size={18}/></button></div></Reveal><div className="ex-band-rutas" aria-hidden="true"><span>Bocachica</span><i/><span>Tierra Bomba</span><i/><span>Caño de Loro</span><i/><span>Punta Arena</span><MapPin size={160}/></div></section>
      <section id="experiencias" className="ex-section" data-ex-seccion>
        <Reveal><div className="ex-section-heading"><div><p className="ex-eyebrow">03 / Aprender haciendo</p><h2>Saberes que<br/><span>siguen vivos.</span></h2></div><p>Cocina, baila y descubre los oficios. Cada experiencia es una invitación a participar.</p></div></Reveal>
        <div className="ex-filtros"><div role="group" aria-label="Filtrar experiencias">{[['todo','Todas'],['cocina','Cocina'],['baile','Baile'],['oficios','Oficios']].map(([id,label])=><button type="button" key={id} aria-pressed={filtro===id} onClick={()=>setFiltro(id)}>{label}</button>)}</div><label className="ex-search"><Search size={15}/><input type="search" aria-label="Buscar experiencias" placeholder="¿Qué quieres descubrir?" value={busqueda} onChange={e=>setBusqueda(e.target.value)}/></label></div>
        <p className="ex-results" role="status">{resultados.length} {resultados.length===1?'experiencia':'experiencias'}</p>
        <div className="ex-experiencias-grid">{resultados.map(({id,titulo,sub,Icon,foto,categoria})=><button type="button" key={id} className="ex-actividad" onPointerEnter={cargarAula} onFocus={cargarAula} onClick={()=>entrar(id)}><div className="ex-actividad-img"><img src={`${BASE}images/memorias/${foto}`} alt="" loading="lazy" decoding="async"/><span><Icon size={17}/>{categoria==='baile'?'Baile':categoria==='cocina'?'Cocina':'Oficios'}</span><i><ArrowUpRight size={22}/></i></div><div><h3>{titulo}</h3><p>{sub}</p></div></button>)}</div>
        {resultados.length===0&&<div className="ex-empty"><p>No encontramos esa experiencia.</p><button type="button" onClick={()=>{setBusqueda('');setFiltro('todo');}}>Ver todas las experiencias <ArrowRight size={14}/></button></div>}
      </section>
      <footer className="ex-footer"><div><strong>Tierra Bomba.</strong><p>Territorio, memoria y comunidad.</p></div><div><span>Alejandra Gómez · Ana Casas</span><span>Arquitectura · Pontificia Universidad Javeriana</span></div><button type="button" onClick={()=>saltar('inicio')}>Volver al inicio <ArrowUp size={16}/></button></footer>
    </>:<div className="ex-explorer"><Suspense fallback={<div className="ex-loading" role="status"><i/><h2>Entrando al territorio</h2><p>Preparando tu experiencia…</p><button type="button" onClick={volver}>Volver al inicio</button></div>}><AulaAmbientalBocachica onExplorarCanal={abrirCanal} canalAbierto={canalAbierto} accionInicial={accion} enPortada={false} onBackToPortada={volver} onNavigateModule={onNavigateModule}/></Suspense></div>}
    {canalAbierto&&<Suspense fallback={<div className="ex-loading ex-loading-overlay" role="status"><i/><h2>El patrimonio toma forma</h2><p>Preparando la animación…</p><button type="button" onClick={cerrarCanal}>Volver</button></div>}><PatrimonioCanal key={canalAbierto} lugar={canalAbierto} onElegirLugar={abrirCanal} onClose={cerrarCanal}/></Suspense>}
  </div>;
}
