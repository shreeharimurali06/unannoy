import Link from "next/link";

const email = "contact@unannoy.com";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-muted sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <p className="font-semibold text-foreground">Unannoy</p>
          <p className="mt-2 max-w-xl">
            Tiny tools for wildly annoying tasks. Local-first, no sign-up, and allergic to unnecessary popups.
          </p>
          <a className="mt-3 inline-flex font-medium text-primary hover:underline" href={`mailto:${email}`}>
            {email}
          </a>
        </div>
        <nav className="flex flex-wrap gap-4">
          <Link href="/tools" className="hover:text-foreground">
            Browse tools
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms of Use
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/about" className="hover:text-foreground">
            About Unannoy
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact Unannoy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
