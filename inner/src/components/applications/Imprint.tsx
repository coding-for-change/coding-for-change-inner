import React from 'react';
import Window from '../os/Window';
import { useSiteConfig } from '../../api';
import ImprintContent from '../showcase/ImprintContent';

export interface ImprintProps extends WindowAppProps {}

const Imprint: React.FC<ImprintProps> = (props) => {
    const siteConfig = useSiteConfig();

    return (
        <Window
            top={80}
            left={120}
            width={700}
            height={600}
            windowTitle="Imprint & Privacy Policy"
            windowBarIcon="windowExplorerIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={siteConfig.copyrightText || ''}
        >
            <div className="site-page" style={styles.container}>
                <div style={styles.content}>
                    <ImprintContent />
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    container: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 32,
        paddingBottom: 64,
        overflow: 'auto',
    },
    content: {
        width: '85%',
        flexDirection: 'column',
    },
};

export default Imprint;
