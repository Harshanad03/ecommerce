const https = require('https');
const fs = require('fs');
const path = require('path');

const subcategories = [
  // Electronics subcategories
  {
    id: 'smartphones',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    filename: 'smartphones.jpg'
  },
  {
    id: 'laptops',
    url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    filename: 'laptops.jpg'
  },
  {
    id: 'audio',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    filename: 'audio.jpg'
  },
  {
    id: 'wearables',
    url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
    filename: 'wearables.jpg'
  },

  // Clothing subcategories
  {
    id: 'mens',
    url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80',
    filename: 'mens.jpg'
  },
  {
    id: 'womens',
    url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80',
    filename: 'womens.jpg'
  },
  {
    id: 'kids',
    url: 'https://images.unsplash.com/photo-1519238359922-989348752efb?auto=format&fit=crop&w=800&q=80',
    filename: 'kids.jpg'
  },
  {
    id: 'accessories',
    url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80',
    filename: 'accessories.jpg'
  },

  // Home subcategories
  {
    id: 'furniture',
    url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53118?auto=format&fit=crop&w=800&q=80',
    filename: 'furniture.jpg'
  },
  {
    id: 'kitchen',
    url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80',
    filename: 'kitchen.jpg'
  },
  {
    id: 'bedding',
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5b14af?auto=format&fit=crop&w=800&q=80',
    filename: 'bedding.jpg'
  },
  {
    id: 'decor',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    filename: 'decor.jpg'
  },

  // Books subcategories
  {
    id: 'fiction',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    filename: 'fiction.jpg'
  },
  {
    id: 'nonfiction',
    url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
    filename: 'nonfiction.jpg'
  },
  {
    id: 'childrenbooks',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    filename: 'childrenbooks.jpg'
  },
  {
    id: 'textbooks',
    url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
    filename: 'textbooks.jpg'
  },

  // Beauty subcategories
  {
    id: 'skincare',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    filename: 'skincare.jpg'
  },
  {
    id: 'makeup',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    filename: 'makeup.jpg'
  },
  {
    id: 'haircare',
    url: 'https://images.unsplash.com/photo-1560067174-c5a3a8f37060?auto=format&fit=crop&w=800&q=80',
    filename: 'haircare.jpg'
  },
  {
    id: 'fragrance',
    url: 'https://images.unsplash.com/photo-1587017539504-7aa499b410df?auto=format&fit=crop&w=800&q=80',
    filename: 'fragrance.jpg'
  },

  // Sports subcategories
  {
    id: 'activewear',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    filename: 'activewear.jpg'
  },
  {
    id: 'equipment',
    url: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80',
    filename: 'equipment.jpg'
  },
  {
    id: 'outdoors',
    url: 'https://images.unsplash.com/photo-1501691223387-dd0500403074?auto=format&fit=crop&w=800&q=80',
    filename: 'outdoors.jpg'
  },
  {
    id: 'fitness',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    filename: 'fitness.jpg'
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

  console.log('Starting subcategory image downloads...');
  
  for (const subcategory of subcategories) {
    try {
      await downloadImage(subcategory.url, subcategory.filename);
    } catch (error) {
      console.error(error);
    }
  }
  
  console.log('All subcategory downloads completed!');
};

downloadAllImages(); 