type PageHeaderProps = {
  title: string;
  description?: string;
  as?: "h1" | "h2";
};

export function PageHeader({ title, description, as = "h2" }: PageHeaderProps) {
  const Heading = as;
  return (
    <header className="mb-4">
      <Heading className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</Heading>
      {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
    </header>
  );
}
