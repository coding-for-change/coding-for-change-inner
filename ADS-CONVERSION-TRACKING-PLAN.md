# Google Ad Grants — Conversion Tracking + Cookie Consent Plan

Status: **research done, decisions locked, no code written yet.** Prepared 2026-07-27.

**Locked decisions (2026-07-27):**
- **CMP: Klaro, self-hosted, with a `consent-records` collection.** Chosen over Cookiebot Free after weighing the effort (§4a). No page ceiling, no surprise auto-upgrade invoice, no third-party JS, banner matches the redesign, and Google does **not** require a certified CMP for advertisers (verified, §3). Cost: ~8h of build, and we own the compliance surface — including a drifting upstream (no npm release since Mar 2024, no commits since Mar 2025).
- Cookiebot Free was the runner-up. CookieYes Free was eliminated outright: it caps at **5,000 pageviews/month** (per CookieYes's own pricing page; blogs citing 25,000 are wrong), and we did **~7,000 pageviews in the second half of July 2026 alone** (≈14k/month, net of DNT/GPC opt-outs). Cookiebot's limit is *subpages* (50), with no traffic cap — the right shape of limit for us, which is why it beat CookieYes.
- **Stack: `gtag.js` with both Google Ads conversions and GA4. No GTM.** GA4 is reporting-only; conversions go through the direct Ads tag.
- **Our first-party analytics gets gated behind "statistics" consent.**
- **Both extras are in scope:** the `/3d` banner-in-the-monitor fix and real Cal.com booking conversions.

---

## 1. TL;DR

| Question | Answer |
| --- | --- |
| Is conversion tracking really mandatory for Ad Grants? | **Yes.** Confirmed in Google's own policy. Our account (created 2026) is squarely in scope. |
| Is ≥1 conversion/month really required? | **Yes**, and it's checked. Zero-conversion months are a compliance risk. |
| Is a cookie banner mandatory? | **Yes — but only because we're adding Google Ads tags.** It is not mandated by Ad Grants itself; it's mandated by German TDDDG § 25 + Google's own EU user consent policy once Google's cookies land on the site. |
| Best free CMP tier? | **Cookiebot Free** is the right call for us today (site is ~20–30 URLs, limit is 50). CookieYes Free is the better long-term free tier if the blog grows. Klaro (self-hosted) is the zero-cost-forever option if we accept manual maintenance. |
| Biggest hidden risk | Consent refusal + very low ad volume ⇒ a month with **0 recorded conversions** ⇒ Ad Grants non-compliance, even though the site actually converted. Mitigations in §6. |

**Important:** this reverses a deliberate earlier decision. The whole first-party analytics stack was built *specifically to avoid a cookie banner* (legitimate interest, no cookies, sessionStorage only). Putting Google Ads tags on the site ends that. If you want to keep the no-banner site, the alternative is §6c (offline conversion import) — but that has its own consent problem, so it is not a clean escape.

---

## 2. Fact-check: what Ad Grants actually requires

From Google's **Account management policy** (the binding one):

- Accounts created **after 22 April 2019** must have conversion tracking that accrues **"at least 1 conversion per month."**
- Those accounts must **"use conversion-based Smart bidding for all campaigns"** (Maximize conversions, Maximize conversion value, tCPA, tROAS). Manual CPC is no longer allowed. Smart Bidding is *mathematically dependent* on conversion tracking — so this is a second, independent reason it's mandatory.
- Conversions like **homepage visits must be excluded** from the Conversions category.
- Account-level **5% CTR every month**; missing it two months in a row ⇒ temporary deactivation.
- Non-compliance ⇒ **temporary deactivation** (ads stop, account/data preserved, reinstatement possible after fixing).

From the **Ad Grants Policy Compliance Guide**:

- "Accurate" means a *meaningful* conversion, not a technicality: **total clicks must not nearly equal total conversions**.
- Accepted examples: donations, memberships, **email/newsletter sign-ups, volunteer sign-ups, information request submissions, calls to your organisation**. Our waitlist / membership application / NGO contact form / Cal.com booking all qualify cleanly.
- Categorise correctly (donations ⇒ purchase/sale). Ours are **"Submit lead form"** and **"Book appointment"** — no donations involved.
- Prefer "count one" over "count every" for lead-type actions.

So: your instinct was right, and it's stricter than "mandatory" — it's *mandatory plus a monthly volume floor*.

---

## 3. Why the cookie banner becomes unavoidable

Three separate layers, all pointing the same way:

1. **TDDDG § 25 (Germany's ePrivacy implementation)** — storing or reading anything on a visitor's device that isn't *strictly necessary for the requested service* requires prior consent. The Google Ads conversion tag writes `_gcl_aw` / `_gcl_dc`. Not strictly necessary ⇒ consent required. Legitimate interest is **not** available as a basis here; § 25 is consent-or-nothing.
2. **GDPR Art. 6** — the gclid + conversion data is personal data processed for advertising measurement ⇒ needs Art. 6(1)(a) consent, plus an Art. 13 disclosure and a US transfer note (Google LLC / DPF).
3. **Google's own EU user consent policy** — as an advertiser we must obtain consent for Google's cookies and for sharing data with Google for ad purposes, and pass it via **Consent Mode v2** (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`). Without those signals, EEA measurement degrades.

### Do we need a Google-*certified* CMP? No — verified

Checked directly, because getting this wrong would disqualify a self-hosted CMP:

- [Google AdSense help](https://support.google.com/adsense/answer/13554116?hl=en): *"partners using our publisher products—Google AdSense, Ad Manager, or AdMob—are required to use a certified CMP"*, and the page opens by directing advertisers elsewhere. **Publishers only.**
- [Google CMP Partner Program](https://cmppartnerprogram.withgoogle.com/), verbatim: *"Nothing prevents advertisers from using a CMP that is not a partner (yet) to adopt Consent Mode and meet our EU UCP requirements."*
- [Google Ads help](https://support.google.com/google-ads/answer/13695607?hl=en): two equal paths — use a certified CMP, **or** *"if you maintain your own banner, implement consent mode v2."*

We are an advertiser, not a publisher. What is mandatory is the **consent** and the **Consent Mode v2 signals** — not the vendor. Klaro qualifies.

### ⚠️ But the account gets audited, and the banner must pass

Google runs [periodic EU User Consent Policy audits](https://support.google.com/google-ads/answer/16724512?hl=en) on advertiser accounts: a reviewer visits the site as a user would. Failing can **suspend conversion measurement** — which would break the Ad Grants conversion requirement and take the grant with it. This is the real compliance surface, and it's the same whether we use Cookiebot or Klaro.

The eight audit criteria, as build requirements:

1. **Visible consent banner** requiring affirmative action
2. **Ads personalization disclosed** — by name, not buried in a generic "marketing" label
3. **Functional consent buttons** (accept *and* reject genuinely work)
4. **Third-party data-sharing disclosed**
5. **A link to [Google's Business Data Responsibility site](https://business.safety.google/privacy/)** — a specific, checkable link, not a generic privacy policy. Easy to miss; must be in the banner/privacy text.
6. **Consent signals implemented** — Consent Mode v2 (or TCF)
7. **No cookies set before consent**
8. **CMP configured correctly**

Items 2 and 5 are the ones a hand-rolled banner typically fails on. Both are in scope.

---

## 4. CMP free-tier comparison

| | **Cookiebot Free** | **CookieYes Free** | **Klaro (self-hosted)** |
| --- | --- | --- | --- |
| Cost | €0 permanent | €0 permanent | €0 forever, MIT/BSD |
| Hard limit | **1 domain, 50 subpages**, no traffic cap | **5,000 pageviews/month**, unlimited pages | none |
| Consent Mode v2 | ✅ | ✅ | ✅ (signals, hand-wired) |
| Auto cookie scan | ✅ | ✅ | ❌ manual declaration |
| Consent log | ✅ stored, **no CSV export** on free | ✅ basic | ❌ build it yourself |
| Branding | "Powered by Cookiebot" **not removable** | removable? no — shown on free | fully ours |
| Google-certified CMP | ✅ Gold tier | ✅ | ❌ |
| Failure mode at limit | **auto-upgrades you to a paid tier** (€15–30/mo) once the scanner sees >50 pages; reports also exist of free scripts simply stopping | banner stops serving past the pageview cap | n/a |
| Third-party JS on our site | yes (Usercentrics, DK) | yes (US/IN) | none |

### Decision: Cookiebot Free — with a guard

**Why the pageview column settles it.** A "pageview" is counted per page *load* — one visitor browsing 10 pages consumes 10. Our first-party `analytics-events` table logged ~7,000 pageviews in the second half of July 2026, i.e. ≈14k/month, and that number is already *net* of DNT/GPC opt-outs so the true figure is higher. CookieYes Free (5,000/mo) would be exhausted in about a week; even the incorrect 25k figure from secondary sources would be uncomfortable once ad traffic arrives. Cookiebot Free has **no traffic cap whatsoever** — its only limit is the 50-URL scan ceiling, which scales with content, not popularity. For a low-page-count / decent-traffic site like ours that is exactly the right shape of limit.


Our current URL count is ~14 static routes (`/`, `/about`… `/contact`, `/imprint`, `/privacy`) plus `/projects/[slug]` and `/blog/[slug]`. Locale is cookie-based (`getServerLocale`), **not** path-based, so DE/EN does **not** double the URL count. That puts us comfortably under 50 today.

The risk is purely financial and purely about growth: the moment the scanner crawls >50 URLs (≈35 more blog posts + case studies), Cookiebot **auto-upgrades to a paid plan** rather than warning us. Guards:

- Cap the crawl in the Cookiebot dashboard (exclude `/blog/*` deep pages from scanning — the banner and Consent Mode keep working regardless; only the auto-generated cookie declaration depends on the scan, and ours will be a short, hand-verifiable list: Cookiebot's own cookie + Google's `_gcl_*`).
- Put a reminder on the calendar to re-check the subpage count each quarter.
- **Switch trigger:** if we pass ~45 scanned URLs and don't want to pay, the fallback is **Klaro (self-hosted)**, *not* CookieYes — at our traffic every pageview-metered free tier is already out of reach. Cookiebot Premium Small (€15/mo, 350 subpages) is the other option and is honestly cheap for what it removes from our plate.

Klaro stays the zero-cost-forever escape hatch (no third-party script, no limits, German), but it hands us the consent-record obligation under GDPR Art. 7(1) as homework. Not worth it *today* for a 4-cookie site where a free hosted option fits.

---

## 5. Tracking architecture I propose

**One `gtag.js`, two products, no GTM:**

```
inner/src/app/layout.tsx  <head>   (server component → reads runtime env)
  1. Consent Mode v2 defaults      → all denied, region-agnostic, data-cookieconsent="ignore"
  2. Cookiebot CMP loader          → data-cbid=…, data-blockingmode="auto"
  3. gtag.js                       → data-cookieconsent="ignore"  (Advanced Consent Mode)
       gtag('config', 'AW-XXXXXXXXX')   ← conversions (the Ad Grants requirement)
       gtag('config', 'G-XXXXXXXXXX')   ← GA4, reporting only
```

Why this shape:

- **No GTM.** Google Tag Manager is a container you embed once and then manage tags through a web UI instead of code. It earns its keep when non-developers need to add tracking without a deploy. For us it would be a second, *unversioned* source of truth outside PR review, plus one more third party — and a tag published from a browser is invisible to our privacy policy and consent config until someone notices. GA4 does **not** require GTM (it's the same `gtag.js`), so choosing GA4 costs us nothing here. GTM can be added later without redoing any of this.
- **GA4 is reporting-only.** ⚠️ With GA4 present there are now two routes to get conversions into Google Ads: the direct Ads tag, or importing GA4 key events. **Do exactly one.** Doing both double-counts and walks straight into Ad Grants' "total clicks must not nearly equal total conversions" rule. We use the direct Ads tag; GA4 key events stay unimported.
- **GA4 privacy settings are not defaults** — see actions B-11..13. Google Signals must stay off, data retention wants raising from the 2-month default, and the Google data-processing terms need accepting in-account. Our own Postgres funnel analytics remain the ground truth for attribution; GA4 is a convenience layer.
- **Advanced Consent Mode, not Basic.** Tags load immediately and downgrade to cookieless pings when consent is denied, which is the only configuration where Google can ever model the denied traffic. (Reality check in §6.)
- **`data-cookieconsent="ignore"`** on the Consent Mode + gtag snippets so Cookiebot's auto-blocking doesn't strip the very scripts that are supposed to receive the consent signal.
- **Runtime env, not `NEXT_PUBLIC_`.** `layout.tsx` is an async server component and rendering is already dynamic (locale comes from cookies), so it can read `process.env` at request time. This matters: our prod images are prebuilt and pushed to a registry, so a `NEXT_PUBLIC_` var would need new Dockerfile `ARG`s + CI build args. Runtime env = just add two lines to compose. The IDs are non-secret either way.

### Conversion actions → existing code hooks

We already fire first-party conversion events at exactly the right places, so each Google Ads conversion is a one-line addition next to an existing call:

| Google Ads action | Category | Fires at |
| --- | --- | --- |
| Membership waitlist signup | Submit lead form | `inner/src/components/showcase/BecomeAMember.tsx:63` |
| Membership application | Submit lead form | `inner/src/components/showcase/BecomeAMember.tsx:146` |
| NGO / general contact enquiry | Submit lead form | `inner/src/components/showcase/Contact.tsx:111` |
| Cal.com booking **completed** | Book appointment | `inner/src/components/general/BookingEmbed.tsx` — new `bookingSuccessful` subscription (see §6d) |

All four set as **Primary** (only Primary actions count in the Conversions column and feed Smart Bidding), **"count one"**, 30-day click window.

### The `/3d` scene

`/3d` renders the inner app inside the 3D monitor via iframe on the same origin. If Cookiebot only loads in the inner app, a first-time visitor landing on `/3d` gets the consent banner **rendered inside the tiny monitor screen**. Fix: load Cookiebot on the outer page (`outer/src/index.html`) too and skip it in the inner app when `window.self !== window.top`. Same origin ⇒ one shared consent cookie, so consent given on either surface covers both. Low priority (`/3d` is `noindex` and opt-in, and ad traffic lands on `/`) but it's a 10-line fix.

---

## 6. The risk that will actually bite us

Ad Grants needs **≥1 recorded conversion every month**. A German consent banner typically loses 30–50% of visitors, and our absolute conversion volume is small. A month with 2 real signups where both visitors declined cookies = **0 conversions in Google Ads** = compliance exposure, despite the site working fine.

Mitigations, in order of value:

**a) Track all four conversion actions as Primary.** Four shots at the monthly floor instead of one. Still all genuinely meaningful under Google's own examples — no policy risk.

**b) Advanced Consent Mode.** Honest caveat: Google's conversion modeling needs meaningful volume before it activates (commonly cited: ~700 ad clicks per country/domain over 7 days — treat as an order-of-magnitude figure, not a documented guarantee). A grant account spending a fraction of its $329/day will not hit that for a long time. So Advanced mode is the right default because it costs nothing and starts paying off later — **but do not plan around modeling rescuing us in year one.**

**c) Offline conversion import as a backstop (optional, later).** Our own Postgres already records every conversion with ground truth. If we also capture `gclid` from the landing URL into the existing attribution record, we can upload real conversions to Google Ads (CSV or API) for clicks that the browser tag missed. Caveat that keeps this from being a banner-free loophole: the Google Ads API expects consent signals on uploads too, and storing gclid client-side is itself a § 25 storage event. So this is a *completeness* tool on top of the consented tag, not a replacement for consent. Flagging it as a phase 2 idea, not part of the first build.

**d) Wire real Cal.com booking completions.** Today we only fire `booking_started`, which triggers when the widget *scrolls into view* (`BookingEmbed.tsx:74-79`) — that's a viewport impression, not even a click. As an Ad Grants conversion it would be indefensible: nearly every visitor to that section would "convert", which is precisely the clicks≈conversions pattern Google audits for.

**It is directly observable, and the comment at `BookingEmbed.tsx:70-72` is out of date.** We already use `@calcom/embed-react`, which ships `getCalApi()`. Cal's embed posts events to the parent frame, so no webhook and no `/thanks` redirect are needed:

```ts
import { getCalApi } from '@calcom/embed-react';

useEffect(() => {
  let cancelled = false;
  (async () => {
    const cal = await getCalApi();
    if (cancelled) return;
    cal('on', {
      action: 'bookingSuccessful',
      callback: (e) => {
        const uid = e.detail?.data?.uid;      // dedupe key
        trackEvent('booking_completed', { label: 'calcom', meta: { uid } });
        trackAdsConversion('booking');
      },
    });
  })();
  return () => { cancelled = true; };
}, []);
```

Details that matter for implementation:

- **Only works on the `calLink` path.** `BookingEmbed` has two rendering modes (`BookingEmbed.tsx:98-122`): the `<Cal>` component when the CMS URL is a `cal.com/...` link, and a plain `<iframe>` otherwise (e.g. a Google Calendar appointment schedule). The raw-iframe branch is cross-origin with no event contract — it stays impression-only. **Worth confirming the CMS Site Configuration → Booking page URL is actually a `cal.com` link**, or this conversion never fires (action A-16 below).
- **`bookingSuccessful` fires on fresh bookings, not reschedules** ([calcom#13835](https://github.com/calcom/cal.diy/issues/13835)). Fine — a reschedule isn't a new lead.
- "Successfully completed" ≠ confirmed. If the event type requires host confirmation, the event still fires at submission. That's the correct moment for an ad conversion (the lead is captured), but it means Google's count can exceed confirmed meetings.
- **This one item needs a migration.** `analytics-events.type` is a Payload `select` (`AnalyticsEvents.ts:50-55`), which the Postgres adapter backs with a real enum type — `enum_analytics_events_type`, currently `('landing','pageview','cta_click','form_start','conversion','outbound_click','booking_started')`. Adding a value alters the schema, so it goes through the full `CLAUDE.md` migration process (throwaway Postgres → `payload migrate` to baseline → `migrate:create`), committed together with the code.
- **So: add `booking_completed`, don't rename `booking_started`.** A rename would mean rewriting historical rows and churning the enum for zero analytical gain. One `ALTER TYPE … ADD VALUE` is the whole diff. (Safe inside Payload's transaction on PG 16 because the migration only *adds* the value without using it in the same transaction — I'll confirm the generated SQL does exactly that.) The existing impression event keeps its name; I'll correct its misleading description text instead.
- Dedupe on `uid` so a re-render or double event can't double-fire the conversion.

**e) Monitor.** Check the Conversions column in Google Ads on the 1st of each month. If it reads 0, we have ~3 weeks to react before a second bad month matters.

---

## 7. YOUR actions (things I can't do)

Roughly 60–90 minutes total.

**A. Cookiebot account**
1. Sign up at cookiebot.com with an `@codingforchange.com` address. Choose the **Free** plan and add `codingforchange.com` as the single domain.
2. Let the first scan run (a few minutes). Confirm the reported subpage count is well under 50 — **screenshot it** so we have a baseline.
3. In *Settings → Scanning*, restrict/exclude deep paths if the count is already near the limit.
4. In *Settings → Banner*: layout = your preference, but set **"Deny" and "Accept" buttons equally prominent** (German DSK guidance — a hidden reject button is the single most-fined banner mistake). Enable a "Necessary / Statistics / Marketing" category banner, not accept-only.
5. Enable **Google Consent Mode** in the Cookiebot dashboard.
6. Copy the **Domain Group ID (CBID)** — a UUID — and send it to me.

**B. Google Ads conversion actions**
7. In Google Ads → *Goals → Conversions → New conversion action → Website*. Create the four actions from §5, exactly:
   - `Waitlist signup` — Submit lead form — count **One** — 30d click window — Primary
   - `Membership application` — Submit lead form — One — 30d — Primary
   - `Contact enquiry` — Submit lead form — One — 30d — Primary
   - `Cal.com booking` — Book appointment — One — 30d — Primary
8. When asked how to install: choose **"Install the tag yourself" → Google tag**. Do **not** pick GTM.
9. Send me: the **Conversion ID** (`AW-XXXXXXXXX`, same for all four) and each action's **Conversion Label** (the short string after the `/`).
10. Leave *Enhanced conversions* **off** for now — it needs its own consent/legal handling and we should ship the basic setup first.

**B2. GA4 (reporting only)**
11. Create a GA4 property + Web data stream for `codingforchange.com`. Send me the **Measurement ID** (`G-XXXXXXXXXX`). Don't use the stream's "install" snippet — I'm loading it through the shared `gtag.js`.
12. *Admin → Data collection → Google signals:* leave **off** (it enables cross-device ads data and widens our disclosure obligations for no benefit — Ad Grants can't remarket anyway).
13. *Admin → Data retention:* raise event retention from the **2-month default** to 14 months.
14. *Admin → Account settings:* accept the **Google Ads Data Processing Terms / Measurement Controller-Controller terms** (needed for our GDPR paperwork to be honest).
15. ⚠️ Do **not** import GA4 key events into Google Ads as conversions — the direct Ads tag already covers that, and doing both double-counts (§5).

**C. Cal.com prerequisite (this one gates a whole conversion)**
16. Check CMS → *Site Configuration → Booking page URL*. The real booking conversion **only works if it's a `cal.com/<user>/<event>` link.** If it's a Google Calendar appointment-schedule URL, the embed is an opaque cross-origin iframe and completions are invisible — tell me and I'll plan a Cal.com webhook instead. Send me what it's currently set to.

**D. Campaign side (independent of me, but needed for compliance)**
17. Confirm every campaign uses a **conversion-based Smart Bidding** strategy (Maximize conversions to start).
18. Confirm geo-targeting is set to where we actually operate (Munich/Bavaria/Germany), not worldwide.
19. Confirm ≥2 sitelink assets exist and account CTR is trending above 5%.

**E. Legal sign-off**
20. Review the Datenschutz/Impressum text I'll draft (§8) — you're the one signing off for the e.V. It now needs a GA4 section too. Then paste the blocks into the CMS Legal global, same flow as `inner/cms/LEGAL-CONTENT.md`.

**F. Deploy**
21. Add the new env vars to the production `.env` (values from steps 6, 9, 11) and redeploy. **One migration ships with this** (the `booking_completed` enum value), which auto-applies on CMS boot — so watch `docker logs homepage-cms-1` on the first deploy rather than assuming it came up clean.
22. Screenshot the Cookiebot subpage count as a baseline, and put a quarterly reminder in the calendar to re-check it against the 50 limit.

---

## 8. MY actions (code)

**One migration is required** — the `booking_completed` enum value (§6d) — so item 6 follows the full `CLAUDE.md` process. Everything else is app code.

1. **`inner/src/lib/consent.ts`** (new) — thin wrapper over Cookiebot: `hasConsent('statistics' | 'marketing')`, a subscribe helper for `CookiebotOnAccept`/`CookiebotOnDecline`/`CookiebotOnConsentReady`, and `renewConsent()` for the footer link. Typed, SSR-safe, no-ops when Cookiebot is absent — **local dev without a CBID must keep working exactly as today**.
2. **`inner/src/lib/googleAds.ts`** (new) — `trackAdsConversion(action)` mapping our four action names to `send_to: AW-…/label`, guarded on the tag existing. Fails silent, never blocks a form submit.
3. **`inner/src/app/layout.tsx`** — inject the three `<head>` snippets in the order from §5, reading `COOKIEBOT_CBID` / `GOOGLE_ADS_CONVERSION_ID` / `GA4_MEASUREMENT_ID` + the four label vars from runtime env; render nothing when unset.
4. **Conversion call sites** — `trackAdsConversion(...)` alongside the existing `trackConversion(...)` in `BecomeAMember.tsx:63` + `:146` and `Contact.tsx:111`.
5. **Cal.com real booking conversion** (§6d) — `getCalApi()` + `bookingSuccessful` subscription in `BookingEmbed.tsx`, deduped on booking `uid`, guarded to the `calLink` branch. Fix the stale comment at `:70-72` while I'm there.
6. **Migration** — add `booking_completed` to `EVENT_TYPES` / `AnalyticsEvents.ts`, then generate the migration in a throwaway Postgres per `CLAUDE.md` (baseline with `payload migrate` first, so the diff is against the last-deployed schema, not a `push`-mutated dev DB). Review the SQL, `pnpm build` to gate the type-check, commit code + migration together.
7. **Consent gating for our first-party analytics** (your Q2 answer) — `trackEvent` and the attribution capture become conditional on `statistics` consent; DNT/GPC stay as an additional opt-out. Events fired before consent resolves get queued and flushed on accept, or dropped on decline, so we don't lose the `landing` event of every consenting visitor to a race. Update the doc comments in `analytics.ts` / `attribution.ts` that currently assert a no-consent-needed design.
8. **Footer "Cookie settings" link** — reopens the Cookiebot dialog (`renewConsent()`), DE/EN via existing i18n. Legally required: withdrawal must be as easy as giving consent.
9. **`/3d` banner fix** — Cookiebot loader in `outer/src/index.html` so the banner renders over the 3D scene, plus a `window.self !== window.top` guard in the inner app so it doesn't also render a second banner inside the monitor iframe. Same origin ⇒ one shared consent cookie covers both surfaces.
10. **Env plumbing** — `.env.example` (documented), `docker-compose.yml`, `docker-compose.dev.yml`, `docker-compose.prod.yml`. Runtime env, no Dockerfile `ARG`s needed (§5).
11. **Legal content draft** — `COOKIE-CONSENT-LEGAL-CONTENT.md`, DE+EN blocks: §Google Ads Conversion Tracking, §Google Analytics 4, §Consent Management (Cookiebot/Usercentrics A/S), each with Art. 6(1)(a) basis, recipient, US transfer/DPF, retention, withdrawal — plus a cookie table. Also **corrects the existing Datenschutz**, which currently describes a cookieless, banner-free site and becomes false the moment this ships.
12. **Verification pass** — dev stack, and I'll report what I actually observe rather than what should happen: no `_gcl_*` or `_ga` cookie before consent; cookieless pings on decline; `_gcl_aw` + a conversion hit on accept; consent persisting across the `/` ↔ `/3d` boundary; a real test booking firing `bookingSuccessful`; Google Ads *Tag diagnostics* reporting "Recording conversions"; Cookiebot's consent-mode report green.

**Order.** Items 8, 9, 11 need nothing from you — I can start immediately. Items 1–5, 7, 10 I can write and test against dummy IDs, then swap in the real ones. Item 6 (migration) is independent of your steps too. End-to-end verification (12) needs the CBID + Conversion ID + Measurement ID, and the booking half of it needs A-16 answered.

---

## 9. Decisions — resolved 2026-07-27

**Q1 — GTM/GA4? → `gtag.js` with GA4, no GTM.** GA4 for reporting only; conversions via the direct Ads tag; GA4 key events explicitly **not** imported (double-counting risk, §5). GTM rejected: unversioned tag config outside PR review, for a benefit (no-deploy tag edits) we don't currently need. Addable later without rework.

**Q2 — Gate our first-party analytics behind consent? → Yes, gate on "statistics".** Removes the TDDDG § 25 exposure on the sessionStorage writes entirely; marginal data cost, since the same visitors are already lost on the Google side. Conversion *rows* (waitlist/contact submissions) are unaffected — only their attribution fields go empty for non-consenting visitors. Requires rewriting the "no consent needed" rationale in `LEGAL-CONTENT.md` §7 Reichweitenmessung.

**Q3 — CMP? → Cookiebot Free**, on the pageview-cap reasoning in §4. Accepted risk: auto-upgrade to a paid tier once the scanner crawls >50 URLs; mitigated by crawl exclusions + a quarterly check (action F-22), with Klaro or €15/mo Premium Small as the exits.

**Q4 — The two extras? → Both in scope.** `/3d` banner fix (§5, item 9) and real Cal.com booking conversions (§6d, items 5–6).

### Still open — one blocker

**A-16: is the CMS booking URL a `cal.com` link or a Google Calendar appointment schedule?** If the latter, the `bookingSuccessful` approach is dead on arrival (opaque cross-origin iframe) and the booking conversion needs a Cal.com/Google webhook instead — a materially bigger piece of work. Everything else can proceed regardless.

---

## Sources

- [Ad Grants account management policy](https://support.google.com/nonprofits/answer/117827?hl=en) — conversion tracking + Smart Bidding mandate, 1/month floor, 5% CTR, deactivation
- [Ad Grants Policy Compliance Guide](https://support.google.com/nonprofits/answer/9314402?hl=en) — meaningful-conversion examples, categorisation, count-one
- [Cookiebot pricing](https://www.cookiebot.com/en/pricing/) — free tier limits, paid tiers
- [Cookiebot pricing explained (2026)](https://www.cookiebannerguide.com/cookiebot-pricing/) — free-plan feature breakdown
- [Cookiebot pricing / hidden costs](https://www.enzuzo.com/blog/cookiebot-pricing) — subpage definition, auto-upgrade behaviour
- [Premium Lite plan (Cookiebot support)](https://support.cookiebot.com/hc/en-us/articles/13775776141468-Premium-Lite-Plan) — what happens past the limit
- [Implementing Google Consent Mode (Cookiebot support)](https://support.cookiebot.com/hc/en-us/articles/360016047000-Implementing-Google-Consent-Mode) — snippet order, `data-cookieconsent="ignore"`
- [Cookiebot CMP × Consent Mode v2](https://www.cookiebot.com/en/cookiebot-cmp-google-consent-mode/)
- [Google Consent Mode v2 explained (Stape)](https://stape.io/blog/google-consent-mode-v2) — basic vs advanced
- [Consent Mode v2 audit guide (aubado)](https://www.aubado.com/blog/google-ads-consent-mode-guide) — modeling activation thresholds
- [CookieYes pricing](https://www.cookieyes.com/pricing/) — **free tier is 5,000 pageviews/month**, pageview = page load (supersedes the 25,000 figure in secondary blogs)
- [Klaro (kiprotect/klaro)](https://github.com/kiprotect/klaro) — self-hosted option
- [Cal.com embed events](https://cal.com/help/embedding/embed-events) — `Cal("on", { action: "bookingSuccessful", callback })`, `uid` + `allBookings` payload
- [calcom#13835](https://github.com/calcom/cal.diy/issues/13835) — `bookingSuccessful` does not fire on reschedule
