const https = require('https');
const fs = require('fs');
const path = require('path');

const categories = [
  {
    id: 'electronics',
    url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80',
    filename: 'electronics.jpg'
  },
  {
    id: 'clothing',
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
    filename: 'clothing.jpg'
  },
  {
    id: 'home',
    url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80',
    filename: 'home.jpg'
  },
  {
    id: 'books',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    filename: 'books.jpg'
  },
  {
    id: 'beauty',
    url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    filename: 'beauty.jpg'
  },
  {
    id: 'sports',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    filename: 'sports.jpg'
  }
];

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

const downloadAllImages = async () => {
  // Create categories directory if it doesn't exist
  const categoriesDir = path.join(__dirname, '../public/images/categories');
  if (!fs.existsSync(categoriesDir)) {
    fs.mkdirSync(categoriesDir, { recursive: true });
  }

  console.log('Starting image downloads...');
  
  for (const category of categories) {
    try {
      await downloadImage(category.url, category.filename);
    } catch (error) {
      console.error(error);
    }
  }
  
  console.log('All downloads completed!');
};

downloadAllImages(); 