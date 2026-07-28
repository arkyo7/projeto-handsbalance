
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.faq_items ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.gallery_images ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS translations jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Services translations (name / description / notes)
UPDATE public.services SET translations = '{
 "pt":{"name":"Sessão Sem Dor – Parte Inferior do Corpo","description":"Uma sessão personalizada, realizada de acordo com as necessidades que partilha antes da sua marcação.","notes":"Os detalhes da sessão são confirmados consigo antes da marcação."},
 "fr":{"name":"Séance Sans Douleur – Bas du Corps","description":"Une séance personnalisée, réalisée selon les besoins que vous partagez avant votre rendez-vous.","notes":"Les détails de la séance sont confirmés avec vous avant le rendez-vous."},
 "nl":{"name":"Pijnvrije Sessie – Onderlichaam","description":"Een persoonlijke sessie, afgestemd op de wensen die u vóór uw afspraak deelt.","notes":"De details van de sessie worden vooraf met u besproken."}}'::jsonb WHERE slug = 'pain-free-lower-body';

UPDATE public.services SET translations = '{
 "pt":{"name":"Sessão Sem Dor – Parte Superior do Corpo","description":"Uma sessão personalizada, realizada de acordo com as necessidades que partilha antes da sua marcação.","notes":"Os detalhes da sessão são confirmados consigo antes da marcação."},
 "fr":{"name":"Séance Sans Douleur – Haut du Corps","description":"Une séance personnalisée, réalisée selon les besoins que vous partagez avant votre rendez-vous.","notes":"Les détails de la séance sont confirmés avec vous avant le rendez-vous."},
 "nl":{"name":"Pijnvrije Sessie – Bovenlichaam","description":"Een persoonlijke sessie, afgestemd op de wensen die u vóór uw afspraak deelt.","notes":"De details van de sessie worden vooraf met u besproken."}}'::jsonb WHERE slug = 'pain-free-upper-body';

UPDATE public.services SET translations = '{
 "pt":{"name":"Terapia Rápida em Cadeira","description":"Uma sessão personalizada, realizada de acordo com as necessidades que partilha antes da sua marcação.","notes":"Os detalhes da sessão são confirmados consigo antes da marcação."},
 "fr":{"name":"Thérapie Rapide sur Chaise","description":"Une séance personnalisée, réalisée selon les besoins que vous partagez avant votre rendez-vous.","notes":"Les détails de la séance sont confirmés avec vous avant le rendez-vous."},
 "nl":{"name":"Snelle Stoelmassage","description":"Een persoonlijke sessie, afgestemd op de wensen die u vóór uw afspraak deelt.","notes":"De details van de sessie worden vooraf met u besproken."}}'::jsonb WHERE slug = 'quick-chair-therapy';

UPDATE public.services SET translations = '{
 "pt":{"name":"Sessão Desportiva","description":"Uma sessão personalizada, realizada de acordo com as necessidades que partilha antes da sua marcação.","notes":"Os detalhes da sessão são confirmados consigo antes da marcação."},
 "fr":{"name":"Séance Sportive","description":"Une séance personnalisée, réalisée selon les besoins que vous partagez avant votre rendez-vous.","notes":"Les détails de la séance sont confirmés avec vous avant le rendez-vous."},
 "nl":{"name":"Sportsessie","description":"Een persoonlijke sessie, afgestemd op de wensen die u vóór uw afspraak deelt.","notes":"De details van de sessie worden vooraf met u besproken."}}'::jsonb WHERE slug = 'sports-session';

UPDATE public.services SET translations = '{
 "pt":{"name":"Antisstress Corpo Inteiro + SPA de Pés","description":"Uma sessão personalizada, realizada de acordo com as necessidades que partilha antes da sua marcação.","notes":"Os detalhes da sessão são confirmados consigo antes da marcação."},
 "fr":{"name":"Anti-Stress Corps Entier + SPA des Pieds","description":"Une séance personnalisée, réalisée selon les besoins que vous partagez avant votre rendez-vous.","notes":"Les détails de la séance sont confirmés avec vous avant le rendez-vous."},
 "nl":{"name":"Anti-Stress Volledig Lichaam + Voeten-SPA","description":"Een persoonlijke sessie, afgestemd op de wensen die u vóór uw afspraak deelt.","notes":"De details van de sessie worden vooraf met u besproken."}}'::jsonb WHERE slug = 'full-body-anti-stress-feet-spa';

UPDATE public.services SET translations = '{
 "pt":{"name":"Sessão de Drenagem Linfática","description":"Uma sessão personalizada, realizada de acordo com as necessidades que partilha antes da sua marcação.","notes":"Os detalhes da sessão são confirmados consigo antes da marcação."},
 "fr":{"name":"Séance de Drainage Lymphatique","description":"Une séance personnalisée, réalisée selon les besoins que vous partagez avant votre rendez-vous.","notes":"Les détails de la séance sont confirmés avec vous avant le rendez-vous."},
 "nl":{"name":"Lymfedrainage Sessie","description":"Een persoonlijke sessie, afgestemd op de wensen die u vóór uw afspraak deelt.","notes":"De details van de sessie worden vooraf met u besproken."}}'::jsonb WHERE slug = 'lymphatic-drainage';

UPDATE public.services SET translations = '{
 "pt":{"name":"Cartão Presente","description":"Um presente de bem-estar para alguém especial. Os detalhes são confirmados na compra.","notes":"As condições do cartão presente serão confirmadas antes da compra."},
 "fr":{"name":"Carte Cadeau","description":"Un cadeau bien-être pour une personne qui vous est chère. Les détails sont confirmés à l''achat.","notes":"Les conditions de la carte cadeau seront confirmées avant l''achat."},
 "nl":{"name":"Cadeaubon","description":"Een wellnesscadeau voor iemand om wie u geeft. De details worden bij aankoop bevestigd.","notes":"De voorwaarden van de cadeaubon worden vóór aankoop bevestigd."}}'::jsonb WHERE slug = 'gift-card';

-- FAQ translations
UPDATE public.faq_items SET translations = '{
 "pt":{"question":"Como posso marcar uma sessão?","answer":"Pode marcar online através deste site: escolha a sua sessão, selecione uma data e hora disponíveis e confirme a sua marcação."},
 "fr":{"question":"Comment puis-je réserver une séance ?","answer":"Vous pouvez réserver en ligne sur ce site : choisissez votre séance, sélectionnez une date et une heure disponibles, puis confirmez votre réservation."},
 "nl":{"question":"Hoe kan ik een sessie boeken?","answer":"U kunt online boeken via deze website: kies uw sessie, selecteer een beschikbare datum en tijd en bevestig uw boeking."}}'::jsonb WHERE sort_order = 1;

UPDATE public.faq_items SET translations = '{
 "pt":{"question":"Posso remarcar a minha marcação?","answer":"Sim. Pode remarcar até 12 horas antes da hora da marcação, através do link seguro na confirmação da sua reserva."},
 "fr":{"question":"Puis-je reporter mon rendez-vous ?","answer":"Oui. Vous pouvez le reporter jusqu''à 12 heures avant l''heure du rendez-vous, via le lien sécurisé de votre confirmation."},
 "nl":{"question":"Kan ik mijn afspraak verzetten?","answer":"Ja. U kunt tot 12 uur vóór de afspraak verzetten via de beveiligde link in uw bevestiging."}}'::jsonb WHERE sort_order = 2;

UPDATE public.faq_items SET translations = '{
 "pt":{"question":"Qual é a política de cancelamento?","answer":"Pode cancelar ou remarcar até 12 horas antes da hora da marcação."},
 "fr":{"question":"Quelle est la politique d''annulation ?","answer":"Vous pouvez annuler ou reporter jusqu''à 12 heures avant l''heure du rendez-vous."},
 "nl":{"question":"Wat is het annuleringsbeleid?","answer":"U kunt tot 12 uur vóór de afspraak annuleren of verzetten."}}'::jsonb WHERE sort_order = 3;

UPDATE public.faq_items SET translations = '{
 "pt":{"question":"Onde fica o centro de bem-estar?","answer":"De Pintelaan 209 bus 301, 9000 Gent, Bélgica."},
 "fr":{"question":"Où se situe le centre de bien-être ?","answer":"De Pintelaan 209 bus 301, 9000 Gand, Belgique."},
 "nl":{"question":"Waar bevindt het wellnesscentrum zich?","answer":"De Pintelaan 209 bus 301, 9000 Gent, België."}}'::jsonb WHERE sort_order = 4;

UPDATE public.faq_items SET translations = '{
 "pt":{"question":"Que métodos de pagamento são aceites?","answer":"Os métodos de pagamento disponíveis serão apresentados durante o processo de marcação."},
 "fr":{"question":"Quels moyens de paiement sont acceptés ?","answer":"Les moyens de paiement disponibles seront indiqués pendant la réservation."},
 "nl":{"question":"Welke betaalmethodes worden aanvaard?","answer":"De beschikbare betaalmethodes worden tijdens het boeken getoond."}}'::jsonb WHERE sort_order = 5;

UPDATE public.faq_items SET translations = '{
 "pt":{"question":"Como devo preparar-me para a minha marcação?","answer":"Informação em breve."},
 "fr":{"question":"Comment dois-je me préparer à mon rendez-vous ?","answer":"Informations à venir."},
 "nl":{"question":"Hoe bereid ik mij voor op mijn afspraak?","answer":"Informatie volgt binnenkort."}}'::jsonb WHERE sort_order = 6;

UPDATE public.faq_items SET translations = '{
 "pt":{"question":"Posso comprar um Cartão Presente?","answer":"Informação sobre o Cartão Presente em breve. Contacte-nos para mais detalhes."},
 "fr":{"question":"Puis-je acheter une Carte Cadeau ?","answer":"Informations sur la Carte Cadeau à venir. Contactez-nous pour plus de détails."},
 "nl":{"question":"Kan ik een Cadeaubon kopen?","answer":"Informatie over de cadeaubon volgt binnenkort. Neem contact met ons op voor details."}}'::jsonb WHERE sort_order = 7;

-- Business settings translations (about text + cancellation policy)
UPDATE public.business_settings SET translations = '{
 "pt":{"about_text":"O Hands & Balance Wellness Center é um espaço calmo e acolhedor dedicado à massagem terapêutica profissional. As nossas sessões foram concebidas para aliviar a tensão muscular, reduzir o stress e devolver equilíbrio ao corpo. Com um toque atento e tratamentos personalizados, ajudamo-lo a relaxar, recuperar e sentir-se mais ligado ao seu bem-estar físico.","cancellation_policy":"Pode cancelar ou remarcar até 12 horas antes da hora da marcação."},
 "fr":{"about_text":"Hands & Balance Wellness Center est un espace calme et bienveillant dédié à la massothérapie professionnelle. Nos séances sont conçues pour soulager les tensions musculaires, réduire le stress et rétablir l''équilibre du corps. Par un toucher attentif et des soins personnalisés, nous vous aidons à vous détendre, à récupérer et à vous reconnecter à votre bien-être physique.","cancellation_policy":"Vous pouvez annuler ou reporter jusqu''à 12 heures avant l''heure du rendez-vous."},
 "nl":{"about_text":"Hands & Balance Wellness Center is een rustige en zorgzame plek gewijd aan professionele massagetherapie. Onze sessies zijn ontworpen om spierspanning te verlichten, stress te verminderen en het lichaam weer in balans te brengen. Met aandachtige handen en persoonlijke behandelingen helpen wij u te ontspannen, te herstellen en u beter te voelen in uw lichaam.","cancellation_policy":"U kunt tot 12 uur vóór de afspraak annuleren of verzetten."}}'::jsonb;

-- Official gallery photography
INSERT INTO public.gallery_images (image_url, alt_text, is_featured, is_published, sort_order, translations) VALUES
('/images/hands-balance/gallery-treatment-room-01.webp','The treatment room at Hands & Balance Wellness Center, prepared for a massage session.', true, true, 1,
 '{"pt":{"alt_text":"A sala de tratamento do Hands & Balance Wellness Center, preparada para uma sessão de massagem."},"fr":{"alt_text":"La salle de soins de Hands & Balance Wellness Center, préparée pour une séance de massage."},"nl":{"alt_text":"De behandelruimte van Hands & Balance Wellness Center, klaar voor een massagesessie."}}'::jsonb),
('/images/hands-balance/gallery-treatment-room-02.webp','A calm corner of the treatment room with soft lighting and warm textiles.', false, true, 2,
 '{"pt":{"alt_text":"Um canto tranquilo da sala de tratamento, com luz suave e têxteis acolhedores."},"fr":{"alt_text":"Un coin paisible de la salle de soins, avec un éclairage doux et des textiles chaleureux."},"nl":{"alt_text":"Een rustige hoek van de behandelruimte met zacht licht en warme textiel."}}'::jsonb),
('/images/hands-balance/gallery-treatment-room-03.webp','The massage table prepared with fresh linens before a session.', false, true, 3,
 '{"pt":{"alt_text":"A marquesa de massagem preparada com lençóis lavados antes de uma sessão."},"fr":{"alt_text":"La table de massage préparée avec du linge frais avant une séance."},"nl":{"alt_text":"De massagetafel met vers linnen, klaar voor een sessie."}}'::jsonb),
('/images/hands-balance/gallery-chair-therapy.webp','The chair used for quick chair therapy sessions.', false, true, 4,
 '{"pt":{"alt_text":"A cadeira utilizada nas sessões de terapia rápida em cadeira."},"fr":{"alt_text":"La chaise utilisée pour les séances de thérapie rapide sur chaise."},"nl":{"alt_text":"De stoel die wordt gebruikt voor snelle stoelmassages."}}'::jsonb),
('/images/hands-balance/gallery-wellness-details.webp','Wellness details: oils, candles and natural elements used during sessions.', false, true, 5,
 '{"pt":{"alt_text":"Detalhes de bem-estar: óleos, velas e elementos naturais utilizados nas sessões."},"fr":{"alt_text":"Détails bien-être : huiles, bougies et éléments naturels utilisés pendant les séances."},"nl":{"alt_text":"Wellnessdetails: oliën, kaarsen en natuurlijke elementen tijdens de sessies."}}'::jsonb),
('/images/hands-balance/gallery-welcome-tea.webp','A welcome tea served before the start of a session.', false, true, 6,
 '{"pt":{"alt_text":"Um chá de boas-vindas servido antes do início de uma sessão."},"fr":{"alt_text":"Un thé de bienvenue servi avant le début d''une séance."},"nl":{"alt_text":"Een welkomstthee, geserveerd voor aanvang van een sessie."}}'::jsonb),
('/images/hands-balance/gallery-feet-spa.webp','The feet SPA ritual included in the full body anti-stress session.', false, true, 7,
 '{"pt":{"alt_text":"O ritual de SPA de pés incluído na sessão antisstress de corpo inteiro."},"fr":{"alt_text":"Le rituel SPA des pieds inclus dans la séance anti-stress corps entier."},"nl":{"alt_text":"Het voeten-SPA-ritueel uit de anti-stress sessie voor het volledige lichaam."}}'::jsonb),
('/images/hands-balance/gallery-massage-preparation.webp','Preparation of oils and towels before a personalized massage.', false, true, 8,
 '{"pt":{"alt_text":"Preparação de óleos e toalhas antes de uma massagem personalizada."},"fr":{"alt_text":"Préparation des huiles et des serviettes avant un massage personnalisé."},"nl":{"alt_text":"Voorbereiding van oliën en handdoeken vóór een persoonlijke massage."}}'::jsonb);
