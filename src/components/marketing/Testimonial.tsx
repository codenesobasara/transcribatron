import { Container } from "@/components/layout/Container";

interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
}

export function Testimonial({ quote, author, role }: TestimonialProps) {
  return (
    <section className="py-20 md:py-28">
      <Container size="narrow">
        <blockquote className="text-center">
          <p className="font-serif text-2xl md:text-3xl leading-relaxed text-ink">
            &ldquo;{quote}&rdquo;
          </p>
          <footer className="mt-6 text-sm text-ink-3">
            — {author}
            {role && <span>, {role}</span>}
          </footer>
        </blockquote>
      </Container>
    </section>
  );
}
