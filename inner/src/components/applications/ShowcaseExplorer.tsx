'use client';
import React from 'react';
import Window from '../os/Window';
import TopNav from '../showcase/TopNav';
import useInitialWindowSize from '../../hooks/useInitialWindowSize';
import { useSiteConfig } from '../../api';

export interface ShowcaseExplorerProps extends WindowAppProps {
    // The active route's content, rendered inside the window's scroll area.
    // Routing is handled by the Next.js App Router, not an in-window router.
    children?: React.ReactNode;
}

const ShowcaseExplorer: React.FC<ShowcaseExplorerProps> = (props) => {
    const { initWidth, initHeight } = useInitialWindowSize({ margin: 100 });
    const siteConfig = useSiteConfig();

    return (
        <Window
            top={24}
            left={56}
            width={initWidth}
            height={initHeight}
            trackViewport
            windowTitle={siteConfig.windowTitle || ''}
            windowBarIcon="windowExplorerIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={siteConfig.copyrightText || ''}
        >
            <div className="site-page">
                <TopNav />
                <div className="site-scroll">{props.children}</div>
            </div>
        </Window>
    );
};

export default ShowcaseExplorer;
