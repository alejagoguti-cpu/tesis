const fs = require('fs');
const path = require('path');

const shpDir = 'C:/Users/aleja/Downloads/Cartografia_Catastro_AMB_Cartagena/SHP_Catastro_AMB_Cartagena';
const outPath = path.join(__dirname, '../public/data/cartagena_catastro_real.json');

const originX = 4721000;
const originY = 2703500;
const scale = 0.02; // 1 unit = 50m

function to3D(x, y) {
  return [
    parseFloat(((x - originX) * scale).toFixed(2)),
    parseFloat(((y - originY) * scale).toFixed(2))
  ];
}

// Topographic elevation function (Cerro de la Popa + Tierra Bomba hills)
function getTopographicElevation(x3D, y3D) {
  // Cerro de la Popa (Cartagena)
  const popaDist = Math.hypot(x3D - 42, y3D - (-16));
  if (popaDist < 16) {
    const factor = Math.cos((popaDist / 16) * (Math.PI / 2));
    return parseFloat((factor * factor * 2.8).toFixed(2));
  }
  // Tierra Bomba central plateau
  const tbDist = Math.hypot(x3D - (-18), y3D - 8);
  if (tbDist < 25) {
    const factor = Math.cos((tbDist / 25) * (Math.PI / 2));
    return parseFloat((factor * 0.45).toFixed(2));
  }
  return 0;
}

function parseShpPolygons(shpPath, maxCount = 20000, step = 1, minPoints = 3) {
  if (!fs.existsSync(shpPath)) return [];
  const buf = fs.readFileSync(shpPath);
  let offset = 100;
  const items = [];
  let index = 0;

  while (offset < buf.length && items.length < maxCount) {
    const contentLenBytes = buf.readInt32BE(offset + 4) * 2;
    const shapeType = buf.readInt32LE(offset + 8);

    if ((shapeType === 5 || shapeType === 15) && (index % step === 0)) {
      const numParts = buf.readInt32LE(offset + 44);
      const numPoints = buf.readInt32LE(offset + 48);

      const parts = [];
      for (let p = 0; p < numParts; p++) {
        parts.push(buf.readInt32LE(offset + 52 + p * 4));
      }

      const pointsOffset = offset + 52 + numParts * 4;
      const endPart = parts.length > 1 ? parts[1] : numPoints;
      const ring = [];

      let lastX = null, lastY = null;
      for (let pt = parts[0]; pt < endPart; pt++) {
        const x = buf.readDoubleLE(pointsOffset + pt * 16);
        const y = buf.readDoubleLE(pointsOffset + pt * 16 + 8);
        const pt3D = to3D(x, y);

        if (lastX === null || Math.hypot(pt3D[0] - lastX, pt3D[1] - lastY) > 0.08) {
          ring.push(pt3D);
          lastX = pt3D[0];
          lastY = pt3D[1];
        }
      }

      if (ring.length >= minPoints) {
        items.push(ring);
      }
    }
    index++;
    offset += 8 + contentLenBytes;
  }
  return items;
}

function parseShpLines(shpPath, maxCount = 5000, step = 1) {
  if (!fs.existsSync(shpPath)) return [];
  const buf = fs.readFileSync(shpPath);
  let offset = 100;
  const items = [];
  let index = 0;

  while (offset < buf.length && items.length < maxCount) {
    const contentLenBytes = buf.readInt32BE(offset + 4) * 2;
    const shapeType = buf.readInt32LE(offset + 8);

    if ((shapeType === 3 || shapeType === 13 || shapeType === 5) && (index % step === 0)) {
      const numParts = buf.readInt32LE(offset + 44);
      const numPoints = buf.readInt32LE(offset + 48);

      const parts = [];
      for (let p = 0; p < numParts; p++) {
        parts.push(buf.readInt32LE(offset + 52 + p * 4));
      }

      const pointsOffset = offset + 52 + numParts * 4;
      const endPart = parts.length > 1 ? parts[1] : numPoints;
      const line = [];

      for (let pt = parts[0]; pt < endPart; pt++) {
        const x = buf.readDoubleLE(pointsOffset + pt * 16);
        const y = buf.readDoubleLE(pointsOffset + pt * 16 + 8);
        line.push(to3D(x, y));
      }

      if (line.length >= 2) {
        items.push(line);
      }
    }
    index++;
    offset += 8 + contentLenBytes;
  }
  return items;
}

console.log('--- EXTRACTING COMPLETE CARTAGENA & TIERRA BOMBA 3D GIS DATA ---');

// 1. Landmasses (Corregimientos + Barrios + Perimetro Urbano)
console.log('1. Extracting landmasses...');
const landCorreg = parseShpPolygons(path.join(shpDir, 'Corregimiento.shp'), 500, 1, 4);
const landBarrios = parseShpPolygons(path.join(shpDir, 'Barrio.shp'), 500, 1, 4);
const landmasses = [...landCorreg, ...landBarrios];
console.log(`Landmasses: ${landmasses.length} polygons`);

// 2. Manzanas (Manzana.shp)
console.log('2. Extracting manzanas...');
const manzanas = parseShpPolygons(path.join(shpDir, 'Manzana.shp'), 6000, 2, 4);
console.log(`Manzanas: ${manzanas.length} polygons`);

// 3. Roads (Nomenclaturavial.shp)
console.log('3. Extracting road network...');
const roads = parseShpLines(path.join(shpDir, 'Nomenclaturavial.shp'), 5000, 2);
console.log(`Roads: ${roads.length} segments`);

// 4. Buildings (Construccion.shp - dense sampling across the whole city)
console.log('4. Extracting building footprints across all sectors of Cartagena & Tierra Bomba...');
const rawBuildings = parseShpPolygons(path.join(shpDir, 'Construccion.shp'), 22000, 8, 3);

const buildings = rawBuildings.map((ring) => {
  let sumX = 0, sumY = 0;
  ring.forEach(pt => { sumX += pt[0]; sumY += pt[1]; });
  const cx = sumX / ring.length;
  const cy = sumY / ring.length;

  const elev = getTopographicElevation(cx, cy);

  let type = 'tb';
  let height = 0.22;

  // Bocagrande, Castillogrande, El Laguito (towers)
  if (cx >= 12 && cx <= 32 && cy >= -28 && cy <= 18) {
    type = 'skyscraper';
    height = parseFloat((1.2 + Math.random() * 3.6).toFixed(2)); // 15 - 45 floors
  }
  // Centro Histórico, San Diego, Getsemaní
  else if (cx >= 28 && cx <= 46 && cy >= -26 && cy <= -10) {
    type = 'centro';
    height = parseFloat((0.4 + Math.random() * 0.5).toFixed(2)); // colonial 2 - 4 floors
  }
  // Manga, Torices, Cabrero, Marbella, Crespo
  else if (cx >= 32 && cx <= 65 && cy >= -20 && cy <= 12) {
    type = 'modern_residential';
    height = parseFloat((0.5 + Math.random() * 1.4).toFixed(2)); // 4 - 12 floors
  }
  // Industrial / Urban East
  else if (cx >= 45) {
    type = 'urban';
    height = parseFloat((0.25 + Math.random() * 0.4).toFixed(2));
  }
  // Tierra Bomba (Isla)
  else {
    type = 'vernacular';
    height = parseFloat((0.18 + Math.random() * 0.22).toFixed(2));
  }

  return {
    r: ring,
    h: height,
    e: elev,
    t: type,
  };
});

console.log(`Buildings: ${buildings.length} 3D structures classified`);

const dataset = {
  meta: {
    source: "Catastro Multipropósito AMB Cartagena 2026",
    projection: "MAGNA-SIRGAS Origen Nacional (EPSG:9377)",
    origin: { x0: originX, y0: originY },
    scale: scale,
    counts: {
      buildings: buildings.length,
      manzanas: manzanas.length,
      roads: roads.length,
      landmasses: landmasses.length,
    }
  },
  landmasses,
  manzanas,
  roads,
  buildings,
};

fs.writeFileSync(outPath, JSON.stringify(dataset));
const sizeMB = (fs.statSync(outPath).size / (1024 * 1024)).toFixed(2);
console.log(`SUCCESS! Saved complete Cartagena 3D dataset to ${outPath} (${sizeMB} MB)`);
