-- Extensions
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');
CREATE TYPE public.appointment_status AS ENUM ('pending_payment','confirmed','completed','cancelled','no_show');
CREATE TYPE public.payment_status AS ENUM ('pending','paid','failed','refunded','partially_refunded','not_required');
CREATE TYPE public.payment_mode AS ENUM ('full_payment','deposit','pay_on_site');
CREATE TYPE public.email_log_status AS ENUM ('pending','sent','failed');

-- Shared updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ROLES
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile" ON public.profiles FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SERVICES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  duration_minutes int NOT NULL CHECK (duration_minutes > 0),
  price_cents int NOT NULL CHECK (price_cents >= 0),
  description text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  internal_notes text NOT NULL DEFAULT '',
  image_url text,
  buffer_minutes int NOT NULL DEFAULT 0,
  online_payment_enabled boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  is_bookable boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  is_archived boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active services" ON public.services FOR SELECT TO anon, authenticated USING (is_active AND NOT is_archived);
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BUSINESS SETTINGS (single row)
CREATE TABLE public.business_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL DEFAULT 'Hands & Balance Wellness Center',
  phone text NOT NULL DEFAULT '',
  phone_international text NOT NULL DEFAULT '',
  whatsapp_number text,
  email text NOT NULL DEFAULT '',
  address_line1 text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  postal_code text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  timezone text NOT NULL DEFAULT 'Europe/Brussels',
  currency text NOT NULL DEFAULT 'EUR',
  default_language text NOT NULL DEFAULT 'en',
  instagram_url text,
  instagram_handle text,
  reviews_url text,
  cancellation_policy text NOT NULL DEFAULT 'You can cancel or reschedule up to 12 hours before the appointment time.',
  cancellation_window_hours int NOT NULL DEFAULT 12,
  payment_mode public.payment_mode NOT NULL DEFAULT 'pay_on_site',
  deposit_cents int NOT NULL DEFAULT 0,
  slot_interval_minutes int NOT NULL DEFAULT 15,
  gap_between_sessions_minutes int NOT NULL DEFAULT 15,
  min_notice_hours int NOT NULL DEFAULT 12,
  max_advance_days int NOT NULL DEFAULT 90,
  show_business_hours boolean NOT NULL DEFAULT false,
  about_text text NOT NULL DEFAULT '',
  practitioner_name text,
  practitioner_bio text,
  practitioner_languages text,
  practitioner_experience text,
  practitioner_certifications text,
  gift_card_validity text,
  gift_card_rules text,
  emails_configured boolean NOT NULL DEFAULT false,
  admin_notification_email text,
  internal_notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.business_settings TO anon;
GRANT SELECT, UPDATE ON public.business_settings TO authenticated;
GRANT ALL ON public.business_settings TO service_role;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads settings" ON public.business_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update settings" ON public.business_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER business_settings_updated BEFORE UPDATE ON public.business_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BUSINESS HOURS
CREATE TABLE public.business_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday int NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  is_open boolean NOT NULL DEFAULT false,
  open_time time NOT NULL DEFAULT '09:00',
  close_time time NOT NULL DEFAULT '18:00',
  break_start time,
  break_end time,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (weekday)
);
GRANT SELECT ON public.business_hours TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_hours TO authenticated;
GRANT ALL ON public.business_hours TO service_role;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads hours" ON public.business_hours FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage hours" ON public.business_hours FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- AVAILABILITY EXCEPTIONS (extra availability on a specific date)
CREATE TABLE public.availability_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exception_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability_exceptions TO authenticated;
GRANT ALL ON public.availability_exceptions TO service_role;
ALTER TABLE public.availability_exceptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage availability exceptions" ON public.availability_exceptions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- BLOCKED PERIODS (holidays, blocks)
CREATE TABLE public.blocked_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date date NOT NULL,
  end_date date NOT NULL,
  start_time time,
  end_time time,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_periods TO authenticated;
GRANT ALL ON public.blocked_periods TO service_role;
ALTER TABLE public.blocked_periods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage blocked periods" ON public.blocked_periods FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- CUSTOMERS
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  country_code text NOT NULL DEFAULT '+32',
  preferred_language text NOT NULL DEFAULT 'en',
  internal_notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage customers" ON public.customers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER customers_updated BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- APPOINTMENTS
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  manage_token text NOT NULL UNIQUE,
  token_expires_at timestamptz NOT NULL DEFAULT (now() + interval '180 days'),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  service_name text NOT NULL,
  appointment_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  duration_minutes int NOT NULL,
  timezone text NOT NULL DEFAULT 'Europe/Brussels',
  status public.appointment_status NOT NULL DEFAULT 'pending_payment',
  payment_status public.payment_status NOT NULL DEFAULT 'not_required',
  payment_mode public.payment_mode NOT NULL DEFAULT 'pay_on_site',
  price_cents int NOT NULL,
  amount_due_cents int NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'EUR',
  customer_comments text NOT NULL DEFAULT '',
  internal_notes text NOT NULL DEFAULT '',
  accepted_cancellation_policy boolean NOT NULL DEFAULT false,
  accepted_privacy_policy boolean NOT NULL DEFAULT false,
  slot tsrange GENERATED ALWAYS AS (tsrange((appointment_date + start_time), (appointment_date + end_time), '[)')) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);
ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_no_overlap
  EXCLUDE USING gist (slot WITH &&)
  WHERE (status IN ('pending_payment','confirmed','completed'));
CREATE INDEX appointments_date_idx ON public.appointments (appointment_date, start_time);
CREATE INDEX appointments_status_idx ON public.appointments (status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage appointments" ON public.appointments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER appointments_updated BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- APPOINTMENT HISTORY
CREATE TABLE public.appointment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  action text NOT NULL,
  details text NOT NULL DEFAULT '',
  actor text NOT NULL DEFAULT 'system',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX appointment_history_appt_idx ON public.appointment_history (appointment_id, created_at DESC);
GRANT SELECT, INSERT ON public.appointment_history TO authenticated;
GRANT ALL ON public.appointment_history TO service_role;
ALTER TABLE public.appointment_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read history" ON public.appointment_history FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins write history" ON public.appointment_history FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));

-- PAYMENTS
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  amount_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  status public.payment_status NOT NULL DEFAULT 'pending',
  provider text NOT NULL DEFAULT 'stripe',
  stripe_payment_id text,
  stripe_session_id text,
  refunded_cents int NOT NULL DEFAULT 0,
  refund_requested boolean NOT NULL DEFAULT false,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER payments_updated BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- EMAIL LOGS
CREATE TABLE public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  recipient text NOT NULL,
  template text NOT NULL,
  status public.email_log_status NOT NULL DEFAULT 'pending',
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.email_logs TO authenticated;
GRANT ALL ON public.email_logs TO service_role;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage email logs" ON public.email_logs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- GALLERY
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  alt_text text NOT NULL DEFAULT '',
  caption text,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published images" ON public.gallery_images FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "Admins manage gallery" ON public.gallery_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- REVIEWS
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  rating int NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  content text NOT NULL,
  language text NOT NULL DEFAULT 'en',
  source text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- FAQ
CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  language text NOT NULL DEFAULT 'en',
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faq_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faq_items TO authenticated;
GRANT ALL ON public.faq_items TO service_role;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published faq" ON public.faq_items FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "Admins manage faq" ON public.faq_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER faq_updated BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- GIFT CARDS
CREATE TABLE public.gift_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  amount_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  purchaser_name text,
  purchaser_email text,
  recipient_name text,
  personal_message text,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  valid_until date,
  is_redeemed boolean NOT NULL DEFAULT false,
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.gift_cards TO authenticated;
GRANT ALL ON public.gift_cards TO service_role;
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage gift cards" ON public.gift_cards FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- SEED DATA
INSERT INTO public.services (slug, name, duration_minutes, price_cents, description, notes, internal_notes, sort_order, is_featured, is_bookable) VALUES
('pain-free-lower-body','Pain Free Session – Lower Body',30,3500,'A personalized session carried out according to the needs you share before your appointment.','Session details are confirmed with you before the appointment.','',1,false,true),
('pain-free-upper-body','Pain Free Session – Upper Body',30,3500,'A personalized session carried out according to the needs you share before your appointment.','Session details are confirmed with you before the appointment.','',2,false,true),
('quick-chair-therapy','Quick Chair Therapy',20,2000,'A personalized session carried out according to the needs you share before your appointment.','Session details are confirmed with you before the appointment.','',3,false,true),
('sports-session','Sports Session',60,6000,'A personalized session carried out according to the needs you share before your appointment.','Session details are confirmed with you before the appointment.','',4,true,true),
('full-body-anti-stress-feet-spa','Full Body Anti-Stress + Feet SPA',70,7000,'A personalized session carried out according to the needs you share before your appointment.','Session details are confirmed with you before the appointment.','',5,true,true),
('lymphatic-drainage','Lymphatic Drainage Session',60,6000,'A personalized session carried out according to the needs you share before your appointment.','Session details are confirmed with you before the appointment.','',6,false,true),
('gift-card','Gift Card',80,7500,'A wellness gift for someone you care about. Details are confirmed at purchase.','Gift card conditions will be confirmed before purchase.','ACTION REQUIRED: the Gift Card duration (currently 1 hour 20 minutes) and its usage rules must be confirmed with the owner before final publication.',7,true,false);

INSERT INTO public.business_settings (phone, phone_international, email, address_line1, city, postal_code, country, instagram_handle, instagram_url, about_text, admin_notification_email, internal_notes)
VALUES ('0495 74 30 85','+32 495 74 30 85','anabelamagalhaes1@hotmail.com','De Pintelaan 209 bus 301','Gent','9000','Belgium','@hands_balance_wellnesscenter','https://www.instagram.com/hands_balance_wellnesscenter/','Hands & Balance Wellness Center is a calm and supportive space focused on professional massage therapy. Our sessions are designed to relieve muscle tension, reduce stress and restore balance to the body. Through attentive touch and personalized treatments, we help you relax, recover and feel more connected to your physical well-being.','anabelamagalhaes1@hotmail.com','Opening hours, WhatsApp number, payment mode and gift card rules are not confirmed yet.');

INSERT INTO public.business_hours (weekday, is_open, open_time, close_time) VALUES
(0,false,'09:00','18:00'),(1,false,'09:00','18:00'),(2,false,'09:00','18:00'),(3,false,'09:00','18:00'),(4,false,'09:00','18:00'),(5,false,'09:00','18:00'),(6,false,'09:00','18:00');

INSERT INTO public.reviews (author_name, rating, content, language, sort_order) VALUES
('Juliana Prado dos Santos',5,'A Ana Laura é uma pessoa que preza pelo atendimento humanizado, e isso faz toda diferença em seu trabalho. Me senti muito confortável e bem com a sua massagem. Uma ótima profissional!','pt',1),
('Daniel Berlofa',5,'My wife surprised me with a relaxing massage as a gift. It was truly rejuvenating. I was tired and stressed, but after the massage, I felt much better and had several great days afterward. I genuinely recommend it!','en',2),
('Elizabeth Lahaye',5,'Fully recommend! The perfect way to relax and treat yourself to a caring massage. The experience is enhanced with aromatherapy and excellent quality products.','en',3);

INSERT INTO public.faq_items (question, answer, sort_order) VALUES
('How can I book a session?','You can book online through this website: choose your session, select an available date and time, and confirm your booking.',1),
('Can I reschedule my appointment?','Yes. You can reschedule up to 12 hours before the appointment time using the secure link in your booking confirmation.',2),
('What is the cancellation policy?','You can cancel or reschedule up to 12 hours before the appointment time.',3),
('Where is the wellness center located?','De Pintelaan 209 bus 301, 9000 Gent, Belgium.',4),
('Which payment methods are accepted?','Available payment methods will be shown during the booking process.',5),
('How should I prepare for my appointment?','Information coming soon.',6),
('Can I purchase a Gift Card?','Gift Card information coming soon. Please contact us for details.',7);