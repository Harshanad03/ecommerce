# Complete Supabase Setup Guide for Ecomz

This guide will walk you through the process of setting up Supabase for your Ecomz project.

## 1. Create a Supabase Account and Project

1. Go to [Supabase](https://supabase.com/) and sign up for an account if you don't already have one.
2. Once logged in, click "New Project" to create a new project.
3. Fill in the project details:
   - Name: `ecomz` (or any name you prefer)
   - Database Password: Create a strong password
   - Region: Choose the region closest to you or your target audience
4. Click "Create new project" and wait for the project to be created (this may take a few minutes).

## 2. Set Up Environment Variables

1. In your Supabase project dashboard, go to "Project Settings" (gear icon) > "API".
2. Under "Project API keys", you'll find:
   - Project URL: Copy this for `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key: Copy this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Create a `.env.local` file in the root of your project with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Replace the placeholder values with your actual Supabase URL and anon key.

## 3. Create the Products Table

### Option 1: Using the Supabase Dashboard

1. In your Supabase project dashboard, go to "Table Editor".
2. Click "Create a new table".
3. Set the table name to "products".
4. Add the following columns:

| Column Name | Type | Default Value | Primary Key | Is Nullable |
|-------------|------|---------------|------------|-------------|
| id | uuid | uuid_generate_v4() | Yes | No |
| name | text | | No | No |
| description | text | | No | Yes |
| price | numeric | | No | No |
| category | text | | No | No |
| image | text | | No | Yes |
| rating | numeric | | No | Yes |
| reviews | integer | | No | Yes |
| stock | integer | | No | No |
| featured | boolean | false | No | No |
| created_at | timestamp with time zone | now() | No | No |

5. Click "Save" to create the table.

### Option 2: Using SQL

1. In your Supabase project dashboard, go to "SQL Editor".
2. Create a new query.
3. Copy and paste the SQL from `src/scripts/create-products-table.sql`.
4. Run the query to create the table.

## 4. Seed the Database with Initial Data

1. Make sure your environment variables are set up correctly.
2. Run the following command to seed your database with the initial product data:

```bash
npm run seed-db
```

This will:
- Compile the TypeScript seed script
- Connect to your Supabase database
- Clear any existing products (optional)
- Insert the products from your local data

## 5. Verify Your Setup

1. Visit the `/supabase-setup` page in your application to verify that your environment variables are set up correctly.
2. In your Supabase dashboard, go to "Table Editor" > "products" to verify that your products have been added.

## 6. Update Your Application to Use Supabase

Now that your Supabase database is set up, you can update your application to use the Supabase API functions instead of the local data.

Here are the key files to update:

1. `src/app/page.tsx`: Update to use `getFeaturedProducts()` from the API
2. `src/app/products/page.tsx`: Update to use `getAllProducts()` from the API
3. `src/app/products/[id]/page.tsx`: Update to use `getProductById()` from the API
4. `src/app/categories/[id]/page.tsx`: Update to use `getProductsByCategory()` from the API

## 7. Additional Features to Consider

Once your basic Supabase integration is working, you might want to consider adding these features:

1. **Authentication**: Add user authentication to create admin-only sections
2. **Storage**: Use Supabase Storage for product images
3. **Real-time updates**: Implement real-time updates for inventory changes
4. **Admin Dashboard**: Create an admin dashboard to manage products

## Troubleshooting

If you encounter any issues:

1. **Environment Variables**: Make sure your `.env.local` file is in the root directory and contains the correct values.
2. **Database Connection**: Check that your Supabase project is active and the database is online.
3. **API Functions**: Check the browser console for any errors in the API functions.
4. **Seeding Script**: If the seeding script fails, check the error message for details.

For more help, refer to the [Supabase documentation](https://supabase.com/docs).
