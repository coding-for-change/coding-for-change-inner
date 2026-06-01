'use client'
import React, { useEffect, useState } from 'react';
import { Link, ExperienceToggle } from '../general';
import { usePathname } from 'next/navigation';
import useIsMobile from '../../hooks/useIsMobile';

export interface VerticalNavbarProps {}

const NAV_LINKS: { to: string; text: string }[] = [
    { to: '', text: 'HOME' },
    { to: 'about', text: 'ABOUT' },
    { to: 'events', text: 'EVENTS' },
    { to: 'projects', text: 'PROJECTS' },
    { to: 'sponsors', text: 'SPONSORS' },
    { to: 'team', text: 'TEAM' },
    { to: 'qa', text: 'Q&A' },
    { to: 'join', text: 'JOIN' },
    { to: 'contact', text: 'CONTACT' },
];

const VerticalNavbar: React.FC<VerticalNavbarProps> = () => {
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const [menuOpen, setMenuOpen] = useState(false);

    const isHome = pathname === '/';

    // Collapse the mobile menu whenever the route changes.
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

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
                    <h3 style={styles.mobileTitle}>Coding for Change</h3>
                    <span style={styles.mobileChevron}>
                        {menuOpen ? '▲' : '▼'}
                    </span>
                </div>
                {menuOpen && (
                    <div style={styles.mobileLinks}>
                        {NAV_LINKS.map((navLink) => (
                            <Link
                                key={navLink.text}
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
                <h1 style={styles.headerText}>Coding for</h1>
                <h1 style={styles.headerText}>Change</h1>
                <h3 style={styles.headerShowcase}>Munich Student Club</h3>
            </div>
            <ExperienceToggle containerStyle={styles.experienceToggle} />
            <div style={styles.links}>
                {NAV_LINKS.map((navLink) => (
                    <Link
                        key={navLink.text}
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
        marginBottom: 28,
    },
    experienceToggle: {
        justifyContent: 'flex-start',
        marginBottom: 48,
    },
    headerText: {
        fontSize: 38,
        lineHeight: 1,
    },
    headerShowcase: {
        marginTop: 12,
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
