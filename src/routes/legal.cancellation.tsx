import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { LegalPage } from "@/components/site/LegalPage";
import { siteDataQuery } from "@/lib/site-query";

const title = "Cancellation Policy | Hands & Balance Wellness Center";
const description =
  "How to cancel or reschedule your massage session at Hands & Balance Wellness Center in Gent.";

export const Route = createFileRoute("/legal/cancellation")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteDataQuery),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/legal/cancellation" }],
  }),
  component: CancellationPage,
});

function CancellationPage() {
  const { data } = useSuspenseQuery(siteDataQuery);
  return (
    <LegalPage title="Cancellation Policy">
      <section>
        <h2>Changing your appointment</h2>
        <p>{data.settings.cancellation_policy}</p>
      </section>
      <section>
        <h2>How to cancel or reschedule</h2>
        <p>
          Use the personal link in your booking confirmation to cancel or move your appointment
          online, or contact us directly by phone or email.
        </p>
      </section>
      <section>
        <h2>Late arrivals and no-shows</h2>
        <p>
          If you arrive late, your session may be shortened so that following appointments are not
          affected. Repeated no-shows may require a prepayment for future bookings.
        </p>
      </section>
    </LegalPage>
  );
}
