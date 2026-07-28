/** Static, owner-confirmed business facts. Anything not listed here must come
 *  from the admin panel (business_settings) or stay "Information coming soon." */

export const BUSINESS = {
  name: "Hands & Balance Wellness Center",
  shortName: "Hands & Balance",
  addressLine1: "De Pintelaan 209 bus 301",
  postalCode: "9000",
  city: "Gent",
  country: "Belgium",
  phoneDisplay: "0495 74 30 85",
  phoneInternational: "+32 495 74 30 85",
  phoneHref: "tel:+32495743085",
  email: "anabelamagalhaes1@hotmail.com",
  instagramHandle: "@hands_balance_wellnesscenter",
  instagramUrl: "https://www.instagram.com/hands_balance_wellnesscenter/",
  timezone: "Europe/Brussels",
  currency: "EUR",
  ratingValue: "5.0",
  reviewCount: 19,
} as const;

export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(
    `${BUSINESS.addressLine1}, ${BUSINESS.postalCode} ${BUSINESS.city}, ${BUSINESS.country}`,
  );

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hello, I found Hands & Balance Wellness Center through the website and would like more information.";

export const NAV_LINKS = [
  { to: "/", key: "nav.home" },
  { to: "/services", key: "nav.services" },
  { to: "/about", key: "nav.about" },
  { to: "/gallery", key: "nav.gallery" },
  { to: "/reviews", key: "nav.reviews" },
  { to: "/contact", key: "nav.contact" },
] as const;

export const PLACEHOLDER_NOTICE = "Professional image to be added.";
export const INFO_SOON = "Information coming soon.";

export function formatPrice(cents: number, currency = "EUR", locale = "en-BE") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} minutes`;
  if (m === 0) return h === 1 ? "1 hour" : `${h} hours`;
  return `${h} hour${h > 1 ? "s" : ""} ${m} minutes`;
}

/** Human date for a plain YYYY-MM-DD string, timezone-safe. */
export function formatIsoDate(iso: string, locale = "en-GB") {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function shortTime(t: string) {
  return t.slice(0, 5);
}
