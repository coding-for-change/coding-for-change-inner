INSTRUCTIONS (do not copy this part)
================================================================

Dated 2026-07-27. Two changes to the published privacy policy. Every other
section stays as it is — in particular 9 (Google Ads) and 10 (Google Analytics),
which are still cookie-based and still consent-gated.

Reason: reach measurement no longer stores anything on the visitor's device. That
takes it outside § 25 TDDDG, so it runs on Art. 6(1)(f) GDPR and is no longer
controlled by the cookie banner. The persistent 180-day visitor id was removed
entirely.

--------------------------------------------------------------------------------
CHANGE 1 — replace section 7 in full
Keep the heading: 7. Reach measurement and usage analytics
Replace everything beneath it with the following:
--------------------------------------------------------------------------------

To understand which channels (e.g. posters, QR codes, newsletters, social-media posts, search engines) bring visitors to our website and how the website is used, we operate our own reach measurement. It runs exclusively on our own infrastructure within the EU; the data is not shared with any third party for this purpose.

We collect:

- the campaign label contained in a tagged link (e.g. the "src" parameter or "utm_*" parameters);
- for untagged visits — if your browser transmits it — the domain of the referring website (e.g. google.com), which we assign to a broad channel (search, social media, referral or direct); we do not store the full address of the referring page;
- the pages you view and individual interactions (starting and submitting a form, reaching the booking widget, completing a booking) and the language setting.

No cookies and no storage on your device: this measurement stores nothing at all on your device — no cookie, no local storage. The campaign label and a randomly generated session number exist only in your browser's working memory for as long as the tab is open, so that a sign-up can be related to the link you arrived through. They are gone when you reload the page, open a new tab, or close the tab. There is no way for us to recognise you on a later visit, on another device, or in another tab.

We store no IP address, create no fingerprint, do not track you across other websites, and do not combine this data with any other source. We count events, not people: we can tell that a poster produced 37 visits and 4 sign-ups, but not how many distinct individuals that was.

If you submit a form (contact, application or waitlist form), the campaign label of your visit is stored together with your submission so that we can understand which measure led to it.

Legal basis: Art. 6(1)(f) GDPR. Our legitimate interest lies in measuring and improving the reach and effectiveness of our non-commercial public-relations work. Because nothing is stored on or read from your device, § 25 TDDDG does not apply and no consent is required.

Your right to object: if your browser sends a "Do Not Track" or "Global Privacy Control" signal, we collect nothing at all. That is the simplest way to exercise your right to object under Art. 21 GDPR. Your other rights under section 15 remain unaffected.

Storage duration: usage events are deleted automatically after 12 months. A campaign label stored with a form submission is deleted together with that submission.

--------------------------------------------------------------------------------
CHANGE 2 — section 8, delete three lines from the cookie list
--------------------------------------------------------------------------------

These three entries no longer exist and must be removed:

    cfc.visitor (localStorage) – random visitor id for reach measurement ...
    cfc.attribution (localStorage) – the campaign you arrived through ...
    cfc.session (sessionStorage) – random session id ...

The remaining five are unchanged and still accurate:
cfc_consent, cfc_consent_id, cfc-locale, _gcl_aw/_gcl_dc, _ga.

--------------------------------------------------------------------------------
NOTE FOR LEGAL REVIEW
--------------------------------------------------------------------------------

Section 7 asserts that § 25 TDDDG does not apply. That rests on ephemeral working
memory not counting as "storage in terminal equipment" — the mainstream reading,
though EDPB Guidelines 02/2023 leave room for argument under a very broad
interpretation. If you would rather not state it that plainly, drop the sentence
that names § 25 and simply keep the statement that nothing is stored on the
device, which is factually true either way.
