const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src/assets');
const manifestPath = path.join(__dirname, 'src/assets/assets-manifest.json');

fs.readdir(assetsDir, (err, files) => {
  if (err) {
    console.error('Error reading assets directory:', err);
    return;
  }
  const images = files.filter(file => /\.(jpg|jpeg|png|gif|svg)$/.test(file));
  fs.writeFileSync(manifestPath, JSON.stringify(images, null, 2));
  console.log('Assets manifest generated:', manifestPath);
});
