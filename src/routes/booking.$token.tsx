import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, Clock, Euro, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cancelBooking, getAvailability, getBooking, rescheduleBooking } from "@/lib/public.functions";
import { BUSINESS, formatDuration, formatIsoDate, formatPrice, shortTime } from "@/lib/site";

export const Route = createFileRoute("/booking/$token")({
  head: () => ({
    meta: [
      { title: "Manage Your Booking | Hands & Balance Wellness Center" },
      {
        name: "description",
        content: "View, reschedule or cancel your massage session at Hands & Balance Wellness Center.",
      },
      { property: "og:title", content: "Manage Your Booking | Hands & Balance Wellness Center" },
      {
        property: "og:description",
        content: "View, reschedule or cancel your massage session at Hands & Balance Wellness Center.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ManageBookingPage,
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

function ManageBookingPage() {
  const { token } = Route.useParams();
  const queryClient = useQueryClient();
  const [rescheduling, setRescheduling] = useState(false);
  const [date, setDate] = useState<string | null>(null);

  const getBookingFn = useServerFn(getBooking);
  const cancelFn = useServerFn(cancelBooking);
  const rescheduleFn = useServerFn(rescheduleBooking);

  const bookingQuery = useQuery({
    queryKey: ["booking", token],
    queryFn: () => getBookingFn({ data: { token } }),
  });
  const booking = bookingQuery.data?.booking ?? null;

  const cancelMutation = useMutation({
    mutationFn: () => cancelFn({ data: { token } }),
    onSuccess: () => {
      toast.success("Your booking has been cancelled.");
      queryClient.invalidateQueries({ queryKey: ["booking", token] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rescheduleMutation = useMutation({
    mutationFn: (payload: { date: string; startTime: string }) =>
      rescheduleFn({ data: { token, ...payload } }),
    onSuccess: () => {
      toast.success("Your booking has been moved.");
      setRescheduling(false);
      setDate(null);
      queryClient.invalidateQueries({ queryKey: ["booking", token] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (bookingQuery.isLoading) {
    return (
      <div className="container-page flex max-w-2xl items-center gap-2 py-24 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading your booking…
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container-page max-w-2xl py-24 text-center">
        <h1 className="font-display text-3xl text-primary-deep">Booking link not valid</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This link is invalid or has expired. Please contact us and we will help you directly.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild className="rounded-full px-6">
            <a href={BUSINESS.phoneHref}>Call {BUSINESS.phoneDisplay}</a>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-primary/30 px-6">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const cancelled = booking.status === "cancelled";

  return (
    <div className="container-page max-w-2xl py-14 sm:py-20">
      <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Your Booking</h1>
      <p className="mt-3 text-sm text-muted-foreground">Reference {booking.reference}</p>

      <Card className="mt-8 border-border bg-card shadow-soft">
        <CardContent className="space-y-3 p-7 text-sm text-muted-foreground">
          <p className="font-display text-2xl text-primary-deep">{booking.service_name}</p>
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-sage" aria-hidden="true" />
            {formatIsoDate(booking.appointment_date)} · {shortTime(booking.start_time)}–
            {shortTime(booking.end_time)}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-sage" aria-hidden="true" />
            {formatDuration(booking.duration_minutes)}
          </p>
          <p className="flex items-center gap-2 font-medium text-primary">
            <Euro className="h-4 w-4 text-sage" aria-hidden="true" />
            {formatPrice(booking.price_cents, booking.currency)}
          </p>
          <p>
            {BUSINESS.addressLine1}, {BUSINESS.postalCode} {BUSINESS.city}
          </p>
          <p className="pt-2">
            Status:{" "}
            <span className={cancelled ? "text-destructive" : "font-medium text-primary-deep"}>
              {booking.status.replace("_", " ")}
            </span>
          </p>
        </CardContent>
      </Card>

      <p className="mt-6 rounded-2xl border border-dashed border-primary/25 bg-secondary/50 p-5 text-sm text-muted-foreground">
        {booking.cancellationPolicy}
      </p>

      {!cancelled && booking.canModify ? (
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-full border-primary/30 px-6"
              onClick={() => setRescheduling((v) => !v)}
            >
              {rescheduling ? "Close reschedule" : "Reschedule"}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="rounded-full px-6">
                  Cancel booking
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This cannot be undone. You can always make a new booking afterwards.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep booking</AlertDialogCancel>
                  <AlertDialogAction onClick={() => cancelMutation.mutate()}>
                    Yes, cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {rescheduling ? (
            <ReschedulePanel
              days={nextDays(28)}
              date={date}
              setDate={setDate}
              pending={rescheduleMutation.isPending}
              onConfirm={(d, t) => rescheduleMutation.mutate({ date: d, startTime: t })}
              token={token}
            />
          ) : null}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          {cancelled
            ? "This booking has been cancelled."
            : "This booking can no longer be changed online. Please contact us directly and we will help you."}
        </p>
      )}

      <div className="mt-10 flex flex-wrap gap-2">
        <Button asChild variant="outline" className="rounded-full border-primary/30 px-6">
          <a href={BUSINESS.phoneHref}>Call {BUSINESS.phoneDisplay}</a>
        </Button>
        <Button asChild variant="ghost" className="rounded-full px-6">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}

function ReschedulePanel({
  days,
  date,
  setDate,
  pending,
  onConfirm,
  token,
}: {
  days: string[];
  date: string | null;
  setDate: (d: string) => void;
  pending: boolean;
  onConfirm: (date: string, time: string) => void;
  token: string;
}) {
  const [time, setTime] = useState<string | null>(null);
  const getBookingFn = useServerFn(getBooking);
  const availabilityFn = useServerFn(getAvailability);

  // Slots for the same service are resolved by the server from the booking token.
  const slots = useQuery({
    queryKey: ["reschedule-slots", token, date],
    enabled: Boolean(date),
    queryFn: async () => {
      const { booking } = await getBookingFn({ data: { token } });
      if (!booking) return { slots: [] as { start: string; end: string }[] };
      return availabilityFn({
        data: { serviceId: (booking as unknown as { service_id: string }).service_id, date: date! },
      });
    },
  });

  return (
    <div className="rounded-2xl border border-border bg-secondary/50 p-6">
      <h2 className="font-display text-2xl text-primary-deep">Pick a new date</h2>
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
                {dt.toLocaleDateString("en-GB", { weekday: "short" })}
              </span>
              <span className="font-display text-xl">{dt.getDate()}</span>
              <span className="text-[0.7rem] opacity-80">
                {dt.toLocaleDateString("en-GB", { month: "short" })}
              </span>
            </button>
          );
        })}
      </div>

      {date ? (
        slots.isLoading ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Checking availability…
          </p>
        ) : slots.data && slots.data.slots.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
            {slots.data.slots.map((slot) => (
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
          <p className="mt-4 text-sm text-muted-foreground">
            No availability on this day. Please choose another date.
          </p>
        )
      ) : null}

      <Button
        className="mt-6 rounded-full px-7"
        disabled={!date || !time || pending}
        onClick={() => date && time && onConfirm(date, time)}
      >
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Confirm new time
      </Button>
    </div>
  );
}
