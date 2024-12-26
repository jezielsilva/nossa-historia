const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src/assets');
const manifestPath = path.join(__dirname, 'src/assets/assets-manifest.json');

function getAllFiles(dir, fileList = [], subfolderManifests = {}) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Se for um diretório, chamamos a função recursivamente
      const subfolder = path.relative(assetsDir, filePath);
      subfolderManifests[subfolder] = subfolderManifests[subfolder] || [];
      getAllFiles(filePath, fileList, subfolderManifests);
    } else if (/\.(jpg|jpeg|png|gif|svg)$/.test(file)) {
      // Se for um arquivo de imagem, adicionamos à lista
      const relativePath = path.relative(assetsDir, filePath);
      fileList.push(relativePath);

      // Adiciona ao manifesto da subpasta, se aplicável
      const subfolder = path.relative(assetsDir, path.dirname(filePath));
      subfolderManifests[subfolder] = subfolderManifests[subfolder] || [];
      subfolderManifests[subfolder].push(relativePath);
    }
  });
  return { fileList, subfolderManifests };
}

try {
  const { fileList, subfolderManifests } = getAllFiles(assetsDir);

  // Salvar arquivo geral com todas as imagens
  fs.writeFileSync(manifestPath, JSON.stringify(fileList, null, 2));
  console.log('Assets manifest (geral) generated:', manifestPath);

  // Salvar um arquivo separado para cada subpasta
  Object.keys(subfolderManifests).forEach((subfolder) => {
    const subfolderManifestPath = path.join(assetsDir, `${subfolder.replace(/[\/\\]/g, '-')}-manifest.json`);
    fs.writeFileSync(subfolderManifestPath, JSON.stringify(subfolderManifests[subfolder], null, 2));
    console.log('Subfolder manifest generated:', subfolderManifestPath);
  });
} catch (err) {
  console.error('Error processing assets directory:', err);
}
