import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/site/LegalPage";

const title = "Terms and Conditions | Hands & Balance Wellness Center";
const description =
  "The terms that apply when you book and attend a massage session at Hands & Balance Wellness Center in Gent.";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/legal/terms" }],
  }),
  component: () => (
    <LegalPage title="Terms and Conditions">
      <section>
        <h2>Bookings</h2>
        <p>
          A booking is confirmed once you receive a confirmation with your reference number. Please
          arrive a few minutes before your session starts; late arrivals may shorten the session
          time.
        </p>
      </section>
      <section>
        <h2>Services</h2>
        <p>
          Our sessions are wellness and relaxation massage treatments. They are not a medical
          treatment, diagnosis or therapy, and they do not replace advice from a healthcare
          professional.
        </p>
      </section>
      <section>
        <h2>Health information</h2>
        <p>
          Please inform us before your session about pregnancy, injuries, recent surgery, skin
          conditions or any medical condition. We may decline or adapt a session for safety reasons.
        </p>
      </section>
      <section>
        <h2>Payment</h2>
        <p>
          Prices are shown in euro and include applicable taxes. The available payment methods are
          communicated at the time of booking.
        </p>
      </section>
      <section>
        <h2>Conduct</h2>
        <p>
          Any inappropriate behaviour will end the session immediately and the full amount remains
          due.
        </p>
      </section>
    </LegalPage>
  ),
});
