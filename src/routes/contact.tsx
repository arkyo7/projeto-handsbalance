import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { siteDataQuery } from "@/lib/site-query";
import { BookingCta, ContactSection, FaqSection } from "@/components/site/Sections";

const title = "Contact & Location | Hands & Balance Wellness Center Gent";
const description =
  "Find Hands & Balance Wellness Center at De Pintelaan 209 bus 301, 9000 Gent. Call, email or message us to plan your session.";

export const Route = createFileRoute("/contact")({
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
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data } = useSuspenseQuery(siteDataQuery);
  return (
    <>
      <div className="container-page pt-14 sm:pt-20">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Contact</h1>
      </div>
      <ContactSection data={data} />
      <FaqSection data={data} />
      <BookingCta />
    </>
  );
}
