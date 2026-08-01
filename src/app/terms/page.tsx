import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { renderLegalDoc } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern your use of Transcribatron.",
};

export const dynamic = "force-static";

export default function TermsPage() {
  const html = renderLegalDoc("terms");
  return (
    <Container>
      <article
        className="legal-prose max-w-3xl pt-32 pb-24 md:pt-40"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Container>
  );
}
