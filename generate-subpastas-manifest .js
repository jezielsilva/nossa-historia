const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src/assets');

// Função para verificar se dois arrays são iguais
function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

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
    } else {
      // Adiciona qualquer arquivo (não filtra por tipo) à subpasta correspondente
      const relativePath = path.relative(assetsDir, filePath).replace(/\\/g, '/'); // Corrige as barras
      const subfolder = path.relative(assetsDir, path.dirname(filePath)).replace(/\\/g, '/');
      subfolderManifests[subfolder] = subfolderManifests[subfolder] || [];
      subfolderManifests[subfolder].push(relativePath);
    }
  });
  return subfolderManifests;
}

function updateOrCreateSubfolderManifest(subfolder, newFiles) {
  const folderName = subfolder.split('/').pop(); // Última parte do caminho
  const subfolderManifestPath = path.join(assetsDir, `${folderName}-manifest.json`);

  let currentManifest = [];

  // Tenta ler o manifesto atual, se existir
  if (fs.existsSync(subfolderManifestPath)) {
    try {
      currentManifest = JSON.parse(fs.readFileSync(subfolderManifestPath, 'utf-8'));
    } catch (err) {
      console.error(`Erro ao ler o manifesto existente para ${folderName}:`, err);
    }

    // Verifica se houve alteração nos arquivos da subpasta
    if (!arraysAreEqual(currentManifest, newFiles)) {
      // Se houve alteração, atualiza o manifesto
      try {
        fs.writeFileSync(subfolderManifestPath, JSON.stringify(newFiles, null, 2));
        console.log('Manifesto da subpasta atualizado:', subfolderManifestPath);
      } catch (err) {
        console.error('Erro ao atualizar o manifesto da subpasta:', err);
      }
    } else {
      console.log(`Nenhuma alteração detectada para a subpasta ${folderName}. Manifesto não foi alterado.`);
    }
  } else {
    // Se o manifesto não existir, cria um novo
    try {
      fs.writeFileSync(subfolderManifestPath, JSON.stringify(newFiles, null, 2));
      console.log('Manifesto da subpasta criado:', subfolderManifestPath);
    } catch (err) {
      console.error('Erro ao criar o manifesto da subpasta:', err);
    }
  }
}

try {
  const subfolderManifests = getAllFilesByFolder(assetsDir);

  // Atualiza ou cria o manifesto para cada subpasta
  Object.keys(subfolderManifests).forEach((subfolder) => {
    // Ignora a criação de manifestos para a pasta 'geral'
    if (subfolder.toLowerCase() === 'geral') {
      return; // Não gera manifesto para a pasta 'geral'
    }

    // Atualiza ou cria o manifesto para cada subpasta
    updateOrCreateSubfolderManifest(subfolder, subfolderManifests[subfolder]);
  });
} catch (err) {
  console.error('Erro ao processar os arquivos e atualizar ou criar os manifestos:', err);
}
