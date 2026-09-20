const fs = require('fs');
const path = require('path');

// Let's parse the binary GLB and separate/combine meshes into 3 clean OBJ / GLB models or run gltf-transform
const { execSync } = require('child_process');

console.log('Optimizing tierrabomba model into clean 3-layer architecture...');

// Step 1: gltf-transform optimize with weld, quantize, simplify
// Let's run dedup, weld, quantize, and draco
try {
  console.log('Running gltf-transform pipeline...');
  // npx @gltf-transform/cli optimize --no-join ...
  // Let's run individual safe transforms:
  // 1. weld (merges duplicate vertices)
  // 2. simplify (reduces dense flat surfaces)
  // 3. quantize
  // 4. draco
  execSync('npx --yes @gltf-transform/cli weld public/models/tierrabomba_revit.glb public/models/tierrabomba_weld.glb', { stdio: 'inherit' });
  execSync('npx --yes @gltf-transform/cli simplify public/models/tierrabomba_weld.glb public/models/tierrabomba_simp.glb --ratio 0.5 --error 0.001', { stdio: 'inherit' });
  execSync('npx --yes @gltf-transform/cli draco public/models/tierrabomba_simp.glb public/models/tierrabomba_revit_fast.glb', { stdio: 'inherit' });

  const originalSize = fs.statSync('public/models/tierrabomba_revit.glb').size;
  const fastSize = fs.statSync('public/models/tierrabomba_revit_fast.glb').size;

  console.log('Original size:', (originalSize / (1024*1024)).toFixed(2), 'MB');
  console.log('Fast size:', (fastSize / (1024*1024)).toFixed(2), 'MB');
} catch (e) {
  console.error('Error during optimization:', e);
}
