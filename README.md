# StudyAbroadAI 🎓

AI-powered guidance platform for Indian students pursuing global education. Built with Next.js 14, Supabase, and Groq AI.

## 🚀 Features

- **AI Chatbot**: Conversational assistant powered by Groq API (Moonshot/Kimi K2)
- **Smart Profile Detection**: Automatically extracts student information from conversations
- **University Recommendations**: Personalized suggestions based on profile
- **Country Comparisons**: Side-by-side analysis with interactive charts
- **Streaming Responses**: Real-time AI responses via Server-Sent Events
- **Authentication**: Email/password and Google OAuth via Supabase
- **Hybrid Caching**: Intelligent data caching with staleness management
- **PDF Reports**: Generate custom study abroad reports on-demand
- **Multiple Chat Sessions**: Manage parallel conversations with history

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ and npm installed
- A Supabase account ([supabase.com](https://supabase.com))
- A Groq API key ([console.groq.com](https://console.groq.com))
- Git

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Groq API
GROQ_API_KEY=your_groq_api_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the database schema from `database/schema.sql`

The schema includes:
- `chat_sessions` - Store conversation history
- `universities_cache` - Cache university data
- `countries_cache` - Cache country information
- `saved_comparisons` - Save comparison charts

### 4. Enable Authentication

In your Supabase dashboard:

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Enable **Google** provider:
   - Add your Google OAuth credentials
   - Set redirect URL: `http://localhost:3000/auth/callback`

### 5. Get Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Create an account or sign in
3. Generate an API key
4. Add it to your `.env.local` file

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
study-abroad-ai/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── chats/
│   │   ├── comparisons/
│   │   └── profile/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── chat/
│   │   └── groq/
│   ├── about/
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # Shadcn/ui components
│   ├── chat/                     # Chat interface components
│   └── layout/                   # Layout components
├── lib/
│   ├── supabase/                 # Supabase clients
│   ├── groq/                     # Groq API integration
│   └── utils.ts                  # Utility functions
├── types/                        # TypeScript type definitions
└── public/                       # Static assets
```

## 🎯 Key Implementation Details

### Chat System

The chat system uses streaming responses for a real-time experience:

```typescript
// Stream AI responses via SSE
const stream = await streamChatCompletion(messages, ADVISOR_SYSTEM_PROMPT)

// Messages are saved to Supabase with full history
await supabase
  .from('chat_sessions')
  .update({ messages: [...messages, { role: 'assistant', content: response }] })
```

### Caching Strategy

Data is cached intelligently to balance freshness and performance:

- **Universities**: 30 days
- **Countries**: 7 days
- **Job Market**: 14 days
- **Deadlines**: 1 day

Stale data is returned immediately while refreshing in the background.

### Profile Extraction

Student profiles are automatically extracted from conversations:

```typescript
const profileData = await extractProfile(messages)
// Returns: education level, field, budget, preferences, etc.
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
npm run build
```

### Production Checklist

- [ ] Add your production domain to Supabase authentication settings
- [ ] Update `NEXT_PUBLIC_SITE_URL` in environment variables
- [ ] Configure Google OAuth redirect URLs for production
- [ ] Set up Supabase Row Level Security (RLS) policies
- [ ] Review and optimize API rate limits

## 📊 Database Schema

See `database/schema.sql` for the complete database schema including:

- Chat sessions with JSONB message arrays
- University and country data caches
- Saved comparisons
- Indexes for performance

## 🤝 Contributing

This is a project built for a French client. If you want to extend it:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is proprietary and confidential.

## 🐛 Troubleshooting

### "Module not found" errors

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Supabase connection issues

- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure RLS policies allow your operations

### Groq API errors

- Verify your API key is valid
- Check API rate limits
- Ensure you're using a supported model name

## 📞 Support

For issues or questions:
- Check the [documentation](docs/)
- Review existing issues on GitHub
- Contact the development team

## 🎉 Next Steps

After setup, you can:

1. **Customize the landing page** in `app/page.tsx`
2. **Seed university data** using `public/data/universities-seed.json`
3. **Configure AI prompts** in `lib/groq/prompts.ts`
4. **Add more Shadcn components** as needed
5. **Implement remaining features**:
   - Dashboard pages (in progress)
   - Chat interface with streaming (in progress)
   - Comparison charts (in progress)
   - Profile management (in progress)
   - PDF report generation (to be implemented)

---

Built with ❤️ for Indian students pursuing global education
