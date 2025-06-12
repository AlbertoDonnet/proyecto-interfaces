const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'docs');
const outputFile = path.join(buildDir, 'service-worker-cache-list.js');

function generateCacheList() {
  const files = [];
  const basePath = process.env.NODE_ENV === 'production' ? '/proyecto-interfaces/' : '/';

  function walkDir(dir) {
    const entries = fs.readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else {
        // Excluir archivos no necesarios
        if (!entry.endsWith('.map') && 
            !entry.includes('service-worker') && 
            !entry.includes('404.html')) {
          
          let relativePath = path.relative(buildDir, fullPath);
          // Convertir a formato URL con barras normales
          relativePath = relativePath.split(path.sep).join('/');
          
          files.push(`${basePath}${relativePath}`);
        }
      }
    }
  }

  walkDir(buildDir);
  
  // Manejar el archivo index.html
  const indexHtmlPath = basePath + 'index.html';
  const index = files.findIndex(f => f === indexHtmlPath);
  if (index !== -1) {
    files[index] = basePath;
  }

  return files;
}

// Crear directorio docs si no existe
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

const cacheList = generateCacheList();
fs.writeFileSync(
  outputFile,
  `self.urlsToCache = ${JSON.stringify(cacheList, null, 2)};`
);
console.log(`✅ Lista de caché generada: ${cacheList.length} recursos`);