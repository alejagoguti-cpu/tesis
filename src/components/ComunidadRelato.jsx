import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, ArrowUp, Map, Utensils, Music, Hammer, Box } from 'lucide-react';
import VistaPatrimonio from './VistaPatrimonio';
import { PATRIMONIO_ESCENAS } from '../data/patrimonioEscenas';
import './comunidad-relato.css';

// Versión para la comunidad: el mismo relato del tercer corte, contado en palabras sencillas.
// Todas las cifras vienen de la tesis y de la presentación del tercer corte (fuentes al final).

const BASE = import.meta.env.BASE_URL;
const TERCER_CORTE = 'https://alejagoguti-cpu.github.io/tesis_tercer_corte/';

const PASOS = [
  { id: 'isla', n: '01', label: 'La isla' },
  { id: 'pasa', n: '02', label: 'Qué está pasando' },
  { id: 'somos', n: '03', label: 'Lo que somos' },
  { id: 'proponemos', n: '04', label: 'Qué proponemos' },
  { id: 'barrio', n: '05', label: 'El nuevo barrio' },
  { id: 'explora', n: '06', label: 'Explora' },
];

const PUEBLOS = [
  { nombre: 'Tierra Bomba', casas: '770', texto: 'Aquí está la sede principal del colegio de la isla, con 934 estudiantes.' },
  { nombre: 'Punta Arena', casas: '385', texto: 'Su colegio solo llega a 5.º de primaria: más de 60 jóvenes salen cada día en lancha a estudiar.' },
  { nombre: 'Caño del Oro', casas: '441', texto: 'Tiene el colegio San José, con 497 estudiantes.' },
  { nombre: 'Bocachica', casas: '1.004', texto: 'El pueblo más grande, junto a los fuertes. Su colegio tiene 1.192 estudiantes.' },
];

const DATOS_PROBLEMA = [
  { cifra: '0,6 a 3 m', unidad: 'por año', texto: 'Es lo que el mar le quita a la orilla en algunos tramos de la isla.' },
  { cifra: '891', unidad: 'de unas 2.600', texto: 'casas y construcciones están en la franja que el mar podría alcanzar en 30 años.' },
  { cifra: '9 de 10', unidad: 'vecinos', texto: 'vieron daños en casas, calles, agua, turismo y pesca (encuesta a 238 habitantes, 2016).' },
];

const IDEAS = [
  {
    n: '01', color: '#ff6b4a', titulo: 'Decidir desde la isla',
    que: 'Una mesa permanente con el Consejo Comunitario, las Juntas de Acción Comunal y el Distrito. Ninguna obra en la costa ni ninguna reubicación se hace sin pasar por ella.',
    acciones: ['Reuniones fijas en la isla', 'Presupuesto que la comunidad ayuda a decidir', 'Consulta previa de toda obra o reubicación (Ley 70 de 1993)', 'Una oficina técnica en la isla que acompañe los proyectos'],
    quien: 'Consejo Comunitario, Juntas de Acción Comunal, Alcaldía Local 1 y Planeación Distrital',
    cuando: 'Primero, en 0 a 2 años. Es la base de todo lo demás.',
  },
  {
    n: '02', color: '#f5b97a', titulo: 'Casas en suelo seguro',
    que: 'Las familias de la orilla se mudan poco a poco a la meseta alta (22 m sobre el mar), sin salir de la isla y con título colectivo. La orilla que se libera se vuelve parque y no se vuelve a ocupar.',
    acciones: ['Retomar la titulación colectiva pedida en 2013', 'Reservar suelo comunitario en la meseta', 'Casas que crecen con la familia y conservan a los vecinos cerca', 'Proteger la orilla liberada para que nadie la vuelva a ocupar'],
    quien: 'Consejo Comunitario, Agencia Nacional de Tierras, Distrito y Armada',
    cuando: 'En 2 a 10 años, manzana por manzana, a medida que el mar se acerque.',
  },
  {
    n: '03', color: '#2fd1b0', titulo: 'Cuidar la orilla',
    que: 'Donde hay casas, un malecón de guadua frena la ola. En la bahía se siembra manglar y en las playas se recuperan las dunas. Todo se puede mover si el mar sigue avanzando.',
    acciones: ['Malecón de guadua en los tramos más críticos', 'Sembrar manglar y recuperar dunas', 'Barreras de fibra de coco y estacas en la orilla', 'Vecinos que miden cada año cuánto avanza el mar'],
    quien: 'INVEMAR, Cardique, DIMAR, Distrito y el Comité Barrial de Emergencias',
    cuando: 'Ya, en los tramos más críticos. La medición, siempre.',
  },
  {
    n: '04', color: '#49c6e5', titulo: 'Agua y salud en la isla',
    que: 'Recoger el agua de lluvia en colegios y edificios públicos, limpiar las aguas usadas con humedales antes de que lleguen al mar y tener un puesto de salud en suelo seguro.',
    acciones: ['Tanques de agua lluvia en escuelas y puestos de salud', 'Un humedal que limpia el agua en cada pueblo', 'Puesto de salud permanente en la meseta', 'Seguimiento al acueducto que llega desde Mamonal'],
    quien: 'Aguas de Cartagena, Distrito, ESE Cartagena y Consejo Comunitario',
    cuando: 'El agua lluvia, pronto. Humedales y salud, en los años siguientes.',
  },
  {
    n: '05', color: '#ff7a50', titulo: 'Unir los cuatro pueblos',
    que: 'Un sendero entre Tierra Bomba, Punta Arena, Caño del Oro y Bocachica, un muelle comunitario en cada pueblo y una lancha escolar interna. Ir a Cartagena debe ser una opción, no una obligación.',
    acciones: ['Sendero por el carreteable que ya existe', 'Muelle comunitario en cada pueblo', 'Lancha escolar entre los pueblos', 'Paradas con sombra y agua cada 400 m'],
    quien: 'Distrito, DIMAR, asociaciones de lancheros y Consejo Comunitario',
    cuando: 'Muelles y lancha escolar, pronto. El sendero, por tramos.',
  },
  {
    n: '06', color: '#a9cf5c', titulo: 'Cuidar la cultura y el trabajo',
    que: 'El parque de la orilla también da trabajo: turismo manejado por la comunidad en fuertes, playas y manglar, un vivero, acuerdos de pesca y lugares para las fiestas y los saberes de los mayores.',
    acciones: ['Turismo comunitario en fuertes, playas y manglar', 'Vivero comunitario de árboles nativos', 'Acuerdos de pesca con las áreas protegidas', 'Lugares para las fiestas y para enseñar los saberes'],
    quien: 'Consejo Comunitario, pescadores, asociaciones de turismo, Parques Nacionales y Distrito',
    cuando: 'En 2 a 8 años. Los usos de cada lugar los decide la comunidad.',
  },
];

const BARRIO = [
  { cifra: '+22 m', texto: 'sobre el nivel del mar: la meseta queda fuera del alcance del mar.' },
  { cifra: '120', texto: 'casas que pueden crecer con la familia.' },
  { cifra: '450.000 L', texto: 'de agua lluvia en un tanque comunitario, con 12 llaves para todos.' },
  { cifra: '350', texto: 'estudiantes en un colegio cuyo techo recoge el agua.' },
  { cifra: '400 m²', texto: 'de plaza cubierta para reunirse, celebrar y decidir.' },
];

const ACTIVIDADES = [
  { id: 'pescado', titulo: 'Del mar a la mesa', sub: 'Prepara pescado con arroz de coco.', Icon: Utensils, foto: 'arroz_coco_pescado.jpg', tipo: 'Cocina' },
  { id: 'cocada', titulo: 'Las cocadas', sub: 'Una preparación tradicional.', Icon: Utensils, foto: 'dulces_isnelia.jpg', tipo: 'Cocina' },
  { id: 'bullerengue', titulo: 'Entra a la rueda', sub: 'Al ritmo del bullerengue.', Icon: Music, foto: 'bullerengue.jpg', tipo: 'Baile' },
  { id: 'mapale', titulo: 'Sigue el movimiento', sub: 'Baila mapalé.', Icon: Music, foto: 'mapale_cumbia.jpg', tipo: 'Baile' },
  { id: 'oficios', titulo: 'Manos que construyen', sub: 'Talleres y saberes locales.', Icon: Hammer, foto: 'carpinteria_ribera.jpg', tipo: 'Oficios' },
];

const SUBS = { sanFernando: 'El fuerte que defendía el paso', sanJose: 'La batería junto al agua', casco: 'Las calles del pueblo', sanRafael: 'La fortificación del cerro' };

function irA(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth' });
  const h = el.querySelector('h1, h2');
  if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
}

function Encabezado({ n, titulo, children }) {
  return (
    <header className="cr-head">
      <p className="cr-eyebrow"><b>{n}</b> / {PASOS.find((p) => p.n === n)?.label}</p>
      <h2>{titulo}</h2>
      {children && <p className="cr-lead">{children}</p>}
    </header>
  );
}

export default function ComunidadRelato({ onExplorarMapa, onActividad, onPatrimonio, onPrecargar, onVer3D, onBackToThesis }) {
  const raiz = useRef(null);
  const [activo, setActivo] = useState('inicio');

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) setActivo(e.target.id); },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    raiz.current?.querySelectorAll('[data-paso]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="cr" ref={raiz}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500&family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap" />

      <nav className="cr-nav" aria-label="Pasos de la página">
        <button type="button" className="cr-nav-marca" onClick={() => irA('inicio')}>Tierra Bomba <span>· para la comunidad</span></button>
        <div className="cr-nav-pasos">
          {PASOS.map((p) => (
            <button key={p.id} type="button" aria-current={activo === p.id ? 'step' : undefined} onClick={() => irA(p.id)}>
              <span>{p.n}</span>{p.label}
            </button>
          ))}
        </div>
      </nav>

      {/* PORTADA */}
      <section id="inicio" className="cr-hero" data-paso>
        <img src={`${BASE}textures/tierrabomba_satelite.jpg`} alt="" className="cr-hero-img" fetchPriority="high" />
        <div className="cr-hero-velo" />
        <div className="cr-hero-txt">
          <p className="cr-eyebrow">Versión para la comunidad · Cartagena</p>
          <h1>Tierra Bomba</h1>
          <p className="cr-hero-sub">Nuestra isla, hoy y mañana.</p>
          <p className="cr-hero-p">
            El mar se está llevando parte de la orilla. Aquí te contamos, paso a paso y en palabras sencillas,
            qué está pasando y qué proponemos para que la gente pueda seguir viviendo en la isla.
          </p>
          <div className="cr-hero-acciones">
            <button type="button" className="cr-btn" onClick={() => irA('isla')}>Empezar <ArrowDown size={18} /></button>
            {onBackToThesis && <button type="button" className="cr-btn cr-btn-sec" onClick={onBackToThesis}>Ver la tesis completa</button>}
          </div>
        </div>
        <ol className="cr-hero-indice" aria-label="Lo que vas a encontrar">
          {PASOS.map((p) => (
            <li key={p.id}><button type="button" onClick={() => irA(p.id)}><span>{p.n}</span>{p.label}<ArrowRight size={14} /></button></li>
          ))}
        </ol>
      </section>

      {/* 01 · LA ISLA */}
      <section id="isla" className="cr-sec" data-paso>
        <Encabezado n="01" titulo="Una isla, cuatro pueblos.">
          Tierra Bomba queda frente a Cartagena. En ella viven cuatro pueblos, unidos por una vía de 13 km y por el mar.
        </Encabezado>
        <div className="cr-pueblos">
          {PUEBLOS.map((p, i) => (
            <article key={p.nombre} className="cr-pueblo">
              <span className="cr-num">0{i + 1}</span>
              <h3>{p.nombre}</h3>
              <p className="cr-pueblo-casas"><b>{p.casas}</b> casas y construcciones</p>
              <p>{p.texto}</p>
            </article>
          ))}
        </div>
        <button type="button" className="cr-btn cr-btn-sec" onPointerEnter={onPrecargar} onFocus={onPrecargar} onClick={onExplorarMapa}>
          <Map size={18} /> Ver los pueblos en el mapa
        </button>
      </section>

      {/* 02 · QUÉ ESTÁ PASANDO */}
      <section id="pasa" className="cr-sec cr-sec-alt" data-paso>
        <Encabezado n="02" titulo="El mar se está llevando la orilla.">
          Cada año la costa retrocede. Lo que está más cerca del agua es lo primero que se pierde: casas, calles y playas.
        </Encabezado>
        <div className="cr-datos">
          {DATOS_PROBLEMA.map((d) => (
            <div key={d.cifra} className="cr-dato">
              <p className="cr-dato-cifra">{d.cifra}</p>
              <p className="cr-dato-unidad">{d.unidad}</p>
              <p>{d.texto}</p>
            </div>
          ))}
        </div>

        <div className="cr-dos">
          <div className="cr-caja">
            <p className="cr-etiqueta">Ya pasó</p>
            <h3>Del Barrio Abajo al Barrio Arriba</h3>
            <p>
              Familias que vivían junto a la orilla se mudaron a la parte alta después de perder sus casas.
              La calle Primera desapareció. Los mayores cuentan que las calles nuevas son más estrechas que los callejones de antes.
            </p>
          </div>
          <div className="cr-caja cr-caja-acento">
            <p className="cr-etiqueta">El problema de fondo</p>
            <h3>Las decisiones se toman lejos</h3>
            <p>
              Dónde reubicar a las familias, cómo traer el agua, qué obras hacer en la costa: casi todo se decide en Cartagena.
              Por eso la isla pierde su suelo <b>sin poder decidir sobre él</b>.
            </p>
          </div>
        </div>

        <div className="cr-barra-comparada" role="img" aria-label="9 de cada 10 vieron el daño material; 4 de cada 10 vieron el daño a la vida en comunidad">
          <p className="cr-etiqueta">Lo que se ve y lo que no se ve</p>
          <div className="cr-barra"><span>Daño en casas, calles, agua y sustento</span><i style={{ '--v': '87%' }} /><b>9 de cada 10</b></div>
          <div className="cr-barra"><span>Daño en costumbres, encuentros y saberes</span><i style={{ '--v': '37%' }} /><b>4 de cada 10</b></div>
          <p className="cr-nota">
            Casi todos ven el daño a las casas. Menos gente ve el daño a la vida en comunidad, pero también se puede perder si las familias se mudan sin un plan.
          </p>
        </div>
      </section>

      {/* 03 · LO QUE SOMOS */}
      <section id="somos" className="cr-sec" data-paso>
        <Encabezado n="03" titulo="Lo que no queremos perder.">
          La isla no es solo suelo. Es la gente, sus fiestas, su forma de organizarse y de encontrarse.
        </Encabezado>
        <blockquote className="cr-cita">
          «Mientras sigamos unidos y sin egoísmos, actuando como comunidad, resistiremos».
          <cite>Participante de los talleres de memoria con mayores</cite>
        </blockquote>
        <div className="cr-somos">
          <article className="cr-caja">
            <p className="cr-etiqueta">Las fiestas</p>
            <ul className="cr-fiestas">
              <li><b>13 jun</b> San Antonio</li>
              <li><b>24 jun</b> San Juan, con regatas de botes de vela</li>
              <li><b>16 jul</b> Virgen del Carmen</li>
            </ul>
          </article>
          <article className="cr-caja">
            <p className="cr-etiqueta">Cómo nos organizamos</p>
            <p>El Consejo Comunitario de Comunidades Negras de Tierra Bomba, las Juntas de Acción Comunal y el Comité Barrial de Emergencias.</p>
          </article>
          <article className="cr-caja">
            <p className="cr-etiqueta">Dónde nos encontramos</p>
            <p>El dominó en las esquinas, la champeta, y el mar, donde juegan los niños.</p>
          </article>
          <article className="cr-caja">
            <p className="cr-etiqueta">Los que estudian</p>
            <p><b className="cr-grande">Más de 2.600</b> estudiantes en los colegios oficiales de la isla. Para ir a la universidad hay que ir a Cartagena.</p>
          </article>
        </div>
      </section>

      {/* 04 · QUÉ PROPONEMOS */}
      <section id="proponemos" className="cr-sec cr-sec-alt" data-paso>
        <Encabezado n="04" titulo="Seis ideas para quedarnos en la isla.">
          La meta es una sola: que la gente de Tierra Bomba siga viviendo en la isla, en suelo seguro, con agua y servicios propios,
          y decidiendo sobre su territorio.
        </Encabezado>
        <div className="cr-ideas">
          {IDEAS.map((idea) => (
            <article key={idea.n} className="cr-idea" style={{ '--c': idea.color }}>
              <span className="cr-idea-n">{idea.n}</span>
              <h3>{idea.titulo}</h3>
              <p>{idea.que}</p>
              <dl>
                <div><dt>Quién</dt><dd>{idea.quien}</dd></div>
                <div><dt>Cuándo</dt><dd>{idea.cuando}</dd></div>
              </dl>
              <details>
                <summary>¿Qué se haría?</summary>
                <ul>{idea.acciones.map((a) => <li key={a}>{a}</li>)}</ul>
              </details>
            </article>
          ))}
        </div>
      </section>

      {/* 05 · EL NUEVO BARRIO */}
      <section id="barrio" className="cr-sec" data-paso>
        <Encabezado n="05" titulo="Así sería el nuevo barrio.">
          En la meseta, la parte más alta y segura, junto al colegio y al parque. Cerca del mar, pero fuera de su alcance.
        </Encabezado>
        <div className="cr-barrio">
          {BARRIO.map((b) => (
            <div key={b.cifra} className="cr-barrio-dato">
              <p className="cr-dato-cifra">{b.cifra}</p>
              <p>{b.texto}</p>
            </div>
          ))}
        </div>
        <p className="cr-texto">
          Las casas se hacen con madera tratada, bloques de tierra y celosías que dejan pasar el aire.
          La orilla que se libera se vuelve un parque con manglar, dunas y bosque seco.
        </p>
        <div className="cr-acciones">
          {onVer3D && <button type="button" className="cr-btn" onClick={onVer3D}><Box size={18} /> Ver el barrio en 3D</button>}
          <button type="button" className="cr-btn cr-btn-sec" onPointerEnter={onPrecargar} onFocus={onPrecargar} onClick={onExplorarMapa}><Map size={18} /> Recorrer la isla</button>
        </div>
      </section>

      {/* 06 · EXPLORA */}
      <section id="explora" className="cr-sec cr-sec-alt" data-paso>
        <Encabezado n="06" titulo="Recorre, juega y aprende.">
          Elige por dónde seguir: conoce los fuertes, cocina, baila o descubre los oficios de la isla.
        </Encabezado>

        <h3 className="cr-sub">La historia de los fuertes</h3>
        <div className="cr-patrimonio">
          {Object.entries(PATRIMONIO_ESCENAS).map(([id, d]) => (
            <button key={id} type="button" className="cr-tarjeta" onClick={() => onPatrimonio(id)} aria-label={`Ver la animación de ${d.nombre}`}>
              <div className="cr-tarjeta-visual"><VistaPatrimonio lugar={id} /></div>
              <div className="cr-tarjeta-txt"><h4>{d.nombre}</h4><p>{SUBS[id]}</p></div>
              <ArrowUpRight size={18} className="cr-tarjeta-flecha" />
            </button>
          ))}
        </div>

        <h3 className="cr-sub">Saberes que siguen vivos</h3>
        <div className="cr-actividades">
          {ACTIVIDADES.map(({ id, titulo, sub, Icon, foto, tipo }) => (
            <button key={id} type="button" className="cr-tarjeta" onPointerEnter={onPrecargar} onFocus={onPrecargar} onClick={() => onActividad(id)}>
              <div className="cr-tarjeta-visual"><img src={`${BASE}images/memorias/${foto}`} alt="" loading="lazy" decoding="async" /><span className="cr-tipo"><Icon size={14} />{tipo}</span></div>
              <div className="cr-tarjeta-txt"><h4>{titulo}</h4><p>{sub}</p></div>
              <ArrowUpRight size={18} className="cr-tarjeta-flecha" />
            </button>
          ))}
        </div>
      </section>

      {/* CIERRE */}
      <section className="cr-cierre">
        <p className="cr-eyebrow">Para conversar</p>
        <h2>Esto es una propuesta.<br /><span>Tu voz cuenta.</span></h2>
        <p className="cr-lead">
          Lo que ves aquí es un trabajo de grado de arquitectura. No es una decisión tomada: es una propuesta para conversar con la comunidad.
        </p>
        <ul className="cr-preguntas">
          <li>¿Qué lugar de tu pueblo no se puede perder?</li>
          <li>Si tuvieras que mudarte, ¿qué necesitarías tener cerca?</li>
          <li>¿Qué debería hacerse primero en tu pueblo?</li>
        </ul>
        <div className="cr-acciones">
          <a className="cr-btn cr-btn-sec" href={TERCER_CORTE} target="_blank" rel="noreferrer">Ver la presentación técnica <ArrowUpRight size={16} /></a>
          {onBackToThesis && <button type="button" className="cr-btn cr-btn-sec" onClick={onBackToThesis}>Ver la tesis completa</button>}
          <button type="button" className="cr-btn cr-btn-sec" onClick={() => irA('inicio')}>Volver al inicio <ArrowUp size={16} /></button>
        </div>
        <footer className="cr-pie">
          <p><b>Alejandra Gómez · Ana Casas</b> · Tesis de grado en Arquitectura y Urbanismo · Pontificia Universidad Javeriana · 2026</p>
          <p>
            Fuentes: encuesta a 238 habitantes (Universidad de Manizales, 2016); talleres de memoria (Universidad Tecnológica de Bolívar);
            Caracol Radio (2018); El Universal (2022); matrícula del Ministerio de Educación (2025); tasas de retroceso de INVEMAR;
            conteo de construcciones del archivo de la tesis; imagen satelital Esri World Imagery; costa © OpenStreetMap. Las cifras de la propuesta vienen de la tesis.
          </p>
        </footer>
      </section>
    </div>
  );
}
