const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src/assets');

function getAllFilesByFolder(dir, subfolderManifests = {}) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);

    // Ignora pastas chamadas 'geral'
    if (fs.statSync(filePath).isDirectory() && file.toLowerCase() === 'geral') {
      return; // Não faz nada se for a pasta 'geral'
    }

    if (fs.statSync(filePath).isDirectory()) {
      // Se for um diretório, chama recursivamente
      const subfolder = path.relative(assetsDir, filePath).replace(/\\/g, '/'); // Corrige as barras
      subfolderManifests[subfolder] = subfolderManifests[subfolder] || [];
      getAllFilesByFolder(filePath, subfolderManifests);
    } else if (/\.(jpg|jpeg|png|gif|svg)$/i.test(file)) {
      // Adiciona as imagens à subpasta correspondente
      const relativePath = path.relative(assetsDir, filePath).replace(/\\/g, '/'); // Corrige as barras
      const subfolder = path.relative(assetsDir, path.dirname(filePath)).replace(/\\/g, '/');
      subfolderManifests[subfolder] = subfolderManifests[subfolder] || [];
      subfolderManifests[subfolder].push(relativePath);
    }
  });
  return subfolderManifests;
}

try {
  const subfolderManifests = getAllFilesByFolder(assetsDir);

  // Salva cada manifesto de subpasta em um arquivo separado
  Object.keys(subfolderManifests).forEach((subfolder) => {
    // Ignora a criação de manifestos para a pasta 'geral'
    if (subfolder.toLowerCase() === 'geral') {
      return; // Não gera manifesto para a pasta 'geral'
    }

    // Extrai o último nome da subpasta para o nome do arquivo
    const folderName = subfolder.split('/').pop(); // Última parte do caminho
    const subfolderManifestPath = path.join(assetsDir, `${folderName}-manifest.json`);
    fs.writeFileSync(subfolderManifestPath, JSON.stringify(subfolderManifests[subfolder], null, 2));
    console.log('Manifesto da subpasta gerado:', subfolderManifestPath);
  });
} catch (err) {
  console.error('Erro ao gerar os manifestos de subpastas:', err);
}
