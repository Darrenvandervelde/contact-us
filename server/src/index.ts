import express, { Request, Response } from "express";
import { pool } from "./db.js";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json({ limit: "10kb" }));

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

app.get("/api/health", (_request: Request, response: Response) => {
  response.json({ status: "ok" });
});

app.post("/api/contact", async (request: Request, response: Response) => {
  const body = request.body as ContactPayload;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !subject || !message) {
    response.status(400).json({ message: "Please complete all fields." });
    return;
  }

  if (name.length > 100 || email.length > 254 || subject.length > 150 || message.length > 5000) {
    response.status(400).json({ message: "One or more fields exceed the allowed length." });
    return;
  }

  if (!isEmail(email)) {
    response.status(400).json({ message: "Please enter a valid email address." });
    return;
  }

  try {
    await pool.query(
      "INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)",
      [name, email, subject, message]
    );
    response.status(201).json({ message: "Your message has been received." });
  } catch (error) {
    console.error("Failed to save contact message:", error);
    response.status(500).json({ message: "We could not save your message. Please try again later." });
  }
});

async function start() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(254) NOT NULL,
      subject VARCHAR(150) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  app.listen(port, () => {
    console.log(`Contact API listening on http://localhost:${port}`);
  });
}

start().catch((error: unknown) => {
  console.error("Could not start the API:", error);
  process.exit(1);
});
