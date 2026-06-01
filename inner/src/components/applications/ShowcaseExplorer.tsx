'use client'
import React from 'react';
import Window from '../os/Window';
import VerticalNavbar from '../showcase/VerticalNavbar';
import useInitialWindowSize from '../../hooks/useInitialWindowSize';
import { useSiteConfig } from '../../api';

export interface ShowcaseExplorerProps extends WindowAppProps {
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
                <VerticalNavbar />
                <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    {props.children}
                </div>
            </div>
        </Window>
    );
};

export default ShowcaseExplorer;
