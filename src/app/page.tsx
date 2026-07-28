import { Hero } from "@/components/marketing/Hero";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { FeatureRow } from "@/components/marketing/FeatureRow";
import { PricingCard } from "@/components/marketing/PricingCard";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { Section } from "@/components/layout/Section";
import { featuresJourney } from "@/lib/copy/features";
import { landingFaq } from "@/lib/copy/faq";
import { siteConfig } from "@/lib/site-config";

export default function HomePage() {
  // App Store URLs come from Sanity siteSettings in Task 22. Until then, null.
  const appStoreUrl: string | null = null;
  const macAppStoreUrl: string | null = null;

  return (
    <>
      <Hero appStoreUrl={appStoreUrl} macAppStoreUrl={macAppStoreUrl} />
      <TrustStrip
        items={[
          "On-device by default",
          "No subscription",
          "No ads",
          "No tracking",
        ]}
      />
      {featuresJourney.map((f, i) => (
        <FeatureRow
          key={f.number}
          number={f.number}
          title={f.title}
          body={f.body}
          bullets={f.bullets}
          screenshot={f.screenshot}
          align={i % 2 === 0 ? "left" : "right"}
          variant={i % 2 === 1 ? "alt" : "default"}
        />
      ))}
      <Section title="One price. That's it." eyebrow="Pricing">
        <PricingCard
          price={{ display: "$9.99", caption: "One-time purchase, lifetime access" }}
          includes={[
            "Everything above, forever",
            "On-device AI included, no per-minute fees",
            "Free updates for life",
            "Family Sharing supported",
          ]}
          appStoreUrl={appStoreUrl}
          macAppStoreUrl={macAppStoreUrl}
        />
        <div className="mt-12 text-center text-ink-2 max-w-2xl mx-auto">
          What you&apos;d pay elsewhere in a year:{" "}
          {siteConfig.competitors.map((c, i, arr) => (
            <span key={c.name}>
              <strong className="text-ink">{c.name} ${c.perYear}</strong>
              {i < arr.length - 1 ? ", " : "."}
            </span>
          ))}
          {" "}
          <strong className="text-accent">Transcribatron $9.99. Once.</strong>
        </div>
      </Section>
      <Section title="Questions, answered." eyebrow="FAQ" variant="alt">
        <FaqAccordion items={landingFaq} />
      </Section>
      <CtaBanner
        headline="Say more. Spend less."
        body="$9.99 once. Download for iPhone and Mac."
        appStoreUrl={appStoreUrl}
        macAppStoreUrl={macAppStoreUrl}
        position="landing-footer"
      />
    </>
  );
}
