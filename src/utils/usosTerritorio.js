import * as THREE from 'three';

// Usos del suelo / equipamientos. Los únicos usos precargados vienen de OpenStreetMap
// (escuela, hoteles); el resto lo marca el equipo de tesis edificio por edificio (levantamiento en sitio).
export const USOS = [
  { id: 'vivienda', name: 'Vivienda', color: '#f5b83d', icon: '' },
  { id: 'comercio', name: 'Comercio / tiendas', color: '#e0483e', icon: '🏪' },
  { id: 'culto', name: 'Iglesia / culto', color: '#8b5cf6', icon: '⛪' },
  { id: 'educativo', name: 'Educación', color: '#2f7de1', icon: '🏫' },
  { id: 'salud', name: 'Salud', color: '#17a673', icon: '🏥' },
  { id: 'institucional', name: 'Institucional / comunal', color: '#0e9fb8', icon: '🏛️' },
  { id: 'turismo', name: 'Turismo / alojamiento', color: '#e0559a', icon: '🏨' },
  { id: 'productivo', name: 'Productivo / depósito', color: '#8a7f73', icon: '🏭' },
  { id: 'recreativo', name: 'Recreación / deporte', color: '#7cb518', icon: '⚽' }
];

export const STORAGE_USOS = 'tesis_m5_usos_v1';

export function loadUserTags() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USOS) || '{}');
  } catch (e) {
    return {};
  }
}

export function saveUserTags(tags) {
  try {
    localStorage.setItem(STORAGE_USOS, JSON.stringify(tags));
  } catch (e) {}
}

export function useColor(id) {
  return new THREE.Color((USOS.find((u) => u.id === id) || { color: '#ffffff' }).color);
}

export function iconSprite(emoji, color) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(64, 62, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 8;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.font = '54px "Segoe UI Emoji","Apple Color Emoji",sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 64, 66);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  sp.scale.set(0.5, 0.5, 1);
  sp.renderOrder = 45;
  return sp;
}
