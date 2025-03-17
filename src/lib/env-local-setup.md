# Creating Your .env.local File

Follow these steps to create your `.env.local` file with Supabase credentials:

## Step 1: Get Your Supabase Credentials

1. Go to [Supabase](https://supabase.com/) and sign up for an account if you don't already have one.
2. Create a new project by clicking "New Project" on your dashboard.
3. Fill in the project details:
   - Name: `ecomz` (or any name you prefer)
   - Database Password: Create a strong password
   - Region: Choose the region closest to you
4. Wait for your project to be created (this may take a few minutes).
5. Go to "Project Settings" (gear icon) in the sidebar.
6. Click on "API" in the sidebar menu.
7. Under "Project API keys", you'll find:
   - Project URL: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 2: Create the .env.local File

1. Open a text editor (like Notepad, VS Code, etc.)
2. Create a new file with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Replace `https://your-project-id.supabase.co` with your actual Supabase project URL
4. Replace `your-anon-key` with your actual Supabase anon key
5. Save the file as `.env.local` (make sure it's not saved as `.env.local.txt`) in the root directory of your project (same level as package.json)

## Step 3: Verify Your Setup

1. Restart your development server:
   ```
   npm run dev
   ```
2. Visit the `/supabase-setup` page in your application to verify that your environment variables are set up correctly.

## Example .env.local File

Here's an example of what your `.env.local` file should look like:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnopqrst.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3BxcnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2MTYxNjY4MjAsImV4cCI6MTkzMTc0MjgyMH0.EXAMPLE_KEY_REPLACE_WITH_YOUR_ACTUAL_KEY
```

Remember to replace the values with your actual Supabase credentials.

## Important Notes

- The `.env.local` file is automatically ignored by Git for security reasons
- You'll need to set up these environment variables in your deployment environment as well
- Never commit your Supabase keys to your repository
- Restart your development server after creating the `.env.local` file
