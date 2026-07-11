import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
// All four global stylesheets — importing every one here is what the old CRA
// build did via index.tsx/App.tsx. (The abandoned migration dropped App.css and
// mobile.css, which is what broke its formatting.)
import '../index.css';
import '../App.css';
import '../components/showcase/landing.css';
import '../components/mobile/mobile.css';

import Providers from './providers';
import InputRelay from './InputRelay';
import { fetchGlobal } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsSiteConfig } from '@/api/types';

const robotoMono = localFont({
    src: '../assets/fonts/RobotoMono-latin.woff2',
    weight: '100 700',
    display: 'swap',
    variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://codingforchange.com'),
    title: 'Coding for Change — TUM Student Initiative for Social Tech (Munich, Club)',
    description:
        'Coding for Change is a TUM student initiative and Munich-based Club. We build software for NGOs, host hackathons, and bring students together for social good. Join us in Munich.',
    manifest: '/manifest.json',
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: '/images/apple-touch-icon.png',
    },
    openGraph: {
        type: 'website',
        url: 'https://codingforchange.com/',
        title: 'Coding for Change — TUM Student Initiative',
        description:
            "Munich's leading social computer science initiative. Software for NGOs. TUM students welcome.",
        images: ['/images/android-chrome-512x512.png'],
        locale: 'en_US',
        alternateLocale: 'de_DE',
    },
    twitter: {
        card: 'summary',
        title: 'Coding for Change — TUM Student Initiative',
        description: "Munich's leading social computer science initiative.",
    },
};

export const viewport: Viewport = {
    themeColor: '#000000',
    width: 'device-width',
    initialScale: 1,
};

// Organization structured data — the canonical entity description for search
// engines and LLMs. Facts here are stable, so they live in code rather than the
// CMS; the About page's editorial copy is CMS-managed (the `about` global).
const ORG_JSONLD = {
    '@context': 'https://schema.org',
    '@type': ['NGO', 'EducationalOrganization'],
    name: 'Coding for Change',
    legalName: 'Coding for Change e.V.',
    url: 'https://codingforchange.com',
    logo: 'https://codingforchange.com/images/android-chrome-512x512.png',
    description:
        'Munich-based, gemeinnütziger (charitable) student initiative and TUM-accredited student club building free custom software for nonprofit organizations.',
    slogan: 'Helping NGOs escape the digital stone age',
    foundingDate: '2026-04',
    foundingLocation: 'Munich, Germany',
    areaServed: 'DE',
    email: 'info@codingforchange.com',
    founder: [
        { '@type': 'Person', name: 'David Franke' },
        { '@type': 'Person', name: 'Jakob Landbrecht' },
        { '@type': 'Person', name: 'Tim Kausemann' },
        { '@type': 'Person', name: 'Alexander Reyers' },
    ],
    memberOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Technical University of Munich',
        url: 'https://www.tum.de',
    },
    sameAs: [
        'https://www.linkedin.com/company/coding-for-change-tum/',
        'https://github.com/coding-for-change',
    ],
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getServerLocale();
    const siteConfig = await fetchGlobal<CmsSiteConfig>('site-config', locale);

    return (
        <html lang={locale} className={robotoMono.variable}>
            <head>
                {/* `_parent` keeps links working when the OS is embedded in the
                    3D scene's monitor iframe. */}
                <base target="_parent" />
                {}
                <link rel="preconnect" href="https://use.typekit.net" />
                <link
                    rel="preconnect"
                    href="https://p.typekit.net"
                    crossOrigin="anonymous"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html:
                            "(function(){var l=document.createElement('link');" +
                            "l.rel='stylesheet';l.href='https://use.typekit.net/llo2eru.css';" +
                            "l.media='print';l.onload=function(){this.onload=null;this.media='all'};" +
                            'document.head.appendChild(l);})();',
                    }}
                />
                <noscript>
                    {/* eslint-disable-next-line @next/next/no-page-custom-font */}
                    <link rel="stylesheet" href="https://use.typekit.net/llo2eru.css" />
                </noscript>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
                />
            </head>
            <body>
                <noscript>
                    <h1>Coding for Change — Munich&apos;s Student Initiative for Social Tech</h1>
                    <p>
                        Coding for Change is a Club and Technical University of Munich (TUM)
                        student initiative based in Munich. We build software for NGOs, host
                        hackathons, and bring students together to use code for social good.
                    </p>
                    <nav>
                        <a href="/about">About</a> · <a href="/team">Team</a> ·{' '}
                        <a href="/projects">Projects</a> · <a href="/events">Events</a> ·{' '}
                        <a href="/sponsors">Sponsors</a> · <a href="/qa">FAQ</a> ·{' '}
                        <a href="/join">Join</a> · <a href="/contact">Contact</a>
                    </nav>
                </noscript>

                {/* Force the custom pixel fonts to load before first paint. */}
                <div
                    className="font_preload"
                    style={{
                        opacity: 0,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 0,
                        height: 0,
                        overflow: 'hidden',
                        pointerEvents: 'none',
                    }}
                    aria-hidden
                >
                    <span style={{ fontFamily: "'MSSerif', Arial, sans-serif" }}>abc</span>
                    <span style={{ fontFamily: "'Millennium', Arial, sans-serif" }}>abc</span>
                    <span style={{ fontFamily: "'MillenniumBold', Arial, sans-serif" }}>abc</span>
                    <span style={{ fontFamily: "'Terminal', Arial, sans-serif" }}>abc</span>
                </div>

                <InputRelay />
                <Providers initialLocale={locale} initialConfig={siteConfig}>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
