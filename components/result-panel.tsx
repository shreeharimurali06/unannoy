import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

export function ResultPanel({
  title = "Output",
  text,
  tool,
  empty = "Your unannoyed result will appear here.",
  className,
}: {
  title?: string;
  text: string;
  tool: string;
  empty?: string;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[24px] border border-border bg-surface/90 p-4 shadow-sm", className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        <CopyButton text={text} tool={tool} disabled={!text} />
      </div>
      <pre className="min-h-[240px] whitespace-pre-wrap break-words rounded-2xl bg-surface-soft p-4 font-mono text-sm leading-6 text-foreground">
        {text || <span className="font-sans text-muted">{empty}</span>}
      </pre>
    </section>
  );
}
