import { products } from '@/data/products';
import { supabase } from '@/lib/supabase';

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  // Clear existing data (optional)
  console.log('Clearing existing products...');
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .neq('id', '0'); // Delete all rows
  
  if (deleteError) {
    console.error('Error clearing products table:', deleteError);
    return;
  }
  
  console.log('Inserting products...');
  // Insert products
  const { error: insertError } = await supabase
    .from('products')
    .insert(products.map(product => ({
      // If you want to keep your existing IDs, you'll need to modify the table schema
      // Otherwise, Supabase will generate UUIDs automatically
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews,
      stock: product.stock,
      featured: product.featured || false,
    })));
  
  if (insertError) {
    console.error('Error seeding products:', insertError);
    return;
  }
  
  console.log('Database seeded successfully!');
}

// Only run the seeding function if this script is executed directly
if (require.main === module) {
  seedDatabase()
    .catch(error => {
      console.error('Error seeding database:', error);
    });
}

export { seedDatabase };
