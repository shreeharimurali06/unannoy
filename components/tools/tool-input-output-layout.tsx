export function ToolInputOutputLayout({
  input,
  output,
}: {
  input: React.ReactNode;
  output: React.ReactNode;
}) {
  return <div className="grid min-w-0 gap-5 lg:grid-cols-2 lg:items-start">{input}{output}</div>;
}
