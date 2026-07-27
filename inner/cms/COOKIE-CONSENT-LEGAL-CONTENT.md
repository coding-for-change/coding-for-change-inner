# Datenschutz updates for consent + Google Ads tracking

Paste-ready blocks for the **Legal global** in the CMS. Same flow as
`LEGAL-CONTENT.md`.

**The Impressum needs no changes.** It describes the legal entity, not data
processing. Leave `/imprint` exactly as it is.

⚠️ This is drafted to match what the code actually does, but I'm not your lawyer.
Two items below are **pre-existing gaps unrelated to this PR** (cal.com and the
locale cookie) — worth a read-through by someone who can sign off for the e.V.

---

## What changes, in order of importance

| # | Action | Why |
|---|---|---|
| 1 | **Replace §2's second sentence** | It currently claims "no cookies … no third-party analytics". That becomes **false** on deploy. This is the one that matters. |
| 2 | **Replace §7 entirely** | Reach measurement is no longer cookie-free-and-legitimate-interest. It's now consent-based, uses `localStorage`, and has a **persistent** visitor id. |
| 3 | **Insert new §8, §9, §10, §11** after §7 | Consent management, Google Ads, GA4, cal.com. |
| 4 | **Renumber the old §8–§13** → §12–§17 | See mapping below. |
| 5 | **Add the cookie table** into new §8 | Audit criterion: a visitor must be able to see what is stored. |
| 6 | **Update the date in the last section** | Currently "July 2026". |

### Renumbering map

| Old | New | Title |
|---|---|---|
| 8 | 12 | Google Fonts |
| 9 | 13 | Links to Social Networks |
| 10 | 14 | SSL/TLS Encryption |
| 11 | 15 | Your Rights |
| 12 | 16 | Right to Lodge a Complaint |
| 13 | 17 | Currency |

### Two pre-existing gaps this fixes in passing

- **cal.com is currently undisclosed.** The booking widget embeds
  `app.cal.com` in an iframe, which transmits the visitor's IP to Cal.com Inc.
  (USA) as soon as it loads. That's a third-country transfer with no mention in
  the current policy. New §11 covers it.
- **The `cfc-locale` cookie is currently undisclosed** — and contradicted by §2's
  "no cookies" claim. It's lawful without consent (a language preference the
  visitor actively chose is strictly necessary under EDPB WP194), but it must
  still appear in the cookie table.

---

## 1. §2 — replace the tracking sentence

**Find** (EN): *"This website uses no cookies and does not integrate any
third-party analytics or tracking services (e.g. Google Analytics)."*
**Replace with:**

> This website uses cookies and comparable storage only where they are strictly
> necessary for operation, or where you have consented. Nothing that is not
> strictly necessary is stored before you have made a choice in the cookie
> banner. You can change or withdraw that choice at any time via “Cookie
> settings” in the footer. Details of every purpose, recipient and storage
> duration are set out in sections 7 to 11.

**DE** — find: *„Diese Website verwendet keine Cookies und bindet keine
Analyse- oder Tracking-Dienste Dritter (z. B. Google Analytics) ein."*
Replace with:

> Diese Website verwendet Cookies und vergleichbare Speichertechniken nur, soweit
> sie für den Betrieb unbedingt erforderlich sind oder Sie eingewilligt haben.
> Vor Ihrer Entscheidung im Cookie-Banner wird nichts gespeichert, was nicht
> unbedingt erforderlich ist. Sie können Ihre Entscheidung jederzeit über
> „Cookie-Einstellungen" im Footer ändern oder widerrufen. Die Einzelheiten zu
> Zwecken, Empfängern und Speicherdauern finden Sie in den Abschnitten 7 bis 11.

---

## 2. §7 — replace the whole section

### EN — "7. Reach Measurement and Usage Analytics"

> We operate our own reach measurement on this website in order to understand
> which campaigns and channels bring people to us, and which pages are actually
> used. It runs on our own servers in Germany; the data is not passed to any
> third party for this purpose.
>
> **What is recorded:** the campaign label from the link you arrived through
> (e.g. `?src=poster-tumsom` or standard `utm_*` parameters), the domain that
> referred you, the pages you view, and interactions such as starting a form or
> completing a booking.
>
> **Identifiers:** a random session id, stored for the duration of your visit,
> and a random visitor id stored for **182 days**. The visitor id is what allows
> us to connect a later visit to the campaign you originally arrived through — if
> you scan a poster code in May and sign up in July, we can attribute that
> signup to the poster. We do **not** store your IP address, we do not create a
> fingerprint, and we do not combine this data with any other source.
>
> **Legal basis:** your consent, Art. 6(1)(a) GDPR, together with § 25(1) TDDDG
> for the storage on your device. Nothing is read or written before you consent,
> and withdrawing consent deletes the stored identifiers from your browser
> immediately.
>
> **Storage duration:** event data is deleted automatically after 12 months.
> Records created because you submitted something to us (waitlist, contact,
> application) follow their own retention periods in sections 4 to 6.
>
> We also honour the “Do Not Track” and “Global Privacy Control” browser signals
> as an additional opt-out: if either is set, we record nothing even if consent
> was given.

### DE — „7. Reichweitenmessung und Nutzungsanalyse"

> Wir betreiben auf dieser Website eine eigene Reichweitenmessung, um zu
> verstehen, über welche Kampagnen und Kanäle Menschen zu uns kommen und welche
> Seiten tatsächlich genutzt werden. Sie läuft auf unseren eigenen Servern in
> Deutschland; die Daten werden zu diesem Zweck nicht an Dritte weitergegeben.
>
> **Was erfasst wird:** die Kampagnenkennung des Links, über den Sie gekommen
> sind (z. B. `?src=poster-tumsom` oder die üblichen `utm_*`-Parameter), die
> verweisende Domain, die von Ihnen aufgerufenen Seiten sowie Interaktionen wie
> das Beginnen eines Formulars oder das Abschließen einer Terminbuchung.
>
> **Kennungen:** eine zufällige Sitzungskennung für die Dauer Ihres Besuchs und
> eine zufällige Besucherkennung mit einer Speicherdauer von **182 Tagen**. Die
> Besucherkennung ermöglicht es uns, einen späteren Besuch der Kampagne
> zuzuordnen, über die Sie ursprünglich zu uns gekommen sind – scannen Sie im Mai
> einen Plakat-Code und melden sich im Juli an, können wir diese Anmeldung dem
> Plakat zuordnen. Ihre IP-Adresse speichern wir **nicht**, wir erstellen keinen
> Fingerprint und führen diese Daten nicht mit anderen Quellen zusammen.
>
> **Rechtsgrundlage:** Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO sowie
> § 25 Abs. 1 TDDDG für die Speicherung auf Ihrem Endgerät. Vor Ihrer
> Einwilligung wird nichts gelesen oder geschrieben; ein Widerruf löscht die
> gespeicherten Kennungen unmittelbar aus Ihrem Browser.
>
> **Speicherdauer:** Ereignisdaten werden automatisch nach 12 Monaten gelöscht.
> Datensätze, die entstehen, weil Sie uns etwas übermittelt haben (Warteliste,
> Kontakt, Bewerbung), unterliegen den eigenen Fristen in den Abschnitten 4 bis 6.
>
> Zusätzlich beachten wir die Browsersignale „Do Not Track" und „Global Privacy
> Control" als Widerspruchsmöglichkeit: Ist eines davon gesetzt, erfassen wir
> nichts – auch dann nicht, wenn eine Einwilligung vorliegt.

---

## 3. New §8 — Consent Management (insert after §7)

### EN — "8. Consent Management and Cookies"

> To ask for and record your cookie choice we use **Klaro**, an open-source
> consent tool that we host ourselves. No data is transmitted to the tool's
> developers or to any other third party by the banner itself.
>
> Two strictly necessary cookies are set once you make a choice. They exist only
> so that we can remember your decision and prove that we obtained it (Art. 7(1)
> GDPR), which is a legal obligation — they are never used to track you. Legal
> basis: Art. 6(1)(c) and (f) GDPR; storage is permitted without consent under
> § 25(2) no. 2 TDDDG.
>
> Together with your decision we store a random consent id, which purposes you
> accepted, the version of the banner text you were shown, the language, and the
> page you were on. We do **not** store your IP address or your browser's user
> agent.
>
> **Everything stored on your device:**
>
> | Name | Purpose | Basis | Duration |
> |---|---|---|---|
> | `cfc_consent` | Remembers your cookie choice | Strictly necessary | 182 days |
> | `cfc_consent_id` | Random id linking your choice to our consent record | Strictly necessary | 182 days |
> | `cfc-locale` | Remembers the language you selected | Strictly necessary | 12 months |
> | `cfc.visitor` (localStorage) | Random visitor id for reach measurement (§7) | Consent | 182 days |
> | `cfc.attribution` (localStorage) | The campaign you arrived through (§7) | Consent | 182 days |
> | `cfc.session` (sessionStorage) | Random session id (§7) | Consent | End of session |
> | `_gcl_*` | Google Ads conversion measurement (§9) | Consent | up to 90 days |
> | `_ga`, `_ga_*` | Google Analytics (§10) | Consent | up to 14 months |
>
> You can withdraw or change your consent at any time via **“Cookie settings”**
> in the footer of every page. Withdrawal takes effect immediately, deletes the
> relevant cookies and stored identifiers, and does not affect the lawfulness of
> processing carried out beforehand.

### DE — „8. Einwilligungsverwaltung und Cookies"

> Zur Abfrage und Dokumentation Ihrer Cookie-Entscheidung nutzen wir **Klaro**,
> ein Open-Source-Einwilligungswerkzeug, das wir selbst hosten. Das Banner selbst
> übermittelt keine Daten an die Entwickler des Werkzeugs oder an sonstige Dritte.
>
> Mit Ihrer Entscheidung werden zwei unbedingt erforderliche Cookies gesetzt. Sie
> dienen ausschließlich dazu, Ihre Entscheidung zu speichern und deren Einholung
> nachweisen zu können (Art. 7 Abs. 1 DSGVO) – eine rechtliche Pflicht. Zu
> Tracking-Zwecken werden sie nicht verwendet. Rechtsgrundlage: Art. 6 Abs. 1
> lit. c und f DSGVO; die Speicherung ist nach § 25 Abs. 2 Nr. 2 TDDDG ohne
> Einwilligung zulässig.
>
> Zusammen mit Ihrer Entscheidung speichern wir eine zufällige
> Einwilligungskennung, die von Ihnen akzeptierten Zwecke, die Version des
> angezeigten Banner-Textes, die Sprache und die Seite, auf der Sie sich befanden.
> Ihre IP-Adresse und Ihren Browser-User-Agent speichern wir **nicht**.
>
> **Alles, was auf Ihrem Endgerät gespeichert wird:**
>
> | Name | Zweck | Grundlage | Dauer |
> |---|---|---|---|
> | `cfc_consent` | Speichert Ihre Cookie-Entscheidung | Unbedingt erforderlich | 182 Tage |
> | `cfc_consent_id` | Zufällige Kennung zur Verknüpfung mit unserem Einwilligungsnachweis | Unbedingt erforderlich | 182 Tage |
> | `cfc-locale` | Speichert die von Ihnen gewählte Sprache | Unbedingt erforderlich | 12 Monate |
> | `cfc.visitor` (localStorage) | Zufällige Besucherkennung für die Reichweitenmessung (§ 7) | Einwilligung | 182 Tage |
> | `cfc.attribution` (localStorage) | Kampagne, über die Sie gekommen sind (§ 7) | Einwilligung | 182 Tage |
> | `cfc.session` (sessionStorage) | Zufällige Sitzungskennung (§ 7) | Einwilligung | Ende der Sitzung |
> | `_gcl_*` | Google Ads Conversion-Messung (§ 9) | Einwilligung | bis zu 90 Tage |
> | `_ga`, `_ga_*` | Google Analytics (§ 10) | Einwilligung | bis zu 14 Monate |
>
> Sie können Ihre Einwilligung jederzeit über **„Cookie-Einstellungen"** im Footer
> jeder Seite widerrufen oder ändern. Der Widerruf wirkt sofort, löscht die
> betroffenen Cookies und gespeicherten Kennungen und berührt nicht die
> Rechtmäßigkeit der bis dahin erfolgten Verarbeitung.

---

## 4. New §9 — Google Ads Conversion Tracking

### EN — "9. Google Ads Conversion Tracking"

> As a non-profit association we take part in the **Google Ad Grants** programme,
> which provides us with free search advertising. The programme requires us to
> measure and report which advertisements lead to an actual result. We therefore
> use Google Ads conversion tracking, provided by **Google Ireland Limited**,
> Gordon House, Barrow Street, Dublin 4, Ireland.
>
> **What happens:** if you consent, Google's tag records when you complete one of
> four actions — joining the waitlist, submitting a membership application,
> sending a contact enquiry, or booking an appointment — and links it to the
> advertisement you clicked. For this purpose Google sets `_gcl_*` cookies and
> processes the click identifier contained in the ad link.
>
> **Ads personalisation:** Google may use this data not only to measure
> advertising performance but also for the **personalisation of advertising**.
> Information on how Google handles data it receives from us is available at
> [business.safety.google/privacy](https://business.safety.google/privacy/).
>
> **Legal basis:** your consent, Art. 6(1)(a) GDPR, and § 25(1) TDDDG for the
> cookies. Without consent no cookie is set and no identifier is transmitted; the
> tag then sends Google only aggregated, cookie-free information containing no
> identifiers.
>
> **Transfer to a third country:** data may be processed by **Google LLC** in the
> USA. Google LLC is certified under the EU–US Data Privacy Framework, so the
> European Commission's adequacy decision of 10 July 2023 applies. In addition we
> have concluded the standard contractual clauses with Google.
>
> You can withdraw your consent at any time via “Cookie settings” in the footer.

### DE — „9. Google Ads Conversion-Tracking"

> Als gemeinnütziger Verein nehmen wir am Programm **Google Ad Grants** teil, das
> uns kostenlose Suchanzeigen zur Verfügung stellt. Das Programm verpflichtet uns
> zu messen und zu berichten, welche Anzeigen zu einem tatsächlichen Ergebnis
> führen. Wir setzen daher das Conversion-Tracking von Google Ads ein, angeboten
> von **Google Ireland Limited**, Gordon House, Barrow Street, Dublin 4, Irland.
>
> **Was passiert:** Mit Ihrer Einwilligung erfasst das Google-Tag, wenn Sie eine
> von vier Aktionen abschließen – Eintrag in die Warteliste, Absenden einer
> Mitgliedsbewerbung, Senden einer Kontaktanfrage oder Buchen eines Termins – und
> verknüpft dies mit der von Ihnen angeklickten Anzeige. Google setzt hierfür
> `_gcl_*`-Cookies und verarbeitet die im Anzeigenlink enthaltene Klick-Kennung.
>
> **Personalisierung von Werbung:** Google kann diese Daten nicht nur zur Messung
> der Anzeigenleistung, sondern auch zur **Personalisierung von Werbung**
> verwenden. Informationen dazu, wie Google die von uns übermittelten Daten
> verarbeitet, finden Sie unter
> [business.safety.google/privacy](https://business.safety.google/privacy/).
>
> **Rechtsgrundlage:** Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO sowie
> § 25 Abs. 1 TDDDG für die Cookies. Ohne Einwilligung wird kein Cookie gesetzt
> und keine Kennung übermittelt; das Tag sendet an Google dann nur aggregierte,
> cookiefreie Informationen ohne Kennungen.
>
> **Drittlandübermittlung:** Daten können durch **Google LLC** in den USA
> verarbeitet werden. Google LLC ist unter dem EU-US Data Privacy Framework
> zertifiziert, sodass der Angemessenheitsbeschluss der Europäischen Kommission
> vom 10. Juli 2023 greift. Ergänzend haben wir mit Google die
> Standardvertragsklauseln abgeschlossen.
>
> Sie können Ihre Einwilligung jederzeit über „Cookie-Einstellungen" im Footer
> widerrufen.

---

## 5. New §10 — Google Analytics 4

### EN — "10. Google Analytics"

> With your consent we use **Google Analytics 4**, a service of Google Ireland
> Limited, to understand how this website is used in aggregate. Google Analytics
> sets `_ga` and `_ga_*` cookies and processes a randomly generated identifier,
> the pages you view, approximate location derived from a shortened IP address,
> and technical details of your device and browser.
>
> We have configured the service restrictively: **“Google signals” is switched
> off**, so no cross-device or advertising data is added to the reports, and the
> retention period for event data is set to 14 months.
>
> **Legal basis:** your consent, Art. 6(1)(a) GDPR, and § 25(1) TDDDG.
> **Third country:** as described in section 9 — Google LLC, USA, under the
> EU–US Data Privacy Framework, plus standard contractual clauses.
>
> You can withdraw your consent at any time via “Cookie settings” in the footer.

### DE — „10. Google Analytics"

> Mit Ihrer Einwilligung nutzen wir **Google Analytics 4**, einen Dienst der
> Google Ireland Limited, um in aggregierter Form zu verstehen, wie diese Website
> genutzt wird. Google Analytics setzt `_ga`- und `_ga_*`-Cookies und verarbeitet
> eine zufällig erzeugte Kennung, die von Ihnen aufgerufenen Seiten, eine aus
> einer gekürzten IP-Adresse abgeleitete ungefähre Standortangabe sowie
> technische Angaben zu Ihrem Gerät und Browser.
>
> Wir haben den Dienst restriktiv konfiguriert: **„Google-Signale" ist
> deaktiviert**, sodass keine geräteübergreifenden oder werbebezogenen Daten in
> die Berichte einfließen, und die Aufbewahrungsdauer für Ereignisdaten ist auf
> 14 Monate gesetzt.
>
> **Rechtsgrundlage:** Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO sowie
> § 25 Abs. 1 TDDDG.
> **Drittland:** wie in Abschnitt 9 beschrieben – Google LLC, USA, unter dem
> EU-US Data Privacy Framework, ergänzt um Standardvertragsklauseln.
>
> Sie können Ihre Einwilligung jederzeit über „Cookie-Einstellungen" im Footer
> widerrufen.

---

## 6. New §11 — Appointment Booking (cal.com)

> **Note:** this closes a pre-existing gap — the booking widget is already live
> and currently undisclosed.

### EN — "11. Appointment Booking (Cal.com)"

> On our contact page we embed the booking calendar of **Cal.com, Inc.**, 2261
> Market Street #5039, San Francisco, CA 94114, USA, so that you can arrange a
> meeting with us directly.
>
> The calendar is loaded in an iframe from Cal.com. When it loads, your IP
> address and technical details of your browser are transmitted to Cal.com. If
> you complete a booking, the data you enter there (in particular your name and
> email address) is processed by Cal.com on our behalf in order to schedule the
> appointment.
>
> **Legal basis:** Art. 6(1)(f) GDPR — our legitimate interest in offering a
> simple way to arrange a meeting — and, once you actively make a booking,
> Art. 6(1)(b) GDPR for carrying out the appointment.
>
> **Third country:** Cal.com processes data in the USA. We have concluded a data
> processing agreement including the EU standard contractual clauses.
>
> If you would rather not use the calendar, you can simply email us at
> info@codingforchange.com to arrange a meeting instead.
>
> Cal.com's privacy policy: https://cal.com/privacy

### DE — „11. Terminbuchung (Cal.com)"

> Auf unserer Kontaktseite binden wir den Buchungskalender von **Cal.com, Inc.**,
> 2261 Market Street #5039, San Francisco, CA 94114, USA ein, damit Sie direkt
> ein Gespräch mit uns vereinbaren können.
>
> Der Kalender wird in einem iframe von Cal.com geladen. Beim Laden werden Ihre
> IP-Adresse und technische Angaben zu Ihrem Browser an Cal.com übermittelt.
> Wenn Sie eine Buchung abschließen, verarbeitet Cal.com die dort von Ihnen
> eingegebenen Daten (insbesondere Name und E-Mail-Adresse) in unserem Auftrag,
> um den Termin zu vereinbaren.
>
> **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO – unser berechtigtes Interesse
> an einer einfachen Möglichkeit zur Terminvereinbarung – sowie, sobald Sie
> aktiv eine Buchung vornehmen, Art. 6 Abs. 1 lit. b DSGVO zur Durchführung des
> Termins.
>
> **Drittland:** Cal.com verarbeitet Daten in den USA. Wir haben einen
> Auftragsverarbeitungsvertrag einschließlich der EU-Standardvertragsklauseln
> abgeschlossen.
>
> Wenn Sie den Kalender nicht nutzen möchten, schreiben Sie uns einfach an
> info@codingforchange.com, um einen Termin zu vereinbaren.
>
> Datenschutzerklärung von Cal.com: https://cal.com/privacy

---

## 7. Final section — update the date

Change "July 2026" / „Juli 2026" to the month you actually publish this.

---

## Two things to do outside the CMS

1. **Google Ads → accept the Data Processing Terms** in the account. §9 above
   claims we have standard contractual clauses with Google; that claim is only
   true once you've accepted them.
2. **Cal.com → confirm the DPA.** §11 claims a data processing agreement with
   Cal.com. Check it's actually in place on the account (Cal.com offers one);
   if not, either sign it or soften that sentence before publishing.
