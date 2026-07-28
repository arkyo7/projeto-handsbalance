import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";

import { BrandMark } from "@/components/site/Brand";
import { BUSINESS, MAPS_URL, NAV_LINKS } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

const legalLinks = [
  { to: "/legal/privacy", key: "footer.privacy" },
  { to: "/legal/terms", key: "footer.terms" },
  { to: "/legal/cancellation", key: "footer.cancellation" },
  { to: "/legal/cookies", key: "footer.cookies" },
] as const;

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-secondary/60">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 text-primary">
            <BrandMark className="h-9 w-9" />
            <span className="font-display text-lg text-primary-deep">Hands &amp; Balance</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A calm and supportive space focused on professional massage therapy in Gent.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-deep">
            Navigation
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground transition-colors hover:text-primary">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-deep">Legal</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {legalLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground transition-colors hover:text-primary">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-deep">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden="true" />
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                {BUSINESS.addressLine1}
                <br />
                {BUSINESS.postalCode} {BUSINESS.city}, {BUSINESS.country}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-sage" aria-hidden="true" />
              <a href={BUSINESS.phoneHref} className="hover:text-primary">
                {BUSINESS.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-sage" aria-hidden="true" />
              <a href={`mailto:${BUSINESS.email}`} className="break-all hover:text-primary">
                {BUSINESS.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Instagram className="h-4 w-4 shrink-0 text-sage" aria-hidden="true" />
              <a
                href={BUSINESS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                {BUSINESS.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BUSINESS.name}. {t("footer.rights")}
          </p>
          <p>
            Massage therapy is a well-being service and does not replace medical, physiotherapeutic or
            psychological care.
          </p>
        </div>
      </div>
    </footer>
  );
}
