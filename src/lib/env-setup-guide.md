# Setting Up Environment Variables for Supabase

Follow these steps to set up your environment variables for Supabase:

1. Create a new file named `.env.local` in the root directory of your project (same level as package.json)

2. Add the following content to the file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Replace `your_supabase_project_url` with your actual Supabase project URL
   - This looks like: `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`

4. Replace `your_supabase_anon_key` with your actual Supabase anon key
   - This is a long string that starts with "eyJ..."

5. Save the file

## Where to Find Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to Project Settings (gear icon in the sidebar)
4. Click on "API" in the sidebar
5. Under "Project API keys", you'll find:
   - Project URL: Copy this for `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key: Copy this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Important Notes

- The `.env.local` file is automatically ignored by Git for security reasons
- You'll need to set up these environment variables in your deployment environment as well
- Never commit your Supabase keys to your repository
- Restart your development server after creating the `.env.local` file
