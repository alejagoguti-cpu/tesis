// Interpretación volumétrica de San Fernando, no levantamiento del monumento.
// All visible surfaces are independent 3D points, projected on a 2D canvas so the
// animation also works on devices without WebGL. No photograph is drawn.
const TAU = Math.PI * 2;
const smooth = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
export function crearEscenaPatrimonio(canvas, { onFase, onError, reducida = false, lugar = 'sanFernando', rotulos = true } = {}) {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) { onError?.(); return () => {}; }
  let seed = 71;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const mobile = window.innerWidth < 760;
  const puntos = [], agua = [], barco = [], estela = [];
  const esFernando = lugar === 'sanFernando', esJose = lugar === 'sanJose', esCasco = lugar === 'casco', esRafael = lugar === 'sanRafael';
  const maritimo = esFernando || esJose;
  const etiquetas = [];
  const hill = (x,z) => { const r=Math.hypot(x+1,z+1.5); return r<3.1?2.35:2.35*Math.exp(-Math.pow((r-3.1)/2.8,2)); };
  const personaEn = u => esRafael ? (()=>{ const a=1.1+u*.8; const r=7.4-u*5.7; const x=-1+Math.cos(a)*r,z=-1.5+Math.sin(a)*r;return [x,hill(x,z)+.08,z];})() : [Math.sin(u*Math.PI)*.8,.06,6.8-u*7.6];
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
  if (esFernando) {
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
  etiquetas.push(['SAN FERNANDO',fx,1.7,fz-.3],['SAN JOSÉ',2.6,.95,6.7]);
  }
  // Other monuments use their own geometry and motion in the same renderer.
  function losa(x0,x1,z0,z1,y,color){for(let x=x0;x<x1;x+=paso*1.4)for(let z=z0;z<z1;z+=paso*1.4)put(puntos,x,y,z,color,.8);}
  function caja(x,z,wx,wz,alto,color,base=0){
    pared([x-wx/2,z-wz/2],[x+wx/2,z-wz/2],alto,puntos,color,base);
    pared([x+wx/2,z-wz/2],[x+wx/2,z+wz/2],alto,puntos,color,base);
    pared([x+wx/2,z+wz/2],[x-wx/2,z+wz/2],alto,puntos,color,base);
    pared([x-wx/2,z+wz/2],[x-wx/2,z-wz/2],alto,puntos,color,base);
    losa(x-wx/2,x+wx/2,z-wz/2,z+wz/2,base+alto,color);
  }
  function vivienda(x,z,wx,wz,color,alto=1.15){
    caja(x,z,wx,wz,alto,color);
    for(let xx=-wx/2-.12;xx<wx/2+.12;xx+=paso)for(let zz=-wz/2-.12;zz<wz/2+.12;zz+=paso)
      put(puntos,x+xx,alto+.12+(1-Math.abs(xx)/(wx/2+.12))*.48,z+zz,random()>.3?'#b77750':'#d39b6a');
    // Dark inset door and window points on the street-facing facade.
    const side=x<0?1:-1;
    for(let y=.05;y<.8;y+=paso)for(let dz=-.25;dz<.25;dz+=paso)put(puntos,x+side*(wx/2+.015),y,z+dz,'#223e3a');
  }
  function arbol(x,z,altura=1.8){
    for(let y=0;y<altura;y+=.08)for(let a=0;a<TAU;a+=.7)put(puntos,x+Math.cos(a)*.07,y,z+Math.sin(a)*.07,'#90744e',.7);
    for(let i=0;i<300;i++){const a=random()*TAU,r=Math.sqrt(random())*.7;put(puntos,x+Math.cos(a)*r,altura+random()*.6,z+Math.sin(a)*r,random()>.4?'#799c65':'#426c50',.9,3);}
  }
  if(esJose){
    // Angular low platform: two wings on the water, separate from the vault block.
    const shape=[[-3.6,-1.6],[1.6,-1.6],[1.6,-.35],[-.7,-.35],[-.7,1.15],[-3.6,1.15]];
    poligono(shape,.36,-.5,-1.4,1);
    for(let i=0;i<shape.length;i++){
      const a=shape[i],b=shape[(i+1)%shape.length];
      const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/paso);
      for(let k=0;k<n;k++){
        const u=k/n,x=-.5+a[0]+(b[0]-a[0])*u,z=-1.4+a[1]+(b[1]-a[1])*u;
        for(let y=.36;y<.7;y+=paso)if((k%9)>2)put(puntos,x,y,z,stone());
      }
    }
    // Seven vaulted bays with curved, individually visible roof shells.
    for(let bay=0;bay<7;bay++){
      const cx=-3.65+bay*.69;
      for(let a=0;a<=Math.PI;a+=.075)for(let zz=-4.1;zz<-2.7;zz+=paso)put(puntos,cx+Math.cos(a)*.33,.75+Math.sin(a)*.43,zz,stone());
      for(let y=.36;y<.79;y+=paso){put(puntos,cx-.33,y,-2.69,stone());put(puntos,cx+.33,y,-2.69,stone());}
    }
    caja(1,-3.35,.9,1.45,1.55,'#c3b58c');
    for(let i=0;i<1700;i++){const a=random()*TAU,r=2.3+random()*.9;put(puntos,-1.9+Math.cos(a)*r,-.08,-2.1+Math.sin(a)*r*.68,'#6c7861',.85,1);}
    // Distant opposite shore is intentionally small: the main subject is San José.
    for(let a=0;a<Math.PI;a+=.025)for(let y=0;y<.45;y+=paso)put(puntos,3.8+Math.cos(a)*1.3,y,6.4+Math.sin(a)*.9,stone(),.8);
    etiquetas.push(['SAN JOSÉ · BÓVEDAS',-1.5,1.5,-3.5],['BATERÍA BAJA',-2,.85,-.1],['SAN FERNANDO',3.8,.9,6.4]);
  }
  if(esCasco){
    // Interpretive urban fabric, not a replica of an identified block or church.
    losa(-5.7,5.7,-6,6,.0,'#46564b');
    losa(-1.1,1.1,-4.5,6.5,.025,'#b7a27b');
    losa(-3,3,-1.6,1.4,.035,'#a99e7e');
    const casas=[[-3.5,-4.4,2,1.45,'#c0a970'],[2.8,-4.4,1.9,1.5,'#79a7a6'],[-3.55,2.7,2.1,1.6,'#bd8f6d'],[3.4,2.5,1.9,1.7,'#a4b98a'],[-3.6,4.8,2,1.3,'#83aaa0'],[3.3,4.7,2,1.3,'#b9ac7a']];
    casas.forEach(c=>vivienda(...c));
    // Modest church volume with pitched roof and open belfry, clearly schematic.
    caja(0,-4.2,2.2,2.1,1.8,'#e1d3b2');
    for(let x=-1.2;x<1.2;x+=paso)for(let z=-5.35;z<-3.05;z+=paso)put(puntos,x,1.85+(1-Math.abs(x)/1.2)*.7,z,'#a97856');
    for(let y=0;y<1.35;y+=paso)for(let x=-.36;x<.36;x+=paso)if(y<.95+Math.sqrt(Math.max(0,.13-x*x)))put(puntos,x,y,-3.035,'#293e36');
    for(const side of [-1,1])caja(side*.75,-3.18,.32,.38,1,'#e1d3b2',1.8);
    pared([-.95,-3.18],[.95,-3.18],.18,puntos,'#e1d3b2',2.8);
    for(let y=2.97;y<3.35;y+=.07)put(puntos,0,y,-3.18,'#d4bf91',1.3);
    for(let x=-.16;x<=.16;x+=.06)put(puntos,x,3.2,-3.18,'#d4bf91',1.3);
    arbol(-3.3,.3,1.65);arbol(3.4,.1,1.6);
    // Simple pier at the waterfront, connected to the main pedestrian axis.
    losa(-.55,.55,6.1,8.2,.12,'#9b805d');
    for(let z=6.1;z<8.3;z+=.5)for(const side of [-1,1])for(let y=-.3;y<.15;y+=.07)put(puntos,side*.48,y,z,'#7e7456');
    etiquetas.push(['FACHADAS',-3.4,1.9,3],['PLAZA',1.9,.14,.5],['IGLESIA · ESQUEMA',0,3.6,-4],['BORDE DE AGUA',0,.3,7.8]);
  }
  if(esRafael){
    // Hill and elevated crescent battery. Terrain is illustrative, not surveyed.
    for(let i=0;i<(mobile?4800:8500);i++){
      const a=random()*TAU,r=Math.sqrt(random())*8,x=-1+Math.cos(a)*r,z=-1.5+Math.sin(a)*r;
      put(puntos,x,hill(x,z)-.06,z,random()>.45?'#5b7850':'#354f3c',.8,1);
    }
    for(let r=.4;r<8;r+=.42)for(let a=0;a<TAU;a+=.025){const x=-1+Math.cos(a)*r,z=-1.5+Math.sin(a)*r;put(puntos,x,hill(x,z)-.03,z,'#6f8e5b',.7,4);}
    const start=puntos.length;
    for(let a=0;a<=Math.PI;a+=paso/2.5){
      for(let y=0;y<.78;y+=paso)if(y<.5||(a*15/Math.PI)%1>.32)put(puntos,-1+Math.cos(a)*2.75,y,-1.5+Math.sin(a)*2.25,stone());
      for(let r=2.15;r<2.75;r+=paso)put(puntos,-1+Math.cos(a)*r,.5,-1.5+Math.sin(a)*r*.82,stone());
    }
    caja(-1,-2.5,2.35,1.15,1.15,'#c8bd96');
    // Sentry box at the forward edge, not a medieval tower.
    for(let a=0;a<TAU;a+=.16)for(let y=.55;y<1.45;y+=paso)put(puntos,-1+Math.cos(a)*.24,y,.77+Math.sin(a)*.24,stone());
    for(let r=0;r<.32;r+=paso)for(let a=0;a<TAU;a+=.2)put(puntos,-1+Math.cos(a)*r,1.7-r,.77+Math.sin(a)*r,stone());
    for(let i=start;i<puntos.length;i++)puntos[i].y+=2.35;
    // The ascending dotted path is not an asserted access route.
    for(let u=0;u<=1;u+=.005){const [x,y,z]=personaEn(u);put(puntos,x,y-.015,z,'#bdab78',1.25);}
    etiquetas.push(['ÁNGEL SAN RAFAEL',-1,4.3,-2],['CERRO DEL HORNO',-4.4,1.1,3.9]);
  }

  // Moving sea: waves are displacement of the points, not a texture overlay.
  for(let i=0;i<(mobile?2600:5200);i++){
    const x=-12+random()*25,z=-2+random()*13;
    if (esCasco && z<6.4) continue;
    if (esRafael && z<7.8) continue;
    if (esFernando && z<.3 && x<1.3 && x>-6) continue;
    if (esJose && z<.8 && x>-5.7 && x<1.5) continue;
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
    const scale=Math.min(w/(mobile?15:20),h/(mobile?17:14))*24/depth*(esCasco?.79:1);
    return {x:w*(mobile?.5:.60)+xx*scale,y:h*(mobile?.47:esCasco?.46:.52)-yy*scale,z:depth,scale};
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
    for(const q of puntos){const k=smooth((build-q.f*.22)/.78);append(q,q.x*k+q.sx*(1-k),(q.y+(q.tipo===3&&!reducida?Math.sin(t*.8+q.f*6)*.05:0))*k+q.sy*(1-k),q.z*k+q.sz*(1-k),q.tipo===1?.45:.85, q.tipo===1?.75:q.size);}
    if(maritimo&&(cycle>.12||reducida)){for(const q of barco){const sail=q.tipo===2&&!reducida?Math.sin(q.y*3+t*3)*.1:0;append(q,shipX+q.x,.1+q.y+bob,shipZ+q.z+sail,.95,1.25);}for(const q of estela){const pulse=(q.f+t*.35)%1;append(q,shipX+q.x-pulse*.6,-.08+Math.sin(q.f*TAU+t)*.04,shipZ+q.z*(1+pulse*1.5),.4*(1-pulse),.9);}}
    // A moving chain of dots links the maritime face and vessel, illustrating
    // the territorial relation. This is not a calculated artillery range.
    if(maritimo&&phase===2){for(const from of (esJose?[[-2,.6,.6],[3.8,.7,6.4]]:[[fx,1.1,fz+2.6],[2.6,.7,6.7]]))for(let i=0;i<60;i++){const u=(i/60+(reducida?0:t*.11))%1;append({c:'#f1a37b',size:1},from[0]+(shipX-from[0])*u,from[1]+(.6-from[1])*u,from[2]+(shipZ-from[2])*u,.45+Math.sin(u*Math.PI)*.4,1);}}
    function chain(a,b,color='#efd2a0',size=1){
      const d=Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
      for(let k=0;k<=d;k+=.035){const u=k/d;append({c:color,size},a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u,.95,size);}
    }
    function caminante(x,y,z,momento,color='#edbc91',scale=.85){
      const gait=reducida?0:Math.sin(momento*5.2)*.2;
      const P=(dx,dy,dz)=>[x+dx*scale,y+dy*scale,z+dz*scale];
      chain(P(0,.44,0),P(0,.91,0),color,1.6);
      chain(P(0,.47,0),P(gait,.05,.09),'#d3d4bd',1.35);
      chain(P(0,.47,0),P(-gait,.05,-.09),'#d3d4bd',1.35);
      chain(P(0,.79,0),P(-gait*.8,.46,.12),color,1.2);
      chain(P(0,.79,0),P(gait*.8,.46,-.12),color,1.2);
      for(let a=0;a<TAU;a+=.35)for(let b=.2;b<Math.PI;b+=.4)append({c:'#e4bc8d',size:1.1},x+Math.sin(b)*Math.cos(a)*.12*scale,y+(1.05+Math.cos(b)*.12)*scale,z+Math.sin(b)*Math.sin(a)*.12*scale,.95,1.2);
    }
    if(!maritimo&&build>.8){
      if(esCasco){
        for(let n=0;n<5;n++){
          const u=(cycle+n*.18)%1;
          const [x,y,z]=personaEn(u);
          caminante(x+(n%2?.45:-.45),y,z,t+n*1.4,['#f1c38e','#80bcb4','#c5d08b'][n%3],.9);
        }
        // Particles travel along the street and collect in the plaza.
        for(let n=0;n<90;n++){const u=(n/90+(reducida?0:t*.04))%1;const [x,y,z]=personaEn(u);append({c:'#f1ba83',size:1},x,y+.02,z,.5,1);}
      }
      if(esRafael){
        const u=smooth(Math.max(0,(cycle-.16)/.75)),[x,y,z]=personaEn(u);
        caminante(x,y,z,t,'#e9ca9c',1.1);
        if(phase===2)for(const target of [[-6,.1,7],[6,.1,6],[8,.1,0]])for(let n=0;n<70;n++){
          const f=(n/70+(reducida?0:t*.06))%1;
          append({c:'#e4ae78',size:1},-1+(target[0]+1)*f,3.15+(target[1]-3.15)*f,.7+(target[2]-.7)*f,.5,1);
        }
      }
    }

    buffer.sort((a,b)=>b.z-a.z);
    for(const p of buffer){ctx.globalAlpha=p.a;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,TAU);ctx.fill();}
    ctx.globalAlpha=1;
    if(rotulos&&build>.9)for(const [text,x,y,z] of etiquetas)label(text,x,y,z,'#e6d7b8');
    if(rotulos){ctx.fillStyle='#739a9c';ctx.font='10px "Geist Mono",monospace';ctx.textAlign='left';ctx.fillText(esCasco?'BORDE DE AGUA':esRafael?'CERRO DEL HORNO':'MAR CARIBE',w*.08,h*.63);
    ctx.textAlign='right';ctx.fillText(esCasco?'RECORRIDO PEATONAL':esRafael?'PAISAJE DE BOCACHICA':'BAHÍA DE CARTAGENA →',w*.93,h*.71);}
  }
  function label(text,x,y,z,color){const p=project(x,y,z);ctx.font=`${mobile?9:10}px "Geist Mono",monospace`;ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(text,p.x,p.y-15);ctx.strokeStyle=color;ctx.globalAlpha=.4;ctx.beginPath();ctx.moveTo(p.x,p.y-9);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.globalAlpha=1;}
  const frame=t=>{if(!alive)return;if(reducida){draw(13);return;}raf=requestAnimationFrame(frame);const dt=last?Math.min(t-last,1000):0;last=t;if(!visible||document.hidden)return;if(!pausado&&!reducida)elapsed+=dt/1000;if(t-lastDraw<40)return;lastDraw=t;draw(reducida?13:elapsed);};
  const move=e=>{const r=canvas.getBoundingClientRect();mouseX=(e.clientX-r.left)/r.width-.5;mouseY=(e.clientY-r.top)/r.height-.5;};
  const leave=()=>{mouseX=0;mouseY=0;};
  const ro=new ResizeObserver(resize);ro.observe(canvas);
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;});io.observe(canvas);
  canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',leave);
  resize();raf=requestAnimationFrame(frame);
  return { pausar(v){pausado=v;}, repetir(){elapsed=0;oldFase=-1;}, dispose(){alive=false;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);} };
}
