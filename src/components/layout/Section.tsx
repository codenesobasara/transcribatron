import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "alt";
  title?: string;
  eyebrow?: string;
  titleAs?: "h1" | "h2";
}

export function Section({
  className,
  variant = "default",
  title,
  eyebrow,
  titleAs = "h2",
  children,
  ...props
}: SectionProps) {
  const TitleTag = titleAs;
  return (
    <section
      className={cn(
        "py-20 md:py-28",
        variant === "alt" ? "bg-surface-2" : "bg-bg",
        className
      )}
      {...props}
    >
      <Container>
        {(eyebrow || title) && (
          <header className="mb-12 md:mb-16 max-w-2xl">
            {eyebrow && (
              <div className="text-sm font-medium text-accent mb-3 tracking-wide uppercase">
                {eyebrow}
              </div>
            )}
            {title && (
              <TitleTag className="text-4xl md:text-5xl font-semibold tracking-tight text-ink">
                {title}
              </TitleTag>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
