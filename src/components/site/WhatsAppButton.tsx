import { MessageCircle } from "lucide-react";

import { BUSINESS, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/site";

/**
 * The WhatsApp number is configurable in the admin panel. Until it is
 * confirmed, we fall back to the business phone number and label the button
 * as "Message us" without claiming WhatsApp is active on it.
 */
export function WhatsAppButton({ number }: { number?: string | null }) {
  const digits = (number ?? BUSINESS.phoneInternational).replace(/[^\d]/g, "");
  const confirmed = Boolean(number);
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;

  return (
    <a
      href={confirmed ? href : `mailto:${BUSINESS.email}?subject=${encodeURIComponent("Website enquiry")}`}
      target={confirmed ? "_blank" : undefined}
      rel={confirmed ? "noopener noreferrer" : undefined}
      aria-label={confirmed ? "Contact us on WhatsApp" : "Send us a message by email"}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift transition-transform hover:scale-105 focus-visible:scale-105 md:bottom-8 md:right-8"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
