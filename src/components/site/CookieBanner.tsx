import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "hb-cookie-consent";

/**
 * No non-essential scripts are loaded anywhere in this project, and none may be
 * added before the visitor has accepted them here.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const decide = (value: string) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-border bg-card p-5 shadow-lift md:inset-x-auto md:left-6 md:max-w-md"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        We only use cookies that are strictly necessary to run this website and your booking. No
        tracking or analytics tools are loaded without your consent.{" "}
        <Link to="/legal/cookies" className="text-primary underline underline-offset-2">
          Cookie Policy
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" className="rounded-full px-5" onClick={() => decide("accepted")}>
          Accept
        </Button>
        <Button size="sm" variant="outline" className="rounded-full px-5" onClick={() => decide("rejected")}>
          Reject
        </Button>
        <Button size="sm" variant="ghost" className="rounded-full px-4" asChild>
          <Link to="/legal/cookies">Preferences</Link>
        </Button>
      </div>
    </div>
  );
}
