'use client'
import React, { useCallback, useEffect, useState } from 'react';
import Colors from '../../constants/colors';
import Button from '../os/Button';
import { isMobileViewport } from '../../hooks/useIsMobile';

const STORAGE_KEY = 'cfc-experience-prompt-seen';

/**
 * First-visit dialog that lets visitors know the 3D "enhanced experience"
 * exists. Shown once — a localStorage flag suppresses it on later visits —
 * and never inside the 3D scene's embedded monitor iframe.
 */
const ExperienceModal: React.FC = () => {
    const [open, setOpen] = useState(false);

    const remember = useCallback(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, '1');
        } catch (e) {
            // localStorage blocked — the prompt simply reappears next visit.
        }
    }, []);

    const dismiss = useCallback(() => {
        remember();
        setOpen(false);
    }, [remember]);

    const enter3D = useCallback(() => {
        remember();
        window.location.href = '/3d';
    }, [remember]);

    useEffect(() => {
        // Never prompt inside the 3D scene's embedded monitor.
        let embedded = false;
        try {
            embedded = window.self !== window.top;
        } catch (e) {
            embedded = true;
        }
        if (embedded) return;

        // The 3D experience isn't offered on mobile — don't advertise it.
        if (isMobileViewport()) return;

        let seen = false;
        try {
            seen = !!window.localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            seen = false;
        }
        if (seen) return;

        // Let the desktop settle in before welcoming the visitor.
        const timer = window.setTimeout(() => setOpen(true), 700);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') dismiss();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, dismiss]);

    if (!open) return null;

    return (
        <div style={styles.backdrop}>
            <div style={styles.dialog}>
                <div style={styles.titleBar}>
                    <p className="showcase-header">Coding for Change</p>
                    <Button icon="close" onClick={dismiss} />
                </div>
                <div style={styles.body}>
                    <div style={styles.badge}>
                        <p style={styles.badgeText}>3D</p>
                    </div>
                    <div style={styles.copy}>
                        <h3 style={styles.heading}>
                            Try the enhanced experience?
                        </h3>
                        <p style={styles.text}>
                            You can explore Coding for Change as an interactive
                            3D scene. Switch whenever you like.
                        </p>
                    </div>
                </div>
                <div style={styles.buttonRow}>
                    <button
                        className="site-button"
                        style={styles.button}
                        onClick={enter3D}
                    >
                        Enter 3D mode
                    </button>
                    <button
                        className="site-button"
                        style={styles.button}
                        onClick={dismiss}
                    >
                        No thanks
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    backdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100000,
    },
    dialog: {
        flexDirection: 'column',
        width: 460,
        maxWidth: '90%',
        padding: 3,
        backgroundColor: Colors.lightGray,
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
        boxSizing: 'border-box',
    },
    titleBar: {
        height: 26,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 8,
        paddingRight: 3,
        backgroundColor: Colors.blue,
        boxSizing: 'border-box',
    },
    body: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 24,
    },
    badge: {
        width: 52,
        minWidth: 52,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        backgroundColor: Colors.blue,
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
    },
    badgeText: {
        color: Colors.white,
        fontFamily: 'MillenniumBold, sans-serif',
        fontSize: 24,
    },
    copy: {
        flexDirection: 'column',
        flex: 1,
    },
    heading: {
        marginBottom: 12,
    },
    text: {
        fontSize: 16,
        lineHeight: 1.45,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        paddingTop: 0,
    },
    button: {
        minWidth: 116,
        marginLeft: 10,
        padding: '8px 16px',
        fontSize: 16,
        cursor: 'pointer',
    },
};

export default ExperienceModal;
