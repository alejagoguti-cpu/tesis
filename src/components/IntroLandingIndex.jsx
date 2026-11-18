import React, { Suspense, lazy, useState, useCallback } from 'react';
import ComunidadRelato from './ComunidadRelato';
import MapaVivo from './MapaVivo';
import { PATRIMONIO_ESCENAS } from '../data/patrimonioEscenas';
import './comunidad-facil.css';
import './experiencia-comunidad.css';

// #/comunidad: primero el mapa vivo (MapaVivo, para tocar y escuchar); la versión en texto (ComunidadRelato) es opcional. Desde ahí se entra
// al mapa interactivo y a los juegos (AulaAmbientalBocachica) o a las animaciones de los fuertes (PatrimonioCanal).
let patrimonioPromise;
const cargarPatrimonio = () => patrimonioPromise || (patrimonioPromise = import('./PatrimonioCanal'));
const PatrimonioCanal = lazy(cargarPatrimonio);
let aulaPromise;
const cargarAula = () => aulaPromise || (aulaPromise = import('./AulaAmbientalBocachica'));
const AulaAmbientalBocachica = lazy(cargarAula);

const escenaDesdeUrl = () => {
  const id = new URLSearchParams(window.location.search).get('experiencia');
  return id === 'canal' ? 'sanFernando' : Object.hasOwn(PATRIMONIO_ESCENAS, id) ? id : null;
};

export default function IntroLandingIndex({ onNavigateModule, onBackToThesis }) {
  const [accion, setAccion] = useState(null);
  const [enPortada, setEnPortada] = useState(true);
  const [leer, setLeer] = useState(false);
  const [canalAbierto, setCanalAbierto] = useState(escenaDesdeUrl);

  const abrirCanal = useCallback((nodo = 'sanFernando') => {
    cargarPatrimonio();
    const id = Object.hasOwn(PATRIMONIO_ESCENAS, nodo) ? nodo : 'sanFernando';
    setCanalAbierto(id);
    const url = new URL(window.location.href);
    url.searchParams.set('experiencia', id);
    window.history.replaceState(null, '', url);
  }, []);

  const cerrarCanal = useCallback(() => {
    setCanalAbierto(null);
    const url = new URL(window.location.href);
    if (['canal', ...Object.keys(PATRIMONIO_ESCENAS)].includes(url.searchParams.get('experiencia'))) {
      url.searchParams.delete('experiencia');
      window.history.replaceState(null, '', url);
    }
  }, []);

  const entrar = useCallback((id) => {
    cargarAula();
    setAccion({ id, turno: Date.now() });
    setEnPortada(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const volver = useCallback(() => {
    setEnPortada(true);
    setAccion(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="community-entry ex-root">
      {enPortada && !leer ? (
        <MapaVivo
          onActividad={entrar}
          onPatrimonio={abrirCanal}
          onPrecargar={cargarAula}
          onIsla3D={() => entrar('isla')}
          onVer3D={onNavigateModule ? () => onNavigateModule('3dviewer') : undefined}
          onLeer={() => { setLeer(true); window.scrollTo({ top: 0, behavior: 'instant' }); }}
          onBackToThesis={onBackToThesis}
        />
      ) : enPortada ? (
        <>
          <button type="button" className="cr-volver-mapa" onClick={() => setLeer(false)}>← Volver al mapa</button>
          <ComunidadRelato
            onExplorarMapa={() => setLeer(false)}
            onActividad={entrar}
            onPatrimonio={abrirCanal}
            onPrecargar={cargarAula}
            onVer3D={onNavigateModule ? () => onNavigateModule('3dviewer') : undefined}
            onBackToThesis={onBackToThesis}
          />
        </>
      ) : (
        <div className="ex-explorer">
          <Suspense
            fallback={
              <div className="ex-loading" role="status">
                <i />
                <h2>Entrando al territorio</h2>
                <p>Preparando tu experiencia…</p>
                <button type="button" onClick={volver}>Volver al inicio</button>
              </div>
            }
          >
            <AulaAmbientalBocachica
              onExplorarCanal={abrirCanal}
              canalAbierto={canalAbierto}
              accionInicial={accion}
              enPortada={false}
              onBackToPortada={volver}
              onNavigateModule={onNavigateModule}
            />
          </Suspense>
        </div>
      )}
      {canalAbierto && (
        <Suspense
          fallback={
            <div className="ex-loading ex-loading-overlay" role="status">
              <i />
              <h2>El patrimonio toma forma</h2>
              <p>Preparando la animación…</p>
              <button type="button" onClick={cerrarCanal}>Volver</button>
            </div>
          }
        >
          <PatrimonioCanal key={canalAbierto} lugar={canalAbierto} onElegirLugar={abrirCanal} onClose={cerrarCanal} />
        </Suspense>
      )}
    </div>
  );
}
