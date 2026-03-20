import React, { useState } from 'react';
import { useInterval } from 'usehooks-ts';

const HOURGLASS_FRAMES = ['⌛', '⏳'];

const RetroLoader: React.FC = () => {
    const [frame, setFrame] = useState(0);
    const [dots, setDots] = useState(0);

    useInterval(() => {
        setFrame((f) => (f + 1) % HOURGLASS_FRAMES.length);
        setDots((d) => (d + 1) % 4);
    }, 500);

    return (
        <div style={styles.container}>
            <div style={styles.window}>
                <div style={styles.titleBar}>
                    <span style={styles.titleText}>Loading</span>
                </div>
                <div style={styles.body}>
                    <span style={styles.hourglass}>{HOURGLASS_FRAMES[frame]}</span>
                    <p style={styles.text}>
                        Loading{'.'.repeat(dots)}
                    </p>
                    <div style={styles.progressOuter}>
                        <div style={styles.progressTrack}>
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        ...styles.progressBlock,
                                        animationDelay: `${i * 0.15}s`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    window: {
        flexDirection: 'column',
        width: 280,
        boxShadow:
            'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
        backgroundColor: '#c0c0c0',
    },
    titleBar: {
        background: 'linear-gradient(90deg, #000080, #1084d0)',
        padding: '3px 4px',
        alignItems: 'center',
    },
    titleText: {
        color: 'white',
        fontFamily: 'MSSerif',
        fontSize: 12,
        fontWeight: 'bold',
    },
    body: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 24px',
        gap: 12,
    },
    hourglass: {
        fontSize: 28,
    },
    text: {
        fontFamily: 'MSSerif',
        fontSize: 14,
        minWidth: 80,
        textAlign: 'center',
    },
    progressOuter: {
        width: '100%',
        boxShadow:
            'inset -1px -1px #ffffff, inset 1px 1px #808080, inset -2px -2px #dfdfdf, inset 2px 2px #0a0a0a',
        padding: 2,
    },
    progressTrack: {
        height: 16,
        gap: 2,
        overflow: 'hidden',
    },
    progressBlock: {
        width: 18,
        height: 16,
        backgroundColor: '#000080',
        flexShrink: 0,
        animation: 'retro-progress 1.5s steps(1) infinite',
    },
};

export default RetroLoader;
