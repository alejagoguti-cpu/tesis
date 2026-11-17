import React, { Suspense, lazy, useState } from 'react';
import { MapPin, Utensils, Music, Hammer, ArrowRight } from 'lucide-react';
import { Escuchar, decir } from './ComunidadFacil';
import './comunidad-facil.css';
const AulaAmbientalBocachica = lazy(() => import('./AulaAmbientalBocachica'));
const ACTIVIDADES = [
  { id:'isla', titulo:'Conocer la isla', Icon:MapPin, foto:'textures/tierrabomba_satelite.jpg', voz:'Vamos a conocer la isla. Elige un pueblo.' },
  { id:'cocinar', titulo:'Cocinar', Icon:Utensils, foto:'images/memorias/arroz_coco_pescado.jpg', voz:'Vamos a cocinar. Elige la foto del pescado o de la cocada.' },
  { id:'bailar', titulo:'Bailar', Icon:Music, foto:'images/memorias/bullerengue.jpg', voz:'Vamos a bailar. Elige un baile.' },
  { id:'oficios', titulo:'Oficios', Icon:Hammer, foto:'images/memorias/carpinteria_ribera.jpg', voz:'Conoce los oficios. Toca una foto para descubrir el taller.' },
];
export default function IntroLandingIndex({onNavigateModule,onBackToThesis}) {
  const [accion,setAccion]=useState(null);
  return <div className="community-entry cf-hub-root">
    <section id="comunidad-portada-hero" className="cf-hub">
      <header><div><p>Comunidad</p><h1>Tierra Bomba</h1></div><Escuchar texto="Bienvenido a Tierra Bomba. Toca una foto. Puedes conocer la isla, cocinar, bailar o descubrir los oficios. Para regresar, toca la flecha que dice Volver."/></header>
      <h2>¿Qué quieres hacer?</h2>
      <div className="cf-hub-grid">{ACTIVIDADES.map(({id,titulo,Icon,foto,voz})=><button type="button" key={id} onClick={()=>{setAccion({id,turno:Date.now()});decir(voz);}}>
        <img src={`${import.meta.env.BASE_URL}${foto}`} alt="" loading={id==='isla'?'eager':'lazy'}/>
        <span className="cf-hub-label"><Icon aria-hidden="true" size={28}/><strong>{titulo}</strong><ArrowRight aria-hidden="true" size={23}/></span>
      </button>)}</div>
      <p className="cf-hub-pista">Toca una foto para empezar.</p>
      <footer>{onBackToThesis&&<button type="button" onClick={onBackToThesis}>Ver la tesis</button>}<span>Alejandra Gómez · Ana Casas</span></footer>
    </section>
    <Suspense fallback={<div className="cf-hub-loading" role="status">Preparando la isla…</div>}>
      <AulaAmbientalBocachica accionInicial={accion} onBackToPortada={()=>{window.speechSynthesis?.cancel();document.getElementById('comunidad-portada-hero')?.scrollIntoView({behavior:'instant'});}} onNavigateModule={onNavigateModule}/>
    </Suspense>
  </div>;
}
