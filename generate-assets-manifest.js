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
    } else if (/\.(jpg|jpeg|png|gif|svg)$/i.test(file)) {
      // Adiciona apenas arquivos de imagem
      const relativeFilePath = path.relative(assetsDir, filePath).replace(/\\/g, '/');
      fileList.push(relativeFilePath);
    }
  });
  return { fileList, folderList };
}

try {
  const { fileList, folderList } = getAllFilesAndFolders(assetsDir);

  // Cria o manifesto geral com fotos e subpastas
  const generalManifest = {
    allImages: fileList,
    subfolders: folderList,
  };

  // Salva o manifesto geral
  fs.writeFileSync(manifestPath, JSON.stringify(generalManifest, null, 2));
  console.log('Manifesto geral gerado com sucesso:', manifestPath);
} catch (err) {
  console.error('Erro ao gerar o manifesto geral:', err);
}
