import React from 'react';
import { Link } from '../general';
import { useSiteConfig } from '../../api';

export interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
    const siteConfig = useSiteConfig();

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.name}>{siteConfig.clubName}</h1>
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
    header: {
        textAlign: 'center',
        marginBottom: 64,
        marginTop: 64,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttons: {
        justifyContent: 'space-between',
    },
    link: {
        padding: 16,
    },
    name: {
        fontSize: 72,
        marginBottom: 16,
        lineHeight: 0.9,
    },
};

export default Home;
