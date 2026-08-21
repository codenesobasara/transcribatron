import { Container } from "@/components/layout/Container";
import { AppStoreBadge } from "./AppStoreBadge";

interface CtaBannerProps {
  headline: string;
  body?: string;
  appStoreUrl?: string | null;
  macAppStoreUrl?: string | null;
  showMacBadge?: boolean;
  position?: string;
}

export function CtaBanner({ headline, body, appStoreUrl, macAppStoreUrl, showMacBadge = true, position = "footer-cta" }: CtaBannerProps) {
  return (
    <section className="py-24 md:py-32 bg-surface border-y border-sep text-ink">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight">{headline}</h2>
          {body && <p className="mt-4 text-lg text-ink-2">{body}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <AppStoreBadge platform="ios" href={appStoreUrl} position={position} />
            {showMacBadge && <AppStoreBadge platform="mac" href={macAppStoreUrl} position={position} />}
          </div>
        </div>
      </Container>
    </section>
  );
}
