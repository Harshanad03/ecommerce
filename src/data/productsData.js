// Initial product data
export const productsData = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear sound with our premium wireless headphones. Features noise cancellation and 20-hour battery life.',
    price: 199.99,
    category: 'electronics',
    image: '/images/products/headphones.jpg',
    rating: 4.8,
    reviews: 245,
    stock: 50,
    featured: true,
  },
  {
    id: '2',
    name: 'Smartphone Pro Max',
    description: 'The latest smartphone with a 6.7-inch display, 5G capability, and an advanced camera system.',
    price: 999.99,
    category: 'electronics',
    image: '/images/products/smartphone.jpg',
    rating: 4.9,
    reviews: 512,
    stock: 30,
    featured: true,
  },
  {
    id: '3',
    name: 'Casual Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt perfect for everyday wear. Available in multiple colors.',
    price: 24.99,
    category: 'clothing',
    image: '/images/products/tshirt.jpg',
    rating: 4.5,
    reviews: 189,
    stock: 200,
    featured: true,
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    description: 'Designed for comfort during long work hours with adjustable height and lumbar support.',
    price: 249.99,
    category: 'furniture',
    image: '/images/products/chair.jpg',
    rating: 4.7,
    reviews: 132,
    stock: 15,
    featured: true,
  },
  {
    id: '5',
    name: 'Stainless Steel Water Bottle',
    description: 'Keep your drinks hot or cold for hours with this insulated stainless steel water bottle.',
    price: 29.99,
    category: 'accessories',
    image: '/images/products/bottle.jpg',
    rating: 4.6,
    reviews: 98,
    stock: 75,
    featured: true,
  },
  {
    id: '6',
    name: 'Fitness Smartwatch',
    description: 'Track your workouts, heart rate, and sleep with this advanced fitness smartwatch.',
    price: 149.99,
    category: 'electronics',
    image: '/images/products/smartwatch.jpg',
    rating: 4.7,
    reviews: 203,
    stock: 40,
    featured: true,
  },
  {
    id: '7',
    name: 'Designer Leather Wallet',
    description: 'Slim and stylish leather wallet with multiple card slots and RFID protection.',
    price: 59.99,
    category: 'accessories',
    image: '/images/products/wallet.jpg',
    rating: 4.4,
    reviews: 87,
    stock: 60,
    featured: true,
  },
  {
    id: '8',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof Bluetooth speaker with 360° sound and 12-hour battery life.',
    price: 79.99,
    category: 'electronics',
    image: '/images/products/speaker.jpg',
    rating: 4.5,
    reviews: 156,
    stock: 25,
  },
  {
    id: '9',
    name: 'Premium Laptop Backpack',
    description: 'Stylish and durable laptop backpack with anti-theft features and USB charging port.',
    price: 89.99,
    category: 'accessories',
    image: '/images/products/backpack.jpg',
    rating: 4.7,
    reviews: 178,
    stock: 45,
    featured: true,
  },
];

// Categories data
export const categoriesData = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'The latest gadgets and electronic devices',
    image: '/images/categories/electronics.jpg',
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Stylish and comfortable clothing for all occasions',
    image: '/images/categories/clothing.jpg',
  },
  {
    id: 'furniture',
    name: 'Furniture',
    description: 'Modern and classic furniture for your home',
    image: '/images/categories/furniture.jpg',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Essential accessories to complement your lifestyle',
    image: '/images/categories/accessories.jpg',
  },
];

// Helper function to save products to localStorage
export const saveProductsToStorage = (products) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ecomz_products', JSON.stringify(products));
  }
};

// Helper function to load products from localStorage
export const loadProductsFromStorage = () => {
  if (typeof window !== 'undefined') {
    const storedProducts = localStorage.getItem('ecomz_products');
    return storedProducts ? JSON.parse(storedProducts) : productsData;
  }
  return productsData;
};
