# Join / Membership Page — CMS content (copy-paste reference)

This is the content for the **Membership Page** global, matching what's in
`scripts/seed.mjs`. The seed only runs against a fresh DB, so on the live site
you enter this by hand.

**Where:** CMS admin → **Globals → Membership Page**.
**Localization:** fill in **English** first, then switch the locale selector
(top-right of the global) to **Deutsch** and fill in the German values. For the
array fields (Benefits, Requirements, Ways to contribute), edit the *same rows*
after switching locale — don't add new rows — so the English and German values
stay attached to the same entry.

> Field-name note: in the admin the arrays are labelled **Benefits** and
> **Requirements**; on the public page they render under the headings
> *"What you get"* and *"Who we're looking for"*. **Ways to contribute** is the
> `tracks` array.

---

## 🇬🇧 English (locale: EN)

### Title
```
Become a Member
```

### Description
```
We're a cross-disciplinary community of students building real software for non-profits — and that takes more than engineers. It takes people who talk to partners and find the real problem, people who tell our story, and people who grow the team. Whatever you're studying, there's a way to make a real impact with us.
```

### Benefits — renders as "What you get" (one row per line)
```
Ship real work for a real non-profit client
```
```
Learn from experienced leads and grow job-ready skills
```
```
Build a portfolio of high-impact projects
```
```
Connect with Munich's tech and social-impact community
```
```
Workshops, hackathons, and socials throughout the semester
```

### Requirements — renders as "Who we're looking for" (one row per line)
```
You're studying or working in Germany
```
```
You can commit around 5 hours a week during the semester
```
```
You care about social impact — coding experience is welcome but not required for every role
```

### Ways to contribute (tracks) — each row has a **Title** and **Description**

**Track 1 — Title**
```
Engineering
```
**Track 1 — Description**
```
Design and build the software that solves our partners' problems — frontend, backend, and everything in between. All experience levels welcome.
```

**Track 2 — Title**
```
Consulting & Product
```
**Track 2 — Description**
```
Work directly with our non-profit partners to uncover the real problem, scope the solution, and translate it for the engineering team. A great fit for business, management, and product-minded students.
```

**Track 3 — Title**
```
Marketing & Communications
```
**Track 3 — Description**
```
Grow our reach and tell the story of our impact — social media, content, events, and partnerships.
```

**Track 4 — Title**
```
People & Operations
```
**Track 4 — Description**
```
Recruit, onboard, and support our members, and keep the club running as we grow. The organisational backbone of Coding for Change.
```

### Contact email
```
join@codingforchange.com
```

---

## 🇩🇪 Deutsch (locale: DE)

### Title
```
Werde Mitglied
```

### Description
```
Wir sind eine interdisziplinäre Gemeinschaft von Studierenden, die echte Software für gemeinnützige Organisationen entwickeln – und dafür braucht es mehr als Entwickler:innen. Es braucht Menschen, die mit Partnern sprechen und das eigentliche Problem finden, die unsere Geschichte erzählen und das Team wachsen lassen. Egal was du studierst – bei uns findest du einen Weg, echten Impact zu schaffen.
```

### Benefits — "Was du bekommst" (one row per line)
```
Echte Arbeit für echte gemeinnützige Kunden leisten
```
```
Von erfahrenen Leads lernen und praxisnahe Fähigkeiten aufbauen
```
```
Portfolio aus wirkungsvollen Projekten aufbauen
```
```
Mit Münchens Tech- und Social-Impact-Community vernetzen
```
```
Workshops, Hackathons und Socializing während des Semesters
```

### Requirements — "Wen wir suchen" (one row per line)
```
Du studierst oder arbeitest in Deutschland
```
```
Du kannst dich ca. 5 Stunden pro Woche während des Semesters einbringen
```
```
Dir liegt gesellschaftlicher Impact am Herzen – Programmiererfahrung ist willkommen, aber nicht für jede Rolle nötig
```

### Ways to contribute (tracks) — same rows as EN, translated

**Track 1 — Title**
```
Entwicklung
```
**Track 1 — Description**
```
Entwirf und entwickle die Software, die die Probleme unserer Partner löst – Frontend, Backend und alles dazwischen. Alle Erfahrungsstufen willkommen.
```

**Track 2 — Title**
```
Consulting & Produkt
```
**Track 2 — Description**
```
Arbeite direkt mit unseren gemeinnützigen Partnern zusammen, um das eigentliche Problem zu erkennen, die Lösung zu skizzieren und sie für das Entwicklungsteam zu übersetzen. Ideal für Studierende aus BWL, Management und Produkt.
```

**Track 3 — Title**
```
Marketing & Kommunikation
```
**Track 3 — Description**
```
Erhöhe unsere Reichweite und erzähle die Geschichte unseres Impacts – Social Media, Content, Events und Partnerschaften.
```

**Track 4 — Title**
```
People & Operations
```
**Track 4 — Description**
```
Gewinne, onboarde und unterstütze unsere Mitglieder und halte den Club am Laufen, während wir wachsen. Das organisatorische Rückgrat von Coding for Change.
```

> `contactEmail` is not localized — the English value above applies to both.

---

## After entering the content

- The **Ways to contribute** section only appears on `/join` once at least one
  track exists — so it stays hidden until you add the tracks above.
- Applications are shown as **closed** (waitlist signup) via the
  `APPLICATIONS_OPEN` flag in `inner/src/components/showcase/BecomeAMember.tsx`.
  To reopen, set it to `true` and redeploy.
- Waitlist emails collect in the CMS admin under **Waitlist Signups**
  (create-only for the public; readable by admins).
