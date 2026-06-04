import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '../general';
import { useSiteConfig } from '../../api';
import useIsMobile from '../../hooks/useIsMobile';
import { useLanguage } from '../../contexts/LanguageContext';
import { IconName } from '../../assets/icons';

export interface AboutProps {}

// Quick-launch tiles. About doubles as the org's home screen, so these
// shortcuts are the seed of collapsing the separate subpages into one app.
const EXPLORE: { to: string; icon: IconName }[] = [
    { to: 'projects', icon: 'showcaseIcon' },
    { to: 'team', icon: 'myComputer' },
    { to: 'join', icon: 'credits' },
    { to: 'contact', icon: 'windowExplorerIcon' },
];

const About: React.FC<AboutProps> = () => {
    const siteConfig = useSiteConfig();
    const isMobile = useIsMobile();
    const { t } = useLanguage();
    const a = t.about;

    // Stats come from the CMS (editable without a deploy); fall back to the
    // localized defaults baked into the translations until the global is filled.
    const stats =
        siteConfig.stats && siteConfig.stats.length > 0
            ? siteConfig.stats
            : a.stats;

    const tileLabels: Record<string, string> = {
        projects: t.nav.projects,
        team: t.nav.team,
        join: t.nav.join,
        contact: t.nav.contact,
    };

    return (
        <div className="site-page-content">
            {/* Hero — one bold statement instead of a wall of text */}
            <h1>{siteConfig.clubName || a.title}</h1>
            <h3 style={styles.oneLiner}>{a.oneLiner}</h3>
            <p style={styles.pitch}>{a.pitch}</p>

            {/* Stat strip — a retro CRT readout of our impact */}
            <div
                style={Object.assign(
                    {},
                    styles.statStrip,
                    isMobile && styles.stackMobile
                )}
            >
                {stats.map((s) => (
                    <div key={s.label} style={styles.statCard}>
                        <span style={styles.statValue}>{s.value}</span>
                        <span style={styles.statLabel}>{s.label}</span>
                    </div>
                ))}
            </div>

            {/* How it works — three short steps, not three paragraphs */}
            <h3 style={styles.sectionHeading}>{a.howItWorks}</h3>
            <div
                style={Object.assign(
                    {},
                    styles.steps,
                    isMobile && styles.stackMobile
                )}
            >
                {a.steps.map((step, i) => (
                    <div key={step.title} style={styles.stepCard}>
                        <div style={styles.stepBadge}>{i + 1}</div>
                        <h4 style={styles.stepTitle}>{step.title}</h4>
                        <p style={styles.stepText}>{step.text}</p>
                    </div>
                ))}
            </div>

            {/* Explore — beveled quick-launch shortcuts */}
            <h3 style={styles.sectionHeading}>{a.explore}</h3>
            <div style={styles.exploreGrid}>
                {EXPLORE.map((item) => (
                    <RouterLink
                        key={item.to}
                        to={`/${item.to}`}
                        className="big-button-container"
                        style={styles.tile}
                    >
                        <Icon icon={item.icon} size={36} />
                        <span style={styles.tileLabel}>{tileLabels[item.to]}</span>
                    </RouterLink>
                ))}
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    oneLiner: {
        marginTop: 8,
        marginBottom: 16,
        color: '#333',
    },
    pitch: {
        maxWidth: 580,
        marginBottom: 44,
    },
    // Stat strip
    statStrip: {
        gap: 16,
        marginBottom: 52,
    },
    stackMobile: {
        flexDirection: 'column',
    },
    statCard: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '22px 16px',
        background: '#000',
        boxShadow: 'var(--border-field)',
    },
    statValue: {
        fontFamily: 'Terminal, monospace',
        fontSize: 42,
        lineHeight: 1,
        color: '#33ff66',
        marginBottom: 10,
    },
    statLabel: {
        fontFamily: 'MSSerif, sans-serif',
        fontSize: 13,
        color: '#c0c0c0',
        textAlign: 'center',
    },
    // How it works
    sectionHeading: {
        marginBottom: 20,
    },
    steps: {
        gap: 16,
        marginBottom: 52,
        alignItems: 'stretch',
    },
    stepCard: {
        flex: 1,
        flexDirection: 'column',
        padding: 24,
        background: 'var(--surface)',
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
    },
    stepBadge: {
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        background: 'var(--surface)',
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
        fontFamily: 'MillenniumBold, serif',
        fontSize: 18,
    },
    stepTitle: {
        marginBottom: 8,
    },
    stepText: {
        fontSize: 16,
    },
    // Explore tiles
    exploreGrid: {
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 16,
    },
    tile: {
        display: 'flex',
        flex: '1 1 130px',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 24,
        textDecoration: 'none',
        color: '#000',
    },
    tileLabel: {
        fontFamily: 'MillenniumBold, serif',
        fontSize: 18,
    },
};

export default About;
