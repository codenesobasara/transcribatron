import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { Screenshot } from "./Screenshot";

interface FeatureRowProps {
  number: string; // "01" - "06"
  title: string;
  body: string;
  bullets?: readonly string[];
  screenshot: { device: "iphone" | "mac"; src?: string; alt: string };
  align?: "left" | "right";
  variant?: "default" | "alt";
}

export function FeatureRow({
  number,
  title,
  body,
  bullets,
  screenshot,
  align = "left",
  variant = "default",
}: FeatureRowProps) {
  return (
    <section className={cn("py-16 md:py-24", variant === "alt" && "bg-surface-2")}>
      <Container>
        <div
          className={cn(
            "grid lg:grid-cols-2 gap-12 lg:gap-16 items-center",
            align === "right" && "lg:grid-flow-dense"
          )}
        >
          <div className={align === "right" ? "lg:col-start-2" : undefined}>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-xs font-medium tracking-widest text-accent">
                {number}
              </span>
              <span className="h-px w-8 bg-accent/40" />
            </div>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
              {title}
            </h3>
            <p className="mt-4 text-lg text-ink-2 max-w-lg">{body}</p>
            {bullets && (
              <ul className="mt-6 space-y-2">
                {bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-ink-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={cn("flex justify-center", align === "right" && "lg:col-start-1 lg:row-start-1")}>
            <Screenshot
              device={screenshot.device}
              src={screenshot.src}
              alt={screenshot.alt}
              className={screenshot.device === "iphone" ? "w-[280px]" : "w-full max-w-lg"}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
