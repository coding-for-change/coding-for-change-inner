import React from 'react';

/**
 * "Cookie settings" affordance for the 3D scene.
 *
 * The inner site is embedded in the 3D monitor via a same-origin iframe. Its
 * consent banner is deliberately suppressed while framed (see `ConsentManager`
 * in the inner app) — otherwise the banner renders *inside* the simulated CRT,
 * a few hundred pixels wide and angled in 3D space, which is unusable and would
 * fail Google's audit criterion 1 ("visible banner requiring affirmative
 * action") on its own.
 *
 * So this surface doesn't collect consent; it links to `/`, where the banner
 * works properly. That is lawful because with no consent stored **nothing is
 * stored on this page either**: Google Consent Mode defaults to denied, so
 * gtag.js sets no cookies, and our first-party analytics is consent-gated. A
 * `/3d` visitor is simply not measured until they consent somewhere.
 *
 * Why not run a second Klaro instance here? It would mean duplicating the
 * banner's DE/EN legal text into the outer bundle — and the two Docker builds
 * have separate contexts (`./outer` vs `./inner`), so no shared file can reach
 * both. Two copies of consent wording that must stay identical to be lawful is a
 * worse risk than one extra click. Revisit if `/3d` ever becomes a landing page
 * for campaigns; today it's `noindex` and opt-in, and ad traffic lands on `/`.
 */
const ConsentLink: React.FC = () => (
    <a
        href="/"
        style={{
            position: 'absolute',
            bottom: 8,
            left: 12,
            zIndex: 50,
            fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
            fontSize: 11,
            color: 'rgba(255, 255, 255, 0.45)',
            textDecoration: 'underline',
            pointerEvents: 'auto',
        }}
    >
        Cookie settings
    </a>
);

export default ConsentLink;
