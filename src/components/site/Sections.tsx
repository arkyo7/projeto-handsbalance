import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Clock,
  Euro,
  Heart,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Star,
  Sun,
  CalendarCheck,
  HandHeart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n, formatDurationIn, translated } from "@/lib/i18n";
import {
  BUSINESS,
  INFO_SOON,
  MAPS_URL,
  PLACEHOLDER_NOTICE,
  formatPrice,
} from "@/lib/site";
import type { PublicSiteData } from "@/lib/booking.server";

type Service = PublicSiteData["services"][number];

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-sage">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl leading-tight text-primary-deep sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function Section({
  children,
  tone = "default",
  className = "",
  id,
}: {
  children: ReactNode;
  tone?: "default" | "cream" | "deep";
  className?: string;
  id?: string;
}) {
  const toneClass =
    tone === "cream" ? "bg-secondary/60" : tone === "deep" ? "bg-primary-deep" : "bg-background";
  return (
    <section id={id} className={`${toneClass} py-16 sm:py-24 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

/** Elegant, clearly-labelled stand-in until official photography is supplied. */
export function ImagePlaceholder({
  label = PLACEHOLDER_NOTICE,
  className = "aspect-[4/5]",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`placeholder-frame flex ${className} w-full items-center justify-center rounded-3xl bg-secondary/70 p-8 text-center`}
      role="img"
      aria-label={label}
    >
      <div className="space-y-3">
        <Leaf className="mx-auto h-8 w-8 text-sage" aria-hidden="true" />
        <p className="font-display text-lg text-primary-deep">{label}</p>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Replace with the official file
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  const { t } = useI18n();
  const trust = [
    { icon: Star, label: t("hero.rating") },
    { icon: Heart, label: t("hero.reviews") },
    { icon: MapPin, label: t("hero.location") },
    { icon: HandHeart, label: t("hero.personal") },
  ];

  return (
    <section className="relative overflow-hidden bg-background pb-16 pt-10 sm:pb-24 sm:pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-accent/50 blur-3xl"
      />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-sage">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.08] text-primary-deep sm:text-5xl lg:text-6xl">
            {t("hero.headline")}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("hero.sub")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-13 rounded-full px-8 text-base">
              <Link to="/book">{t("cta.book")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 rounded-full border-primary/30 px-8 text-base text-primary-deep"
            >
              <Link to="/services">{t("cta.viewServices")}</Link>
            </Button>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-muted-foreground sm:max-w-lg">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative order-last">
          <img
            src="/images/hands-balance/ana-laura-hero.webp"
            alt={t("hero.imageAlt")}
            width={1000}
            height={1250}
            className="aspect-[4/5] max-h-[34rem] w-full rounded-3xl object-cover object-[50%_25%] shadow-lift"
          />
        </div>

      </div>
    </section>
  );
}

export function TrustBar() {
  const { t } = useI18n();
  const items = [
    { icon: HandHeart, label: t("trust.personalized") },
    { icon: Sparkles, label: t("trust.professional") },
    { icon: Leaf, label: t("trust.calm") },
    { icon: CalendarCheck, label: t("trust.online") },
    { icon: MapPin, label: t("trust.located") },
  ];

  return (
    <div className="border-y border-border bg-secondary/60">
      <ul className="container-page grid grid-cols-2 gap-x-6 gap-y-4 py-6 text-sm sm:grid-cols-3 lg:grid-cols-5">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2.5 text-primary-deep">
            <Icon className="h-4 w-4 shrink-0 text-sage" aria-hidden="true" />
            <span className="text-[0.82rem] leading-tight">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServiceCard({ service, currency }: { service: Service; currency: string }) {
  const { t, language } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <Card className="group flex h-full flex-col border-border/80 bg-card shadow-soft transition-shadow hover:shadow-lift">
      <CardContent className="flex flex-1 flex-col p-6">
        {service.is_featured ? (
          <Badge variant="secondary" className="mb-3 w-fit rounded-full text-[0.68rem] tracking-wide">
            {t("services.featured")}
          </Badge>
        ) : null}
        <h3 className="font-display text-2xl leading-snug text-primary-deep">{translated(service, language, "name")}</h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-sage" aria-hidden="true" />
            {formatDurationIn(service.duration_minutes, language)}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-primary">
            <Euro className="h-4 w-4 text-sage" aria-hidden="true" />
            {formatPrice(service.price_cents, currency)}
          </span>
        </div>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {translated(service, language, "description") || t("common.infoSoon")}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full border-primary/30 px-4">
                {t("cta.viewDetails")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-primary-deep">
                  {translated(service, language, "name")}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm">
                  <span>{formatDurationIn(service.duration_minutes, language)}</span>
                  <span className="font-medium text-primary">
                    {formatPrice(service.price_cents, currency)}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {translated(service, language, "description") || t("common.infoSoon")}
              </p>
              {service.notes ? (
                <p className="rounded-xl bg-secondary/70 p-4 text-sm leading-relaxed text-muted-foreground">
                  {translated(service, language, "notes")}
                </p>
              ) : null}
              {service.is_bookable ? (
                <Button asChild className="mt-2 h-11 w-full rounded-full">
                  <Link to="/book" search={{ service: service.slug }} onClick={() => setOpen(false)}>
                    {t("cta.bookNow")}
                  </Link>
                </Button>
              ) : (
                <p className="mt-2 rounded-xl bg-accent/60 p-4 text-sm text-primary-deep">
                  {t("services.notBookable")}
                </p>
              )}
            </DialogContent>
          </Dialog>

          {service.is_bookable ? (
            <Button asChild size="sm" className="rounded-full px-5">
              <Link to="/book" search={{ service: service.slug }}>
                {t("cta.bookNow")}
              </Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function ServicesSection({ data }: { data: PublicSiteData }) {
  const { t } = useI18n();
  return (
    <Section id="services">
      <SectionHeading title={t("services.title")} description={t("services.sub")} />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.services.map((service) => (
          <ServiceCard key={service.id} service={service} currency={data.settings.currency} />
        ))}
      </div>
    </Section>
  );
}

export function AboutSection({ data }: { data: PublicSiteData }) {
  const { t, language } = useI18n();
  const values = [
    { icon: HandHeart, label: t("about.value1") },
    { icon: Sparkles, label: t("about.value2") },
    { icon: Heart, label: t("about.value3") },
    { icon: Sun, label: t("about.value4") },
  ];

  return (
    <Section tone="cream" id="about">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <img
          src="/images/hands-balance/ana-laura-treatment.webp"
          alt={t("about.imageAlt")}
          loading="lazy"
          width={900}
          height={1125}
          className="aspect-[4/5] max-h-[32rem] w-full rounded-3xl object-cover shadow-soft"
        />

        <div>
          <SectionHeading align="left" eyebrow={t("about.eyebrow")} title={t("about.title")} />
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {translated(data.settings, language, "about_text") || t("common.infoSoon")}
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {values.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-primary-deep shadow-soft"
              >
                <Icon className="h-4 w-4 shrink-0 text-sage" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>

          {data.settings.practitioner_bio ? (
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              {translated(data.settings, language, "practitioner_bio")}
            </p>
          ) : (
            <p className="mt-8 rounded-2xl border border-dashed border-primary/25 bg-background/60 p-4 text-sm text-muted-foreground">
              {t("about.practitionerSoon")}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}

export function GallerySection({ data }: { data: PublicSiteData }) {
  const { t, language } = useI18n();
  const [active, setActive] = useState<number | null>(null);
  const images = data.gallery;

  return (
    <Section id="gallery">
      <SectionHeading title={t("gallery.title")} />
      {images.length === 0 ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <ImagePlaceholder key={i} className="aspect-[4/3]" label={t("gallery.empty")} />
          ))}
        </div>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(index)}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            >
              <img
                src={img.image_url}
                alt={translated(img, language, "alt_text") || "Hands & Balance Wellness Center"}
                loading="lazy"
                width={800}
                height={600}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">{t("gallery.lightbox")}</DialogTitle>
          {active !== null && images[active] ? (
            <img
              src={images[active].image_url}
              alt={translated(images[active], language, "alt_text") || "Hands & Balance Wellness Center"}
              className="h-auto w-full rounded-xl"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </Section>
  );
}

export function ReviewsSection({ data }: { data: PublicSiteData }) {
  const { t, language } = useI18n();
  return (
    <Section tone="cream" id="reviews">
      <SectionHeading title={t("reviews.title")} />
      <div className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground">
        <span className="flex" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-4 w-4 fill-sage text-sage" />
          ))}
        </span>
        <span>
          {t("reviews.summary", { rating: BUSINESS.ratingValue, count: BUSINESS.reviewCount })}
        </span>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {data.reviews.map((review) => (
          <Card key={review.id} className="h-full border-border/80 bg-card shadow-soft">
            <CardContent className="flex h-full flex-col p-6">
              <span className="flex" aria-label={t("reviews.stars", { rating: review.rating })}>
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-sage text-sage" aria-hidden="true" />
                ))}
              </span>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                “{review.content}”
              </blockquote>
              <p className="mt-5 text-sm font-medium text-primary-deep">{review.author_name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.settings.reviews_url ? (
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="rounded-full border-primary/30 px-6">
            <a href={data.settings.reviews_url} target="_blank" rel="noopener noreferrer">
              {t("cta.viewMoreReviews")}
            </a>
          </Button>
        </div>
      ) : null}
    </Section>
  );
}

export function GiftCardSection({ data }: { data: PublicSiteData }) {
  const { t, language } = useI18n();
  const gift = data.services.find((s) => s.slug === "gift-card");

  return (
    <Section id="gift-card">
      <div className="grid items-center gap-10 rounded-3xl border border-border bg-secondary/60 p-8 shadow-soft sm:p-12 lg:grid-cols-2">
        <div>
          <SectionHeading align="left" eyebrow={t("gift.eyebrow")} title={t("gift.title")} description={t("gift.sub")} />
          {gift ? (
            <p className="mt-6 font-display text-4xl text-primary">
              {formatPrice(gift.price_cents, data.settings.currency)}
            </p>
          ) : null}
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            {translated(data.settings, language, "gift_card_rules") ||
              t("gift.rulesSoon")}
          </p>
          <Button asChild size="lg" className="mt-8 h-12 rounded-full px-7">
            <Link to="/contact">{t("cta.buyGiftCard")}</Link>
          </Button>
        </div>
        <img
          src="/images/hands-balance/hands-balance-gift-card.webp"
          alt={t("gift.imageAlt")}
          loading="lazy"
          width={1000}
          height={625}
          className="aspect-[16/10] w-full rounded-3xl object-cover shadow-soft"
        />

      </div>
    </Section>
  );
}

export function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    { title: t("how.step1"), text: t("how.step1Text") },
    { title: t("how.step2"), text: t("how.step2Text") },
    { title: t("how.step3"), text: t("how.step3Text") },
  ];

  return (
    <Section tone="cream">
      <SectionHeading title={t("how.title")} />
      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title} className="rounded-2xl border border-border bg-card p-7 shadow-soft">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-lg text-primary-foreground">
              {i + 1}
            </span>
            <h3 className="mt-5 font-display text-xl text-primary-deep">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function BookingCta() {
  const { t } = useI18n();
  return (
    <section className="bg-primary-deep py-16 sm:py-20">
      <div className="container-page text-center">
        <h2 className="font-display text-3xl text-cream sm:text-4xl">{t("cta.headline")}</h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-cream/80">{t("cta.text")}</p>
        <Button
          asChild
          size="lg"
          className="mt-8 h-13 rounded-full bg-cream px-8 text-base text-primary-deep hover:bg-cream/90"
        >
          <Link to="/book">{t("cta.bookYours")}</Link>
        </Button>
      </div>
    </section>
  );
}

export function FaqSection({ data }: { data: PublicSiteData }) {
  const { t } = useI18n();
  return (
    <Section id="faq">
      <SectionHeading title={t("faq.title")} />
      <div className="mx-auto mt-10 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {data.faq.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left font-display text-lg text-primary-deep">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

export function ContactSection({ data }: { data: PublicSiteData }) {
  const { t } = useI18n();
  const actions = [
    { icon: Phone, label: t("cta.call"), href: BUSINESS.phoneHref, external: false },
    { icon: Mail, label: t("cta.email"), href: `mailto:${BUSINESS.email}`, external: false },
    { icon: MapPin, label: t("cta.maps"), href: MAPS_URL, external: true },
    {
      icon: Instagram,
      label: t("cta.instagram"),
      href: data.settings.instagram_url ?? BUSINESS.instagramUrl,
      external: true,
    },
  ];

  return (
    <Section tone="cream" id="contact">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading align="left" eyebrow="Contact" title={t("contact.title")} />
          <address className="mt-8 space-y-4 text-sm not-italic text-muted-foreground">
            <p className="font-medium text-primary-deep">{BUSINESS.name}</p>
            <p>
              {BUSINESS.addressLine1}
              <br />
              {BUSINESS.postalCode} {BUSINESS.city}
              <br />
              {BUSINESS.country}
            </p>
            <p>
              <a href={BUSINESS.phoneHref} className="hover:text-primary">
                {BUSINESS.phoneDisplay}
              </a>{" "}
              <span className="text-xs">({BUSINESS.phoneInternational})</span>
            </p>
            <p>
              <a href={`mailto:${BUSINESS.email}`} className="break-all hover:text-primary">
                {BUSINESS.email}
              </a>
            </p>
            <p>
              <a
                href={data.settings.instagram_url ?? BUSINESS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                {data.settings.instagram_handle ?? BUSINESS.instagramHandle}
              </a>
            </p>
          </address>

          {!data.settings.show_business_hours ? (
            <p className="mt-6 rounded-2xl border border-dashed border-primary/25 bg-background/60 p-4 text-sm text-muted-foreground">
              Opening hours: {INFO_SOON}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-2.5">
            {actions.map(({ icon: Icon, label, href, external }) => (
              <Button
                key={label}
                asChild
                variant="outline"
                className="rounded-full border-primary/30 text-primary-deep"
              >
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {label}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
          <iframe
            title="Map showing Hands & Balance Wellness Center in Gent"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              `${BUSINESS.addressLine1}, ${BUSINESS.postalCode} ${BUSINESS.city}, ${BUSINESS.country}`,
            )}&output=embed`}
            className="h-full min-h-[22rem] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Section>
  );
}
