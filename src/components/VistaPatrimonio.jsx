import React, { useEffect, useRef } from 'react';
export default function VistaPatrimonio({ lugar }){
  const ref=useRef(null);
  useEffect(()=>{
    let viva=true,escena=null;const el=ref.current;
    const io=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;io.disconnect();import('../utils/escenaPatrimonioPuntos').then(({crearEscenaPatrimonio})=>{if(viva)escena=crearEscenaPatrimonio(el,{lugar,reducida:true,rotulos:false});});},{rootMargin:'150px'});io.observe(el);
    return()=>{viva=false;io.disconnect();escena?.dispose?.();};
  },[lugar]);
  return <canvas ref={ref} className="ex-preview" aria-hidden="true"/>;
}
