import { cn } from "@/lib/utils";

export function TextAreaPanel({
  label,
  value,
  onChange,
  placeholder = "Paste the annoying thing here.",
  minHeight = "min-h-[320px]",
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        spellCheck="true"
        className={cn(
          "w-full resize-y rounded-[24px] border border-border bg-surface/90 p-4 font-mono text-sm leading-6 text-foreground shadow-sm transition placeholder:text-muted/75 focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary disabled:cursor-not-allowed disabled:opacity-60",
          minHeight,
        )}
      />
    </label>
  );
}
