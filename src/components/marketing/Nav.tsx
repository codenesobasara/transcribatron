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
          <Button asChild variant="accent" size="sm">
            <Link href="/download" prefetch={false}>Download</Link>
          </Button>
        </nav>
      </Container>
    </header>
  );
}
