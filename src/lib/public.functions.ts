import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getSiteData = createServerFn({ method: "GET" }).handler(async () => {
  const { loadPublicSiteData } = await import("./booking.server");
  return loadPublicSiteData();
});

export const getAvailability = createServerFn({ method: "GET" })
  .inputValidator((data: { serviceId: string; date: string }) =>
    z.object({ serviceId: z.string().uuid(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { computeSlots } = await import("./booking.server");
    return { slots: await computeSlots(data.serviceId, data.date) };
  });

const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  countryCode: z.string().trim().min(2).max(6),
  phone: z.string().trim().min(5).max(30),
  comments: z.string().trim().max(1000).default(""),
  preferredLanguage: z.enum(["en", "nl", "pt", "fr"]),
  acceptCancellation: z.literal(true),
  acceptPrivacy: z.literal(true),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const { createBookingRecord } = await import("./booking.server");
    return createBookingRecord(data);
  });

export const getBooking = createServerFn({ method: "GET" })
  .inputValidator((data: { token: string }) =>
    z.object({ token: z.string().min(20).max(80) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { loadBookingByToken } = await import("./booking.server");
    return { booking: await loadBookingByToken(data.token) };
  });

export const cancelBooking = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) =>
    z.object({ token: z.string().min(20).max(80) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { cancelBookingByToken } = await import("./booking.server");
    return cancelBookingByToken(data.token);
  });

export const rescheduleBooking = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; date: string; startTime: string }) =>
    z
      .object({
        token: z.string().min(20).max(80),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        startTime: z.string().regex(/^\d{2}:\d{2}$/),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { rescheduleBookingByToken } = await import("./booking.server");
    return rescheduleBookingByToken(data.token, data.date, data.startTime);
  });
