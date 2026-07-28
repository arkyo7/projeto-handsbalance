import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Check, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrandLogo } from "@/components/site/Brand";
import { NAV_LINKS } from "@/lib/site";
import { LANGUAGES, useI18n } from "@/lib/i18n";

function LanguageSelector() {
  const { language, setLanguage, t } = useI18n();
  const current = LANGUAGES.find((l) => l.code === language)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-primary"
          aria-label={t("nav.language")}
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-medium tracking-wide">{current.short}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem key={l.code} onSelect={() => setLanguage(l.code)} className="gap-2">
            <span className="w-8 text-xs font-semibold text-muted-foreground">{l.short}</span>
            <span className="flex-1">{l.label}</span>
            {l.code === language ? <Check className="h-4 w-4 text-primary" aria-hidden="true" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-border bg-background/95 shadow-soft backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-18 items-center justify-between gap-4 py-3">
        <BrandLogo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-primary-deep"
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "bg-secondary text-primary-deep" }}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageSelector />
          <Button asChild size="sm" className="hidden rounded-full px-5 sm:inline-flex">
            <Link to="/book">{t("cta.book")}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t("nav.menu")}>
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col gap-2 p-6 pt-14">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base text-foreground transition-colors hover:bg-secondary"
                    activeOptions={{ exact: link.to === "/" }}
                    activeProps={{ className: "bg-secondary text-primary-deep" }}
                  >
                    {t(link.key)}
                  </Link>
                ))}
                <Button asChild className="mt-4 h-12 rounded-full text-base">
                  <Link to="/book" onClick={() => setOpen(false)}>
                    {t("cta.book")}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
