const sharp = require('sharp');

sharp('public/icon.png')
  .resize(512, 512)
  .toFile('public/icon-512x512.png')
  .then(() => {
    console.log('Imagem redimensionada com sucesso!');
  })
  .catch(err => {
    console.error('Erro:', err);
  });