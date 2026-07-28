import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-sep bg-bg py-16">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="font-semibold text-ink">{siteConfig.name}</div>
            <p className="mt-2 text-sm text-ink-3 max-w-xs">{siteConfig.tagline}</p>
          </div>
          <FooterColumn title="Product" links={siteConfig.footer.product} />
          <FooterColumn title="Resources" links={siteConfig.footer.resources} />
          <FooterColumn title="Legal" links={siteConfig.footer.legal} />
        </div>
        <div className="mt-12 pt-8 border-t border-sep flex items-center justify-between text-sm text-ink-3">
          <div>© {year} {siteConfig.name}</div>
          {siteConfig.socials.x && (
            <a
              href={siteConfig.socials.x}
              className="hover:text-ink transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              @transcribatron
            </a>
          )}
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <div className="text-sm font-medium text-ink mb-3">{title}</div>
      <ul className="space-y-2 text-sm text-ink-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} prefetch={false} className="hover:text-ink transition-colors">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
