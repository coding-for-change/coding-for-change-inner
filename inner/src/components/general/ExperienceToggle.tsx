'use client';
import React, { useEffect, useState } from 'react';
import useIsMobile from '../../hooks/useIsMobile';

export interface ExperienceToggleProps {
    containerStyle?: React.CSSProperties;
}

/**
 * True when the desktop OS is running inside the 3D scene's monitor
 * iframe rather than as the standalone site.
 */
const isEmbedded = (): boolean => {
    try {
        return window.self !== window.top;
    } catch (e) {
        // A cross-origin parent makes window.top unreadable. Only the 3D
        // scene ever embeds this site, so treat that case as embedded.
        return true;
    }
};

/**
 * A context-aware switch between the fast desktop-OS site and the 3D
 * "enhanced experience".
 *
 *  - Standalone, it sends the visitor into the 3D scene at /3d.
 *  - Embedded in the 3D scene's monitor, it leaves the 3D scene and
 *    returns to the fast site. /3d and / share an origin, so the embedded
 *    iframe can drive window.top directly.
 *
 * Rendered in the VerticalNavbar (content pages) and on the Home page so
 * it is always visible — and, because it lives in the page content, it
 * also appears inside the 3D scene's monitor.
 */
const ExperienceToggle: React.FC<ExperienceToggleProps> = ({
    containerStyle,
}) => {
    const isMobile = useIsMobile();
    // `isEmbedded()` can't run during SSR (it reads `window`), and on the
    // server it would default to "embedded" and mismatch the client. Resolve
    // it after mount so the server and first client render agree.
    const [embedded, setEmbedded] = useState(false);
    useEffect(() => setEmbedded(isEmbedded()), []);

    const handleClick = () => {
        if (embedded && window.top) {
            // Leave the 3D scene, keeping the visitor on their current page.
            window.top.location.href = window.location.pathname || '/';
        } else {
            window.location.href = '/3d';
        }
    };

    // The 3D scene isn't offered on mobile, so neither is the switch.
    if (isMobile) return null;

    return (
        <div style={Object.assign({}, styles.wrapper, containerStyle)}>
            <button
                className="site-button"
                style={styles.button}
                onClick={handleClick}
            >
                {embedded
                    ? '◂  Exit 3D mode'
                    : 'Enter 3D mode  ▸'}
            </button>
        </div>
    );
};

const styles: StyleSheetCSS = {
    wrapper: {
        justifyContent: 'center',
    },
    button: {
        fontFamily: 'MillenniumBold, sans-serif',
        fontSize: 18,
        padding: '10px 18px',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
    },
};

export default ExperienceToggle;
