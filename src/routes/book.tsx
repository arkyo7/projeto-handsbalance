import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, Check, ChevronLeft, Clock, Euro, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { siteDataQuery } from "@/lib/site-query";
import { createBooking, getAvailability } from "@/lib/public.functions";
import { BUSINESS, formatDuration, formatIsoDate, formatPrice } from "@/lib/site";
import { useI18n, type LanguageCode, formatDateIn, formatDurationIn, LOCALE_BY_LANGUAGE } from "@/lib/i18n";

// Meta tags are now handled dynamically by useLocalizedMeta in the component or i18n helper if needed, 
// but we keep these as fallbacks.
const title = "Book a Massage Session Online | Hands & Balance Gent";
const description =
  "Choose your massage session, pick a date and time and confirm your booking online at Hands & Balance Wellness Center in Gent.";

const searchSchema = z.object({ service: z.string().optional() });

export const Route = createFileRoute("/book")({
  validateSearch: searchSchema,
  loader: ({ context }) => context.queryClient.ensureQueryData(siteDataQuery),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: BookPage,
});

function nextDays(count: number) {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;
  });
}

// Labels are now handled via t() keys: booking.step.*

function Stepper({ step }: { step: number }) {
  const { t } = useI18n();
  const steps = [
    { key: "booking.step.service", label: t("booking.step.service") },
    { key: "booking.step.datetime", label: t("booking.step.datetime") },
    { key: "booking.step.details", label: t("booking.step.details") },
    { key: "booking.step.confirmation", label: t("booking.step.confirmation") },
  ];

  return (
    <ol className="mb-10 grid grid-cols-4 gap-2">
      {steps.map((s, i) => {
        const state = i < step ? "done" : i === step ? "current" : "todo";
        return (
          <li key={s.key} className="flex flex-col gap-2">
            <span
              className={`h-1.5 w-full rounded-full ${
                state === "todo" ? "bg-border" : "bg-primary"
              }`}
            />
            <span
              className={`text-[0.72rem] leading-tight sm:text-xs ${
                state === "current" ? "font-medium text-primary-deep" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function BookPage() {
  const { data } = useSuspenseQuery(siteDataQuery);
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { language, t } = useI18n();

  const bookable = data.services.filter((s) => s.is_bookable);
  const [serviceId, setServiceId] = useState<string | null>(
    bookable.find((s) => s.slug === search.service)?.id ?? null,
  );
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [step, setStep] = useState(search.service && bookable.some((s) => s.slug === search.service) ? 1 : 0);
  const [result, setResult] = useState<{ reference: string; manageToken: string } | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    countryCode: "+32",
    phone: "",
    comments: "",
    acceptCancellation: false,
    acceptPrivacy: false,
  });

  const service = bookable.find((s) => s.id === serviceId) ?? null;
  const days = nextDays(28);

  const availabilityFn = useServerFn(getAvailability);
  const availability = useQuery({
    queryKey: ["availability", serviceId, date],
    queryFn: () => availabilityFn({ data: { serviceId: serviceId!, date: date! } }),
    enabled: Boolean(serviceId && date),
  });

  const createBookingFn = useServerFn(createBooking);
  type BookingPayload = {
    serviceId: string;
    date: string;
    startTime: string;
    fullName: string;
    email: string;
    countryCode: string;
    phone: string;
    comments: string;
    preferredLanguage: LanguageCode;
    acceptCancellation: true;
    acceptPrivacy: true;
  };
  const mutation = useMutation({
    mutationFn: (payload: BookingPayload) => createBookingFn({ data: payload }),
    onSuccess: (res) => {
      setResult({ reference: res.reference, manageToken: res.manageToken });
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (error: Error) => toast.error(error.message || "We could not complete your booking."),
  });

  const go = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = () => {
    if (!service || !date || !time) return;
    if (form.fullName.trim().length < 2) return toast.error(t("booking.errName"));
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return toast.error(t("booking.errEmail"));
    if (form.phone.trim().length < 5) return toast.error(t("booking.errPhone"));
    if (!form.acceptCancellation || !form.acceptPrivacy)
      return toast.error(t("booking.errAccept"));

    mutation.mutate({
      serviceId: service.id,
      date,
      startTime: time,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      countryCode: form.countryCode.trim(),
      phone: form.phone.trim(),
      comments: form.comments.trim(),
      preferredLanguage: language as LanguageCode,
      acceptCancellation: true,
      acceptPrivacy: true,
    });
  };

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">{t("booking.title")}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {t("booking.timezone", { tz: BUSINESS.timezone.replace("_", " ") })}
      </p>

      <div className="mt-10">
        <Stepper step={step} />
      </div>

      {step === 0 ? (
        <div className="grid gap-4">
          {bookable.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setServiceId(s.id);
                setDate(null);
                setTime(null);
                go(1);
              }}
              className={`rounded-2xl border p-5 text-left transition-colors ${
                serviceId === s.id
                  ? "border-primary bg-secondary/70"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <span className="font-display text-xl text-primary-deep">{s.name}</span>
              <span className="mt-2 flex flex-wrap gap-x-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-sage" aria-hidden="true" />
                  {formatDuration(s.duration_minutes)}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-primary">
                  <Euro className="h-4 w-4 text-sage" aria-hidden="true" />
                  {formatPrice(s.price_cents, data.settings.currency)}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {step === 1 && service ? (
        <div>
          <SummaryBar service={service} currency={data.settings.currency} />

          <h2 className="mt-8 font-display text-2xl text-primary-deep">{t("booking.chooseDate")}</h2>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => {
              const dt = new Date(`${d}T00:00:00`);
              const selected = date === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDate(d);
                    setTime(null);
                  }}
                  className={`flex min-w-[4.5rem] shrink-0 flex-col items-center rounded-2xl border px-3 py-3 text-sm transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-primary-deep hover:border-primary/40"
                  }`}
                >
                  <span className="text-[0.7rem] uppercase tracking-wide opacity-80">
                    {dt.toLocaleDateString(LOCALE_BY_LANGUAGE[language], { weekday: "short" })}
                  </span>
                  <span className="font-display text-xl">{dt.getDate()}</span>
                  <span className="text-[0.7rem] opacity-80">
                    {dt.toLocaleDateString(LOCALE_BY_LANGUAGE[language], { month: "short" })}
                  </span>
                </button>
              );
            })}
          </div>

          {date ? (
            <div className="mt-8">
              <h2 className="font-display text-2xl text-primary-deep">
                {t("booking.availableTimes")} · {formatDateIn(date, language)}
              </h2>
              {availability.isLoading ? (
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> {t("booking.checking")}
                </p>
              ) : availability.data && availability.data.slots.length > 0 ? (
                <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                  {availability.data.slots.map((slot) => (
                    <button
                      key={slot.start}
                      type="button"
                      onClick={() => setTime(slot.start)}
                      className={`rounded-xl border px-2 py-2.5 text-sm transition-colors ${
                        time === slot.start
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-primary-deep hover:border-primary/40"
                      }`}
                    >
                      {slot.start}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-2xl border border-dashed border-primary/25 bg-secondary/50 p-5 text-sm text-muted-foreground">
                  {t("booking.noAvailability")}
                </p>
              )}
            </div>
          ) : null}

          <div className="mt-10 flex justify-between gap-3">
            <Button variant="ghost" className="rounded-full" onClick={() => go(0)}>
              <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" /> {t("common.back")}
            </Button>
            <Button className="rounded-full px-7" disabled={!time} onClick={() => go(2)}>
              {t("common.continue")}
            </Button>
          </div>
        </div>
      ) : null}

      {step === 2 && service && date && time ? (
        <div>
          <SummaryBar service={service} currency={data.settings.currency} date={date} time={time} />

          <form
            className="mt-8 grid gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="fullName">{t("booking.fullName")}</Label>
              <Input
                id="fullName"
                maxLength={100}
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t("booking.email")}</Label>
              <Input
                id="email"
                type="email"
                maxLength={255}
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
              <div className="grid gap-2">
                <Label htmlFor="countryCode">{t("booking.countryCode")}</Label>
                <Input
                  id="countryCode"
                  maxLength={6}
                  required
                  value={form.countryCode}
                  onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">{t("booking.phone")}</Label>
                <Input
                  id="phone"
                  inputMode="tel"
                  maxLength={30}
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comments">{t("booking.comments")}</Label>
              <Textarea
                id="comments"
                rows={4}
                maxLength={1000}
                placeholder={t("booking.commentsPlaceholder")}
                value={form.comments}
                onChange={(e) => setForm({ ...form, comments: e.target.value })}
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <Checkbox
                checked={form.acceptCancellation}
                onCheckedChange={(v) => setForm({ ...form, acceptCancellation: v === true })}
                className="mt-0.5"
              />
              <span>
                {t("booking.acceptCancellationPre")}{" "}
                <Link to="/legal/cancellation" className="text-primary underline underline-offset-2">
                  {t("booking.cancellationLink")}
                </Link>
                . {data.settings.cancellation_policy}
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <Checkbox
                checked={form.acceptPrivacy}
                onCheckedChange={(v) => setForm({ ...form, acceptPrivacy: v === true })}
                className="mt-0.5"
              />
              <span>
                {t("booking.acceptPrivacyPre")}{" "}
                <Link to="/legal/privacy" className="text-primary underline underline-offset-2">
                  {t("booking.privacyLink")}
                </Link>{" "}
                {t("booking.acceptPrivacyPost")}
              </span>
            </label>

            <div className="mt-4 flex justify-between gap-3">
              <Button type="button" variant="ghost" className="rounded-full" onClick={() => go(1)}>
                <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" /> {t("common.back")}
              </Button>
              <Button type="submit" className="rounded-full px-7" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : null}
                {t("booking.confirm")}
              </Button>
            </div>
          </form>
        </div>
      ) : null}

      {step === 3 && result && service && date && time ? (
        <Card className="border-primary/25 bg-secondary/50 shadow-soft">
          <CardContent className="p-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mt-6 font-display text-3xl text-primary-deep">{t("booking.confirmed")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("booking.referenceIs")} <span className="font-medium text-primary">{result.reference}</span>
            </p>

            <div className="mx-auto mt-8 max-w-sm space-y-2 rounded-2xl border border-border bg-card p-5 text-left text-sm text-muted-foreground">
              <p className="font-display text-xl text-primary-deep">{service.name}</p>
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-sage" aria-hidden="true" />
                {formatDateIn(date, language)} · {time}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-sage" aria-hidden="true" />
                {formatDurationIn(service.duration_minutes, language)}
              </p>
              <p className="flex items-center gap-2 font-medium text-primary">
                <Euro className="h-4 w-4 text-sage" aria-hidden="true" />
                {formatPrice(service.price_cents, data.settings.currency)}
              </p>
              <p>
                {BUSINESS.addressLine1}, {BUSINESS.postalCode} {BUSINESS.city}
              </p>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              {t("booking.saveLink")}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button
                className="rounded-full px-6"
                onClick={() =>
                  navigate({ to: "/booking/$token", params: { token: result.manageToken } })
                }
              >
                {t("booking.manage")}
              </Button>
              <Button asChild variant="outline" className="rounded-full border-primary/30 px-6">
                <Link to="/">Back to home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function SummaryBar({
  service,
  currency,
  date,
  time,
}: {
  service: { name: string; duration_minutes: number; price_cents: number };
  currency: string;
  date?: string;
  time?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/60 p-5">
      <p className="font-display text-xl text-primary-deep">{service.name}</p>
      <p className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
        <span>{formatDuration(service.duration_minutes)}</span>
        <span className="font-medium text-primary">{formatPrice(service.price_cents, currency)}</span>
        {date && time ? (
          <span>
            {formatIsoDate(date)} · {time}
          </span>
        ) : null}
      </p>
    </div>
  );
}
