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
      }
    ]
  }
];
