'use client';
import React from 'react';
import RouterLink from 'next/link';
import { useSiteConfig, useLanguage } from '../../api';

// Dark-navy footer palette (matches the .lp site tokens).
const BG = '#0a1830';
const HEADING = '#eef4fb';
const MUTED = '#9db0c7';
const ACCENT = '#7fe3e4';
const LINE = 'rgba(255, 255, 255, 0.1)';
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

/**
 * Site-wide footer. Shared by the desktop site shell and the mobile layout —
 * with the Windows-95 desktop chrome (and its shortcuts) gone, this is now the
 * canonical way to reach the Imprint, Privacy and Credits pages. Labels are
 * localized (EN/DE) via the translation table. A centered max-width inner block
 * keeps it readable full-width on desktop and stacked on mobile.
 */
const SiteFooter: React.FC = () => {
    const siteConfig = useSiteConfig();
    const { t } = useLanguage();

    const f = t.footer;
    const PAGE_LINKS = [
        { to: '/', label: f.home },
        { to: '/about', label: f.about },
        { to: '/projects', label: f.projects },
        { to: '/team', label: f.team },
        { to: '/blog', label: f.blog },
        { to: '/#sponsors', label: f.sponsors },
        { to: '/partner', label: f.partner },
        { to: '/join', label: f.join },
    ];

    const INFO_LINKS = [
        { to: '/contact', label: f.contact },
        { to: '/qa', label: f.qa },
        { to: '/privacy', label: f.privacy },
        { to: '/imprint', label: f.imprint },
        { to: '/credits', label: f.credits },
    ];

    return (
        <footer style={styles.footer}>
            <div style={styles.inner}>
                <div style={styles.top}>
                    <img
                        src="/images/logo.svg"
                        alt="Coding for Change"
                        width={220}
                        height={30}
                        style={styles.logo}
                    />
                    {siteConfig.tagline && (
                        <p style={styles.tagline}>{siteConfig.tagline}</p>
                    )}
                    {siteConfig.email && (
                        <a href={`mailto:${siteConfig.email}`} style={styles.email}>
                            {siteConfig.email}
                        </a>
                    )}
                </div>

                <div style={styles.columns}>
                    <div style={styles.column}>
                        <p style={styles.columnHeading}>{f.pages.toUpperCase()}</p>
                        {PAGE_LINKS.map((link) => (
                            <RouterLink key={link.label} href={link.to} style={styles.columnLink}>
                                {link.label}
                            </RouterLink>
                        ))}
                    </div>
                    <div style={styles.column}>
                        <p style={styles.columnHeading}>{f.info.toUpperCase()}</p>
                        {INFO_LINKS.map((link) => (
                            <RouterLink key={link.label} href={link.to} style={styles.columnLink}>
                                {link.label}
                            </RouterLink>
                        ))}
                    </div>
                </div>
            </div>

            {siteConfig.copyrightText && (
                <div style={styles.copyrightWrap}>
                    <div style={styles.divider} />
                    <p style={styles.copyright}>{siteConfig.copyrightText}</p>
                </div>
            )}
        </footer>
    );
};

const styles: StyleSheetCSS = {
    footer: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: BG,
        borderTop: `1px solid ${LINE}`,
        padding: '48px 24px 32px',
        width: '100%',
        boxSizing: 'border-box',
    },
    inner: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 48,
        width: '100%',
        maxWidth: 1060,
        margin: '0 auto',
        boxSizing: 'border-box',
        justifyContent: 'space-between',
    },
    top: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        flex: '1 1 260px',
        minWidth: 240,
    },
    logo: {
        height: 30,
        width: 'auto',
        objectFit: 'contain',
        alignSelf: 'flex-start',
        // Black wordmark SVG → white for the dark footer.
        filter: 'brightness(0) invert(1)',
    },
    tagline: {
        fontFamily: FONT,
        fontSize: 14,
        color: MUTED,
        lineHeight: 1.6,
        margin: 0,
        maxWidth: 280,
    },
    email: {
        fontFamily: FONT,
        fontSize: 14,
        color: ACCENT,
        textDecoration: 'none',
    },
    columns: {
        display: 'flex',
        flexDirection: 'row',
        gap: 64,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
    },
    columnHeading: {
        fontFamily: FONT,
        fontSize: 12,
        fontWeight: 700,
        color: HEADING,
        letterSpacing: 1,
        margin: '0 0 16px 0',
    },
    columnLink: {
        display: 'flex',
        fontFamily: FONT,
        fontSize: 14,
        color: MUTED,
        textDecoration: 'none',
        padding: '6px 0',
    },
    copyrightWrap: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 1060,
        margin: '0 auto',
        boxSizing: 'border-box',
    },
    divider: {
        height: 1,
        backgroundColor: LINE,
        margin: '32px 0 20px',
        width: '100%',
    },
    copyright: {
        fontFamily: FONT,
        fontSize: 12,
        color: MUTED,
        margin: 0,
    },
};

export default SiteFooter;
