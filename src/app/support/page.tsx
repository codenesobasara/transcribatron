import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { renderLegalDoc } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Transcribatron.",
};

export const dynamic = "force-static";

export default function SupportPage() {
  const html = renderLegalDoc("support");
  return (
    <Container>
      <article
        className="legal-prose max-w-3xl pt-32 pb-24 md:pt-40"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Container>
  );
}
