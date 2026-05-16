export type ToolContent = {
  intro: string;
  whatThisDoes: string;
  whenToUse: string;
  howItWorks: string;
  useCases: string[];
  faqs: { question: string; answer: string }[];
};

export function ToolSEOContent({ content }: { content: ToolContent }) {
  return (
    <div className="grid gap-8">
      <section className="rounded-[28px] border border-border bg-surface/72 p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">What this tool does</h2>
        <p className="mt-4 leading-7 text-muted">{content.whatThisDoes}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[28px] border border-border bg-surface/72 p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">When to use it</h2>
          <p className="mt-4 leading-7 text-muted">{content.whenToUse}</p>
        </article>
        <article className="rounded-[28px] border border-border bg-surface/72 p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <p className="mt-4 leading-7 text-muted">{content.howItWorks}</p>
        </article>
      </section>
      <section className="rounded-[28px] border border-border bg-surface/72 p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Useful for</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {content.useCases.map((useCase) => (
            <li key={useCase} className="rounded-2xl border border-border bg-surface-soft/60 p-4 text-sm leading-6 text-muted">
              {useCase}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
