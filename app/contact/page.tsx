import type { Metadata } from "next";
import { Mail } from "lucide-react";

const email = "contact@unannoy.com";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Unannoy with feedback, bugs, suggestions, tool requests, or friendly side quests.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Contact</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Found something annoying inside Unannoy?
      </h1>
      <div className="mt-6 space-y-4 text-lg leading-8 text-muted">
        <p>That is ironic, but helpful.</p>
        <p>For feedback, bugs, suggestions, or tool requests, email:</p>
      </div>
      <a
        href={`mailto:${email}?subject=Unannoy%20feedback`}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-medium text-background"
      >
        <Mail className="h-4 w-4" />
        {email}
      </a>
      <section className="mt-10 rounded-[28px] border border-border bg-surface/75 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">Tool requests</h2>
        <p className="mt-3 leading-7 text-muted">If there is a tiny task you keep doing manually, send it over.</p>
        <ul className="mt-4 grid gap-2 text-muted">
          <li>I always need to clean this kind of pasted text.</li>
          <li>Can you add a JSON to CSV converter?</li>
          <li>Can you make a tool that removes tracking from links?</li>
          <li>Can this work better on mobile?</li>
        </ul>
      </section>
      <p className="mt-8 text-lg leading-8 text-muted">
        Also happy to chat about drones, AI, engineering, music, math, and Pokemon. Bonus points if the topic involves
        making something useful, beautiful, or mildly over-engineered for fun.
      </p>
    </div>
  );
}
