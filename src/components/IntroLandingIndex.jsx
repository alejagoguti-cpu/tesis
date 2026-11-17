import React, { Suspense, lazy, useState, useCallback } from 'react';
import { MapPin, Utensils, Music, Hammer, Landmark, ArrowRight } from 'lucide-react';
import './comunidad-facil.css';
const PatrimonioCanal = lazy(() => import('./PatrimonioCanal'));
const AulaAmbientalBocachica = lazy(() => import('./AulaAmbientalBocachica'));
const ACTIVIDADES = [
  { id:'canal', titulo:'San Fernando en movimiento', Icon:Landmark, foto:'images/patrimonio/san-fernando-aerea.jpg' },
  { id:'pescado', titulo:'Cocinar pescado', Icon:Utensils, foto:'images/memorias/arroz_coco_pescado.jpg' },
  { id:'cocada', titulo:'Hacer cocadas', Icon:Utensils, foto:'images/memorias/dulces_isnelia.jpg' },
  { id:'bullerengue', titulo:'Bailar bullerengue', Icon:Music, foto:'images/memorias/bullerengue.jpg' },
  { id:'mapale', titulo:'Bailar mapalé', Icon:Music, foto:'images/memorias/mapale_cumbia.jpg' },
  { id:'isla', titulo:'Conocer los pueblos', Icon:MapPin, foto:'textures/tierrabomba_satelite.jpg' },
  { id:'oficios', titulo:'Descubrir talleres', Icon:Hammer, foto:'images/memorias/carpinteria_ribera.jpg' },
];
export default function IntroLandingIndex({onNavigateModule,onBackToThesis}) {
  const [accion,setAccion]=useState(null);
  const [canalAbierto,setCanalAbierto]=useState(() => { const id = new URLSearchParams(window.location.search).get('experiencia'); return id === 'canal' ? 'sanFernando' : ['sanFernando','sanJose','sanRafael','casco'].includes(id) ? id : null; });
  const abrirCanal = useCallback((nodo = 'sanFernando') => {
    const id = ['sanFernando','sanJose','sanRafael','casco'].includes(nodo) ? nodo : 'sanFernando';
    setCanalAbierto(id);
    const url = new URL(window.location.href); url.searchParams.set('experiencia', id); window.history.replaceState(null, '', url);
  }, []);
  const cerrarCanal = useCallback(() => {
    setCanalAbierto(null);
    const url = new URL(window.location.href);
    if (['canal','sanFernando','sanJose','sanRafael','casco'].includes(url.searchParams.get('experiencia'))) { url.searchParams.delete('experiencia'); window.history.replaceState(null, '', url); }
  }, []);
  const [enPortada,setEnPortada]=useState(true);
  return <div className="community-entry cf-hub-root">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500&family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap"/>
    <section id="comunidad-portada-hero" className="cf-hub">
      <div className="cf-hub-backdrop" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}textures/tierrabomba_satelite.jpg`} alt=""/></div>
      <div className="cf-hub-frame" aria-hidden="true"/>
      <header><span>Tierra Bomba</span><span>Comunidad · Cartagena</span></header>
      <div className="cf-hub-intro"><p>Territorio · Cultura · Vida en la isla</p><h1>Tierra Bomba</h1></div>
      <h2>¿Qué quieres hacer?</h2>
      <div className="cf-hub-grid">{ACTIVIDADES.map(({id,titulo,Icon,foto})=><button type="button" key={id} onClick={()=>{if(id==='canal'){abrirCanal();return;}setEnPortada(false);setAccion({id,turno:Date.now()});}}>
        <img src={`${import.meta.env.BASE_URL}${foto}`} alt="" loading={id==='isla'?'eager':'lazy'}/>
        <span className="cf-hub-label"><Icon aria-hidden="true" size={28}/><strong>{titulo}</strong><ArrowRight aria-hidden="true" size={23}/></span>
      </button>)}</div>
      <p className="cf-hub-pista">Toca una foto para empezar.</p>
      <footer>{onBackToThesis&&<button type="button" onClick={onBackToThesis}>Ver la tesis</button>}<span>Alejandra Gómez · Ana Casas</span></footer>
    </section>
    <Suspense fallback={<div className="cf-hub-loading" role="status">Preparando la isla…</div>}>
      <AulaAmbientalBocachica onExplorarCanal={abrirCanal} canalAbierto={canalAbierto} accionInicial={accion} enPortada={enPortada} onBackToPortada={()=>{setEnPortada(true);document.getElementById('comunidad-portada-hero')?.scrollIntoView({behavior:'instant'});}} onNavigateModule={onNavigateModule}/>
    </Suspense>
    {canalAbierto && <Suspense fallback={<div className="cf-hub-loading" role="status">Preparando el patrimonio en puntos…</div>}><PatrimonioCanal key={canalAbierto} lugar={canalAbierto} onElegirLugar={abrirCanal} onClose={cerrarCanal}/></Suspense>}
  </div>;
}
