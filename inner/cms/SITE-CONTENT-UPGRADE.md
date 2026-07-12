# Site credibility upgrade — CMS content to enter

Copy-paste reference for the content that powers the new/updated pages in the
`feat/site-credibility-upgrade` branch. Enter **English first**, then switch the
locale selector (top-right in the admin) to **Deutsch** and fill the same
rows/fields with the German values.

Contents:
1. Site Config — hero tagline
2. Team — bios (full names, credential-first) + company logos
3. Projects — case studies (Lebenshilfe + edunovo)
4. Partner Page (For NGOs) — new global
5. Notes / things that live in code (not the CMS)

---

## 1. Site Config → hero tagline

**Where:** Globals → Site Config → `tagline` (this is the hero sub-headline on `/`).

The current tagline ("Helping NGOs escape the digital stone age") is shown to
*every* visitor — including prospective NGO partners, whom it frames as
backward. Replace it with a value-first line that works for both students and
partners:

**EN**
```
We build the software nonprofits can't afford to build themselves — free, in a single semester.
```
**DE**
```
Wir entwickeln die Software, die sich gemeinnützige Organisationen sonst nicht leisten können – kostenlos, in einem einzigen Semester.
```

> The homepage `<h1>` is still the club name (fine — the value prop now sits in
> the tagline directly beneath it and in the About page headline).

---

## 2. Team → bios

**Where:** Collections → Team → each member.

Two changes: **(a)** use full names (first + last) — first-names-only reads as a
student project and blocks any LinkedIn cross-check; **(b)** lead each bio with
the credential, keep **one** beat of personality. The employer logos now show
**always** (previously hover-only, invisible on mobile), so make sure every
member's **Companies** relationship is populated.

> Full surnames confirmed only for the four co-founders below. Add the surnames
> for the rest before publishing.

| Name (set `name`) | Role (`role`) | Bio EN (`bio`) | Bio DE (`bio`, locale=de) |
|---|---|---|---|
| **Jakob Landbrecht** | Co-Founder | Information Systems @ TUM. Builds tooling at Picus Capital. Hobby pilot. | Wirtschaftsinformatik @ TUM. Entwickelt Tools bei Picus Capital. Hobbypilot. |
| **Tim Kausemann** | Co-Founder | CS @ TUM. Previously CHECK24, currently interning at Bloomberg. | Informatik @ TUM. Zuvor CHECK24, aktuell Praktikum bei Bloomberg. |
| **David Franke** | Growth & Projects | TUM-BWL @ TUM. Internships at CHECK24 & Nomos. Volunteer maths tutor. | TUM-BWL @ TUM. Praktika bei CHECK24 & Nomos. Ehrenamtlicher Mathe-Tutor. |
| **Alexander Reyers** | Co-Founder | Information Systems @ TUM. Co-founded RoboTUM; tutored PGdP and EIST. | Wirtschaftsinformatik @ TUM. Mitgründer von RoboTUM; Tutor für PGdP und EIST. |
| **Sophia ‹surname›** | Sponsorships & Projects | Economics @ LMU. Speaks five languages; runs half-marathons. | VWL @ LMU. Spricht fünf Sprachen; läuft Halbmarathons. |
| **Yemema ‹surname›** | Founding Engineer | CS @ LMU. Interested in software architecture; previously interned in manufacturing. | Informatik @ LMU. Interessiert an Softwarearchitektur; zuvor Praktikum in der Fertigung. |
| **Tim ‹surname›** | Founding Engineer | CS @ TUM. Previously CHECK24; network admin at the Studierendenwerk. | Informatik @ TUM. Zuvor CHECK24; Netzwerkadministration beim Studierendenwerk. |
| **Justus ‹surname›** | Founding Engineer | CS @ TUM. SWE intern at Optiver. Competitive cheerleader. | Informatik @ TUM. SWE-Praktikant bei Optiver. Wettkampf-Cheerleader. |
| **Eric ‹surname›** | Engineer | CS @ TUM. Part of best.in.tum; builds EV-infrastructure software at SWM. | Informatik @ TUM. Teil von best.in.tum; entwickelt Software für Ladeinfrastruktur bei den SWM. |
| **Richard ‹surname›** | Engineer | TUM-BWL @ TUM. Internships at SENACOR & Nomos. Volunteer paramedic. | TUM-BWL @ TUM. Praktika bei SENACOR & Nomos. Ehrenamtlicher Sanitäter. |

> The "Previously at" label above the logos is translated in code; you only need
> to attach the right Company records to each member.

---

## 3. Projects → case studies

**Where:** Collections → Projects → each project. New fields live under the
**"Case study"** collapsible + the **slug/featured** boxes in the sidebar.
Everything except title/partner/description/status is optional — a project with
no case-study fields just shows its summary card.

For each project set: **slug** (sidebar), **featured** (sidebar, tick the
flagship), and the case-study fields. `problem` / `approach` / `outcome` accept
multiple paragraphs (one per line). Add screenshots under **Gallery** as they
become available — they make the biggest difference.

### 3a. Lebenshilfe München — the flagship

- **slug:** `lebenshilfe-muenchen`  ·  **featured:** ✅  ·  **status:** Active
- **technologies:** Next.js, MySQL, shadcn/ui

**title** — EN `Companion Management for Lebenshilfe München` · DE `Schulbegleiter-Verwaltung für die Lebenshilfe München`
**ngoPartner** — `Lebenshilfe München e.V.`

**description** (card summary)
- EN: `A role-based platform that lets school companions log hours, teachers approve them, and administrators manage children, staff and billing — replacing a paper-and-spreadsheet process.`
- DE: `Eine rollenbasierte Plattform, auf der Schulbegleiter:innen Stunden erfassen, Lehrkräfte sie freigeben und die Verwaltung Kinder, Personal und Abrechnung managt – als Ersatz für Zettel und Tabellen.`

**impact** (one-liner)
- EN: `Rolling out to ~150 school companions — turning monthly paperwork into a few taps.`
- DE: `Rollout an ~150 Schulbegleiter:innen – aus monatlichem Papierkram werden wenige Klicks.`

**problem**
- EN:
  ```
  Lebenshilfe München coordinates school companions (Schulbegleiter) who support children with disabilities in the classroom.
  Hours were tracked on paper and in spreadsheets, approvals happened over email, and billing meant re-typing the same numbers across systems — slow, error-prone, and a heavy load on a small administrative team.
  ```
- DE:
  ```
  Die Lebenshilfe München koordiniert Schulbegleiter:innen, die Kinder mit Behinderung im Unterricht unterstützen.
  Stunden wurden auf Papier und in Tabellen erfasst, Freigaben liefen per E-Mail, und für die Abrechnung mussten dieselben Zahlen mehrfach übertragen werden – langsam, fehleranfällig und eine große Last für ein kleines Verwaltungsteam.
  ```

**approach**
- EN:
  ```
  A student team scoped a single role-based platform together with Lebenshilfe's coordinators.
  Companions log their hours in a few taps, teachers approve entries, and administrators manage children, staff and billing in one place.
  Built with Next.js, MySQL and shadcn/ui, designed around the real daily workflow rather than the old paperwork.
  ```
- DE:
  ```
  Ein Studierendenteam hat gemeinsam mit den Koordinator:innen der Lebenshilfe eine einzige rollenbasierte Plattform konzipiert.
  Begleiter:innen erfassen ihre Stunden mit wenigen Klicks, Lehrkräfte geben Einträge frei, und die Verwaltung managt Kinder, Personal und Abrechnung an einem Ort.
  Gebaut mit Next.js, MySQL und shadcn/ui – ausgelegt auf den echten Arbeitsalltag statt auf den alten Papierprozess.
  ```

**outcome**
- EN:
  ```
  The platform goes live with its first school companions on 15 July 2026.
  Once rolled out it replaces the paper-and-spreadsheet process for around 150 companions — cutting the monthly administrative burden and giving coordinators a single source of truth for hours and billing.
  ```
- DE:
  ```
  Die Plattform geht am 15. Juli 2026 mit den ersten Schulbegleiter:innen live.
  Nach dem Rollout ersetzt sie den Papier- und Tabellenprozess für rund 150 Begleiter:innen – sie senkt den monatlichen Verwaltungsaufwand und gibt den Koordinator:innen eine verlässliche Datenquelle für Stunden und Abrechnung.
  ```

**quote** — collect from a Lebenshilfe contact after launch. Suggested fields:
`quote.text` (their words), `quote.author` (name), `quote.role` (e.g. "Coordinator, Lebenshilfe München").

**Gallery** — add product screenshots once the rollout is underway (dashboard, hour-logging screen, approval view). This is the single highest-impact addition.

### 3b. edunovo

- **slug:** `edunovo`  ·  **featured:** ⬜️  ·  **status:** Active
- **technologies:** Next.js, Supabase

**title** — EN `A Speaker Platform for edunovo` · DE `Eine Speaker-Plattform für edunovo`
**ngoPartner** — `edunovo e.V.`

**description**
- EN: `A platform that connects schools with speakers from business, politics and society — a curated database for workshop requests and speaker availability.`
- DE: `Eine Plattform, die Schulen mit Speaker:innen aus Wirtschaft, Politik und Gesellschaft verbindet – eine kuratierte Datenbank für Workshop-Anfragen und Verfügbarkeiten.`

**problem**
- EN:
  ```
  edunovo gives students authentic insight into careers by bringing speakers from business, politics and society into schools.
  Matching the right speaker to each school's request was manual and hard to scale — a bottleneck that limited how many students edunovo could reach.
  ```
- DE:
  ```
  edunovo gibt Schüler:innen authentische Einblicke in Berufe, indem es Speaker:innen aus Wirtschaft, Politik und Gesellschaft in Schulen bringt.
  Die passende Person zur jeweiligen Anfrage zu finden war manuell und schwer skalierbar – ein Engpass, der begrenzte, wie viele Schüler:innen edunovo erreichen konnte.
  ```

**approach**
- EN:
  ```
  A student team is building a platform with a curated speaker database, so schools can browse availability and submit workshop requests, and edunovo can match and coordinate them in one place. Built with Next.js and Supabase.
  ```
- DE:
  ```
  Ein Studierendenteam entwickelt eine Plattform mit kuratierter Speaker-Datenbank: Schulen sehen Verfügbarkeiten und stellen Workshop-Anfragen, edunovo matcht und koordiniert an einem Ort. Gebaut mit Next.js und Supabase.
  ```

**outcome** — fill in once there's a milestone worth reporting (first schools onboarded, first workshops booked). Leave blank until then.

### 3c. Impact story (per project — for nonprofits)

Each project now branches into two views: the **Technical deep-dive** (the fields
above) and an **Impact story** for potential NGO partners. Fill the **"Impact
story (for nonprofits)"** collapsible on the project:

- **impactHeadline** — one-line outcome (e.g. `How Lebenshilfe gave 150 companions their evenings back`).
- **impactChallenge** — the partner's problem in their world (non-technical).
- **impactSolution** — what the software does for them, plain language (benefits, not stack).
- **impactResults** — the difference it made.
- **NGO FAQ** — question/answer pairs (cost, time, what happens after). The partner quote + screenshots from the case study are reused automatically.

The chooser only appears when **both** the technical and impact fields are
filled; otherwise the project opens straight into whichever exists.

---

## 4. Partner Page (For NGOs) — new global

**Where:** Globals → **Partner Page (For NGOs)**. Powers `/partner`, linked from
the homepage ("Partner with us" CTA), the About page, and the footer. Falls back
to sensible built-in copy if left blank, but fill it in for the real pitch.

**title**
- EN: `Have a problem worth solving? Let's build it together.`
- DE: `Ein Problem, das es zu lösen lohnt? Lass es uns gemeinsam bauen.`

**intro**
- EN: `We partner with non-profits to design and ship the software they need — free of charge, delivered by a dedicated student team over a single semester. No lock-in, no invoice: you own what we build.`
- DE: `Wir entwickeln gemeinsam mit gemeinnützigen Organisationen die Software, die sie brauchen – kostenlos, geliefert von einem festen Studierendenteam in einem Semester. Kein Lock-in, keine Rechnung: Was wir bauen, gehört euch.`

**valueProps (What we bring)** — one row each (title / description):
1. EN `A dedicated team` — `Engineers, product and design working only on your project for the semester.` · DE `Ein festes Team` — `Engineering, Produkt und Design, die ein Semester lang nur an eurem Projekt arbeiten.`
2. EN `Production software, not a prototype` — `Real, maintainable software that goes live and keeps working after we hand it over.` · DE `Produktreife Software, kein Prototyp` — `Echte, wartbare Software, die live geht und nach der Übergabe weiterläuft.`
3. EN `Free of charge` — `Funded by our university backing and sponsors — there is no cost to you.` · DE `Kostenlos` — `Finanziert durch unsere universitäre Anbindung und Sponsoren – für euch entstehen keine Kosten.`
4. EN `Clean hand-off` — `Documentation, a walkthrough, and the code — you own it, with no dependency on us.` · DE `Saubere Übergabe` — `Dokumentation, ein Walkthrough und der Code – alles gehört euch, ganz ohne Abhängigkeit von uns.`

**process (How a partnership works)** — one row each (title / description):
1. EN `Tell us the problem` — `A first conversation to understand your work and the pain point worth solving.` · DE `Erzählt uns das Problem` — `Ein erstes Gespräch, um eure Arbeit und den größten Schmerzpunkt zu verstehen.`
2. EN `We scope it together` — `We shape a solution that can realistically ship in one semester.` · DE `Wir schneiden es gemeinsam zu` — `Wir formen eine Lösung, die realistisch in einem Semester lieferbar ist.`
3. EN `The team builds` — `A student team builds it in agile sprints, with you in the loop throughout.` · DE `Das Team entwickelt` — `Ein Studierendenteam baut sie in agilen Sprints – ihr seid durchgehend eingebunden.`
4. EN `Hand-off & support` — `We deliver the finished product with docs and a support window.` · DE `Übergabe & Support` — `Wir liefern das fertige Produkt mit Dokumentation und einem Support-Zeitraum.`

**commitment** (optional)
- EN: `All we ask: a main point of contact and a little of their time through the semester, so we build the right thing.`
- DE: `Was wir brauchen: eine feste Ansprechperson und etwas ihrer Zeit über das Semester, damit wir das Richtige bauen.`

**ctaHeading**
- EN: `Ready to talk?` · DE: `Bereit für ein Gespräch?`

**ctaText**
- EN: `Tell us about your organisation and the problem you're facing — we'll take it from there.`
- DE: `Erzähl uns von eurer Organisation und eurem Problem – wir kümmern uns um den Rest.`

**contactEmail** — `info@codingforchange.com` (or a dedicated partner address).

---

## 5. Lives in code, not the CMS (FYI — no action needed)

- **Homepage / About impact stats** ("4 NGOs · 10+ members · **150+ users' time
  saved**") are in `inner/src/i18n/translations.ts` (`about.stats`). Change them
  there, not in the CMS. If `Site Config → stats` was populated for the old
  About page, it's no longer read by these pages.
- **The Events section** was removed from the homepage; the Events collection
  still exists in the CMS for future use, and `/events` now redirects home.
- **Blog** was removed from the primary nav (still linked in the footer and fully
  functional) — publishing a couple of posts is what lets it back into the nav.
