# Archive94
Next.js + Supabase (Postgres, Google auth) + Mailgun. Prices in naira.

## Setup
1. **Supabase:** create a project. SQL Editor: run `supabase/schema.sql`, then `supabase/seed.sql`.
2. **Google OAuth:** Google Cloud Console > APIs & Services > OAuth consent screen (External, add your email as test user) > Credentials > Create OAuth client ID (Web application). Authorised redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`. Copy the client ID and secret.
3. **Supabase Auth:** Authentication > Providers > Google: paste ID and secret, enable. Authentication > URL Configuration: Site URL `http://localhost:3000`, add redirect URL `http://localhost:3000/auth/callback` (and your Vercel URL later).
4. **Mailgun:** use the sandbox domain, add your email under Authorized Recipients and confirm it. Copy the API key and domain. EU accounts: set `MAILGUN_API_BASE=https://api.eu.mailgun.net`.
5. `cp .env.example .env.local` and fill it in (Supabase URL and anon key are under Project Settings > API).
6. `npm install && npm run dev`, open http://localhost:3000.

## Test
Sign in with Google, add a piece, checkout, confirm the row in `orders`, `order_items` and reduced `stock`, and check the email. A sold piece shows "Archived".

## Make yourself admin
`update profiles set is_admin = true where email = 'you@example.com';`
