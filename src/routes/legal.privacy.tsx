import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/site/LegalPage";

const title = "Privacy Policy | Hands & Balance Wellness Center";
const description =
  "How Hands & Balance Wellness Center collects, uses and protects your personal data under the GDPR.";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/legal/privacy" }],
  }),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      intro="We only collect the personal data we need to manage your booking and to contact you about your session."
    >
      <section>
        <h2>Data we collect</h2>
        <ul>
          <li>Name, email address and phone number provided in the booking form.</li>
          <li>Session details: service, date, time and any comments you share with us.</li>
          <li>Preferred language, used to communicate with you.</li>
        </ul>
      </section>
      <section>
        <h2>Why we use it</h2>
        <p>
          To confirm, manage, reschedule or cancel your appointment, to send booking-related emails
          and to comply with our legal obligations. We do not sell your data and we do not use it
          for marketing without your consent.
        </p>
      </section>
      <section>
        <h2>Your rights</h2>
        <p>
          Under the GDPR you may request access, correction, deletion, restriction or portability of
          your data, and object to its processing. Contact us and we will respond within 30 days.
        </p>
      </section>
      <section>
        <h2>Retention and security</h2>
        <p>
          Booking records are kept only as long as necessary for administrative and legal purposes.
          Data is stored on secured infrastructure with restricted access.
        </p>
      </section>
    </LegalPage>
  ),
});
