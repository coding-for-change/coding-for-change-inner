import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import Logo from '../../assets/Logo.png';
import './mobile.css';

const NAVY = '#0f2040';
const PIXEL_FONT = "MillenniumBold, 'Times New Roman', Times, serif";

// Distance (px) the user scrolls before the "Coding for Change" wordmark
// is fully revealed next to the logo.
const REVEAL_DISTANCE = 90;

const LANGUAGES: { code: 'de' | 'en'; label: string; flag: string }[] = [
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
];

const MobileNav: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [reveal, setReveal] = useState(0);
    const location = useLocation();
    const { t, locale, setLocale } = useLanguage();
    const langRef = useRef<HTMLDivElement>(null);

    // Close the menu whenever the route changes.
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    // Reveal the wordmark progressively as the page scrolls.
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY || document.documentElement.scrollTop || 0;
            setReveal(Math.min(1, y / REVEAL_DISTANCE));
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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

    const navLinks = [
        // Sections on the single-scroll landing page.
        { to: '/#about', label: t.nav.about },
        { to: '/#events', label: t.nav.events },
        { to: '/#projects', label: t.nav.projects },
        { to: '/#sponsors', label: t.nav.sponsors },
        { to: '/#qa', label: t.nav.qa },
        // Standalone pages.
        { to: '/team', label: t.nav.team },
        { to: '/blog', label: t.nav.blog },
        { to: '/contact', label: t.nav.contact },
    ];

    const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

    return (
        <>
            <header style={styles.header}>
                <div style={styles.brand}>
                    <RouterLink to="/" style={styles.logoLink}>
                        <img src={Logo} alt="Coding for Change" style={styles.logo} />
                    </RouterLink>
                    <span
                        style={Object.assign({}, styles.wordmark, {
                            opacity: reveal,
                            transform: `translateX(${(1 - reveal) * -8}px)`,
                        })}
                    >
                        Coding for Change
                    </span>
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
                                to="/"
                                style={styles.logoLink}
                                onClick={() => setOpen(false)}
                            >
                                <img
                                    src={Logo}
                                    alt="Coding for Change"
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
                                to={link.to}
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
                        to="/join"
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
        background: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
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
    },
    wordmark: {
        fontFamily: PIXEL_FONT,
        fontSize: 20,
        color: '#000',
        whiteSpace: 'nowrap',
        transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        pointerEvents: 'none',
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
        background: '#000',
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
        background: '#ffffff',
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
        border: `2px solid ${NAVY}`,
        borderRadius: 8,
        background: 'white',
        fontSize: 16,
        color: NAVY,
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
        color: '#000',
        fontFamily: PIXEL_FONT,
        textDecoration: 'none',
        borderBottom: '1px solid #f0f0f0',
    },
    ctaButton: {
        display: 'flex',
        marginTop: 28,
        background: '#000000',
        color: '#ffffff',
        borderRadius: 32,
        padding: '18px 0',
        fontSize: 20,
        fontFamily: PIXEL_FONT,
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
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        cursor: 'pointer',
        fontSize: 15,
        color: '#000',
        fontFamily: PIXEL_FONT,
    },
    caret: {
        fontSize: 12,
        color: '#6b7280',
    },
    langMenu: {
        display: 'flex',
        position: 'absolute',
        bottom: 'calc(100% + 6px)',
        left: 0,
        flexDirection: 'column',
        minWidth: '100%',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
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
        color: '#000',
        fontFamily: PIXEL_FONT,
        whiteSpace: 'nowrap',
        textAlign: 'left',
    },
    langOptionActive: {
        background: '#f3f4f6',
    },
};

export default MobileNav;
