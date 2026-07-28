import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { siteDataQuery } from "@/lib/site-query";
import { BookingCta, GallerySection } from "@/components/site/Sections";

const title = "Gallery | Hands & Balance Wellness Center Gent";
const description =
  "Take a look inside our wellness space in Gent: the treatment room, the atmosphere and the details that help you relax.";

export const Route = createFileRoute("/gallery")({
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
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data } = useSuspenseQuery(siteDataQuery);
  return (
    <>
      <div className="container-page pt-14 sm:pt-20">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Gallery</h1>
      </div>
      <GallerySection data={data} />
      <BookingCta />
    </>
  );
}
