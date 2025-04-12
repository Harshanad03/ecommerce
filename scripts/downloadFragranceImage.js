const https = require('https');
const fs = require('fs');
const path = require('path');

const fragranceImage = {
  id: 'fragrance',
  url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
  filename: 'fragrance.jpg'
};

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../public/images/categories', filename);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded: ${filename}`);
          resolve();
        });
      } else {
        reject(`Failed to download ${filename}: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      reject(`Error downloading ${filename}: ${err.message}`);
    });
  });
};

const downloadFragranceImage = async () => {
  // Create categories directory if it doesn't exist
  const categoriesDir = path.join(__dirname, '../public/images/categories');
  if (!fs.existsSync(categoriesDir)) {
    fs.mkdirSync(categoriesDir, { recursive: true });
  }

  console.log('Starting fragrance image download...');
  
  try {
    await downloadImage(fragranceImage.url, fragranceImage.filename);
    console.log('Fragrance image download completed!');
  } catch (error) {
    console.error(error);
  }
};

downloadFragranceImage(); 