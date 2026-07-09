# Privacy-policy text for cookieless analytics (Phases 1–2)

Draft wording to add to the **Legal → Datenschutzerklärung (privacyPolicy)** global,
in both the English (`en`) and German (`de`) locales. It covers what is now
implemented:

- **Campaign attribution** (Phase 1): a traffic-source tag captured in
  `sessionStorage` and saved alongside a waitlist/contact submission.
- **Behavioural analytics** (Phase 2): pageviews and key interactions (starting
  and submitting a form, reaching the booking widget) beaconed to our own
  `analytics-events` store, keyed only by a random per-visit session number, with
  the referrer classified into a channel (search / social / referral / direct).
  We honour Do-Not-Track / Global-Privacy-Control as an opt-out.

Retention of the behavioural events is **12 months**, then deleted; the automated
purge job ships in Phase 4 — until it is live, delete old rows manually or state
the period as an intention.

> ⚠️ Not legal advice — have whoever owns your Datenschutz review before publishing.

---

## English (`en`)

### Reach measurement, campaign attribution and usage analytics

We want to understand which of our outreach efforts (e.g. posters, QR codes,
newsletters, social-media posts, search engines) bring people to our website and
how the site is used, so we can improve it. To do this we use a **cookie-free,
first-party** approach — we do not use Google Analytics or any third-party
tracking service.

**What we process.**
- **Traffic source.** When you open our site through a tagged link — for example
  a QR code on a poster or a link with a parameter such as `?src=poster-tumsom`
  or `utm_*` parameters — we record the campaign label in that link. For untagged
  visits we record, if your browser sends it, the domain of the site you came
  from (e.g. `google.com`, `instagram.com`) and classify it into a broad channel
  (search, social, referral, or direct). We do **not** store the full address of
  the referring page.
- **Usage.** We record which pages of our site you view and a few key
  interactions — starting a form, submitting a form, and reaching the booking
  widget — together with the site language.
- **Session number.** The above is tied to a randomly generated session number
  stored in your browser's **session storage**. It is not a cookie, is confined
  to your current browser session, and is deleted automatically when you close
  the browser tab.

**What we do not do.** We do **not** store your IP address, we do **not** track
you across other websites, we create **no** advertising or personality profiles,
and we do **not** share this data with third parties. All data is stored on our
own infrastructure within the EU. If you submit a form (the membership waitlist
or the contact form), the campaign label is saved together with your submission
so we can see which outreach led to it.

**Legal basis.** The processing is based on our legitimate interest
(Art. 6(1)(f) GDPR) in measuring and improving the reach, usability and
effectiveness of our non-commercial outreach as a student initiative.

**Retention.** The session number never leaves your browser session. Usage
events are stored for up to 12 months and then deleted. A campaign label saved
with a form submission is kept for as long as that submission is kept and deleted
with it.

**Opt-out and your rights.** If your browser sends a "Do Not Track" or "Global
Privacy Control" signal, we do not collect any usage analytics from you. You may
also object to this processing at any time (Art. 21 GDPR) and request access to,
correction or deletion of your data at info@codingforchange.com.

---

## German (`de`)

### Reichweitenmessung, Kampagnen-Zuordnung und Nutzungsanalyse

Wir möchten nachvollziehen, welche unserer Maßnahmen (z. B. Plakate, QR-Codes,
Newsletter, Social-Media-Beiträge, Suchmaschinen) Besucher:innen auf unsere
Website bringen und wie die Website genutzt wird, um sie zu verbessern. Dafür
setzen wir einen **cookiefreien, eigenen** Ansatz ein – wir verwenden weder
Google Analytics noch einen anderen Drittanbieter-Dienst zur Nachverfolgung.

**Was wir verarbeiten.**
- **Herkunft.** Wenn Sie unsere Website über einen markierten Link öffnen – etwa
  einen QR-Code auf einem Plakat oder einen Link mit einem Parameter wie
  `?src=poster-tumsom` oder `utm_*`-Parametern –, erfassen wir die im Link
  enthaltene Kampagnen-Bezeichnung. Bei nicht markierten Aufrufen erfassen wir,
  sofern Ihr Browser sie übermittelt, die Domain der Website, von der Sie kamen
  (z. B. `google.com`, `instagram.com`), und ordnen sie einem groben Kanal zu
  (Suche, Social Media, Verweis oder Direktzugriff). Die vollständige Adresse der
  verweisenden Seite speichern wir **nicht**.
- **Nutzung.** Wir erfassen, welche Seiten unserer Website Sie aufrufen, sowie
  einige zentrale Interaktionen – das Starten eines Formulars, das Absenden eines
  Formulars und das Erreichen des Buchungs-Widgets – zusammen mit der
  Spracheinstellung.
- **Sitzungsnummer.** Diese Angaben werden mit einer zufällig erzeugten
  Sitzungsnummer verknüpft, die im **Session-Storage** Ihres Browsers gespeichert
  wird. Es handelt sich nicht um ein Cookie; die Nummer ist auf Ihre aktuelle
  Browser-Sitzung beschränkt und wird beim Schließen des Browser-Tabs automatisch
  gelöscht.

**Was wir nicht tun.** Wir speichern **nicht** Ihre IP-Adresse, verfolgen Sie
**nicht** über andere Websites hinweg, erstellen **keine** Werbe- oder
Persönlichkeitsprofile und geben diese Daten **nicht** an Dritte weiter. Alle
Daten werden auf unserer eigenen Infrastruktur innerhalb der EU gespeichert. Wenn
Sie ein Formular absenden (die Mitglieder-Warteliste oder das Kontaktformular),
wird die Kampagnen-Bezeichnung zusammen mit Ihrer Übermittlung gespeichert, damit
wir erkennen können, welche Maßnahme dazu geführt hat.

**Rechtsgrundlage.** Die Verarbeitung beruht auf unserem berechtigten Interesse
(Art. 6 Abs. 1 lit. f DSGVO) an der Messung und Verbesserung der Reichweite,
Benutzerfreundlichkeit und Wirksamkeit unserer nicht-kommerziellen
Öffentlichkeitsarbeit als studentische Initiative.

**Speicherdauer.** Die Sitzungsnummer verlässt Ihre Browser-Sitzung nicht.
Nutzungsereignisse werden bis zu 12 Monate gespeichert und anschließend gelöscht.
Eine mit einer Formular-Übermittlung gespeicherte Kampagnen-Bezeichnung wird so
lange gespeichert wie die jeweilige Übermittlung und mit dieser gelöscht.

**Widerspruch und Ihre Rechte.** Übermittelt Ihr Browser ein „Do Not Track"- oder
„Global Privacy Control"-Signal, erheben wir keine Nutzungsanalyse von Ihnen. Sie
können dieser Verarbeitung außerdem jederzeit widersprechen (Art. 21 DSGVO) und
Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen – unter
info@codingforchange.com.
