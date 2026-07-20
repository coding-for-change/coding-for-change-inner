'use client';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import RouterLink from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCmsCollection } from '../../api';
import type { CmsEvent, CmsSponsor, CmsBlogPost } from '../../api/types';
import './mobile.css';

// Mobile-nav palette via the app-shell theme tokens (see index.css --cfc-*),
// so the mobile chrome follows the light/dark theme set on <html data-theme>.
const BG = 'var(--cfc-bg)';
const SURFACE = 'var(--cfc-surface)';
const HEADING = 'var(--cfc-heading)';
const MUTED = 'var(--cfc-text)';
const ACCENT = 'var(--cfc-cta-bg)';
const LINE = 'var(--cfc-line)';
// The nav uses the site's display face (Space Grotesk) via the CSS variable set
// on <html> in layout.tsx, matching the desktop TopNav.
const NAV_FONT = "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif";

const LANGUAGES: { code: 'de' | 'en'; label: string; flag: string }[] = [
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
];

const MobileNav: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const pathname = usePathname();
    const { t, locale, setLocale } = useLanguage();
    const langRef = useRef<HTMLDivElement>(null);

    // Close the menu whenever the route changes.
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Lock background scroll while the overlay is open.
    useEffect(() => {
        if (open) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = prev;
            };
        }
    }, [open]);

    // Close the language dropdown on outside click.
    useEffect(() => {
        if (!langOpen) return;
        const onDown = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [langOpen]);

    // Events, Blog & Sponsors only appear when they have content (pages exist either way).
    const { data: events } = useCmsCollection<CmsEvent>('events');
    const { data: posts } = useCmsCollection<CmsBlogPost>('blog-posts');
    const { data: sponsors } = useCmsCollection<CmsSponsor>('sponsors');
    const hasEvents = (events?.length ?? 0) > 0;
    const hasBlog = (posts?.length ?? 0) > 0;
    const hasSponsors = (sponsors?.length ?? 0) > 0;

    const navLinks = [
        { to: '/about', label: t.nav.about },
        { to: '/projects', label: t.nav.projects },
        ...(hasEvents ? [{ to: '/events', label: t.nav.events }] : []),
        ...(hasBlog ? [{ to: '/blog', label: t.nav.blog }] : []),
        { to: '/team', label: t.nav.team },
        ...(hasSponsors ? [{ to: '/sponsors', label: t.nav.sponsors }] : []),
        { to: '/#qa', label: t.nav.qa }, // FAQ stays a homepage section
        { to: '/contact', label: t.nav.contact },
    ];

    const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

    return (
        <>
            <header style={styles.header}>
                <div style={styles.brand}>
                    <RouterLink href="/" style={styles.logoLink} aria-label="Coding for Change">
                        <img
                            src="/images/logo.svg"
                            alt="Coding for Change"
                            width={190}
                            height={26}
                            style={styles.logo}
                        />
                    </RouterLink>
                </div>
                <button
                    onClick={() => setOpen(true)}
                    style={styles.menuButton}
                    aria-label="Open menu"
                >
                    <span style={styles.line} />
                    <span style={styles.line} />
                    <span style={styles.line} />
                </button>
            </header>

            {open && (
                <div className="mobile-menu-overlay" style={styles.overlay}>
                    <div style={styles.overlayHeader}>
                        <div style={styles.brand}>
                            <RouterLink
                                href="/"
                                style={styles.logoLink}
                                onClick={() => setOpen(false)}
                            >
                                <img
                                    src="/images/logo.svg"
                                    alt="Coding for Change"
                                    width={190}
                                    height={26}
                                    style={styles.logo}
                                />
                            </RouterLink>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            style={styles.closeButton}
                            aria-label="Close menu"
                        >
                            ✕
                        </button>
                    </div>

                    <nav style={styles.nav}>
                        {navLinks.map((link, i) => (
                            <RouterLink
                                key={link.to}
                                href={link.to}
                                className="mobile-menu-item"
                                style={Object.assign({}, styles.navLink, {
                                    animationDelay: `${i * 0.05}s`,
                                })}
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </RouterLink>
                        ))}
                    </nav>

                    <RouterLink
                        href="/join"
                        className="mobile-menu-item"
                        style={Object.assign({}, styles.ctaButton, {
                            animationDelay: `${navLinks.length * 0.05}s`,
                        })}
                        onClick={() => setOpen(false)}
                    >
                        {t.nav.join}
                    </RouterLink>

                    <div
                        ref={langRef}
                        className="mobile-menu-item"
                        style={Object.assign({}, styles.langWrap, {
                            animationDelay: `${(navLinks.length + 1) * 0.05}s`,
                        })}
                    >
                        <button
                            style={styles.langToggle}
                            onClick={() => setLangOpen((o) => !o)}
                            aria-haspopup="listbox"
                            aria-expanded={langOpen}
                        >
                            <span>
                                {current.flag} {current.label}
                            </span>
                            <span style={styles.caret}>{langOpen ? '▴' : '▾'}</span>
                        </button>
                        {langOpen && (
                            <div style={styles.langMenu} role="listbox">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        role="option"
                                        aria-selected={lang.code === locale}
                                        style={Object.assign(
                                            {},
                                            styles.langOption,
                                            lang.code === locale && styles.langOptionActive
                                        )}
                                        onClick={() => {
                                            setLocale(lang.code);
                                            setLangOpen(false);
                                        }}
                                    >
                                        {lang.flag} {lang.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

const styles: StyleSheetCSS = {
    header: {
        display: 'flex',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        zIndex: 100,
        background: BG,
        borderBottom: `1px solid ${LINE}`,
        padding: '0 20px',
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minWidth: 0,
    },
    logoLink: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        flexShrink: 0,
    },
    logo: {
        height: 30,
        width: 'auto',
        objectFit: 'contain',
        // Black wordmark → white in dark theme, unchanged in light (see --cfc-logo-filter).
        filter: 'var(--cfc-logo-filter)',
    },
    menuButton: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        flexShrink: 0,
    },
    line: {
        display: 'block',
        width: 24,
        height: 2,
        background: HEADING,
        borderRadius: 2,
        flexShrink: 0,
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 500,
        background: BG,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px 32px',
    },
    overlayHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        flexShrink: 0,
        marginBottom: 16,
    },
    closeButton: {
        display: 'flex',
        width: 44,
        height: 44,
        border: `2px solid ${LINE}`,
        borderRadius: 8,
        background: 'transparent',
        fontSize: 16,
        color: HEADING,
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
    },
    navLink: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '16px 0',
        fontSize: 24,
        color: HEADING,
        fontFamily: NAV_FONT,
        textDecoration: 'none',
        borderBottom: `1px solid ${LINE}`,
    },
    ctaButton: {
        display: 'flex',
        marginTop: 28,
        background: ACCENT,
        color: BG,
        borderRadius: 32,
        padding: '18px 0',
        fontSize: 20,
        fontFamily: NAV_FONT,
        textDecoration: 'none',
        justifyContent: 'center',
        alignItems: 'center',
    },
    langWrap: {
        display: 'flex',
        position: 'relative',
        marginTop: 20,
        alignSelf: 'flex-start',
    },
    langToggle: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        borderRadius: 10,
        border: `1px solid ${LINE}`,
        background: 'transparent',
        cursor: 'pointer',
        fontSize: 15,
        color: HEADING,
        fontFamily: NAV_FONT,
    },
    caret: {
        fontSize: 12,
        color: MUTED,
    },
    langMenu: {
        display: 'flex',
        position: 'absolute',
        bottom: 'calc(100% + 6px)',
        left: 0,
        flexDirection: 'column',
        minWidth: '100%',
        background: SURFACE,
        border: `1px solid ${LINE}`,
        borderRadius: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        zIndex: 10,
    },
    langOption: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: 15,
        color: HEADING,
        fontFamily: NAV_FONT,
        whiteSpace: 'nowrap',
        textAlign: 'left',
    },
    langOptionActive: {
        background: 'var(--cfc-line)',
    },
};

export default MobileNav;
