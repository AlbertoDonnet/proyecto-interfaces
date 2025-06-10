// generate-cache-list.js
const fs = require('fs');
const path = require('path');

const buildDir = './build'; // carpeta donde está el build estático
const outputFile = './src/service-worker-cache-list.js'; // archivo que importa sw.js

// NUEVA variable para copiar también dentro del build final
const DEST_PATH_BUILD = './build/service-worker-cache-list.js'; 

function walkDir(dir, baseDir = dir) {
  let files = [];
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const relPath = './' + path.relative(baseDir, fullPath).replace(/\\/g, '/');
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(walkDir(fullPath, baseDir));
    } else {
      files.push(relPath);
    }
  }
  return files;
}

const urlsToCache = walkDir(buildDir)
  .filter(f => !f.endsWith('.map')); // opcional: excluye sourcemaps

fs.writeFileSync(outputFile, `self.dynamicUrlsToCache = ${JSON.stringify(urlsToCache, null, 2)};\n`);

console.log(`✅ Archivo generado: ${outputFile}`);

fs.copyFileSync('src/service-worker-cache-list.js', 'static/service-worker-cache-list.js');
console.log('✅ Copiado a static/service-worker-cache-list.js');

// Copiar también al build para que vite preview lo sirva bien
fs.copyFileSync(outputFile, DEST_PATH_BUILD);
console.log(`✅ Copiado a build: ${DEST_PATH_BUILD}`);
