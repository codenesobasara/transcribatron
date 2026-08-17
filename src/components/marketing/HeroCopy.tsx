// Shared hero headline + subhead. Reused across the per-device hero variants
// so the messaging lives in one place. Staggered entrance via `hero-rise-in`.
// `titleAside` renders beside the headline (e.g. the mobile price sticker).
export function HeroCopy({ titleAside }: { titleAside?: React.ReactNode }) {
  return (
    <>
      <div className={titleAside ? "flex items-center justify-between gap-4" : undefined}>
        <h1
          className="hero-rise-in font-serif text-5xl md:text-8xl leading-[0.98] tracking-tight text-ink"
          style={{ animationDelay: "0.55s" }}
        >
          Say more.
          <br />
          <span className="text-accent">Spend less.</span>
        </h1>
        {titleAside}
      </div>
      <p
        className="hero-rise-in mt-4 md:mt-6 text-base md:text-xl text-ink-2 max-w-xl"
        style={{ animationDelay: "0.8s" }}
      >
        The all-in-one voice-to-text for iPhone and Mac. Dictate anywhere, record
        meetings, transcribe imports.
      </p>
    </>
  );
}
