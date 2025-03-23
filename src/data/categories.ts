export interface SubCategory {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  subcategories: SubCategory[];
}

export const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets and electronic devices',
    image: '/images/categories/electronics.jpg',
    subcategories: [
      {
        id: 'smartphones',
        name: 'Smartphones',
        description: 'Latest smartphones from top brands',
        image: '/images/categories/smartphones.jpg'
      },
      {
        id: 'laptops',
        name: 'Laptops & Computers',
        description: 'High-performance laptops and desktop computers',
        image: '/images/categories/laptops.jpg'
      },
      {
        id: 'audio',
        name: 'Audio & Headphones',
        description: 'Premium sound systems and headphones',
        image: '/images/categories/audio.jpg'
      },
      {
        id: 'wearables',
        name: 'Wearable Technology',
        description: 'Smartwatches, fitness trackers, and more',
        image: '/images/categories/wearables.jpg'
      },
      {
        id: 'cameras',
        name: 'Cameras & Photography',
        description: 'Digital cameras, lenses, and accessories',
        image: '/images/categories/cameras.jpg'
      }
    ]
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Trendy apparel for all ages',
    image: '/images/categories/clothing.jpg',
    subcategories: [
      {
        id: 'mens',
        name: "Men's Clothing",
        description: 'Shirts, pants, jackets, and more for men',
        image: '/images/categories/mens.jpg'
      },
      {
        id: 'womens',
        name: "Women's Clothing",
        description: 'Dresses, tops, bottoms, and more for women',
        image: '/images/categories/womens.jpg'
      },
      {
        id: 'kids',
        name: "Kids' Clothing",
        description: 'Comfortable and stylish clothing for children',
        image: '/images/categories/kids.jpg'
      },
      {
        id: 'shoes',
        name: 'Footwear',
        description: 'Shoes, boots, sandals, and more',
        image: '/images/categories/shoes.jpg'
      },
      {
        id: 'accessories',
        name: 'Accessories',
        description: 'Bags, belts, hats, and other accessories',
        image: '/images/categories/accessories.jpg'
      }
    ]
  },
  {
    id: 'home',
    name: 'Home & Kitchen',
    description: 'Everything for your home',
    image: '/images/categories/home.jpg',
    subcategories: [
      {
        id: 'furniture',
        name: 'Furniture',
        description: 'Sofas, beds, tables, and more',
        image: '/images/categories/furniture.jpg'
      },
      {
        id: 'kitchen',
        name: 'Kitchen & Dining',
        description: 'Cookware, appliances, and dining essentials',
        image: '/images/categories/kitchen.jpg'
      },
      {
        id: 'bedding',
        name: 'Bedding & Bath',
        description: 'Sheets, towels, and bathroom accessories',
        image: '/images/categories/bedding.jpg'
      },
      {
        id: 'decor',
        name: 'Home Decor',
        description: 'Decorative items to beautify your home',
        image: '/images/categories/decor.jpg'
      },
      {
        id: 'appliances',
        name: 'Appliances',
        description: 'Major and small appliances for your home',
        image: '/images/categories/appliances.jpg'
      }
    ]
  },
  {
    id: 'books',
    name: 'Books',
    description: 'Books for all interests',
    image: '/images/categories/books.jpg',
    subcategories: [
      {
        id: 'fiction',
        name: 'Fiction',
        description: 'Novels, short stories, and literary fiction',
        image: '/images/categories/fiction.jpg'
      },
      {
        id: 'nonfiction',
        name: 'Non-Fiction',
        description: 'Biographies, history, science, and more',
        image: '/images/categories/nonfiction.jpg'
      },
      {
        id: 'children',
        name: "Children's Books",
        description: 'Books for kids of all ages',
        image: '/images/categories/childrenbooks.jpg'
      },
      {
        id: 'textbooks',
        name: 'Textbooks & Education',
        description: 'Academic and educational resources',
        image: '/images/categories/textbooks.jpg'
      },
      {
        id: 'ebooks',
        name: 'E-Books & Audiobooks',
        description: 'Digital books and audio content',
        image: '/images/categories/ebooks.jpg'
      }
    ]
  },
  {
    id: 'beauty',
    name: 'Beauty',
    description: 'Beauty and personal care products',
    image: '/images/categories/beauty.jpg',
    subcategories: [
      {
        id: 'skincare',
        name: 'Skincare',
        description: 'Cleansers, moisturizers, and treatments',
        image: '/images/categories/skincare.jpg'
      },
      {
        id: 'makeup',
        name: 'Makeup',
        description: 'Foundations, lipsticks, eye products, and more',
        image: '/images/categories/makeup.jpg'
      },
      {
        id: 'haircare',
        name: 'Hair Care',
        description: 'Shampoos, conditioners, and styling products',
        image: '/images/categories/haircare.jpg'
      },
      {
        id: 'fragrance',
        name: 'Fragrance',
        description: 'Perfumes, colognes, and body sprays',
        image: '/images/categories/fragrance.jpg'
      },
      {
        id: 'personalcare',
        name: 'Personal Care',
        description: 'Bath, body, and personal hygiene products',
        image: '/images/categories/personalcare.jpg'
      }
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Sports equipment and activewear',
    image: '/images/categories/sports.jpg',
    subcategories: [
      {
        id: 'activewear',
        name: 'Activewear',
        description: 'Athletic clothing for all sports',
        image: '/images/categories/activewear.jpg'
      },
      {
        id: 'equipment',
        name: 'Sports Equipment',
        description: 'Gear for various sports and activities',
        image: '/images/categories/equipment.jpg'
      },
      {
        id: 'outdoors',
        name: 'Outdoor Recreation',
        description: 'Camping, hiking, and outdoor gear',
        image: '/images/categories/outdoors.jpg'
      },
      {
        id: 'fitness',
        name: 'Fitness & Exercise',
        description: 'Home gym equipment and accessories',
        image: '/images/categories/fitness.jpg'
      },
      {
        id: 'fanshop',
        name: 'Fan Shop',
        description: 'Merchandise for sports teams and athletes',
        image: '/images/categories/fanshop.jpg'
      }
    ]
  },
  {
    id: 'toys',
    name: 'Toys & Games',
    description: 'Fun for all ages',
    image: '/images/categories/toys.jpg',
    subcategories: [
      {
        id: 'toddler',
        name: 'Toddler Toys',
        description: 'Educational and fun toys for toddlers',
        image: '/images/categories/toddler.jpg'
      },
      {
        id: 'action',
        name: 'Action Figures & Collectibles',
        description: 'Collectible figures and memorabilia',
        image: '/images/categories/action.jpg'
      },
      {
        id: 'boardgames',
        name: 'Board Games & Puzzles',
        description: 'Family games, puzzles, and card games',
        image: '/images/categories/boardgames.jpg'
      },
      {
        id: 'videogames',
        name: 'Video Games',
        description: 'Games for all platforms and consoles',
        image: '/images/categories/videogames.jpg'
      },
      {
        id: 'outdoor',
        name: 'Outdoor Play',
        description: 'Toys for outdoor fun and activities',
        image: '/images/categories/outdoorplay.jpg'
      }
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Car parts and accessories',
    image: '/images/categories/automotive.jpg',
    subcategories: [
      {
        id: 'parts',
        name: 'Car Parts & Accessories',
        description: 'Replacement parts and accessories for vehicles',
        image: '/images/categories/parts.jpg'
      },
      {
        id: 'tools',
        name: 'Tools & Equipment',
        description: 'Automotive tools and garage equipment',
        image: '/images/categories/tools.jpg'
      },
      {
        id: 'electronics',
        name: 'Car Electronics',
        description: 'Audio systems, GPS, and other electronics',
        image: '/images/categories/carelectronics.jpg'
      },
      {
        id: 'tires',
        name: 'Tires & Wheels',
        description: 'Tires, wheels, and related accessories',
        image: '/images/categories/tires.jpg'
      },
      {
        id: 'interior',
        name: 'Interior Accessories',
        description: 'Seat covers, floor mats, and interior decor',
        image: '/images/categories/interior.jpg'
      }
    ]
  }
];
