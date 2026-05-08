# MTR Backend - Deploy to Vercel Serverless

This backend is configured to run on **Vercel Serverless Functions** using **Express** and **PostgreSQL** (Neon or Supabase).

## Environment Variables

Create a `.env` file from `.env.example` and configure the following:

| Variable      | Description                                                         |
|---------------|---------------------------------------------------------------------|
| `DATABASE_URL`| Full PostgreSQL connection string (from Neon or Supabase)           |
| `POSTGRES_URL`| Same as above (some Vercel integrations write to this variable)     |
| `JWT_SECRET`  | Strong random string for signing JWTs                               |
| `PGSSLMODE`   | Set to `disable` only for local development with non-SSL Postgres   |

### Example `.env`

```
DATABASE_URL=postgresql://user:password@ep-something.us-east-1.aws.neon.tech/mtrdb?sslmode=require
JWT_SECRET=your_strong_random_secret
```

## Database Provider Options (Vercel Free Tier Compatible)

### Option A: Neon
1. Go to [https://neon.tech](https://neon.tech) and sign up.
2. Create a new project and copy the **connection string**.
3. Paste it into `DATABASE_URL` in your Vercel project settings.

### Option B: Supabase
1. Go to [https://supabase.com](https://supabase.com) and create a project.
2. In Project Settings → Database → Connection String → URI, copy the string.
3. Paste it into `DATABASE_URL` in your Vercel project settings.

## One-Time Database Setup

After you have set `DATABASE_URL` locally, run the setup script to create tables and seed data:

```bash
npm install
node src/db/setup.js
```

This will:
1. Create all tables defined in `src/db/schema.pg.sql`
2. Seed default users, categories, products, inventory, and reviews

> You only need to run this **once** per database instance. Re-running is safe (it skips existing data).

## Local Development

```bash
npm install
npm start
```

The server will run on `http://localhost:3000` (or the port set in `PORT`).

## Deploy to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Link & Deploy

```bash
vercel
```

Follow the prompts to link your project.

### 3. Set Environment Variables on Vercel

```bash
vercel env add DATABASE_URL
vercel env add JWT_SECRET
```

Or add them in the Vercel Dashboard under **Project Settings → Environment Variables**.

### 4. Redeploy

```bash
vercel --prod
```

## API Routes

Base URL: `https://<your-vercel-domain>`

| Endpoint                  | Description                    |
|---------------------------|--------------------------------|
| `GET /`                   | Health / API status            |
| `GET /health`             | Health check                   |
| `POST /api/auth/register` | Register a new customer        |
| `POST /api/auth/login`    | Login and get JWT              |
| `GET /api/auth/profile`   | Get user profile               |
| `PUT /api/auth/profile`   | Update profile                 |
| `GET /api/products`       | List products (with filters)   |
| `GET /api/products/:id`   | Product details                |
| `GET /api/categories`     | List categories                |
| `GET /api/inventory/:id`  | Inventory by product           |
| `GET /api/cart`           | Get current user's cart        |
| `POST /api/orders/checkout`| Checkout cart                 |
| `GET /api/orders`         | User's orders                  |
| `GET /api/reviews/product/:id`| Reviews for a product       |
| `GET /api/admin/dashboard`| Admin dashboard summary        |

## Default Seed Users

| Email             | Password       | Role       |
|-------------------|----------------|------------|
| admin@mtr.com     | admin123       | admin      |
| ali@mtr.com       | customer123    | customer   |
| omar@mtr.com      | customer456    | customer   |

## Troubleshooting

- **Connection refused**: Ensure `DATABASE_URL` is set correctly and the database allows connections from your IP.
- **SSL errors**: Do not set `PGSSLMODE=disable` for remote providers; SSL is required.
- **Missing tables**: Run `node src/db/setup.js` locally against your target database.
