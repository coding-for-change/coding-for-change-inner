'use client'
import React, { useCallback, useEffect, useState } from 'react';
import Colors from '../../constants/colors';
import ShowcaseExplorer from '../applications/ShowcaseExplorer';
import ShutdownSequence from './ShutdownSequence';
import Toolbar from './Toolbar';
import DesktopShortcut, { DesktopShortcutProps } from './DesktopShortcut';
import { IconName } from '../../assets/icons';
import Credits from '../applications/Credits';
import Imprint from '../applications/Imprint';
import Search from '../applications/Search';

export interface DesktopProps {
    children?: React.ReactNode;
}

type ExtendedWindowAppProps<T> = T & WindowAppProps;

const APPLICATIONS: {
    [key in string]: {
        key: string;
        name: string;
        shortcutIcon: IconName;
        component: React.FC<ExtendedWindowAppProps<any>>;
    };
} = {
    credits: {
        key: 'credits',
        name: 'Credits',
        shortcutIcon: 'credits',
        component: Credits,
    },
    imprint: {
        key: 'imprint',
        name: 'Imprint & Privacy',
        shortcutIcon: 'myComputer',
        component: Imprint,
    },
    search: {
        key: 'search',
        name: 'Search',
        shortcutIcon: 'showcaseIcon',
        component: Search,
    },
};

interface ShowcaseState {
    minimized: boolean;
    zIndex: number;
}

const Desktop: React.FC<DesktopProps> = ({ children }) => {
    const [windows, setWindows] = useState<DesktopWindows>({});
    const [showcaseState, setShowcaseState] = useState<ShowcaseState>({ minimized: false, zIndex: 2 });
    const [shortcuts, setShortcuts] = useState<DesktopShortcutProps[]>([]);
    const [shutdown, setShutdown] = useState(false);
    const [numShutdowns, setNumShutdowns] = useState(1);

    useEffect(() => {
        if (shutdown === true) rebootDesktop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shutdown]);

    useEffect(() => {
        const newShortcuts: DesktopShortcutProps[] = [
            {
                shortcutName: 'Coding for Change',
                icon: 'showcaseIcon',
                onOpen: () => restoreShowcase(),
            },
        ];
        Object.keys(APPLICATIONS).forEach((key) => {
            const app = APPLICATIONS[key];
            newShortcuts.push({
                shortcutName: app.name,
                icon: app.shortcutIcon,
                onOpen: () => addWindow(app.key, <app.component
                    onInteract={() => onWindowInteract(app.key)}
                    onMinimize={() => minimizeWindow(app.key)}
                    onClose={() => removeWindow(app.key)}
                    key={app.key}
                />),
            });
        });
        setShortcuts(newShortcuts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const rebootDesktop = useCallback(() => {
        setWindows({});
        setShowcaseState({ minimized: false, zIndex: 2 });
    }, []);

    const removeWindow = useCallback((key: string) => {
        setTimeout(() => {
            setWindows((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }, 100);
    }, []);

    const minimizeWindow = useCallback((key: string) => {
        setWindows((prev) => ({ ...prev, [key]: { ...prev[key], minimized: true } }));
    }, []);

    const getHighestZIndex = useCallback((): number => {
        let max = showcaseState.zIndex;
        Object.keys(windows).forEach((key) => {
            if (windows[key]?.zIndex > max) max = windows[key].zIndex;
        });
        return max;
    }, [windows, showcaseState.zIndex]);

    const toggleMinimize = useCallback((key: string) => {
        if (key === 'showcase') {
            setShowcaseState((s) => {
                const highest = getHighestZIndex();
                return {
                    minimized: s.minimized || s.zIndex === highest ? !s.minimized : s.minimized,
                    zIndex: getHighestZIndex() + 1,
                };
            });
            return;
        }
        const newWindows = { ...windows };
        const highest = getHighestZIndex();
        if (newWindows[key].minimized || newWindows[key].zIndex === highest) {
            newWindows[key].minimized = !newWindows[key].minimized;
        }
        newWindows[key].zIndex = getHighestZIndex() + 1;
        setWindows(newWindows);
    }, [windows, getHighestZIndex]);

    const onWindowInteract = useCallback((key: string) => {
        setWindows((prev) => ({
            ...prev,
            [key]: { ...prev[key], zIndex: 1 + getHighestZIndex() },
        }));
    }, [setWindows, getHighestZIndex]);

    const onShowcaseInteract = useCallback(() => {
        setShowcaseState((s) => ({ ...s, zIndex: 1 + getHighestZIndex() }));
    }, [getHighestZIndex]);

    const restoreShowcase = useCallback(() => {
        setShowcaseState((_s) => ({ minimized: false, zIndex: getHighestZIndex() + 1 }));
    }, [getHighestZIndex]);

    const startShutdown = useCallback(() => {
        setTimeout(() => {
            setShutdown(true);
            setNumShutdowns((n) => n + 1);
        }, 600);
    }, []);

    const addWindow = useCallback((key: string, element: React.ReactElement) => {
        setWindows((prev) => ({
            ...prev,
            [key]: {
                zIndex: getHighestZIndex() + 1,
                minimized: false,
                component: element,
                name: APPLICATIONS[key].name,
                icon: APPLICATIONS[key].shortcutIcon,
            },
        }));
    }, [getHighestZIndex]);

    const openSearch = useCallback(() => {
        addWindow('search', <Search
            onInteract={() => onWindowInteract('search')}
            onMinimize={() => minimizeWindow('search')}
            onClose={() => removeWindow('search')}
            key="search"
        />);
    }, [addWindow, onWindowInteract, minimizeWindow, removeWindow]);

    // Build toolbar windows map including showcase
    const allWindows: DesktopWindows = {
        showcase: {
            zIndex: showcaseState.zIndex,
            minimized: showcaseState.minimized,
            component: <></>,
            name: 'Coding for Change',
            icon: 'showcaseIcon',
        },
        ...windows,
    };

    if (shutdown) {
        return <ShutdownSequence setShutdown={setShutdown} numShutdowns={numShutdowns} />;
    }

    return (
        <div style={styles.desktop}>
            {/* ShowcaseExplorer - always mounted */}
            <div style={Object.assign({}, { zIndex: showcaseState.zIndex }, showcaseState.minimized && styles.minimized)}>
                <ShowcaseExplorer
                    onClose={() => setShowcaseState((s) => ({ ...s, minimized: true }))}
                    onInteract={onShowcaseInteract}
                    onMinimize={() => setShowcaseState((s) => ({ ...s, minimized: true }))}
                >
                    {children}
                </ShowcaseExplorer>
            </div>

            {/* Dynamic windows */}
            {Object.keys(windows).map((key) => {
                const element = windows[key].component;
                if (!element) return <div key={`win-${key}`} />;
                return (
                    <div
                        key={`win-${key}`}
                        style={Object.assign({}, { zIndex: windows[key].zIndex }, windows[key].minimized && styles.minimized)}
                    >
                        {React.cloneElement(element as React.ReactElement<any>, {
                            key,
                            onInteract: () => onWindowInteract(key),
                            onClose: () => removeWindow(key),
                        })}
                    </div>
                );
            })}

            <div style={styles.shortcuts}>
                {shortcuts.map((shortcut, i) => (
                    <div
                        style={Object.assign({}, styles.shortcutContainer, { top: i * 104 })}
                        key={shortcut.shortcutName}
                    >
                        <DesktopShortcut
                            icon={shortcut.icon}
                            shortcutName={shortcut.shortcutName}
                            onOpen={shortcut.onOpen}
                        />
                    </div>
                ))}
            </div>

            <Toolbar
                windows={allWindows}
                toggleMinimize={toggleMinimize}
                shutdown={startShutdown}
                openSearch={openSearch}
            />
        </div>
    );
};

const styles: StyleSheetCSS = {
    desktop: { minHeight: '100%', flex: 1, backgroundColor: Colors.turquoise },
    shortcutContainer: { position: 'absolute' },
    shortcuts: { position: 'absolute', top: 16, left: 6 },
    minimized: { pointerEvents: 'none', opacity: 0 },
};

export default Desktop;
