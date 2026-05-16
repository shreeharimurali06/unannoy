import { ShieldCheck } from "lucide-react";

export function ToolPrivacyNote({ label = "Processed in your browser. We do not store your input." }: { label?: string }) {
  return (
    <aside className="flex gap-3 rounded-[22px] border border-border bg-surface-soft/80 p-4 text-sm text-muted">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
      <p>
        <span className="font-medium text-foreground">Privacy-first:</span> {label}
      </p>
    </aside>
  );
}
