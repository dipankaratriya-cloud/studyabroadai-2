# Quick Setup Guide

Follow these steps to get your StudyAbroadAI platform running:

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Supabase, Groq SDK, and UI libraries.

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Open `.env.local` and fill in your credentials:

### Get Supabase Credentials:
1. Go to [supabase.com](https://supabase.com) and create a project
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** → paste as `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the **anon/public key** → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy the **service_role key** → paste as `SUPABASE_SERVICE_ROLE_KEY`

### Get Groq API Key:
1. Go to [console.groq.com](https://console.groq.com)
2. Create an account or sign in
3. Generate an API key
4. Paste as `GROQ_API_KEY`

## Step 3: Set Up Database

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the contents of `database/schema.sql`
4. Paste and run it in the SQL Editor

This creates all necessary tables:
- chat_sessions
- universities_cache
- countries_cache
- programs_cache
- saved_comparisons

## Step 4: Enable Authentication

In your Supabase dashboard:

### Enable Email Authentication:
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Save

### Enable Google OAuth (Optional but Recommended):
1. Create a Google Cloud Project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Set **Authorized redirect URIs**:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://your-domain.com/auth/callback` (for production)
5. Copy **Client ID** and **Client Secret**
6. In Supabase, go to **Authentication** → **Providers**
7. Enable **Google** provider
8. Paste your Client ID and Client Secret
9. Save

## Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Test the Application

1. **Landing Page**: Should load at `http://localhost:3000`
2. **Sign Up**: Create a test account at `/signup`
3. **Login**: Test authentication at `/login`
4. **Dashboard**: After login, you'll be redirected to `/dashboard`

## Troubleshooting

### Port 3000 already in use:
```bash
npm run dev -- -p 3001
```

### Module not found errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection issues:
- Verify environment variables are correct
- Check Supabase project is active
- Ensure you ran the schema.sql script

### Authentication not working:
- Check Supabase Auth providers are enabled
- Verify redirect URLs match exactly
- Clear browser cookies and try again

## Next Steps

After successful setup:

1. **Customize the UI**: Edit components in `components/` folder
2. **Add More Universities**: Update `public/data/universities-seed.json`
3. **Configure AI Prompts**: Modify `lib/groq/prompts.ts`
4. **Test Chat Interface**: Once dashboard is complete, test the AI chatbot
5. **Deploy to Vercel**: Follow deployment guide in README.md

## Production Deployment

When ready to deploy:

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Update Supabase auth redirect URLs for production
5. Deploy!

## Getting Help

- Check the main [README.md](README.md) for detailed documentation
- Review [Next.js docs](https://nextjs.org/docs)
- Check [Supabase docs](https://supabase.com/docs)
- Review [Groq docs](https://console.groq.com/docs)

---

Happy coding! 🚀
