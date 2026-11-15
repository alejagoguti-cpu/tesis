// Reproductor de ritmos tradicionales de Tierra Bomba (Web Audio API, cero dependencias)

export const PISTAS_MEMORIA = [
  {
    id: 'bullerengue',
    titulo: 'Bullerengue Sentao',
    subtitulo: 'Baile tradicional afrocolombiano · Tambor alegre, llamador y palmas',
    fechaGrande: 'TODOS LOS VIERNES · 5:00 PM',
    diaNum: 'VIE',
    mesCorto: 'BAILE',
    bpm: 92,
    color: '#e0917a',
    icono: 'music',
    historia:
      'Baile ancestral de rueda y canto responsorial de Tierra Bomba. Recupera la danza tradicional frente al olvido generacional.',
    pasos: ['1. Rueda en el patio', '2. Palmas al llamador', '3. Canto de las mayores'],
  },
  {
    id: 'dulce_isnelia',
    titulo: 'Chande · Cocina de Doña Isnelia',
    subtitulo: 'Festival del Dulce Casero: coco, corozo, guandú y caballito',
    fechaGrande: 'SEMANA SANTA · ABRIL',
    diaNum: '14',
    mesCorto: 'ABR',
    bpm: 108,
    color: '#e8a86b',
    icono: 'utensils',
    historia:
      'Memoria gastronómica de Tierra Bomba junto al muelle flotante: arroz con coco frito rallado en lata y dulces caseros de patio.',
    pasos: ['1. Rallar coco del patio', '2. Fogón de leña', '3. Compartir en comunidad'],
  },
  {
    id: 'afrocolombianidad',
    titulo: 'Mapalé y Herencia Africana',
    subtitulo: 'Día Nacional de la Afrocolombianidad · Ruta del Patrimonio',
    fechaGrande: '21 DE MAYO · PLAZA CENTRAL',
    diaNum: '21',
    mesCorto: 'MAY',
    bpm: 126,
    color: '#35d08a',
    icono: 'sparkles',
    historia:
      'Conmemoración comunitaria e intercultural en la Institución Educativa de Tierra Bomba para celebrar la identidad afro y raizal.',
    pasos: ['1. Tambores de apertura', '2. Danza de pesca y mar', '3. Cuentos del terruño'],
  },
  {
    id: 'cumbia_bahia',
    titulo: 'Cumbia de la Bahía',
    subtitulo: 'Mes del Patrimonio · Noche de velas frente a San Fernando',
    fechaGrande: 'SEPTIEMBRE · MES DEL PATRIMONIO',
    diaNum: '18',
    mesCorto: 'SEP',
    bpm: 98,
    color: '#6ec6e6',
    icono: 'disc',
    historia:
      'Encuentro nocturno entre Bocachica, Caño de Loro y Punta Arena con gaitas, guache y memoria oral de los abuelos.',
    pasos: ['1. Paso deslizado', '2. Velas en la orilla', '3. Relatos de abuelos'],
  },
];

export function crearReproductorComunidad() {
  let ctx = null;
  let timer = null;
  let playing = false;
  let muted = false;
  let currentId = 'bullerengue';
  let step = 0;

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function drum(freqStart, freqEnd, dur, gainPeak, time) {
    if (!ctx || muted) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freqStart, time);
    osc.frequency.exponentialRampToValueAtTime(Math.max(28, freqEnd), time + dur);
    g.gain.setValueAtTime(0.001, time);
    g.gain.linearRampToValueAtTime(gainPeak, time + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  function clapOrGuache(dur, gainPeak, hpFreq, time) {
    if (!ctx || muted) return;
    const bufSize = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(hpFreq, time);
    filter.Q.setValueAtTime(1.4, time);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gainPeak, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    src.connect(filter).connect(g).connect(ctx.destination);
    src.start(time);
    src.stop(time + dur + 0.01);
  }

  function fluteNote(freq, dur, gainPeak, time) {
    if (!ctx || muted) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    g.gain.setValueAtTime(0.001, time);
    g.gain.linearRampToValueAtTime(gainPeak, time + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  const PENTATONIC = {
    bullerengue: [293.66, 349.23, 392.0, 440.0, 523.25, 440.0, 392.0, 349.23],
    dulce_isnelia: [329.63, 392.0, 440.0, 523.25, 587.33, 523.25, 440.0, 392.0],
    afrocolombianidad: [261.63, 311.13, 349.23, 392.0, 466.16, 392.0, 349.23, 311.13],
    cumbia_bahia: [246.94, 293.66, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66],
  };

  function tick() {
    if (!playing || !ctx) return;
    const t = ctx.currentTime + 0.02;
    const s = step % 8;
    const track = PISTAS_MEMORIA.find((p) => p.id === currentId) || PISTAS_MEMORIA[0];
    const scale = PENTATONIC[track.id] || PENTATONIC.bullerengue;

    if (track.id === 'bullerengue') {
      // Tambor alegre + llamador en contratiempo + palmas comunitarias
      if (s === 0 || s === 3 || s === 6) drum(135, 52, 0.22, 0.34, t);
      if (s === 2 || s === 6) drum(240, 150, 0.09, 0.18, t); // llamador
      if (s === 2 || s === 4 || s === 6) clapOrGuache(0.07, 0.16, 1750, t); // palmas
      if (s === 0 || s === 4) fluteNote(scale[Math.floor(step / 4) % scale.length], 0.38, 0.08, t);
    } else if (track.id === 'afrocolombianidad') {
      // Mapale rapido
      if (s % 2 === 0) drum(155, 58, 0.16, 0.35, t);
      if (s === 1 || s === 3 || s === 5 || s === 7) drum(280, 170, 0.07, 0.16, t);
      if (s === 2 || s === 5 || s === 7) clapOrGuache(0.05, 0.18, 2200, t);
      if (s % 2 === 0) fluteNote(scale[(step / 2) % scale.length], 0.22, 0.075, t);
    } else if (track.id === 'dulce_isnelia') {
      // Chande festivo
      if (s === 0 || s === 3 || s === 4) drum(142, 54, 0.2, 0.32, t);
      if (s % 2 === 1) clapOrGuache(0.06, 0.12, 3200, t);
      if (s === 0 || s === 2 || s === 5) fluteNote(scale[step % scale.length], 0.32, 0.09, t);
    } else {
      // Cumbia de la bahia
      if (s === 0 || s === 4) drum(115, 45, 0.26, 0.36, t);
      clapOrGuache(0.045, s % 2 === 0 ? 0.09 : 0.05, 4200, t);
      if (s === 0 || s === 3 || s === 6) fluteNote(scale[step % scale.length], 0.42, 0.09, t);
    }
    step++;
  }

  function start(id) {
    if (id) currentId = id;
    ensureCtx();
    if (timer) clearInterval(timer);
    playing = true;
    step = 0;
    const track = PISTAS_MEMORIA.find((p) => p.id === currentId) || PISTAS_MEMORIA[0];
    const stepMs = Math.round((60 / track.bpm / 2) * 1000);
    tick();
    timer = setInterval(tick, stepMs);
  }

  function stop() {
    playing = false;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function setMuted(m) {
    muted = !!m;
  }

  return {
    start,
    stop,
    setMuted,
    destroy: () => {
      stop();
      if (ctx && ctx.state !== 'closed') ctx.close().catch(() => {});
      ctx = null;
    },
  };
}
