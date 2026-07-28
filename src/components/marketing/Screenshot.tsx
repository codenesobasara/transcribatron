import Image from "next/image";
import { cn } from "@/lib/utils";

interface ScreenshotProps {
  device: "iphone" | "mac";
  alt: string; // REQUIRED
  src?: string;
  caption?: string;
  className?: string;
  priority?: boolean;
}

export function Screenshot({ device, src, alt, caption, className, priority }: ScreenshotProps) {
  const isIphone = device === "iphone";
  const frame = isIphone
    ? "aspect-[9/19.5] rounded-[2.5rem] border-8 border-ink"
    : "aspect-[16/10] rounded-2xl border border-sep";

  return (
    <figure className={cn("group", className)}>
      <div
        className={cn(
          "relative overflow-hidden bg-surface transition-transform duration-300",
          "motion-safe:group-hover:rotate-[-1deg]",
          frame
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={isIphone ? "(min-width: 768px) 320px, 240px" : "(min-width: 768px) 720px, 100vw"}
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div
            data-testid="screenshot-placeholder"
            role="img"
            aria-label={alt}
            className="absolute inset-0 flex flex-col p-6 bg-gradient-to-br from-surface to-surface-2"
          >
            <div className="h-2 w-24 rounded-full bg-accent/40 mb-4" />
            <div className="space-y-2">
              <div className="h-3 w-3/4 rounded-full bg-ink/10" />
              <div className="h-3 w-2/3 rounded-full bg-ink/10" />
              <div className="h-3 w-5/6 rounded-full bg-ink/10" />
            </div>
            <div className="mt-auto text-[10px] uppercase tracking-widest text-ink-3">
              {device} preview
            </div>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-ink-3 text-center">{caption}</figcaption>
      )}
    </figure>
  );
}
