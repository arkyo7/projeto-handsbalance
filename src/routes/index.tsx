import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { siteDataQuery } from "@/lib/site-query";
import { BUSINESS } from "@/lib/site";
import {
  AboutSection,
  BookingCta,
  ContactSection,
  FaqSection,
  GallerySection,
  GiftCardSection,
  Hero,
  HowItWorks,
  ReviewsSection,
  ServicesSection,
  TrustBar,
} from "@/components/site/Sections";

const title = "Hands & Balance Wellness Center | Massage Therapy in Gent";
const description =
  "Personalized massage sessions in Gent, Belgium. Relieve tension, reduce stress and restore your balance. Book your session online in a few clicks.";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteDataQuery),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { data } = useSuspenseQuery(siteDataQuery);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: BUSINESS.name,
    image: [],
    telephone: BUSINESS.phoneInternational,
    email: BUSINESS.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.addressLine1,
      postalCode: BUSINESS.postalCode,
      addressLocality: BUSINESS.city,
      addressCountry: "BE",
    },
    sameAs: [BUSINESS.instagramUrl],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS.ratingValue,
      reviewCount: BUSINESS.reviewCount,
    },
    makesOffer: data.services.map((s) => ({
      "@type": "Offer",
      name: s.name,
      price: (s.price_cents / 100).toFixed(2),
      priceCurrency: data.settings.currency,
    })),
  };

  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesSection data={data} />
      <AboutSection data={data} />
      <GallerySection data={data} />
      <ReviewsSection data={data} />
      <GiftCardSection data={data} />
      <HowItWorks />
      <BookingCta />
      <FaqSection data={data} />
      <ContactSection data={data} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
