import fs from 'fs';
import { NodeIO } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, quantize, dedup, draco, prune, simplify, join } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import { MeshoptSimplifier } from 'meshoptimizer';

async function processModel() {
  console.log('Loading tierrabomba_revit.glb...');
  const io = new NodeIO()
    .registerExtensions(KHRONOS_EXTENSIONS)
    .registerDependencies({
      'draco3d.decoder': await draco3d.createDecoderModule(),
      'draco3d.encoder': await draco3d.createEncoderModule(),
    });

  const doc = await io.read('public/models/tierrabomba_revit.glb');
  const root = doc.getRoot();

  console.log('Original Nodes:', root.listNodes().length);
  console.log('Original Meshes:', root.listMeshes().length);

  // Define 3 Materials
  const matTerrain = doc.createMaterial('Terrain')
    .setBaseColorFactor([0.24, 0.55, 0.34, 1.0]) // #3d8b57 green
    .setRoughnessFactor(0.85)
    .setMetallicFactor(0.05);

  const matWalls = doc.createMaterial('Walls')
    .setBaseColorFactor([0.76, 0.43, 0.29, 1.0]) // #c26d4a terracota BTC
    .setRoughnessFactor(0.7)
    .setMetallicFactor(0.1);

  const matBuildings = doc.createMaterial('Buildings')
    .setBaseColorFactor([0.97, 0.98, 0.99, 1.0]) // #f8fafc crisp white
    .setRoughnessFactor(0.35)
    .setMetallicFactor(0.15);

  // Re-assign materials to primitives based on node name / material
  root.listNodes().forEach(node => {
    const name = node.getName() || '';
    const mesh = node.getMesh();
    if (!mesh) return;

    mesh.listPrimitives().forEach(prim => {
      if (name.includes('Toposolid') || name.toLowerCase().includes('terrain')) {
        prim.setMaterial(matTerrain);
      } else if (name.includes('Partición') || name.includes('Interior') || name.toLowerCase().includes('muro')) {
        prim.setMaterial(matWalls);
      } else {
        prim.setMaterial(matBuildings);
      }
    });
  });

  // Now join by material / flatten hierarchy
  console.log('Joining primitives by material & simplifying...');
  await doc.transform(
    join({ keepNamed: false }),
    weld({ tolerance: 0.0001 }),
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.8, error: 0.001 }),
    draco({ method: 'edgebreaker' })
  );

  console.log('Post-transform Meshes:', root.listMeshes().length);
  console.log('Post-transform Materials:', root.listMaterials().map(m => m.getName()));

  // Name the nodes according to their materials
  root.listNodes().forEach(n => {
    const mesh = n.getMesh();
    if (mesh) {
      const prims = mesh.listPrimitives();
      if (prims.length > 0 && prims[0].getMaterial()) {
        const mName = prims[0].getMaterial().getName();
        n.setName(`Layer_${mName}`);
        mesh.setName(`Mesh_${mName}`);
      }
    }
  });

  console.log('Writing optimized tierrabomba_revit.glb...');
  await io.write('public/models/tierrabomba_revit.glb', doc);

  const finalStat = fs.statSync('public/models/tierrabomba_revit.glb');
  console.log(`\n🎉 DONE! Final optimized file size: ${(finalStat.size / (1024 * 1024)).toFixed(2)} MB (${(finalStat.size / 1024).toFixed(0)} KB)`);
}

processModel().catch(console.error);
