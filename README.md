# Contact Us

A full-stack contact form application built for development and testing.

## Technology stack

- **Frontend:** React, Vite, TypeScript and CSS
- **Backend:** Node.js, Express and TypeScript
- **Database:** PostgreSQL (Neon recommended for hosted testing)
- **Hosting:** Vercel

## Features

- Contact form with name, email, subject and message fields
- Browser validation and server-side input validation
- PostgreSQL persistence using parameterised queries
- Success and error feedback
- API health-check endpoint
- Environment-based configuration and CORS allow-list

## Project structure

~~~text
contact-us/
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── style.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── db.ts
│   │   ├── index.ts
│   │   └── local.ts
│   ├── sql/
│   │   └── schema.sql
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
~~~

## Requirements

- Node.js 20 or later
- npm
- PostgreSQL

## Run locally

1. Clone the repository:

   ~~~bash
   git clone https://github.com/Darrenvandervelde/contact-us.git
   cd contact-us
   ~~~

2. Create a PostgreSQL database named `contact_us`.

3. Copy `.env.example` to `.env` in the repository root and update the database credentials.
   - **Windows PowerShell:** `Copy-Item .env.example .env`
   - **macOS / Linux:** `cp .env.example .env`

4. Create the table by running the schema script against the database:

   ~~~bash
   psql -d contact_us -f server/sql/schema.sql
   ~~~

   You can also run the SQL in `server/sql/schema.sql` using pgAdmin's Query Tool.

5. Install dependencies:

   ~~~bash
   npm install
   ~~~

6. Start the frontend and API:

   ~~~bash
   npm run dev
   ~~~

7. Open http://localhost:5173.

The Vite development server proxies local `/api` requests to Express on port 3001. The hosted frontend uses `VITE_API_BASE_URL` to reach the separately deployed API.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | API health check |
| POST | `/api/contact` | Validate and save a contact message |

Example request body:

~~~json
{
  "name": "Alex Example",
  "email": "alex@example.com",
  "subject": "General enquiry",
  "message": "Hello, I would like more information."
}
~~~

## Deploy to Vercel

Deploy the frontend and backend as two Vercel projects from this repository.

### 1. Create a hosted PostgreSQL database

Create a PostgreSQL database with a provider such as Neon. Copy its connection string. Keep the password private and ensure the connection string includes the provider's required SSL settings.

Run the SQL in `server/sql/schema.sql` once against the hosted database.

### 2. Deploy the backend

1. In Vercel, import this GitHub repository as a new project.
2. Set **Root Directory** to `server`.
3. Keep the Express framework detection and default build settings.
4. Add these environment variables for Production and Preview:
   - `DATABASE_URL` — the hosted PostgreSQL connection string (mark as a Secret).
   - `CLIENT_ORIGIN` — the exact deployed frontend origin, for example `https://your-contact-form.vercel.app`.
5. Deploy. The Express app is exported from `src/index.ts` and Vercel serves it as a function.
6. Test `https://YOUR-BACKEND-DOMAIN/api/health`.

### 3. Deploy the frontend

1. Import the same GitHub repository as another Vercel project.
2. Set **Root Directory** to `client`.
3. Use the Vite framework preset and default build command/output directory.
4. Add `VITE_API_BASE_URL` with the backend's full origin, for example `https://your-contact-api.vercel.app` (no trailing slash).
5. Deploy.

### 4. Connect and test

Confirm that `CLIENT_ORIGIN` on the backend exactly matches the frontend domain, including `https://`. Redeploy the backend after changing environment variables. Open the frontend, submit a test message, and verify that it appears in the PostgreSQL `contact_messages` table.

## Environment variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Backend | PostgreSQL connection string; keep secret |
| `PORT` | Local backend | Local Express port (default 3001) |
| `CLIENT_ORIGIN` | Backend | Comma-separated allowed frontend origins |
| `VITE_API_BASE_URL` | Frontend | Deployed API origin; public value, no trailing slash |

Vercel environment variables are configured in Project Settings → Environment Variables. Redeploy after changing them.

## Useful scripts

- `npm run dev` — start frontend and backend in development mode
- `npm run build` — build both workspaces
- `npm run typecheck` — run TypeScript checks

## Testing phase and security notes

This is an initial testing scaffold, not production-ready. Before production use, add rate limiting, spam protection, automated tests, stronger operational logging, and a managed database migration workflow. Do not commit `.env` or submit sensitive personal information to a test deployment.

## License

A license has not yet been selected.
