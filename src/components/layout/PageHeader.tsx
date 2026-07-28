import { Container } from "./Container";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="pt-32 pb-16 md:pt-40 md:pb-24">
      <Container>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-ink max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg md:text-xl text-ink-2 max-w-2xl">{subtitle}</p>
        )}
      </Container>
    </header>
  );
}
