type SectionProps = {
  title: string;
  children: React.ReactNode;
};

export function Section({ title, children }: SectionProps) {
  return (
    <section className="rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-blue-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
