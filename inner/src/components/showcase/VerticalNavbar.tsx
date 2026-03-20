import React, { useEffect, useState } from 'react';
import { Link } from '../general';
import { useLocation } from 'react-router-dom';

export interface VerticalNavbarProps {}

const VerticalNavbar: React.FC<VerticalNavbarProps> = (props) => {
    const location = useLocation();
    const [isHome, setIsHome] = useState(false);

    useEffect(() => {
        if (location.pathname === '/') {
            setIsHome(true);
        } else {
            setIsHome(false);
        }
        return () => {};
    }, [location.pathname]);

    return !isHome ? (
        <div style={styles.navbar}>
            <div style={styles.header}>
                <h1 style={styles.headerText}>Coding for</h1>
                <h1 style={styles.headerText}>Change</h1>
                <h3 style={styles.headerShowcase}>Munich Student Club</h3>
            </div>
            <div style={styles.links}>
                <Link containerStyle={styles.link} to="" text="HOME" />
                <Link containerStyle={styles.link} to="about" text="ABOUT" />
                <Link containerStyle={styles.link} to="events" text="EVENTS" />
                <Link containerStyle={styles.link} to="projects" text="PROJECTS" />
                <Link containerStyle={styles.link} to="sponsors" text="SPONSORS" />
                <Link containerStyle={styles.link} to="team" text="TEAM" />
                <Link containerStyle={styles.link} to="qa" text="Q&A" />
                <Link containerStyle={styles.link} to="join" text="JOIN" />
                <Link containerStyle={styles.link} to="contact" text="CONTACT" />
            </div>
            <div style={styles.spacer} />
        </div>
    ) : (
        <></>
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
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'column',
        marginBottom: 64,
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
};

export default VerticalNavbar;
