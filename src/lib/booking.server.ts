/** Server-only booking engine: slot calculation, booking creation and
 *  self-service management. Never import this from client code. */
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type Slot = { start: string; end: string };

export type BookingInput = {
  serviceId: string;
  date: string;
  startTime: string;
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  comments: string;
  preferredLanguage: string;
  acceptCancellation: boolean;
  acceptPrivacy: boolean;
};

const toMinutes = (t: string) => {
  const [h, m] = t.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
};

const toTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/** Current wall-clock date/time in the business timezone. */
export function nowInTimezone(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

/** Minutes between "now" in the business timezone and a booked slot. */
function minutesUntil(date: string, time: string, timeZone: string) {
  const now = nowInTimezone(timeZone);
  const dayDiff =
    (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${now.date}T00:00:00Z`)) / 86400000;
  return dayDiff * 1440 + toMinutes(time) - toMinutes(now.time);
}

export async function getSettings() {
  const { data, error } = await supabaseAdmin
    .from("business_settings")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Business settings are not configured.");
  return data;
}

export async function computeSlots(serviceId: string, date: string): Promise<Slot[]> {
  const settings = await getSettings();
  const tz = settings.timezone || "Europe/Brussels";

  const { data: service } = await supabaseAdmin
    .from("services")
    .select("id, duration_minutes, buffer_minutes, is_bookable, is_active")
    .eq("id", serviceId)
    .maybeSingle();
  if (!service || !service.is_active || !service.is_bookable) return [];

  const now = nowInTimezone(tz);
  if (date < now.date) return [];
  const maxDate = new Date(Date.parse(`${now.date}T00:00:00Z`) + settings.max_advance_days * 86400000)
    .toISOString()
    .slice(0, 10);
  if (date > maxDate) return [];

  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();

  const [hoursRes, exceptionsRes, blocksRes, apptRes] = await Promise.all([
    supabaseAdmin.from("business_hours").select("*").eq("weekday", weekday).maybeSingle(),
    supabaseAdmin.from("availability_exceptions").select("*").eq("exception_date", date),
    supabaseAdmin
      .from("blocked_periods")
      .select("*")
      .lte("start_date", date)
      .gte("end_date", date),
    supabaseAdmin
      .from("appointments")
      .select("start_time, end_time, status")
      .eq("appointment_date", date)
      .in("status", ["pending_payment", "confirmed", "completed"]),
  ]);

  // Windows: explicit exceptions for the date override the weekly schedule.
  let windows: Array<[number, number]> = [];
  const exceptions = exceptionsRes.data ?? [];
  if (exceptions.length > 0) {
    windows = exceptions.map((e) => [toMinutes(e.start_time), toMinutes(e.end_time)]);
  } else if (hoursRes.data?.is_open) {
    const h = hoursRes.data;
    const open = toMinutes(h.open_time);
    const close = toMinutes(h.close_time);
    if (h.break_start && h.break_end) {
      windows = [
        [open, toMinutes(h.break_start)],
        [toMinutes(h.break_end), close],
      ];
    } else {
      windows = [[open, close]];
    }
  }
  if (windows.length === 0) return [];

  const busy: Array<[number, number]> = [];
  const gap = settings.gap_between_sessions_minutes ?? 0;
  for (const a of apptRes.data ?? []) {
    busy.push([toMinutes(a.start_time) - gap, toMinutes(a.end_time) + gap]);
  }
  for (const b of blocksRes.data ?? []) {
    busy.push([b.start_time ? toMinutes(b.start_time) : 0, b.end_time ? toMinutes(b.end_time) : 1440]);
  }

  const duration = service.duration_minutes + (service.buffer_minutes ?? 0);
  const step = Math.max(5, settings.slot_interval_minutes ?? 15);
  const minNotice = (settings.min_notice_hours ?? 0) * 60;

  const slots: Slot[] = [];
  for (const [wStart, wEnd] of windows) {
    for (let start = wStart; start + duration <= wEnd; start += step) {
      const end = start + duration;
      if (busy.some(([bs, be]) => start < be && end > bs)) continue;
      if (minutesUntil(date, toTime(start), tz) < minNotice) continue;
      slots.push({ start: toTime(start), end: toTime(end) });
    }
  }
  return slots;
}

function randomReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `HB-${out}`;
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createBookingRecord(input: BookingInput) {
  const settings = await getSettings();
  const tz = settings.timezone || "Europe/Brussels";

  const { data: service } = await supabaseAdmin
    .from("services")
    .select("*")
    .eq("id", input.serviceId)
    .maybeSingle();
  if (!service || !service.is_active || !service.is_bookable) {
    throw new Error("This session is not available for online booking.");
  }

  // Re-validate the slot server-side; never trust the browser.
  const slots = await computeSlots(input.serviceId, input.date);
  const slot = slots.find((s) => s.start === input.startTime.slice(0, 5));
  if (!slot) throw new Error("That time is no longer available. Please choose another slot.");

  const { data: customer, error: customerError } = await supabaseAdmin
    .from("customers")
    .upsert(
      {
        full_name: input.fullName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        country_code: input.countryCode,
        preferred_language: input.preferredLanguage,
      },
      { onConflict: "email" },
    )
    .select("id")
    .single();
  if (customerError) throw customerError;

  const onlinePayment =
    settings.payment_mode !== "pay_on_site" && service.online_payment_enabled;
  const amountDue =
    settings.payment_mode === "deposit"
      ? Math.min(settings.deposit_cents, service.price_cents)
      : service.price_cents;

  const reference = randomReference();
  const manageToken = randomToken();

  const { data: appointment, error } = await supabaseAdmin
    .from("appointments")
    .insert({
      reference,
      manage_token: manageToken,
      customer_id: customer.id,
      service_id: service.id,
      service_name: service.name,
      appointment_date: input.date,
      start_time: slot.start,
      end_time: slot.end,
      duration_minutes: service.duration_minutes,
      timezone: tz,
      status: onlinePayment ? "pending_payment" : "confirmed",
      payment_status: onlinePayment ? "pending" : "not_required",
      payment_mode: settings.payment_mode,
      price_cents: service.price_cents,
      amount_due_cents: onlinePayment ? amountDue : 0,
      currency: settings.currency,
      customer_comments: input.comments,
      accepted_cancellation_policy: input.acceptCancellation,
      accepted_privacy_policy: input.acceptPrivacy,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23P01" || error.code === "23505") {
      throw new Error("That time was just booked by someone else. Please choose another slot.");
    }
    throw error;
  }

  await supabaseAdmin.from("appointment_history").insert({
    appointment_id: appointment.id,
    action: "created",
    details: `Booking created online (${settings.payment_mode}).`,
    actor: "customer",
  });

  // Emails are logged as pending until an email provider is configured.
  await supabaseAdmin.from("email_logs").insert([
    {
      appointment_id: appointment.id,
      recipient: input.email,
      template: "booking_confirmation_customer",
      status: settings.emails_configured ? "pending" : "failed",
      error: settings.emails_configured ? null : "Email provider not configured yet.",
    },
    {
      appointment_id: appointment.id,
      recipient: settings.admin_notification_email ?? settings.email,
      template: "booking_notification_admin",
      status: settings.emails_configured ? "pending" : "failed",
      error: settings.emails_configured ? null : "Email provider not configured yet.",
    },
  ]);

  return {
    reference,
    manageToken,
    emailsConfigured: settings.emails_configured,
    requiresPayment: onlinePayment,
  };
}

export async function loadBookingByToken(token: string) {
  const { data, error } = await supabaseAdmin
    .from("appointments")
    .select(
      "id, reference, service_id, service_name, appointment_date, start_time, end_time, duration_minutes, status, payment_status, payment_mode, price_cents, amount_due_cents, currency, timezone, customer_comments, token_expires_at, customers(full_name, email)",
    )
    .eq("manage_token", token)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  if (new Date(data.token_expires_at).getTime() < Date.now()) return null;

  const settings = await getSettings();
  const minutes = minutesUntil(data.appointment_date, data.start_time, data.timezone);
  return {
    ...data,
    cancellationPolicy: settings.cancellation_policy,
    canModify:
      ["pending_payment", "confirmed"].includes(data.status) &&
      minutes > settings.cancellation_window_hours * 60,
  };
}

export async function cancelBookingByToken(token: string) {
  const booking = await loadBookingByToken(token);
  if (!booking) throw new Error("This booking link is invalid or has expired.");
  if (!booking.canModify) {
    throw new Error(
      "This booking can no longer be changed online. Please contact us directly.",
    );
  }

  const refundNeeded = booking.payment_status === "paid";
  const { error } = await supabaseAdmin
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", booking.id);
  if (error) throw error;

  await supabaseAdmin.from("appointment_history").insert({
    appointment_id: booking.id,
    action: "cancelled",
    details: refundNeeded
      ? "Cancelled by customer. Refund request registered for manual review."
      : "Cancelled by customer.",
    actor: "customer",
  });

  if (refundNeeded) {
    await supabaseAdmin
      .from("payments")
      .update({ refund_requested: true })
      .eq("appointment_id", booking.id);
  }

  return { refundRequested: refundNeeded };
}

export async function rescheduleBookingByToken(token: string, date: string, startTime: string) {
  const booking = await loadBookingByToken(token);
  if (!booking) throw new Error("This booking link is invalid or has expired.");
  if (!booking.canModify) {
    throw new Error("This booking can no longer be changed online. Please contact us directly.");
  }

  const { data: appt } = await supabaseAdmin
    .from("appointments")
    .select("service_id")
    .eq("id", booking.id)
    .single();

  const slots = await computeSlots(appt!.service_id, date);
  const slot = slots.find((s) => s.start === startTime.slice(0, 5));
  if (!slot) throw new Error("That time is no longer available. Please choose another slot.");

  const { error } = await supabaseAdmin
    .from("appointments")
    .update({ appointment_date: date, start_time: slot.start, end_time: slot.end })
    .eq("id", booking.id);
  if (error) throw error;

  await supabaseAdmin.from("appointment_history").insert({
    appointment_id: booking.id,
    action: "rescheduled",
    details: `Moved to ${date} ${slot.start}.`,
    actor: "customer",
  });

  return { date, startTime: slot.start };
}

export async function loadPublicSiteData() {
  const [services, reviews, faq, gallery, settings] = await Promise.all([
    supabaseAdmin
      .from("services")
      .select(
        "id, slug, name, duration_minutes, price_cents, description, notes, image_url, is_featured, is_bookable",
      )
      .eq("is_active", true)
      .eq("is_archived", false)
      .order("sort_order"),
    supabaseAdmin
      .from("reviews")
      .select("id, author_name, rating, content, language")
      .eq("is_published", true)
      .order("sort_order"),
    supabaseAdmin
      .from("faq_items")
      .select("id, question, answer")
      .eq("is_published", true)
      .order("sort_order"),
    supabaseAdmin
      .from("gallery_images")
      .select("id, image_url, alt_text, caption, is_featured")
      .eq("is_published", true)
      .order("sort_order"),
    getSettings(),
  ]);

  return {
    services: services.data ?? [],
    reviews: reviews.data ?? [],
    faq: faq.data ?? [],
    gallery: gallery.data ?? [],
    settings: {
      about_text: settings.about_text,
      cancellation_policy: settings.cancellation_policy,
      reviews_url: settings.reviews_url,
      whatsapp_number: settings.whatsapp_number,
      instagram_url: settings.instagram_url,
      instagram_handle: settings.instagram_handle,
      show_business_hours: settings.show_business_hours,
      payment_mode: settings.payment_mode,
      currency: settings.currency,
      gift_card_validity: settings.gift_card_validity,
      gift_card_rules: settings.gift_card_rules,
      practitioner_name: settings.practitioner_name,
      practitioner_bio: settings.practitioner_bio,
    },
  };
}

export type PublicSiteData = Awaited<ReturnType<typeof loadPublicSiteData>>;
