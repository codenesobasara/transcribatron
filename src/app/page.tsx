import { Hero } from "@/components/marketing/Hero";
import { FeatureJourney } from "@/components/marketing/FeatureJourney";
import { ComparisonTable } from "@/components/marketing/ComparisonTable";
import { Reveal } from "@/components/marketing/Reveal";
import { PricingCard } from "@/components/marketing/PricingCard";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { Section } from "@/components/layout/Section";
import { featuresJourney } from "@/lib/copy/features";
import { comparisonCompetitors, comparisonRows } from "@/lib/copy/comparison";
import { landingFaq } from "@/lib/copy/faq";
import { siteConfig } from "@/lib/site-config";
import { resolveDevice } from "@/lib/device";
import { DeviceViewProvider } from "@/components/marketing/DeviceView";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Server-side device detection picks the hero variant. `?device=` overrides
  // it for previewing any device on any machine.
  const deviceParam = (await searchParams).device;
  const device = await resolveDevice(
    typeof deviceParam === "string" ? deviceParam : undefined
  );

  // App Store URLs come from Sanity siteSettings in Task 22. Until then, null.
  const appStoreUrl: string | null = null;
  const macAppStoreUrl: string | null = null;

  return (
    <DeviceViewProvider initial={device}>
      <Hero appStoreUrl={appStoreUrl} macAppStoreUrl={macAppStoreUrl} />
      <FeatureJourney items={featuresJourney} />
      <Section variant="alt">
        <Reveal className="text-center">
          <div className="text-sm font-medium text-accent mb-3 tracking-wide uppercase">
            How we compare
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink">
            Every workflow, one app
          </h2>
          <p className="mt-5 mb-12 text-lg text-ink-2 max-w-2xl mx-auto">
            Others do a slice of this. Transcribatron does all of it, on-device, for
            one price.
          </p>
          <ComparisonTable competitorNames={comparisonCompetitors} rows={comparisonRows} />
        </Reveal>
      </Section>
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
    </DeviceViewProvider>
  );
}
