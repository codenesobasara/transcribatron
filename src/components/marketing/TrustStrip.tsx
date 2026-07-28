import { Container } from "@/components/layout/Container";

interface TrustStripProps {
  items: readonly string[];
}

export function TrustStrip({ items }: TrustStripProps) {
  return (
    <div className="border-y border-sep bg-surface-2 py-6">
      <Container>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-ink-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
