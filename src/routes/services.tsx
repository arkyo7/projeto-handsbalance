import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { siteDataQuery } from "@/lib/site-query";
import { BookingCta, GiftCardSection, HowItWorks, ServicesSection } from "@/components/site/Sections";

const title = "Massage Services & Prices | Hands & Balance Gent";
const description =
  "Relaxing, therapeutic and sports massage sessions in Gent. See durations, prices and what each session includes, then book online.";

export const Route = createFileRoute("/services")({
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
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data } = useSuspenseQuery(siteDataQuery);
  return (
    <>
      <div className="container-page pt-14 sm:pt-20">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Our Sessions</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Every session is adapted to your body and your goals. Choose the treatment that fits how
          you feel today.
        </p>
      </div>
      <ServicesSection data={data} />
      <GiftCardSection data={data} />
      <HowItWorks />
      <BookingCta />
    </>
  );
}
