import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import UIEventBus from '../EventBus';
import InfoOverlay from './InfoOverlay';
import ExitButton from './ExitButton';

interface InterfaceUIProps {}

const InterfaceUI: React.FC<InterfaceUIProps> = ({}) => {
    const [initLoad, setInitLoad] = useState(true);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [inMonitor, setInMonitor] = useState(false);
    const interfaceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        UIEventBus.on('loadingScreenDone', () => {
            setLoading(false);
        });

        // find element by id and set ref
        const element = document.getElementById('ui-interactive');
        if (element) {
            // @ts-ignore
            interfaceRef.current = element;
        }
    }, []);

    const initMouseDownHandler = () => {
        setVisible(true);
        setInitLoad(false);
    };

    useEffect(() => {
        if (!loading && initLoad) {
            document.addEventListener('mousedown', initMouseDownHandler);
            return () => {
                document.removeEventListener('mousedown', initMouseDownHandler);
            };
        }
    }, [loading, initLoad]);

    useEffect(() => {
        UIEventBus.on('enterMonitor', () => {
            setVisible(false);
            setInitLoad(false);
            setInMonitor(true);
            if (interfaceRef.current) {
                interfaceRef.current.style.pointerEvents = 'none';
            }
        });
        UIEventBus.on('leftMonitor', () => {
            setVisible(true);
            setInMonitor(false);
            if (interfaceRef.current) {
                interfaceRef.current.style.pointerEvents = 'auto';
            }
        });
    }, []);

    return !loading ? (
        <>
            {/* The exit control stays available the whole time the visitor
                is in the 3D scene: shown as soon as the scene loads (before
                any interaction) and hidden only once the camera is inside
                the monitor, where the embedded OS provides its own exit. */}
            {!inMonitor && <ExitButton />}
            <motion.div
                initial="hide"
                variants={vars}
                animate={visible ? 'visible' : 'hide'}
                style={styles.wrapper}
                className="interface-wrapper"
                id="prevent-click"
            >
                <InfoOverlay visible={visible} />
            </motion.div>
        </>
    ) : (
        <></>
    );
};

const vars = {
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            delay: 0.3,
            ease: 'easeOut',
        },
    },
    hide: {
        x: -32,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: 'easeOut',
        },
    },
};

interface StyleSheetCSS {
    [key: string]: React.CSSProperties;
}

const styles: StyleSheetCSS = {
    wrapper: {
        width: '100%',
        display: 'flex',
        position: 'absolute',
        boxSizing: 'border-box',
        // Shifted down so the always-visible exit control owns the corner.
        top: 64,
    },
};

export default InterfaceUI;
