import { FormEvent, useState } from "react";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: ""
};

export default function App() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  function updateField(field: keyof ContactForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (status !== "idle") setStatus("idle");
    setFeedback("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result: { message?: string } = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Your message could not be sent.");
      }

      setStatus("success");
      setFeedback("Thanks for getting in touch. Your message has been received.");
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <main className="page-shell">
      <section className="contact-card" aria-labelledby="page-title">
        <p className="eyebrow">WE'D LOVE TO HEAR FROM YOU</p>
        <h1 id="page-title">Contact us</h1>
        <p className="intro">Have a question or something to share? Send us a message and we'll be in touch.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" autoComplete="name" maxLength={100} required
              value={form.name} onChange={(event) => updateField("name", event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required
              value={form.email} onChange={(event) => updateField("email", event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" maxLength={150} required
              value={form.subject} onChange={(event) => updateField("subject", event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={6} maxLength={5000} required
              value={form.message} onChange={(event) => updateField("message", event.target.value)} />
            <span className="hint">{form.message.length}/5000 characters</span>
          </div>

          {feedback && (
            <p className={`feedback ${status}`} role="status" aria-live="polite">{feedback}</p>
          )}

          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send message"}
          </button>
        </form>
        <p className="testing-note">Testing phase · Please don't submit sensitive personal information.</p>
      </section>
    </main>
  );
}
