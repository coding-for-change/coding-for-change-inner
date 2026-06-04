import React, { useEffect, useState } from 'react';
import { Link, ExperienceToggle } from '../general';
import { useLocation } from 'react-router-dom';
import useIsMobile from '../../hooks/useIsMobile';
import { useLanguage } from '../../contexts/LanguageContext';
import Logo from '../../assets/Logo.png';

export interface VerticalNavbarProps {}

const VerticalNavbar: React.FC<VerticalNavbarProps> = () => {
    const location = useLocation();
    const isMobile = useIsMobile();
    const { t } = useLanguage();
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { to: '', text: t.nav.home },
        { to: 'about', text: t.nav.about },
        { to: 'events', text: t.nav.events },
        { to: 'projects', text: t.nav.projects },
        { to: 'sponsors', text: t.nav.sponsors },
        { to: 'team', text: t.nav.team },
        { to: 'blog', text: t.nav.blog },
        { to: 'qa', text: t.nav.qa },
        { to: 'join', text: t.nav.join },
        { to: 'contact', text: t.nav.contact },
    ];

    const isHome = location.pathname === '/';

    // Collapse the mobile menu whenever the route changes.
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // The Home page carries its own navigation, so no navbar there.
    if (isHome) return <></>;

    // Mobile: a collapsible accordion in place of the fixed sidebar, so
    // the content page gets the full width of the screen.
    if (isMobile) {
        return (
            <div style={styles.mobileNavbar}>
                <div
                    style={styles.mobileHeader}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <h3 style={styles.mobileTitle}>{t.navbar.title}</h3>
                    <span style={styles.mobileChevron}>
                        {menuOpen ? '▲' : '▼'}
                    </span>
                </div>
                {menuOpen && (
                    <div style={styles.mobileLinks}>
                        {navLinks.map((navLink) => (
                            <Link
                                key={navLink.to}
                                containerStyle={styles.mobileLink}
                                to={navLink.to}
                                text={navLink.text}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={styles.navbar}>
            <div style={styles.header}>
                <img src={Logo} alt="Coding for Change" style={styles.logo} />
                <h1 style={styles.headerText}>Coding for Change</h1>
            </div>
            <ExperienceToggle containerStyle={styles.experienceToggle} />
            <div style={styles.links}>
                {navLinks.map((navLink) => (
                    <Link
                        key={navLink.to}
                        containerStyle={styles.link}
                        to={navLink.to}
                        text={navLink.text}
                    />
                ))}
            </div>
            <div style={styles.spacer} />
        </div>
    );
};

const styles: StyleSheetCSS = {
    navbar: {
        width: 300,
        height: '100%',
        flexDirection: 'column',
        padding: 48,
        boxSizing: 'border-box',
        position: 'fixed',
        overflowX: 'hidden',
        overflowY: 'auto',
    },
    header: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 28,
    },
    experienceToggle: {
        justifyContent: 'flex-start',
        marginBottom: 48,
    },
    logo: {
        width: 88,
        height: 'auto',
        objectFit: 'contain',
        marginBottom: 16,
    },
    headerText: {
        fontSize: 34,
        lineHeight: 1.1,
    },
    link: {
        marginBottom: 32,
    },
    links: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
    },
    spacer: {
        flex: 1,
    },
    mobileNavbar: {
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        flexShrink: 0,
    },
    mobileHeader: {
        position: 'sticky',
        top: 0,
        zIndex: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        boxSizing: 'border-box',
        background: 'var(--surface)',
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
        cursor: 'pointer',
    },
    mobileTitle: {
        fontSize: 20,
    },
    mobileChevron: {
        fontFamily: 'MSSerif',
        fontSize: 14,
        marginLeft: 12,
    },
    mobileLinks: {
        flexDirection: 'column',
        padding: '4px 0',
        background: 'var(--surface)',
        borderBottom: '1px solid #808080',
    },
    mobileLink: {
        padding: '14px 20px',
        minHeight: 44,
        boxSizing: 'border-box',
        alignItems: 'center',
    },
};

export default VerticalNavbar;
