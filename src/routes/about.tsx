import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { siteDataQuery } from "@/lib/site-query";
import { AboutSection, BookingCta, ReviewsSection } from "@/components/site/Sections";

const title = "About Hands & Balance Wellness Center | Gent";
const description =
  "A calm wellness space in Gent offering personalized massage therapy with an attentive, human-centered approach.";

export const Route = createFileRoute("/about")({
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
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data } = useSuspenseQuery(siteDataQuery);
  return (
    <>
      <div className="container-page pt-14 sm:pt-20">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">About Us</h1>
      </div>
      <AboutSection data={data} />
      <ReviewsSection data={data} />
      <BookingCta />
    </>
  );
}
