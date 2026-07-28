import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { siteDataQuery } from "@/lib/site-query";
import { BookingCta, FaqSection, ReviewsSection } from "@/components/site/Sections";

const title = "Client Reviews | Hands & Balance Wellness Center";
const description =
  "Read what clients say about their massage sessions at Hands & Balance Wellness Center in Gent, Belgium.";

export const Route = createFileRoute("/reviews")({
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
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { data } = useSuspenseQuery(siteDataQuery);
  return (
    <>
      <div className="container-page pt-14 sm:pt-20">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Client Reviews</h1>
      </div>
      <ReviewsSection data={data} />
      <FaqSection data={data} />
      <BookingCta />
    </>
  );
}
