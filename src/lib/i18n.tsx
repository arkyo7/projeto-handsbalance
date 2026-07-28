import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "nl", label: "Nederlands", short: "NL" },
  { code: "pt", label: "Português", short: "PT" },
  { code: "fr", label: "Français", short: "FR" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

/**
 * English is the source language. Other locales fall back to English for any
 * key that has not been translated yet — never mix languages inside a page by
 * inventing partial translations of approved business copy.
 */
const en = {
  "nav.home": "Home",
  "nav.services": "Services",
  "nav.about": "About",
  "nav.gallery": "Gallery",
  "nav.reviews": "Reviews",
  "nav.contact": "Contact",
  "nav.menu": "Open navigation menu",
  "nav.language": "Change language",

  "cta.book": "Book a Session",
  "cta.bookNow": "Book Now",
  "cta.bookYours": "Book Your Session",
  "cta.viewServices": "View Services",
  "cta.viewDetails": "View Details",
  "cta.viewMoreReviews": "View More Reviews",
  "cta.buyGiftCard": "Buy a Gift Card",
  "cta.call": "Call Us",
  "cta.email": "Send an Email",
  "cta.maps": "Open in Maps",
  "cta.instagram": "Visit Instagram",

  "hero.eyebrow": "Professional Massage Therapy in Gent",
  "hero.headline": "Relax, recover and restore your balance.",
  "hero.sub":
    "Personalized massage sessions designed to relieve muscle tension, reduce stress and support your physical well-being in a calm and welcoming environment.",
  "hero.rating": "5.0 rating",
  "hero.reviews": "19 reviews",
  "hero.location": "Gent, Belgium",
  "hero.personal": "Personalized care",

  "trust.personalized": "Personalized Sessions",
  "trust.professional": "Professional Care",
  "trust.calm": "Calm Environment",
  "trust.online": "Online Booking",
  "trust.located": "Located in Gent",

  "services.title": "Massage Sessions Designed Around You",
  "services.sub":
    "Explore the available sessions and choose the experience that best matches your current needs.",

  "about.title": "A Calm Space for Personalized Care",
  "about.value1": "Human-centered care",
  "about.value2": "Personalized sessions",
  "about.value3": "Attentive approach",
  "about.value4": "Relaxing atmosphere",

  "gallery.title": "A Look Inside Hands & Balance",
  "gallery.empty": "Official photos will be added here soon.",

  "reviews.title": "What Clients Say",

  "gift.title": "Give Someone a Moment of Balance",
  "gift.sub": "A thoughtful wellness experience for someone you care about.",

  "how.title": "How Booking Works",
  "how.step1": "Choose Your Session",
  "how.step2": "Select a Date and Time",
  "how.step3": "Confirm Your Booking",

  "cta.headline": "Make time for your well-being.",
  "cta.text": "Choose your session and reserve a time that works for you.",

  "faq.title": "Frequently Asked Questions",

  "contact.title": "Visit Hands & Balance Wellness Center",

  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms and Conditions",
  "footer.cancellation": "Cancellation Policy",
  "footer.cookies": "Cookie Policy",
  "footer.rights": "All rights reserved.",
} as const;

export type TranslationKey = keyof typeof en;

const dictionaries: Record<LanguageCode, Partial<Record<TranslationKey, string>>> = {
  en,
  nl: {
    "nav.home": "Home",
    "nav.services": "Diensten",
    "nav.about": "Over ons",
    "nav.gallery": "Galerij",
    "nav.reviews": "Beoordelingen",
    "nav.contact": "Contact",
    "cta.book": "Boek een sessie",
    "cta.bookNow": "Nu boeken",
    "cta.viewServices": "Bekijk diensten",
  },
  pt: {
    "nav.home": "Início",
    "nav.services": "Serviços",
    "nav.about": "Sobre",
    "nav.gallery": "Galeria",
    "nav.reviews": "Avaliações",
    "nav.contact": "Contacto",
    "cta.book": "Marcar sessão",
    "cta.bookNow": "Marcar agora",
    "cta.viewServices": "Ver serviços",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.services": "Services",
    "nav.about": "À propos",
    "nav.gallery": "Galerie",
    "nav.reviews": "Avis",
    "nav.contact": "Contact",
    "cta.book": "Réserver une séance",
    "cta.bookNow": "Réserver",
    "cta.viewServices": "Voir les services",
  },
};

const STORAGE_KEY = "hb-language";

type I18nValue = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (stored && LANGUAGES.some((l) => l.code === stored)) setLanguageState(stored);
  }, []);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    window.localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = code;
  }, []);

  const t = useCallback(
    (key: TranslationKey) => dictionaries[language][key] ?? en[key],
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
