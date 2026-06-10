import type { Metadata, Viewport } from 'next';
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

// Organization structured data (ported from the old index.html).
const ORG_JSONLD = {
    '@context': 'https://schema.org',
    '@type': ['NGO', 'EducationalOrganization'],
    name: 'Coding for Change',
    alternateName: 'Coding for Change e.V.',
    url: 'https://codingforchange.com',
    logo: 'https://codingforchange.com/images/android-chrome-512x512.png',
    description:
        'Munich-based, TUM-accredited student initiative and Club building software for NGOs.',
    foundingLocation: 'Munich, Germany',
    areaServed: 'DE',
    sameAs: [
        'https://www.linkedin.com/company/coding-for-change/',
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
        <html lang={locale}>
            <head>
                {/* `_parent` keeps links working when the OS is embedded in the
                    3D scene's monitor iframe. */}
                <base target="_parent" />
                <link rel="stylesheet" href="https://use.typekit.net/llo2eru.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500;700&display=swap"
                />
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
