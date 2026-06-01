import React from 'react';
import { Link } from '../general';
import { useSiteConfig } from '../../api';
import useIsMobile from '../../hooks/useIsMobile';
import { useLanguage } from '../../contexts/LanguageContext';

export interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
    const siteConfig = useSiteConfig();
    const isMobile = useIsMobile();
    const { t } = useLanguage();

    return (
        <div style={Object.assign({}, styles.page, isMobile && styles.pageMobile)}>
            <div
                style={Object.assign(
                    {},
                    styles.header,
                    isMobile && styles.headerMobile
                )}
            >
                <h1
                    style={Object.assign(
                        {},
                        styles.name,
                        isMobile && styles.nameMobile
                    )}
                >
                    {siteConfig.clubName}
                </h1>
                <h2>{siteConfig.tagline}</h2>
            </div>
            <div style={styles.buttons}>
                <Link containerStyle={styles.link} to="about" text={t.home.about} />
                <Link containerStyle={styles.link} to="events" text={t.home.events} />
                <Link containerStyle={styles.link} to="projects" text={t.home.projects} />
                <Link containerStyle={styles.link} to="team" text={t.home.team} />
                <Link containerStyle={styles.link} to="join" text={t.home.join} />
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    page: {
        left: 0,
        right: 0,
        top: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%',
    },
    pageMobile: {
        bottom: 0,
        height: 'auto',
        overflowY: 'auto',
        justifyContent: 'flex-start',
        padding: '32px 16px',
        boxSizing: 'border-box',
    },
    header: {
        textAlign: 'center',
        marginBottom: 64,
        marginTop: 64,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerMobile: {
        marginTop: 8,
        marginBottom: 40,
    },
    buttons: {
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    link: {
        padding: 16,
    },
    name: {
        fontSize: 72,
        marginBottom: 16,
        lineHeight: 0.9,
    },
    nameMobile: {
        fontSize: 40,
    },
};

export default Home;
