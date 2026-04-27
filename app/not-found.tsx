import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-page py-32 text-center">
      <p className="eyebrow mx-auto justify-center">Error 404</p>
      <h1 className="mt-4 text-display-md font-heading font-semibold text-navy-900">We can't find that page.</h1>
      <p className="mx-auto mt-4 max-w-prose text-ink-muted">
        The page you're looking for may have moved, or the link is out of date. Try starting from the homepage, or browse our qualification catalogue.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Button href="/" variant="primary">
          Back to home
        </Button>
        <Button href="/courses" variant="outline">
          Browse courses
        </Button>
      </div>
    </section>
  );
}
