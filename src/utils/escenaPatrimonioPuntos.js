// Interpretación volumétrica de San Fernando, no levantamiento del monumento.
// All visible surfaces are independent 3D points, projected on a 2D canvas so the
// animation also works on devices without WebGL. No photograph is drawn.
const TAU = Math.PI * 2;
const smooth = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
export const FASES_CANAL = [
  { titulo: 'El fuerte toma forma', texto: 'Una arquitectura orientada al paso de agua.' },
  { titulo: 'La embarcación entra al canal', texto: 'La forma curva de San Fernando se abre hacia el canal de Bocachica.' },
  { titulo: 'Dos orillas, una defensa', texto: 'San Fernando y San José se relacionaban a través del paso marítimo.' },
];

export function crearEscenaPatrimonio(canvas, { onFase, onError, reducida = false } = {}) {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) { onError?.(); return () => {}; }
  let seed = 71;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const mobile = window.innerWidth < 760;
  const puntos = [], agua = [], barco = [], estela = [];
  const piedra = ['#e5d3a7', '#bbaa83', '#d0bd94', '#f1dfb7', '#988d6d'];
  const put = (arr, x, y, z, c, size = .9, tipo = 0) => arr.push({ x, y, z, c, size, f: random(), sx: (random() - .5) * 22, sy: random() * 12, sz: (random() - .5) * 18, tipo });
  const stone = () => piedra[Math.floor(random() * piedra.length)];
  const paso = mobile ? .11 : .075;
  function pared(a, b, alto, arr = puntos, color = null, baseY = 0) {
    const largo = Math.hypot(b[0] - a[0], b[1] - a[1]);
    for (let d = 0; d <= largo; d += paso) for (let y = 0; y < alto; y += paso) {
      const t = d / largo;
      put(arr, a[0] + (b[0] - a[0]) * t, baseY + y, a[1] + (b[1] - a[1]) * t, color || stone());
    }
  }
  function poligono(poly, alto, cx, cz, escala = 1) {
    const p = poly.map(([x,z]) => [cx + x * escala, cz + z * escala]);
    p.forEach((a,i) => pared(a,p[(i + 1) % p.length],alto));
    // Roof filling using a deterministic point-in-polygon test.
    const xs = p.map(v=>v[0]), zs=p.map(v=>v[1]);
    for(let x=Math.min(...xs);x<Math.max(...xs);x+=paso) for(let z=Math.min(...zs);z<Math.max(...zs);z+=paso){
      let inside=false;
      for(let i=0,j=p.length-1;i<p.length;j=i++) if((p[i][1]>z)!==(p[j][1]>z)&&x<(p[j][0]-p[i][0])*(z-p[i][1])/(p[j][1]-p[i][1])+p[i][0]) inside=!inside;
      if(inside) put(puntos,x,alto,z,stone(),1);
    }
  }
  const fx = -2.35, fz = -2.8;
  // Semicircular maritime battery, inner courtyard, thick parapet and archways.
  for (let a=0;a<=Math.PI;a+=paso/3) {
    const sa=Math.sin(a), ca=Math.cos(a), outer=3.15, inner=2.48;
    for (let y=0;y<1.3;y+=paso) {
      const tronera = y > 1.05 && (a * 21 / Math.PI) % 1 < .38;
      if (!tronera) put(puntos, fx + ca*outer, y, fz + sa*2.8, stone(),1.05);
      const cell=(a*13/Math.PI)%1, archTop=.48+Math.sqrt(Math.max(0,1-Math.pow((cell-.5)*2,2)))*.38;
      if (y>archTop || cell<.13 || cell>.87) put(puntos,fx+ca*inner,y,fz+sa*2.15,stone());
    }
    for(let r=inner;r<outer;r+=paso) put(puntos,fx+ca*r,1.03,fz+sa*(r*.89),stone());
    for(let r=0;r<inner;r+=paso*1.3) put(puntos,fx+ca*r,.025,fz+sa*(r*.87),'#6b735c',.72);
    // Distinct individual merlons along the top edge.
    if ((a*21/Math.PI)%1>.38) put(puntos,fx+ca*outer,1.33,fz+sa*2.8,'#f2dfb5',1.3);
  }
  pared([fx-3.15,fz],[fx+3.15,fz],1.35);
  for(let x=fx-3.1;x<fx+3.1;x+=paso)for(let z=fz-.5;z<fz;z+=paso)put(puntos,x,1.35,z,stone());
  // Two angular land-facing bastions, characteristic of the fort's silhouette.
  const bastion=[[-.85,.35],[-1.12,-.55],[-.28,-1.15],[.72,-.62],[.85,.35],[.15,.65]];
  poligono(bastion,1.5,fx-2.4,fz-.25,.92);
  poligono(bastion,1.5,fx+2.4,fz-.25,.92);
  // Entry passage and two small roofed volumes around the courtyard.
  pared([fx-.45,fz-.5],[fx-.45,fz+.55],.85);
  pared([fx+.45,fz-.5],[fx+.45,fz+.55],.85);
  for(let x=-.43;x<.44;x+=paso)for(let z=-.5;z<.55;z+=paso)put(puntos,fx+x,.9-Math.abs(x)*.4,fz+z,'#ae7754');
  // Shore behind the fort. Sparse dark particles keep water/architecture legible.
  for(let i=0;i<(mobile?1600:2800);i++){
    const x=-8+random()*12,z=-8+random()*5.2;
    put(puntos,x,-.08+random()*.12,z,random()>.5?'#304b3a':'#597253',.75,1);
  }
  // San José on the opposite side of the same animated water scene.
  poligono([[-1,-.55],[.2,-.75],[1,-.2],[1,.6],[-.6,.65]],.65,2.6,6.7,.85);
  for(let i=0;i<800;i++)put(puntos,2.6+(random()-.5)*3.1,-.09,6.8+(random()-.5)*2.1,'#405b4c',.8,1);
  // Moving sea: waves are displacement of the points, not a texture overlay.
  for(let i=0;i<(mobile?2600:5200);i++){
    const x=-12+random()*25,z=-2+random()*13;
    if (z<.3 && x<1.3 && x>-6) continue;
    put(agua,x,-.16,z,['#3a878c','#26535f','#61b6b6','#91d3c4'][Math.floor(random()*4)],.75);
  }
  // Vessel: pointed wooden hull, two masts and billowing sails in particles.
  for(let x=-.95;x<=.95;x+=.045)for(let a=0;a<=Math.PI;a+=.1){
    const r=.32*Math.pow(Math.max(0,1-x*x),.5);
    put(barco,x,.24-Math.sin(a)*r*.75,Math.cos(a)*r,random()>.5?'#d7aa75':'#98764d',1.15);
  }
  for(const mast of [-.35,.3]) {
    for(let y=.2;y<1.7;y+=.04)put(barco,mast,y,0,'#e8d2a6',1.2);
    for(let u=0;u<1;u+=.055)for(let v=0;v<1;v+=.055){
      const breadth=(1-u)*.72;
      put(barco,mast+v*breadth,.45+u*1.15,.03,'#eee6c9',1.05,2);
    }
  }
  for(let i=0;i<420;i++)put(estela,-random()*4,0,(random()-.5)*.65,'#95dcd1',.85);
  let w=1,h=1,dpr=1,raf=0,alive=true,visible=true,pausado=false,elapsed=0,last=0,lastDraw=0,oldFase=-1;
  let mouseX=0,mouseY=0,yaw=-.25,pitch=.63;
  const resize=()=>{const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);if(reducida)draw(9);};
  const project=(x,y,z)=>{
    const xx=x*Math.cos(yaw)-z*Math.sin(yaw), zz=x*Math.sin(yaw)+z*Math.cos(yaw);
    const yy=y*Math.cos(pitch)-zz*Math.sin(pitch), depth=24-y*Math.sin(pitch)-zz*Math.cos(pitch);
    const scale=Math.min(w/(mobile?15:20),h/(mobile?17:14))*24/depth;
    return {x:w*(mobile?.5:.60)+xx*scale,y:h*(mobile?.47:.52)-yy*scale,z:depth,scale};
  };
  function draw(t){
    ctx.fillStyle='#050b0e';ctx.fillRect(0,0,w,h);
    const cycle=(t%22)/22, build=reducida?1:smooth(t/3.2);
    const phase=cycle<.19?0:cycle<.55?1:2;
    if(phase!==oldFase){oldFase=phase;onFase?.(phase);}
    yaw += ((-.25 + mouseX*.22 + (reducida?0:Math.sin(t*.16)*.07))-yaw)*.05;
    pitch += ((.63 + mouseY*.07)-pitch)*.05;
    const shipX=-7+smooth(Math.max(0,(cycle-.12)/.85))*12;
    const shipZ=3.1+Math.sin(cycle*Math.PI)*.45, bob=reducida?0:Math.sin(t*1.8)*.08;
    const buffer=[];
    function append(q,x,y,z,alpha=1,size=q.size){const p=project(x,y,z);if(p.x<-3||p.x>w+3||p.y<-3||p.y>h+3)return;buffer.push({...p,c:q.c,a:alpha,s:Math.max(.45,Math.min(2.4,p.scale*.0155*size))});}
    for(const q of agua){const wave=reducida?0:Math.sin(q.x*1.4+q.z*.85-t*1.6)*.08+Math.cos(q.z*2-t)*.04;append(q,q.x,q.y+wave,q.z,.27+.25*(.5+.5*Math.sin(q.f*TAU+t)));}
    for(const q of puntos){const k=smooth((build-q.f*.22)/.78);append(q,q.x*k+q.sx*(1-k),q.y*k+q.sy*(1-k),q.z*k+q.sz*(1-k),q.tipo===1?.45:.85, q.tipo===1?.75:q.size);}
    if(cycle>.12||reducida){for(const q of barco){const sail=q.tipo===2&&!reducida?Math.sin(q.y*3+t*3)*.1:0;append(q,shipX+q.x,.1+q.y+bob,shipZ+q.z+sail,.95,1.25);}for(const q of estela){const pulse=(q.f+t*.35)%1;append(q,shipX+q.x-pulse*.6,-.08+Math.sin(q.f*TAU+t)*.04,shipZ+q.z*(1+pulse*1.5),.4*(1-pulse),.9);}}
    // A moving chain of dots links the maritime face and vessel, illustrating
    // the territorial relation. This is not a calculated artillery range.
    if(phase===2){for(const from of [[fx,1.1,fz+2.6],[2.6,.7,6.7]])for(let i=0;i<60;i++){const u=(i/60+(reducida?0:t*.11))%1;append({c:'#f1a37b',size:1},from[0]+(shipX-from[0])*u,from[1]+(.6-from[1])*u,from[2]+(shipZ-from[2])*u,.45+Math.sin(u*Math.PI)*.4,1);}}
    buffer.sort((a,b)=>b.z-a.z);
    for(const p of buffer){ctx.globalAlpha=p.a;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,TAU);ctx.fill();}
    ctx.globalAlpha=1;
    if(build>.9){label('SAN FERNANDO',fx,1.7,fz-.3,'#e6d7b8');label('SAN JOSÉ',2.6,.95,6.7,'#b7c9ba');}
    ctx.fillStyle='#739a9c';ctx.font='10px "Geist Mono",monospace';ctx.textAlign='left';ctx.fillText('MAR CARIBE',w*.08,h*.63);
    ctx.textAlign='right';ctx.fillText('BAHÍA DE CARTAGENA →',w*.93,h*.71);
  }
  function label(text,x,y,z,color){const p=project(x,y,z);ctx.font=`${mobile?9:10}px "Geist Mono",monospace`;ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(text,p.x,p.y-15);ctx.strokeStyle=color;ctx.globalAlpha=.4;ctx.beginPath();ctx.moveTo(p.x,p.y-9);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.globalAlpha=1;}
  const frame=t=>{if(!alive)return;raf=requestAnimationFrame(frame);const dt=last?Math.min(t-last,1000):0;last=t;if(!visible||document.hidden)return;if(!pausado&&!reducida)elapsed+=dt/1000;if(t-lastDraw<40)return;lastDraw=t;draw(reducida?13:elapsed);};
  const move=e=>{const r=canvas.getBoundingClientRect();mouseX=(e.clientX-r.left)/r.width-.5;mouseY=(e.clientY-r.top)/r.height-.5;};
  const leave=()=>{mouseX=0;mouseY=0;};
  const ro=new ResizeObserver(resize);ro.observe(canvas);
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;});io.observe(canvas);
  canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',leave);
  resize();raf=requestAnimationFrame(frame);
  return { pausar(v){pausado=v;}, repetir(){elapsed=0;oldFase=-1;}, dispose(){alive=false;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);} };
}
