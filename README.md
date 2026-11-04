# Contact Us

A full-stack contact form application built for development and testing.

## Technology stack
- **Frontend:** React, Vite, TypeScript and CSS
- **Backend:** Node.js, Express and TypeScript
- **Database:** PostgreSQL

## Features
- Contact form with name, email, subject and message fields
- Browser validation and server-side input validation
- PostgreSQL persistence using parameterised queries
- Success and error feedback
- API health-check endpoint
- Environment-based database configuration

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
│   │   └── index.ts
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
2. Create a PostgreSQL database named contact_us (or choose another name and update the connection string).
3. Copy .env.example to .env in the repository root and update the database credentials.
   - **Windows PowerShell:** `Copy-Item .env.example .env`
   - **macOS / Linux:** `cp .env.example .env`
4. Install dependencies:
   ~~~bash
   npm install
   ~~~
5. Start the frontend and API:
   ~~~bash
   npm run dev
   ~~~
6. Open http://localhost:5173.

Vite proxies /api requests to the Express API on port 3001. The API creates the contact_messages table on startup if it does not already exist.

## API endpoints
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/health | API health check |
| POST | /api/contact | Validate and save a contact message |

Example request body:
~~~json
{
  "name": "Alex Example",
  "email": "alex@example.com",
  "subject": "General enquiry",
  "message": "Hello, I would like more information."
}
~~~

## Useful scripts
- `npm run dev` — start the frontend and backend in development mode
- `npm run build` — build both workspaces
- `npm run typecheck` — run TypeScript checks

## Testing phase and security notes
This project is an initial testing scaffold, not production-ready. Before production use, add rate limiting, spam protection, stronger operational logging, database migrations, automated tests, and deployment configuration. Do not commit .env or submit sensitive personal information to a test deployment.

## License
A license has not yet been selected.
