import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/site/LegalPage";

const title = "Cookie Policy | Hands & Balance Wellness Center";
const description =
  "Which cookies this website uses and how you can control them. We only use strictly necessary cookies by default.";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/legal/cookies" }],
  }),
  component: () => (
    <LegalPage
      title="Cookie Policy"
      intro="This website works with a minimum of cookies. No analytics or advertising scripts are loaded without your consent."
    >
      <section>
        <h2>Strictly necessary</h2>
        <p>
          We store your language choice and your cookie preference in your browser so the site
          behaves as you expect. These are required for the website to function and cannot be
          switched off.
        </p>
      </section>
      <section>
        <h2>Analytics and marketing</h2>
        <p>
          None are currently active. If they are added in the future, they will only load after you
          accept them in the cookie banner.
        </p>
      </section>
      <section>
        <h2>Managing cookies</h2>
        <p>
          You can clear stored preferences at any time through your browser settings; the cookie
          banner will then appear again on your next visit.
        </p>
      </section>
    </LegalPage>
  ),
});
