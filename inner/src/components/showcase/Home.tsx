import React from 'react';
import { Link } from '../general';
import { useSiteConfig } from '../../api';
import useIsMobile from '../../hooks/useIsMobile';

export interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
    const siteConfig = useSiteConfig();
    const isMobile = useIsMobile();

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
                <Link containerStyle={styles.link} to="about" text="ABOUT" />
                <Link containerStyle={styles.link} to="events" text="EVENTS" />
                <Link containerStyle={styles.link} to="projects" text="PROJECTS" />
                <Link containerStyle={styles.link} to="team" text="TEAM" />
                <Link containerStyle={styles.link} to="join" text="JOIN" />
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
