import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ArrowRight, Pause, Play } from 'lucide-react';
import './experiencia-comunidad.css';
const BASE=import.meta.env.BASE_URL;
const cargar=src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;});

function IslaPuntos({ pausada }){
  const canvas=useRef(null),pause=useRef(pausada);pause.current=pausada;
  const [lista,setLista]=useState(false),[fallo,setFallo]=useState(false);
  useEffect(()=>{
    const el=canvas.current,ctx=el.getContext('2d');if(!ctx){setFallo(true);return undefined;}
    let vivo=true,raf=0,w=1,h=1,dpr=1,visible=true,last=0,clock=0,old=0,mx=0,my=0,px=0,py=0;
    let puntos=[],dirty=true;const media=window.matchMedia('(prefers-reduced-motion: reduce)');let reduce=media.matches;
    const resize=()=>{dirty=true;const r=el.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,1.5);el.width=Math.round(w*dpr);el.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};
    const move=e=>{const r=el.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5;};
    const leave=()=>{mx=0;my=0;};
    const changed=e=>{reduce=e.matches;dirty=true;};media.addEventListener('change',changed);
    const ro=new ResizeObserver(resize);ro.observe(el);
    const io=new IntersectionObserver(([e])=>visible=e.isIntersecting);io.observe(el);
    el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
    const draw=t=>{
      if(!vivo)return;raf=requestAnimationFrame(draw);const dt=last?Math.min(t-last,100):0;last=t;
      if(!visible||document.hidden||pause.current||t-old<45)return;old=t;if(reduce&&!dirty)return;dirty=false;if(!pause.current&&!reduce)clock+=dt;
      px+=(mx-px)*.06;py+=(my-py)*.06;
      ctx.clearRect(0,0,w,h);
      const size=Math.min(w*.83,h*1.02),cx=w*.52+px*20,cy=h*.51+py*15;
      const angle=reduce?-.11:-.11+Math.sin(clock*.00017)*.045+px*.09;
      ctx.strokeStyle='#54958e';ctx.lineWidth=.7;ctx.globalAlpha=.2;
      for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(cx,cy+size*.1,size*(.5+i*.07),size*(.4+i*.05),angle,0,Math.PI*2);ctx.stroke();}
      ctx.globalAlpha=1;
      const intro=reduce?1:Math.min(1,clock/1500),k=1-Math.pow(1-intro,3);
      for(const p of puntos){
        const xx=p.x*Math.cos(angle)-p.y*Math.sin(angle),yy=p.x*Math.sin(angle)+p.y*Math.cos(angle);
        const offset=(1-k)*(p.f-.5)*size;
        const x=cx+xx*size+offset,y=cy+yy*size*.88+offset*.6+(reduce?0:Math.sin(clock*.0007+p.f*10)*.8);
        ctx.globalAlpha=(.65+p.l*.3)*k;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(x,y,Math.max(.65,size/270*(.32+p.l*.38)),0,Math.PI*2);ctx.fill();
      }
      // A few moving currents around the coast keep the scene alive without a
      // second 3D renderer or a full-screen satellite texture.
      for(let i=0;i<55;i++){const a=i*2.399+clock*.000045,r=size*(.57+(i%5)*.018);ctx.globalAlpha=.15+(i%3)*.07;ctx.fillStyle='#8ecbc0';ctx.beginPath();ctx.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r*.8,1,0,7);ctx.fill();}
      ctx.globalAlpha=1;
    };
    Promise.all([cargar(`${BASE}textures/isla_mascara.png`),cargar(`${BASE}textures/sat_base.jpg`)]).then(([mask,sat])=>{
      if(!vivo)return;const c=document.createElement('canvas');c.width=180;c.height=Math.round(180*mask.height/mask.width);const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(mask,0,0,c.width,c.height);const m=x.getImageData(0,0,c.width,c.height).data;x.drawImage(sat,0,0,c.width,c.height);const rgb=x.getImageData(0,0,c.width,c.height).data;
      let left=c.width,right=0,top=c.height,bottom=0;
      for(let j=0;j<c.height;j++)for(let i=0;i<c.width;i++)if(m[(j*c.width+i)*4]>150){left=Math.min(left,i);right=Math.max(right,i);top=Math.min(top,j);bottom=Math.max(bottom,j);}
      const span=Math.max(right-left,bottom-top);
      for(let j=top;j<=bottom;j++)for(let i=left;i<=right;i++){const o=(j*c.width+i)*4;if(m[o]<150)continue;const lum=(rgb[o]+rgb[o+1]+rgb[o+2])/765,f=((i*37+j*17)%101)/101;
        puntos.push({x:(i-(left+right)/2)/span,y:(j-(top+bottom)/2)/span,f,l:lum,c:`rgb(${Math.round(rgb[o]*.65+80)},${Math.round(rgb[o+1]*.65+87)},${Math.round(rgb[o+2]*.6+75)})`});}
      clock=0;dirty=true;setLista(true);
    }).catch(()=>{if(vivo)setFallo(true);});
    resize();raf=requestAnimationFrame(draw);
    return()=>{vivo=false;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();media.removeEventListener('change',changed);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);};
  },[]);
  return <><canvas ref={canvas} className="ex-isla-canvas" role="img" aria-label="Silueta de Tierra Bomba en puntos de color, con movimiento suave al acercar el cursor"/>{!lista&&!fallo&&<span className="ex-isla-cargando">La isla toma forma…</span>}{fallo&&<img className="ex-isla-fallback" src={`${BASE}textures/isla_mascara.png`} alt="Silueta de Tierra Bomba"/>}</>;
}

export default function HeroTerritorio({onExplorar,onPatrimonio,onActividades,onBackToThesis,academico=false,suspendida=false}){
  const [pausada,setPausada]=useState(false);
  return <section className={`ex-hero ${academico?'ex-hero-tesis':''}`} id="inicio" aria-label="Bienvenida a Tierra Bomba" data-ex-seccion>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500&family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap"/>
    <header className="ex-header"><a href="#inicio" onClick={e=>{e.preventDefault();document.getElementById('inicio')?.scrollIntoView({behavior:'smooth'});}} className="ex-marca"><i/><span>Tierra Bomba<small>{academico?'Arquitectura y territorio':'Un territorio para descubrir'}</small></span></a>
      <nav aria-label="Navegación principal"><button type="button" onClick={onExplorar}>Explorar</button><button type="button" onClick={onPatrimonio}>{academico?'La investigación':'Patrimonio'}</button>{onActividades&&<button type="button" onClick={onActividades}>Actividades</button>}</nav>
      {onBackToThesis?<button type="button" className="ex-nav-link" onClick={onBackToThesis}>Ver la tesis <ArrowUpRight size={15}/></button>:<span className="ex-edicion">Cartagena · Colombia</span>}
    </header>
    <div className="ex-hero-copy"><p className="ex-eyebrow"><span/>Cartagena · Una isla, muchas historias</p><h1>Tierra<span>Bomba<span className="ex-punto">.</span></span></h1><p className="ex-hero-sub">{academico?'Planificación y adaptación territorial frente a la pérdida de suelo costero.':'Un territorio que se recorre, se recuerda y se vive.'}</p><p className="ex-hero-desc">{academico?'Una investigación que conecta el paisaje, la memoria y las formas de habitar la isla.':'Entra a sus pueblos. Descubre la arquitectura de sus fuertes. Aprende con los saberes de su comunidad.'}</p>
      <div className="ex-hero-acciones"><button type="button" className="ex-primary" onClick={onExplorar}>{academico?'Entrar a la comunidad':'Explorar la isla'}<ArrowUpRight size={19}/></button><button type="button" className="ex-secondary" onClick={onPatrimonio}>{academico?'Conocer la investigación':'Descubrir el patrimonio'}<ArrowRight size={16}/></button></div>
    </div>
    <div className="ex-hero-isla"><IslaPuntos pausada={pausada||suspendida}/><span className="ex-coordenada">10° N / 75° O</span><span className="ex-isla-caption">Tierra Bomba<br/><small>{academico?'Territorio · Memoria · Adaptación':'Explora a tu ritmo'}</small></span><button className="ex-motion" type="button" onClick={()=>setPausada(v=>!v)} aria-label={pausada?'Reanudar movimiento de la isla':'Pausar movimiento de la isla'}>{pausada?<Play size={14}/>:<Pause size={14}/>}</button>
      {!academico&&<button type="button" className="ex-isla-pin" onClick={onPatrimonio}><i/><span>El patrimonio<br/><small>Cuatro lugares en movimiento</small></span><ArrowUpRight size={15}/></button>}
    </div>
    <footer className="ex-hero-bottom"><span>Territorio · Patrimonio · Comunidad</span><button type="button" onClick={onPatrimonio}>Sigue explorando <ArrowDown size={14}/></button><span>Alejandra Gómez · Ana Casas</span></footer>
  </section>;
}
