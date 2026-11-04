import express, { Request, Response } from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("This website is not allowed to access the contact API."));
  }
}));
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

export default app;
