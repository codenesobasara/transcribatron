import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/80 border-b border-sep">
      <Container>
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="font-semibold tracking-tight text-ink">
            {siteConfig.name}
          </Link>
          <ul className="hidden md:flex items-center gap-8 text-sm text-ink-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} prefetch={false} className="hover:text-ink transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild variant="accent" size="sm">
            <Link href="/download" prefetch={false}>Download</Link>
          </Button>
        </nav>
      </Container>
    </header>
  );
}
