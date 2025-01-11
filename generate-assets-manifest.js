const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src/assets');
const manifestPath = path.join(__dirname, 'src/assets/assets-general-manifest.json');

function getAllFilesAndFolders(dir, fileList = [], folderList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);

    // Ignora pastas chamadas 'geral'
    if (fs.statSync(filePath).isDirectory() && file.toLowerCase() === 'geral') {
      return; // Não processa pastas chamadas 'geral'
    }

    if (fs.statSync(filePath).isDirectory()) {
      // Adiciona o nome da subpasta à lista de pastas, exceto se for 'geral'
      const relativeFolderPath = path.relative(assetsDir, filePath).replace(/\\/g, '/');
      folderList.push(relativeFolderPath);

      // Recursivamente processa as subpastas
      getAllFilesAndFolders(filePath, fileList, folderList);
    } else if (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file)) {
      // Adiciona apenas arquivos de imagem
      const relativeFilePath = path.relative(assetsDir, filePath).replace(/\\/g, '/');
      fileList.push(relativeFilePath);
    }
  });
  return { fileList, folderList };
}

function updateManifest(fileList, folderList) {
  // Tenta ler o arquivo manifesto existente
  let currentManifest = { allImages: [], subfolders: [] };

  if (fs.existsSync(manifestPath)) {
    try {
      currentManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (err) {
      console.error('Erro ao ler o manifesto existente:', err);
    }
  }

  // Verifica se houve alterações nas imagens ou pastas
  const imagesChanged = !arraysAreEqual(currentManifest.allImages, fileList);
  const foldersChanged = !arraysAreEqual(currentManifest.subfolders, folderList);

  if (imagesChanged || foldersChanged) {
    // Se houve alterações, atualiza o manifesto
    const generalManifest = {
      allImages: fileList,
      subfolders: folderList,
    };

    try {
      fs.writeFileSync(manifestPath, JSON.stringify(generalManifest, null, 2));
      console.log('Manifesto geral atualizado com sucesso:', manifestPath);
    } catch (err) {
      console.error('Erro ao atualizar o manifesto geral:', err);
    }
  } else {
    console.log('Nenhuma alteração detectada. O manifesto não foi alterado.');
  }
}

// Função para comparar se dois arrays são iguais
function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

try {
  const { fileList, folderList } = getAllFilesAndFolders(assetsDir);

  // Atualiza o manifesto apenas se necessário
  updateManifest(fileList, folderList);
} catch (err) {
  console.error('Erro ao processar as imagens e pastas:', err);
}
