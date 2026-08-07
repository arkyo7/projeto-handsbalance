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

/** Display locale used for dates, numbers and currency per language. */
export const LOCALE_BY_LANGUAGE: Record<LanguageCode, string> = {
  en: "en-BE",
  pt: "pt-BR",
  fr: "fr-BE",
  nl: "nl-BE",
};

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
  "nav.close": "Close menu",
  "nav.language": "Change language",
  "nav.main": "Main navigation",

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
  "cta.headline": "Make time for your well-being.",
  "cta.text": "Choose your session and reserve a time that works for you.",

  "common.infoSoon": "Information coming soon.",
  "common.loading": "Loading…",
  "common.back": "Back",
  "common.continue": "Continue",
  "common.goHome": "Go home",
  "common.backHome": "Back to home",
  "common.tryAgain": "Try again",
  "common.optional": "optional",
  "common.callPhone": "Call {phone}",

  "hero.eyebrow": "Professional Massage Therapy in Gent",
  "hero.headline": "Relax, recover and restore your balance.",
  "hero.sub":
    "Personalized massage sessions designed to relieve muscle tension, reduce stress and support your physical well-being in a calm and welcoming environment.",
  "hero.rating": "5.0 rating",
  "hero.reviews": "19 reviews",
  "hero.location": "Gent, Belgium",
  "hero.personal": "Personalized care",
  "hero.imageAlt":
    "Ana Laura, massage therapist at Hands & Balance Wellness Center in Gent.",

  "trust.personalized": "Personalized Sessions",
  "trust.professional": "Professional Care",
  "trust.calm": "Calm Environment",
  "trust.online": "Online Booking",
  "trust.located": "Located in Gent",

  "services.title": "Massage Sessions Designed Around You",
  "services.sub":
    "Explore the available sessions and choose the experience that best matches your current needs.",
  "services.featured": "Featured",
  "services.notBookable":
    "Online booking for this option is not available yet. Please contact us for details.",
  "page.services.title": "Our Sessions",
  "page.services.intro":
    "Every session is adapted to your body and your goals. Choose the treatment that fits how you feel today.",

  "about.eyebrow": "About",
  "about.title": "A Calm Space for Personalized Care",
  "about.value1": "Human-centered care",
  "about.value2": "Personalized sessions",
  "about.value3": "Attentive approach",
  "about.value4": "Relaxing atmosphere",
  "about.imageAlt":
    "Ana Laura providing a personalized massage session at Hands & Balance Wellness Center.",
  "about.practitionerSoon":
    "Practitioner profile, languages and qualifications: information coming soon.",
  "page.about.title": "About Us",

  "gallery.title": "A Look Inside Hands & Balance",
  "gallery.empty": "Official photos will be added here soon.",
  "gallery.open": "Open photo in full size",
  "gallery.lightbox": "Gallery photo",
  "gallery.close": "Close photo",
  "gallery.prev": "Previous photo",
  "gallery.next": "Next photo",
  "gallery.counter": "Photo {current} of {total}",
  "page.gallery.title": "Gallery",

  "reviews.title": "What Clients Say",
  "reviews.summary": "{rating} · {count} reviews",
  "reviews.stars": "{rating} out of 5",
  "page.reviews.title": "Client Reviews",

  "gift.eyebrow": "Gift Card",
  "gift.title": "Give Someone a Moment of Balance",
  "gift.sub": "A thoughtful wellness experience for someone you care about.",
  "gift.rulesSoon": "Validity, included session and delivery options: information coming soon.",
  "gift.imageAlt": "Hands & Balance Wellness Center gift card.",

  "how.title": "How Booking Works",
  "how.step1": "Choose Your Session",
  "how.step1Text": "Browse the available sessions and pick the one that fits your needs.",
  "how.step2": "Select a Date and Time",
  "how.step2Text": "Pick an available day and time in the online calendar.",
  "how.step3": "Confirm Your Booking",
  "how.step3Text": "Share your details, review the summary and confirm your reservation.",

  "faq.title": "Frequently Asked Questions",

  "contact.eyebrow": "Contact",
  "contact.title": "Visit Hands & Balance Wellness Center",
  "contact.hoursSoon": "Opening hours: information coming soon.",
  "contact.mapTitle": "Map showing Hands & Balance Wellness Center in Gent",
  "page.contact.title": "Contact",

  "footer.tagline": "A calm and supportive space focused on professional massage therapy in Gent.",
  "footer.navigation": "Navigation",
  "footer.legal": "Legal",
  "footer.contact": "Contact",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms and Conditions",
  "footer.cancellation": "Cancellation Policy",
  "footer.cookies": "Cookie Policy",
  "footer.rights": "All rights reserved.",
  "footer.disclaimer":
    "Massage therapy is a well-being service and does not replace medical, physiotherapeutic or psychological care.",

  "cookie.label": "Cookie preferences",
  "cookie.text":
    "We only use cookies that are strictly necessary to run this website and your booking. No tracking or analytics tools are loaded without your consent.",
  "cookie.policy": "Cookie Policy",
  "cookie.accept": "Accept",
  "cookie.reject": "Reject",
  "cookie.preferences": "Preferences",

  "notfound.title": "Page not found",
  "notfound.text": "The page you're looking for doesn't exist or has been moved.",
  "error.title": "This page didn't load",
  "error.text": "Something went wrong on our end. You can try refreshing or head back home.",

  "booking.title": "Book Your Session",
  "booking.timezone": "All times are shown in local time ({tz}).",
  "booking.step.service": "Session",
  "booking.step.datetime": "Date & time",
  "booking.step.details": "Your details",
  "booking.step.confirmation": "Confirmation",
  "booking.chooseDate": "Choose a date",
  "booking.availableTimes": "Available times",
  "booking.checking": "Checking availability…",
  "booking.noAvailability":
    "No availability on this day. Please choose another date, or contact us directly.",
  "booking.fullName": "Full name",
  "booking.email": "Email",
  "booking.countryCode": "Country code",
  "booking.phone": "Phone number",
  "booking.comments": "Comments (optional)",
  "booking.commentsPlaceholder": "Anything we should know before your session?",
  "booking.acceptCancellationPre": "I accept the",
  "booking.cancellationLink": "cancellation policy",
  "booking.acceptPrivacyPre": "I accept the",
  "booking.privacyLink": "privacy policy",
  "booking.acceptPrivacyPost": "and agree that my details are used to manage this booking.",
  "booking.confirm": "Confirm booking",
  "booking.confirmed": "Booking confirmed",
  "booking.referenceIs": "Your reference is",
  "booking.saveLink": "Save your personal booking link to cancel or reschedule later.",
  "booking.manage": "Manage my booking",
  "booking.errName": "Please enter your full name.",
  "booking.errEmail": "Please enter a valid email address.",
  "booking.errPhone": "Please enter a valid phone number.",
  "booking.errAccept": "Please accept the cancellation and privacy policies.",
  "booking.errGeneric": "We could not complete your booking.",

  "manage.title": "Your Booking",
  "manage.reference": "Reference {ref}",
  "manage.loading": "Loading your booking…",
  "manage.invalidTitle": "Booking link not valid",
  "manage.invalidText":
    "This link is invalid or has expired. Please contact us and we will help you directly.",
  "manage.status": "Status:",
  "manage.reschedule": "Reschedule",
  "manage.closeReschedule": "Close reschedule",
  "manage.cancel": "Cancel booking",
  "manage.cancelTitle": "Cancel this booking?",
  "manage.cancelDesc": "This cannot be undone. You can always make a new booking afterwards.",
  "manage.keep": "Keep booking",
  "manage.yesCancel": "Yes, cancel",
  "manage.cancelledToast": "Your booking has been cancelled.",
  "manage.movedToast": "Your booking has been moved.",
  "manage.wasCancelled": "This booking has been cancelled.",
  "manage.locked":
    "This booking can no longer be changed online. Please contact us directly and we will help you.",
  "manage.pickNewDate": "Pick a new date",
  "manage.confirmNewTime": "Confirm new time",
  "manage.noAvailability": "No availability on this day. Please choose another date.",

  "status.pending_payment": "Pending payment",
  "status.confirmed": "Confirmed",
  "status.completed": "Completed",
  "status.cancelled": "Cancelled",
  "status.no_show": "No show",

  "legal.contactNote":
    "Questions about this document? Contact {business}, {address} — {email}. This text is a general template and should be reviewed by the business owner before publication.",

  "seo.home.title": "Hands & Balance Wellness Center | Massage Therapy in Gent",
  "seo.home.description":
    "Personalized massage sessions in Gent, Belgium. Relieve tension, reduce stress and restore your balance. Book your session online in a few clicks.",
  "seo.services.title": "Massage Services & Prices | Hands & Balance Gent",
  "seo.services.description":
    "Relaxing, therapeutic and sports massage sessions in Gent. See durations, prices and what each session includes, then book online.",
  "seo.about.title": "About Hands & Balance Wellness Center | Gent",
  "seo.about.description":
    "A calm wellness space in Gent offering personalized massage therapy with an attentive, human-centered approach.",
  "seo.gallery.title": "Gallery | Hands & Balance Wellness Center Gent",
  "seo.gallery.description":
    "Take a look inside our wellness space in Gent: the treatment room, the atmosphere and the details that help you relax.",
  "seo.reviews.title": "Client Reviews | Hands & Balance Wellness Center",
  "seo.reviews.description":
    "Read what clients say about their massage sessions at Hands & Balance Wellness Center in Gent, Belgium.",
  "seo.contact.title": "Contact & Location | Hands & Balance Wellness Center Gent",
  "seo.contact.description":
    "Find Hands & Balance Wellness Center at De Pintelaan 209 bus 301, 9000 Gent. Call, email or message us to plan your session.",
  "seo.book.title": "Book a Massage Session Online | Hands & Balance Gent",
  "seo.book.description":
    "Choose your massage session, pick a date and time and confirm your booking online at Hands & Balance Wellness Center in Gent.",
  "seo.manage.title": "Manage Your Booking | Hands & Balance Wellness Center",
  "seo.manage.description":
    "View, reschedule or cancel your massage session at Hands & Balance Wellness Center.",
} as const;

export type TranslationKey = keyof typeof en;

type Dict = Partial<Record<TranslationKey, string>>;

const pt: Dict = {
  "nav.home": "Início",
  "nav.services": "Serviços",
  "nav.about": "Sobre",
  "nav.gallery": "Galeria",
  "nav.reviews": "Avaliações",
  "nav.contact": "Contacto",
  "nav.menu": "Abrir menu de navegação",
  "nav.close": "Fechar menu",
  "nav.language": "Mudar de idioma",
  "nav.main": "Navegação principal",

  "cta.book": "Marcar sessão",
  "cta.bookNow": "Marcar agora",
  "cta.bookYours": "Marque a sua sessão",
  "cta.viewServices": "Ver serviços",
  "cta.viewDetails": "Ver detalhes",
  "cta.viewMoreReviews": "Ver mais avaliações",
  "cta.buyGiftCard": "Comprar um cartão presente",
  "cta.call": "Ligar",
  "cta.email": "Enviar e-mail",
  "cta.maps": "Abrir no Maps",
  "cta.instagram": "Visitar o Instagram",
  "cta.headline": "Reserve tempo para o seu bem-estar.",
  "cta.text": "Escolha a sua sessão e reserve um horário que lhe convenha.",

  "common.infoSoon": "Informação em breve.",
  "common.loading": "A carregar…",
  "common.back": "Voltar",
  "common.continue": "Continuar",
  "common.goHome": "Ir para o início",
  "common.backHome": "Voltar ao início",
  "common.tryAgain": "Tentar novamente",
  "common.optional": "opcional",
  "common.callPhone": "Ligar {phone}",

  "hero.eyebrow": "Massagem terapêutica profissional em Gent",
  "hero.headline": "Relaxe, recupere e reencontre o seu equilíbrio.",
  "hero.sub":
    "Sessões de massagem personalizadas, criadas para aliviar a tensão muscular, reduzir o stress e apoiar o seu bem-estar físico num ambiente calmo e acolhedor.",
  "hero.rating": "Classificação 5.0",
  "hero.reviews": "19 avaliações",
  "hero.location": "Gent, Bélgica",
  "hero.personal": "Cuidado personalizado",
  "hero.imageAlt":
    "Ana Laura, massoterapeuta do Hands & Balance Wellness Center em Gent.",

  "trust.personalized": "Sessões personalizadas",
  "trust.professional": "Cuidado profissional",
  "trust.calm": "Ambiente tranquilo",
  "trust.online": "Marcação online",
  "trust.located": "Localizado em Gent",

  "services.title": "Sessões de massagem pensadas para si",
  "services.sub":
    "Explore as sessões disponíveis e escolha a experiência que melhor corresponde às suas necessidades actuais.",
  "services.featured": "Destaque",
  "services.notBookable":
    "A marcação online desta opção ainda não está disponível. Contacte-nos para mais detalhes.",
  "page.services.title": "As nossas sessões",
  "page.services.intro":
    "Cada sessão é adaptada ao seu corpo e aos seus objectivos. Escolha o tratamento que combina com o que sente hoje.",

  "about.eyebrow": "Sobre",
  "about.title": "Um espaço calmo para um cuidado personalizado",
  "about.value1": "Atendimento humanizado",
  "about.value2": "Sessões personalizadas",
  "about.value3": "Abordagem atenta",
  "about.value4": "Ambiente relaxante",
  "about.imageAlt":
    "Ana Laura a realizar uma sessão de massagem personalizada no Hands & Balance Wellness Center.",
  "about.practitionerSoon":
    "Perfil da profissional, idiomas e qualificações: informação em breve.",
  "page.about.title": "Sobre nós",

  "gallery.title": "Um olhar por dentro do Hands & Balance",
  "gallery.empty": "As fotografias oficiais serão adicionadas em breve.",
  "gallery.open": "Abrir fotografia em tamanho real",
  "gallery.lightbox": "Fotografia da galeria",
  "gallery.close": "Fechar fotografia",
  "gallery.prev": "Fotografia anterior",
  "gallery.next": "Fotografia seguinte",
  "gallery.counter": "Fotografia {current} de {total}",
  "page.gallery.title": "Galeria",

  "reviews.title": "O que dizem os clientes",
  "reviews.summary": "{rating} · {count} avaliações",
  "reviews.stars": "{rating} em 5",
  "page.reviews.title": "Avaliações de clientes",

  "gift.eyebrow": "Cartão presente",
  "gift.title": "Ofereça um momento de equilíbrio",
  "gift.sub": "Uma experiência de bem-estar para alguém especial.",
  "gift.rulesSoon": "Validade, sessão incluída e formas de entrega: informação em breve.",
  "gift.imageAlt": "Cartão presente do Hands & Balance Wellness Center.",

  "how.title": "Como funciona a marcação",
  "how.step1": "Escolha a sua sessão",
  "how.step1Text": "Veja as sessões disponíveis e escolha a que corresponde às suas necessidades.",
  "how.step2": "Selecione data e hora",
  "how.step2Text": "Escolha um dia e uma hora disponíveis no calendário online.",
  "how.step3": "Confirme a sua marcação",
  "how.step3Text": "Preencha os seus dados, reveja o resumo e confirme a sua reserva.",

  "faq.title": "Perguntas frequentes",

  "contact.eyebrow": "Contacto",
  "contact.title": "Visite o Hands & Balance Wellness Center",
  "contact.hoursSoon": "Horário de funcionamento: informação em breve.",
  "contact.mapTitle": "Mapa com a localização do Hands & Balance Wellness Center em Gent",
  "page.contact.title": "Contacto",

  "footer.tagline":
    "Um espaço calmo e acolhedor dedicado à massagem terapêutica profissional em Gent.",
  "footer.navigation": "Navegação",
  "footer.legal": "Legal",
  "footer.contact": "Contacto",
  "footer.privacy": "Política de Privacidade",
  "footer.terms": "Termos e Condições",
  "footer.cancellation": "Política de Cancelamento",
  "footer.cookies": "Política de Cookies",
  "footer.rights": "Todos os direitos reservados.",
  "footer.disclaimer":
    "A massagem é um serviço de bem-estar e não substitui cuidados médicos, fisioterapêuticos ou psicológicos.",

  "cookie.label": "Preferências de cookies",
  "cookie.text":
    "Utilizamos apenas cookies estritamente necessários ao funcionamento deste site e da sua marcação. Nenhuma ferramenta de rastreio ou de análise é carregada sem o seu consentimento.",
  "cookie.policy": "Política de Cookies",
  "cookie.accept": "Aceitar",
  "cookie.reject": "Recusar",
  "cookie.preferences": "Preferências",

  "notfound.title": "Página não encontrada",
  "notfound.text": "A página que procura não existe ou foi movida.",
  "error.title": "Esta página não carregou",
  "error.text":
    "Ocorreu um problema do nosso lado. Pode tentar novamente ou voltar à página inicial.",

  "booking.title": "Marque a sua sessão",
  "booking.timezone": "Todos os horários são apresentados na hora local ({tz}).",
  "booking.step.service": "Sessão",
  "booking.step.datetime": "Data e hora",
  "booking.step.details": "Os seus dados",
  "booking.step.confirmation": "Confirmação",
  "booking.chooseDate": "Escolha uma data",
  "booking.availableTimes": "Horários disponíveis",
  "booking.checking": "A verificar a disponibilidade…",
  "booking.noAvailability":
    "Sem disponibilidade neste dia. Escolha outra data ou contacte-nos directamente.",
  "booking.fullName": "Nome completo",
  "booking.email": "E-mail",
  "booking.countryCode": "Indicativo",
  "booking.phone": "Telemóvel",
  "booking.comments": "Comentários (opcional)",
  "booking.commentsPlaceholder": "Algo que devamos saber antes da sua sessão?",
  "booking.acceptCancellationPre": "Aceito a",
  "booking.cancellationLink": "política de cancelamento",
  "booking.acceptPrivacyPre": "Aceito a",
  "booking.privacyLink": "política de privacidade",
  "booking.acceptPrivacyPost": "e concordo que os meus dados sejam usados para gerir esta marcação.",
  "booking.confirm": "Confirmar marcação",
  "booking.confirmed": "Marcação confirmada",
  "booking.referenceIs": "A sua referência é",
  "booking.saveLink": "Guarde o seu link pessoal para cancelar ou remarcar mais tarde.",
  "booking.manage": "Gerir a minha marcação",
  "booking.errName": "Introduza o seu nome completo.",
  "booking.errEmail": "Introduza um endereço de e-mail válido.",
  "booking.errPhone": "Introduza um número de telefone válido.",
  "booking.errAccept": "Aceite as políticas de cancelamento e de privacidade.",
  "booking.errGeneric": "Não foi possível concluir a sua marcação.",

  "manage.title": "A sua marcação",
  "manage.reference": "Referência {ref}",
  "manage.loading": "A carregar a sua marcação…",
  "manage.invalidTitle": "Link de marcação inválido",
  "manage.invalidText":
    "Este link é inválido ou expirou. Contacte-nos e ajudamo-lo directamente.",
  "manage.status": "Estado:",
  "manage.reschedule": "Remarcar",
  "manage.closeReschedule": "Fechar remarcação",
  "manage.cancel": "Cancelar marcação",
  "manage.cancelTitle": "Cancelar esta marcação?",
  "manage.cancelDesc": "Esta acção não pode ser anulada. Pode fazer uma nova marcação depois.",
  "manage.keep": "Manter marcação",
  "manage.yesCancel": "Sim, cancelar",
  "manage.cancelledToast": "A sua marcação foi cancelada.",
  "manage.movedToast": "A sua marcação foi alterada.",
  "manage.wasCancelled": "Esta marcação foi cancelada.",
  "manage.locked":
    "Esta marcação já não pode ser alterada online. Contacte-nos directamente e ajudamo-lo.",
  "manage.pickNewDate": "Escolha uma nova data",
  "manage.confirmNewTime": "Confirmar novo horário",
  "manage.noAvailability": "Sem disponibilidade neste dia. Escolha outra data.",

  "status.pending_payment": "Pagamento pendente",
  "status.confirmed": "Confirmada",
  "status.completed": "Concluída",
  "status.cancelled": "Cancelada",
  "status.no_show": "Falta",

  "legal.contactNote":
    "Dúvidas sobre este documento? Contacte {business}, {address} — {email}. Este texto é um modelo geral e deve ser revisto pela proprietária antes da publicação.",

  "seo.home.title": "Hands & Balance Wellness Center | Massagem em Gent",
  "seo.home.description":
    "Sessões de massagem personalizadas em Gent, Bélgica. Alivie tensões, reduza o stress e recupere o seu equilíbrio. Marque online em poucos cliques.",
  "seo.services.title": "Serviços e preços de massagem | Hands & Balance Gent",
  "seo.services.description":
    "Sessões de massagem relaxante, terapêutica e desportiva em Gent. Veja durações, preços e o que inclui cada sessão e marque online.",
  "seo.about.title": "Sobre o Hands & Balance Wellness Center | Gent",
  "seo.about.description":
    "Um espaço de bem-estar tranquilo em Gent, com massagem personalizada e uma abordagem atenta e humana.",
  "seo.gallery.title": "Galeria | Hands & Balance Wellness Center Gent",
  "seo.gallery.description":
    "Conheça o nosso espaço em Gent: a sala de tratamento, o ambiente e os detalhes que ajudam a relaxar.",
  "seo.reviews.title": "Avaliações de clientes | Hands & Balance Wellness Center",
  "seo.reviews.description":
    "Leia o que os clientes dizem sobre as suas sessões de massagem no Hands & Balance Wellness Center em Gent.",
  "seo.contact.title": "Contacto e localização | Hands & Balance Wellness Center Gent",
  "seo.contact.description":
    "Encontre o Hands & Balance Wellness Center em De Pintelaan 209 bus 301, 9000 Gent. Ligue, escreva ou envie mensagem para planear a sua sessão.",
  "seo.book.title": "Marcar massagem online | Hands & Balance Gent",
  "seo.book.description":
    "Escolha a sua sessão de massagem, seleccione data e hora e confirme a marcação online no Hands & Balance Wellness Center em Gent.",
  "seo.manage.title": "Gerir a sua marcação | Hands & Balance Wellness Center",
  "seo.manage.description":
    "Consulte, remarque ou cancele a sua sessão de massagem no Hands & Balance Wellness Center.",
};

const fr: Dict = {
  "nav.home": "Accueil",
  "nav.services": "Services",
  "nav.about": "À propos",
  "nav.gallery": "Galerie",
  "nav.reviews": "Avis",
  "nav.contact": "Contact",
  "nav.menu": "Ouvrir le menu de navigation",
  "nav.close": "Fermer le menu",
  "nav.language": "Changer de langue",
  "nav.main": "Navigation principale",

  "cta.book": "Réserver une séance",
  "cta.bookNow": "Réserver",
  "cta.bookYours": "Réservez votre séance",
  "cta.viewServices": "Voir les services",
  "cta.viewDetails": "Voir les détails",
  "cta.viewMoreReviews": "Voir plus d’avis",
  "cta.buyGiftCard": "Offrir une carte cadeau",
  "cta.call": "Nous appeler",
  "cta.email": "Envoyer un e-mail",
  "cta.maps": "Ouvrir dans Maps",
  "cta.instagram": "Voir l’Instagram",
  "cta.headline": "Prenez le temps de prendre soin de vous.",
  "cta.text": "Choisissez votre séance et réservez un horaire qui vous convient.",

  "common.infoSoon": "Informations à venir.",
  "common.loading": "Chargement…",
  "common.back": "Retour",
  "common.continue": "Continuer",
  "common.goHome": "Aller à l’accueil",
  "common.backHome": "Retour à l’accueil",
  "common.tryAgain": "Réessayer",
  "common.optional": "facultatif",
  "common.callPhone": "Appeler {phone}",

  "hero.eyebrow": "Massothérapie professionnelle à Gand",
  "hero.headline": "Détendez-vous, récupérez et retrouvez votre équilibre.",
  "hero.sub":
    "Des séances de massage personnalisées, conçues pour soulager les tensions musculaires, réduire le stress et soutenir votre bien-être physique dans un cadre calme et accueillant.",
  "hero.rating": "Note de 5,0",
  "hero.reviews": "19 avis",
  "hero.location": "Gand, Belgique",
  "hero.personal": "Soin personnalisé",
  "hero.imageAlt":
    "Ana Laura, massothérapeute au Hands & Balance Wellness Center à Gand.",

  "trust.personalized": "Séances personnalisées",
  "trust.professional": "Soin professionnel",
  "trust.calm": "Cadre apaisant",
  "trust.online": "Réservation en ligne",
  "trust.located": "Situé à Gand",

  "services.title": "Des séances de massage pensées pour vous",
  "services.sub":
    "Découvrez les séances disponibles et choisissez l’expérience qui correspond le mieux à vos besoins actuels.",
  "services.featured": "En vedette",
  "services.notBookable":
    "La réservation en ligne n’est pas encore disponible pour cette option. Contactez-nous pour plus de détails.",
  "page.services.title": "Nos séances",
  "page.services.intro":
    "Chaque séance est adaptée à votre corps et à vos objectifs. Choisissez le soin qui correspond à ce que vous ressentez aujourd’hui.",

  "about.eyebrow": "À propos",
  "about.title": "Un espace calme pour un soin personnalisé",
  "about.value1": "Approche humaine",
  "about.value2": "Séances personnalisées",
  "about.value3": "Écoute attentive",
  "about.value4": "Ambiance relaxante",
  "about.imageAlt":
    "Ana Laura réalisant une séance de massage personnalisée au Hands & Balance Wellness Center.",
  "about.practitionerSoon":
    "Profil de la praticienne, langues et qualifications : informations à venir.",
  "page.about.title": "À propos",

  "gallery.title": "Un aperçu de Hands & Balance",
  "gallery.empty": "Les photos officielles seront ajoutées prochainement.",
  "gallery.open": "Ouvrir la photo en grand",
  "gallery.lightbox": "Photo de la galerie",
  "gallery.close": "Fermer la photo",
  "gallery.prev": "Photo précédente",
  "gallery.next": "Photo suivante",
  "gallery.counter": "Photo {current} sur {total}",
  "page.gallery.title": "Galerie",

  "reviews.title": "Ce que disent les clients",
  "reviews.summary": "{rating} · {count} avis",
  "reviews.stars": "{rating} sur 5",
  "page.reviews.title": "Avis des clients",

  "gift.eyebrow": "Carte cadeau",
  "gift.title": "Offrez un moment d’équilibre",
  "gift.sub": "Une expérience bien-être pour une personne qui vous est chère.",
  "gift.rulesSoon": "Validité, séance incluse et modalités de remise : informations à venir.",
  "gift.imageAlt": "Carte cadeau du Hands & Balance Wellness Center.",

  "how.title": "Comment réserver",
  "how.step1": "Choisissez votre séance",
  "how.step1Text": "Parcourez les séances disponibles et choisissez celle qui vous convient.",
  "how.step2": "Choisissez une date et une heure",
  "how.step2Text": "Sélectionnez un jour et un horaire disponibles dans l’agenda en ligne.",
  "how.step3": "Confirmez votre réservation",
  "how.step3Text": "Renseignez vos coordonnées, vérifiez le récapitulatif et confirmez.",

  "faq.title": "Questions fréquentes",

  "contact.eyebrow": "Contact",
  "contact.title": "Venez au Hands & Balance Wellness Center",
  "contact.hoursSoon": "Heures d’ouverture : informations à venir.",
  "contact.mapTitle": "Carte indiquant Hands & Balance Wellness Center à Gand",
  "page.contact.title": "Contact",

  "footer.tagline":
    "Un espace calme et bienveillant dédié à la massothérapie professionnelle à Gand.",
  "footer.navigation": "Navigation",
  "footer.legal": "Mentions légales",
  "footer.contact": "Contact",
  "footer.privacy": "Politique de confidentialité",
  "footer.terms": "Conditions générales",
  "footer.cancellation": "Politique d’annulation",
  "footer.cookies": "Politique de cookies",
  "footer.rights": "Tous droits réservés.",
  "footer.disclaimer":
    "Le massage est un service de bien-être et ne remplace pas un suivi médical, kinésithérapeutique ou psychologique.",

  "cookie.label": "Préférences de cookies",
  "cookie.text":
    "Nous n’utilisons que les cookies strictement nécessaires au fonctionnement du site et de votre réservation. Aucun outil de suivi ou d’analyse n’est chargé sans votre consentement.",
  "cookie.policy": "Politique de cookies",
  "cookie.accept": "Accepter",
  "cookie.reject": "Refuser",
  "cookie.preferences": "Préférences",

  "notfound.title": "Page introuvable",
  "notfound.text": "La page que vous cherchez n’existe pas ou a été déplacée.",
  "error.title": "Cette page ne s’est pas chargée",
  "error.text":
    "Un problème est survenu de notre côté. Vous pouvez réessayer ou revenir à l’accueil.",

  "booking.title": "Réservez votre séance",
  "booking.timezone": "Tous les horaires sont affichés en heure locale ({tz}).",
  "booking.step.service": "Séance",
  "booking.step.datetime": "Date et heure",
  "booking.step.details": "Vos coordonnées",
  "booking.step.confirmation": "Confirmation",
  "booking.chooseDate": "Choisissez une date",
  "booking.availableTimes": "Horaires disponibles",
  "booking.checking": "Vérification des disponibilités…",
  "booking.noAvailability":
    "Aucune disponibilité ce jour-là. Choisissez une autre date ou contactez-nous directement.",
  "booking.fullName": "Nom complet",
  "booking.email": "E-mail",
  "booking.countryCode": "Indicatif",
  "booking.phone": "Numéro de téléphone",
  "booking.comments": "Commentaires (facultatif)",
  "booking.commentsPlaceholder": "Y a-t-il quelque chose à savoir avant votre séance ?",
  "booking.acceptCancellationPre": "J’accepte la",
  "booking.cancellationLink": "politique d’annulation",
  "booking.acceptPrivacyPre": "J’accepte la",
  "booking.privacyLink": "politique de confidentialité",
  "booking.acceptPrivacyPost":
    "et j’accepte que mes données soient utilisées pour gérer cette réservation.",
  "booking.confirm": "Confirmer la réservation",
  "booking.confirmed": "Réservation confirmée",
  "booking.referenceIs": "Votre référence est",
  "booking.saveLink":
    "Conservez votre lien personnel pour annuler ou reporter votre séance plus tard.",
  "booking.manage": "Gérer ma réservation",
  "booking.errName": "Veuillez indiquer votre nom complet.",
  "booking.errEmail": "Veuillez indiquer une adresse e-mail valide.",
  "booking.errPhone": "Veuillez indiquer un numéro de téléphone valide.",
  "booking.errAccept": "Veuillez accepter les politiques d’annulation et de confidentialité.",
  "booking.errGeneric": "Nous n’avons pas pu finaliser votre réservation.",

  "manage.title": "Votre réservation",
  "manage.reference": "Référence {ref}",
  "manage.loading": "Chargement de votre réservation…",
  "manage.invalidTitle": "Lien de réservation invalide",
  "manage.invalidText":
    "Ce lien est invalide ou a expiré. Contactez-nous et nous vous aiderons directement.",
  "manage.status": "Statut :",
  "manage.reschedule": "Reporter",
  "manage.closeReschedule": "Fermer le report",
  "manage.cancel": "Annuler la réservation",
  "manage.cancelTitle": "Annuler cette réservation ?",
  "manage.cancelDesc":
    "Cette action est irréversible. Vous pourrez toujours effectuer une nouvelle réservation.",
  "manage.keep": "Conserver",
  "manage.yesCancel": "Oui, annuler",
  "manage.cancelledToast": "Votre réservation a été annulée.",
  "manage.movedToast": "Votre réservation a été déplacée.",
  "manage.wasCancelled": "Cette réservation a été annulée.",
  "manage.locked":
    "Cette réservation ne peut plus être modifiée en ligne. Contactez-nous directement et nous vous aiderons.",
  "manage.pickNewDate": "Choisissez une nouvelle date",
  "manage.confirmNewTime": "Confirmer le nouvel horaire",
  "manage.noAvailability": "Aucune disponibilité ce jour-là. Choisissez une autre date.",

  "status.pending_payment": "Paiement en attente",
  "status.confirmed": "Confirmée",
  "status.completed": "Terminée",
  "status.cancelled": "Annulée",
  "status.no_show": "Absence",

  "legal.contactNote":
    "Des questions sur ce document ? Contactez {business}, {address} — {email}. Ce texte est un modèle général et doit être relu par la propriétaire avant publication.",

  "seo.home.title": "Hands & Balance Wellness Center | Massage à Gand",
  "seo.home.description":
    "Séances de massage personnalisées à Gand, Belgique. Soulagez les tensions, réduisez le stress et retrouvez votre équilibre. Réservez en ligne.",
  "seo.services.title": "Services et tarifs de massage | Hands & Balance Gand",
  "seo.services.description":
    "Massages relaxants, thérapeutiques et sportifs à Gand. Durées, tarifs et contenu de chaque séance, puis réservation en ligne.",
  "seo.about.title": "À propos de Hands & Balance Wellness Center | Gand",
  "seo.about.description":
    "Un espace bien-être apaisant à Gand, avec des massages personnalisés et une approche attentive et humaine.",
  "seo.gallery.title": "Galerie | Hands & Balance Wellness Center Gand",
  "seo.gallery.description":
    "Découvrez notre espace à Gand : la salle de soins, l’ambiance et les détails qui aident à se détendre.",
  "seo.reviews.title": "Avis des clients | Hands & Balance Wellness Center",
  "seo.reviews.description":
    "Lisez les avis des clients sur leurs séances de massage au Hands & Balance Wellness Center à Gand.",
  "seo.contact.title": "Contact et adresse | Hands & Balance Wellness Center Gand",
  "seo.contact.description":
    "Hands & Balance Wellness Center, De Pintelaan 209 bus 301, 9000 Gand. Appelez ou écrivez-nous pour planifier votre séance.",
  "seo.book.title": "Réserver un massage en ligne | Hands & Balance Gand",
  "seo.book.description":
    "Choisissez votre séance, sélectionnez une date et une heure et confirmez votre réservation en ligne à Gand.",
  "seo.manage.title": "Gérer votre réservation | Hands & Balance Wellness Center",
  "seo.manage.description":
    "Consultez, reportez ou annulez votre séance de massage au Hands & Balance Wellness Center.",
};

const nl: Dict = {
  "nav.home": "Home",
  "nav.services": "Diensten",
  "nav.about": "Over ons",
  "nav.gallery": "Galerij",
  "nav.reviews": "Beoordelingen",
  "nav.contact": "Contact",
  "nav.menu": "Navigatiemenu openen",
  "nav.close": "Menu sluiten",
  "nav.language": "Taal wijzigen",
  "nav.main": "Hoofdnavigatie",

  "cta.book": "Boek een sessie",
  "cta.bookNow": "Nu boeken",
  "cta.bookYours": "Boek uw sessie",
  "cta.viewServices": "Bekijk diensten",
  "cta.viewDetails": "Bekijk details",
  "cta.viewMoreReviews": "Meer beoordelingen",
  "cta.buyGiftCard": "Cadeaubon kopen",
  "cta.call": "Bel ons",
  "cta.email": "Stuur een e-mail",
  "cta.maps": "Openen in Maps",
  "cta.instagram": "Bekijk Instagram",
  "cta.headline": "Maak tijd voor uw welzijn.",
  "cta.text": "Kies uw sessie en reserveer een moment dat u past.",

  "common.infoSoon": "Informatie volgt binnenkort.",
  "common.loading": "Laden…",
  "common.back": "Terug",
  "common.continue": "Doorgaan",
  "common.goHome": "Naar de startpagina",
  "common.backHome": "Terug naar home",
  "common.tryAgain": "Opnieuw proberen",
  "common.optional": "optioneel",
  "common.callPhone": "Bel {phone}",

  "hero.eyebrow": "Professionele massagetherapie in Gent",
  "hero.headline": "Ontspan, herstel en vind uw balans terug.",
  "hero.sub":
    "Persoonlijke massagesessies die spierspanning verlichten, stress verminderen en uw fysieke welzijn ondersteunen in een rustige en warme omgeving.",
  "hero.rating": "Score 5,0",
  "hero.reviews": "19 beoordelingen",
  "hero.location": "Gent, België",
  "hero.personal": "Persoonlijke zorg",
  "hero.imageAlt":
    "Ana Laura, massagetherapeute bij Hands & Balance Wellness Center in Gent.",

  "trust.personalized": "Persoonlijke sessies",
  "trust.professional": "Professionele zorg",
  "trust.calm": "Rustige omgeving",
  "trust.online": "Online boeken",
  "trust.located": "Gevestigd in Gent",

  "services.title": "Massagesessies op maat van u",
  "services.sub":
    "Ontdek de beschikbare sessies en kies de ervaring die het best bij uw huidige noden past.",
  "services.featured": "Uitgelicht",
  "services.notBookable":
    "Online boeken is voor deze optie nog niet mogelijk. Neem contact met ons op voor meer info.",
  "page.services.title": "Onze sessies",
  "page.services.intro":
    "Elke sessie wordt afgestemd op uw lichaam en uw doelen. Kies de behandeling die past bij hoe u zich vandaag voelt.",

  "about.eyebrow": "Over ons",
  "about.title": "Een rustige plek voor persoonlijke zorg",
  "about.value1": "Menselijke aanpak",
  "about.value2": "Persoonlijke sessies",
  "about.value3": "Aandachtige benadering",
  "about.value4": "Ontspannende sfeer",
  "about.imageAlt":
    "Ana Laura geeft een persoonlijke massagesessie bij Hands & Balance Wellness Center.",
  "about.practitionerSoon":
    "Profiel van de therapeute, talen en kwalificaties: informatie volgt binnenkort.",
  "page.about.title": "Over ons",

  "gallery.title": "Een blik binnen bij Hands & Balance",
  "gallery.empty": "De officiële foto’s worden binnenkort toegevoegd.",
  "gallery.open": "Foto op ware grootte openen",
  "gallery.lightbox": "Galerijfoto",
  "gallery.close": "Foto sluiten",
  "gallery.prev": "Vorige foto",
  "gallery.next": "Volgende foto",
  "gallery.counter": "Foto {current} van {total}",
  "page.gallery.title": "Galerij",

  "reviews.title": "Wat klanten zeggen",
  "reviews.summary": "{rating} · {count} beoordelingen",
  "reviews.stars": "{rating} op 5",
  "page.reviews.title": "Beoordelingen van klanten",

  "gift.eyebrow": "Cadeaubon",
  "gift.title": "Schenk een moment van balans",
  "gift.sub": "Een wellnesservaring voor iemand om wie u geeft.",
  "gift.rulesSoon":
    "Geldigheid, inbegrepen sessie en leveringsmogelijkheden: informatie volgt binnenkort.",
  "gift.imageAlt": "Cadeaubon van Hands & Balance Wellness Center.",

  "how.title": "Zo werkt boeken",
  "how.step1": "Kies uw sessie",
  "how.step1Text": "Bekijk de beschikbare sessies en kies wat bij u past.",
  "how.step2": "Kies datum en tijd",
  "how.step2Text": "Selecteer een beschikbare dag en tijd in de online agenda.",
  "how.step3": "Bevestig uw boeking",
  "how.step3Text": "Vul uw gegevens in, controleer het overzicht en bevestig uw reservatie.",

  "faq.title": "Veelgestelde vragen",

  "contact.eyebrow": "Contact",
  "contact.title": "Bezoek Hands & Balance Wellness Center",
  "contact.hoursSoon": "Openingsuren: informatie volgt binnenkort.",
  "contact.mapTitle": "Kaart met Hands & Balance Wellness Center in Gent",
  "page.contact.title": "Contact",

  "footer.tagline":
    "Een rustige en zorgzame plek gewijd aan professionele massagetherapie in Gent.",
  "footer.navigation": "Navigatie",
  "footer.legal": "Juridisch",
  "footer.contact": "Contact",
  "footer.privacy": "Privacybeleid",
  "footer.terms": "Algemene voorwaarden",
  "footer.cancellation": "Annuleringsbeleid",
  "footer.cookies": "Cookiebeleid",
  "footer.rights": "Alle rechten voorbehouden.",
  "footer.disclaimer":
    "Massagetherapie is een welzijnsdienst en vervangt geen medische, kinesitherapeutische of psychologische zorg.",

  "cookie.label": "Cookievoorkeuren",
  "cookie.text":
    "We gebruiken enkel cookies die strikt noodzakelijk zijn voor deze website en uw boeking. Er worden geen tracking- of analysetools geladen zonder uw toestemming.",
  "cookie.policy": "Cookiebeleid",
  "cookie.accept": "Aanvaarden",
  "cookie.reject": "Weigeren",
  "cookie.preferences": "Voorkeuren",

  "notfound.title": "Pagina niet gevonden",
  "notfound.text": "De pagina die u zoekt bestaat niet of werd verplaatst.",
  "error.title": "Deze pagina is niet geladen",
  "error.text":
    "Er ging iets mis aan onze kant. Probeer het opnieuw of ga terug naar de startpagina.",

  "booking.title": "Boek uw sessie",
  "booking.timezone": "Alle tijden worden getoond in lokale tijd ({tz}).",
  "booking.step.service": "Sessie",
  "booking.step.datetime": "Datum en tijd",
  "booking.step.details": "Uw gegevens",
  "booking.step.confirmation": "Bevestiging",
  "booking.chooseDate": "Kies een datum",
  "booking.availableTimes": "Beschikbare tijden",
  "booking.checking": "Beschikbaarheid controleren…",
  "booking.noAvailability":
    "Geen beschikbaarheid op deze dag. Kies een andere datum of neem rechtstreeks contact op.",
  "booking.fullName": "Volledige naam",
  "booking.email": "E-mail",
  "booking.countryCode": "Landcode",
  "booking.phone": "Telefoonnummer",
  "booking.comments": "Opmerkingen (optioneel)",
  "booking.commentsPlaceholder": "Iets dat we moeten weten vóór uw sessie?",
  "booking.acceptCancellationPre": "Ik aanvaard het",
  "booking.cancellationLink": "annuleringsbeleid",
  "booking.acceptPrivacyPre": "Ik aanvaard het",
  "booking.privacyLink": "privacybeleid",
  "booking.acceptPrivacyPost":
    "en ga ermee akkoord dat mijn gegevens worden gebruikt om deze boeking te beheren.",
  "booking.confirm": "Boeking bevestigen",
  "booking.confirmed": "Boeking bevestigd",
  "booking.referenceIs": "Uw referentie is",
  "booking.saveLink": "Bewaar uw persoonlijke link om later te annuleren of te verzetten.",
  "booking.manage": "Mijn boeking beheren",
  "booking.errName": "Vul uw volledige naam in.",
  "booking.errEmail": "Vul een geldig e-mailadres in.",
  "booking.errPhone": "Vul een geldig telefoonnummer in.",
  "booking.errAccept": "Aanvaard het annulerings- en privacybeleid.",
  "booking.errGeneric": "We konden uw boeking niet voltooien.",

  "manage.title": "Uw boeking",
  "manage.reference": "Referentie {ref}",
  "manage.loading": "Uw boeking laden…",
  "manage.invalidTitle": "Boekingslink niet geldig",
  "manage.invalidText":
    "Deze link is ongeldig of verlopen. Neem contact met ons op en we helpen u verder.",
  "manage.status": "Status:",
  "manage.reschedule": "Verzetten",
  "manage.closeReschedule": "Verzetten sluiten",
  "manage.cancel": "Boeking annuleren",
  "manage.cancelTitle": "Deze boeking annuleren?",
  "manage.cancelDesc": "Dit kan niet ongedaan worden gemaakt. U kunt daarna een nieuwe boeking maken.",
  "manage.keep": "Boeking behouden",
  "manage.yesCancel": "Ja, annuleren",
  "manage.cancelledToast": "Uw boeking is geannuleerd.",
  "manage.movedToast": "Uw boeking is verplaatst.",
  "manage.wasCancelled": "Deze boeking is geannuleerd.",
  "manage.locked":
    "Deze boeking kan niet meer online worden gewijzigd. Neem rechtstreeks contact met ons op.",
  "manage.pickNewDate": "Kies een nieuwe datum",
  "manage.confirmNewTime": "Nieuwe tijd bevestigen",
  "manage.noAvailability": "Geen beschikbaarheid op deze dag. Kies een andere datum.",

  "status.pending_payment": "Betaling in behandeling",
  "status.confirmed": "Bevestigd",
  "status.completed": "Voltooid",
  "status.cancelled": "Geannuleerd",
  "status.no_show": "Niet verschenen",

  "legal.contactNote":
    "Vragen over dit document? Contacteer {business}, {address} — {email}. Deze tekst is een algemeen model en moet vóór publicatie worden nagelezen door de zaakvoerster.",

  "seo.home.title": "Hands & Balance Wellness Center | Massage in Gent",
  "seo.home.description":
    "Persoonlijke massagesessies in Gent, België. Verlicht spanning, verminder stress en vind uw balans terug. Boek online in enkele klikken.",
  "seo.services.title": "Massagediensten en prijzen | Hands & Balance Gent",
  "seo.services.description":
    "Ontspannende, therapeutische en sportmassages in Gent. Bekijk duur, prijzen en inhoud van elke sessie en boek online.",
  "seo.about.title": "Over Hands & Balance Wellness Center | Gent",
  "seo.about.description":
    "Een rustige wellnessplek in Gent met persoonlijke massagetherapie en een aandachtige, menselijke aanpak.",
  "seo.gallery.title": "Galerij | Hands & Balance Wellness Center Gent",
  "seo.gallery.description":
    "Werp een blik in onze ruimte in Gent: de behandelkamer, de sfeer en de details die helpen ontspannen.",
  "seo.reviews.title": "Beoordelingen | Hands & Balance Wellness Center",
  "seo.reviews.description":
    "Lees wat klanten zeggen over hun massagesessies bij Hands & Balance Wellness Center in Gent.",
  "seo.contact.title": "Contact en locatie | Hands & Balance Wellness Center Gent",
  "seo.contact.description":
    "Vind Hands & Balance Wellness Center in De Pintelaan 209 bus 301, 9000 Gent. Bel of mail ons om uw sessie te plannen.",
  "seo.book.title": "Massage online boeken | Hands & Balance Gent",
  "seo.book.description":
    "Kies uw massagesessie, selecteer datum en tijd en bevestig uw boeking online bij Hands & Balance Wellness Center in Gent.",
  "seo.manage.title": "Uw boeking beheren | Hands & Balance Wellness Center",
  "seo.manage.description":
    "Bekijk, verzet of annuleer uw massagesessie bij Hands & Balance Wellness Center.",
};

const dictionaries: Record<LanguageCode, Dict> = { en, nl, pt, fr };

const STORAGE_KEY = "hb-language";

/** Duration wording per language, e.g. "1 hour 10 minutes" / "1 hora e 10 minutos". */
const DURATION_WORDS: Record<
  LanguageCode,
  { minute: string; minutes: string; hour: string; hours: string; join: string }
> = {
  en: { minute: "minute", minutes: "minutes", hour: "hour", hours: "hours", join: " " },
  pt: { minute: "minuto", minutes: "minutos", hour: "hora", hours: "horas", join: " e " },
  fr: { minute: "minute", minutes: "minutes", hour: "heure", hours: "heures", join: " et " },
  nl: { minute: "minuut", minutes: "minuten", hour: "uur", hours: "uur", join: " en " },
};

export function formatDurationIn(minutes: number, language: LanguageCode) {
  const w = DURATION_WORDS[language];
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hourPart = h > 0 ? `${h} ${h === 1 ? w.hour : w.hours}` : "";
  const minutePart = m > 0 ? `${m} ${m === 1 ? w.minute : w.minutes}` : "";
  if (hourPart && minutePart) return `${hourPart}${w.join}${minutePart}`;
  return hourPart || minutePart || `0 ${w.minutes}`;
}

export function formatPriceIn(cents: number, language: LanguageCode, currency = "EUR") {
  return new Intl.NumberFormat(LOCALE_BY_LANGUAGE[language], {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/** Human date for a plain YYYY-MM-DD string, timezone-safe. */
export function formatDateIn(iso: string, language: LanguageCode) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(LOCALE_BY_LANGUAGE[language], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDatePartIn(
  iso: string,
  language: LanguageCode,
  options: Intl.DateTimeFormatOptions,
) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(LOCALE_BY_LANGUAGE[language], {
    ...options,
    timeZone: "UTC",
  });
}

/** Reads a translated field from an admin-managed row, falling back to English. */
export function translated<T extends { translations?: any }>(
  row: T,
  field: string,
  language: LanguageCode,
  fallback: string | null | undefined,
): string {
  if (language === "en") return fallback ?? "";
  const all = row.translations as Record<string, Record<string, string>> | null | undefined;
  const value = all?.[language]?.[field];
  return (value && value.trim()) || fallback || "";
}

type I18nValue = {
  language: LanguageCode;
  locale: string;
  setLanguage: (code: LanguageCode) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  tr: <T extends { translations?: any }>(
    row: T,
    field: string,
    fallback: string | null | undefined,
  ) => string;
  formatDate: (iso: string) => string;
  formatDatePart: (iso: string, options: Intl.DateTimeFormatOptions) => string;
  formatDuration: (minutes: number) => string;
  formatPrice: (cents: number, currency?: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (stored && LANGUAGES.some((l) => l.code === stored)) setLanguageState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    window.localStorage.setItem(STORAGE_KEY, code);
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      const raw = dictionaries[language][key] ?? en[key];
      if (!vars) return raw;
      return raw.replace(/\{(\w+)\}/g, (_, name: string) =>
        vars[name] === undefined ? `{${name}}` : String(vars[name]),
      );
    },
    [language],
  );

  const value = useMemo<I18nValue>(
    () => ({
      language,
      locale: LOCALE_BY_LANGUAGE[language],
      setLanguage,
      t,
      tr: (row, field, fallback) => translated(row, field, language, fallback),
      formatDate: (iso) => formatDateIn(iso, language),
      formatDatePart: (iso, options) => formatDatePartIn(iso, language, options),
      formatDuration: (minutes) => formatDurationIn(minutes, language),
      formatPrice: (cents, currency = "EUR") => formatPriceIn(cents, language, currency),
    }),
    [language, setLanguage, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

/** Keeps <title> and the meta description in sync with the selected language. */
export function useLocalizedMeta(titleKey: TranslationKey, descriptionKey: TranslationKey) {
  const { t, language } = useI18n();
  useEffect(() => {
    document.title = t(titleKey);
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t(descriptionKey));
  }, [t, language, titleKey, descriptionKey]);
}
