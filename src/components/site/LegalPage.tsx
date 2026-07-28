import type { ReactNode } from "react";

import { BUSINESS } from "@/lib/site";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-page max-w-3xl py-14 sm:py-20">
      <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">{title}</h1>
      {intro ? <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p> : null}
      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-primary-deep [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
        <p className="rounded-2xl border border-dashed border-primary/25 bg-secondary/50 p-5">
          Questions about this document? Contact {BUSINESS.name}, {BUSINESS.addressLine1},{" "}
          {BUSINESS.postalCode} {BUSINESS.city}, {BUSINESS.country} —{" "}
          <a href={`mailto:${BUSINESS.email}`} className="text-primary underline underline-offset-2">
            {BUSINESS.email}
          </a>
          . This text is a general template and should be reviewed by the business owner before
          publication.
        </p>
      </div>
    </div>
  );
}
