export function ToolFAQ({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <section className="rounded-[28px] border border-border bg-surface/72 p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-semibold tracking-tight">Questions before the button mashing</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.question} className="rounded-2xl border border-border bg-surface-soft/70 p-4">
            <h3 className="font-semibold">{item.question}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
