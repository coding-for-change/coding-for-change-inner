'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Colors from '../../constants/colors';
import ShowcaseExplorer from '../applications/ShowcaseExplorer';
import ShutdownSequence from './ShutdownSequence';
import Toolbar from './Toolbar';
import DesktopShortcut, { DesktopShortcutProps } from './DesktopShortcut';
import { IconName } from '../../assets/icons';
import Credits from '../applications/Credits';
import Imprint from '../applications/Imprint';

export interface DesktopProps {
    // The active route's content, rendered inside the always-present showcase
    // window. Supplied by the (os) route-group layout.
    children?: React.ReactNode;
}

type ExtendedWindowAppProps<T> = T & WindowAppProps;

// The showcase is the primary window: it hosts the routed page content and is
// open by default. Other apps are opened from desktop shortcuts.
const SHOWCASE_KEY = 'showcase';

const APPLICATIONS: {
    [key in string]: {
        key: string;
        name: string;
        shortcutIcon: IconName;
        // Windowed apps render a component. "Route" apps (e.g. the blog) instead
        // navigate the showcase window to a path and have no component.
        component?: React.FC<ExtendedWindowAppProps<any>>;
        route?: string;
    };
} = {
    showcase: {
        key: 'showcase',
        name: 'Coding for Change',
        shortcutIcon: 'showcaseIcon',
    },
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
    blog: {
        key: 'blog',
        name: 'News',
        shortcutIcon: 'windowExplorerIcon',
        route: '/blog',
    },
};

// Metadata-only window entry for the showcase. Its `component` is never read —
// the render loop renders <ShowcaseExplorer> inline so it always reflects the
// current route's `children` — but the field satisfies the DesktopWindows type
// and feeds the taskbar (name/icon/zIndex/minimized).
const showcaseEntry = (zIndex: number, minimized = false) => ({
    zIndex,
    minimized,
    component: <React.Fragment />,
    name: APPLICATIONS.showcase.name,
    icon: APPLICATIONS.showcase.shortcutIcon,
});

const Desktop: React.FC<DesktopProps> = ({ children }) => {
    const router = useRouter();

    // The showcase window is open on load (like the old auto-open behavior).
    const [windows, setWindows] = useState<DesktopWindows>(() => ({
        [SHOWCASE_KEY]: showcaseEntry(1),
    }));

    const [shortcuts, setShortcuts] = useState<DesktopShortcutProps[]>([]);

    const [shutdown, setShutdown] = useState(false);
    const [numShutdowns, setNumShutdowns] = useState(1);

    useEffect(() => {
        if (shutdown === true) {
            rebootDesktop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shutdown]);

    const rebootDesktop = useCallback(() => {
        setWindows({ [SHOWCASE_KEY]: showcaseEntry(1) });
    }, []);

    const removeWindow = useCallback((key: string) => {
        // Absolute hack and a half
        setTimeout(() => {
            setWindows((prevWindows) => {
                const newWindows = { ...prevWindows };
                delete newWindows[key];
                return newWindows;
            });
        }, 100);
    }, []);

    const minimizeWindow = useCallback((key: string) => {
        setWindows((prevWindows) => {
            const newWindows = { ...prevWindows };
            if (newWindows[key]) newWindows[key].minimized = true;
            return newWindows;
        });
    }, []);

    const getHighestZIndex = useCallback((): number => {
        let highestZIndex = 0;
        Object.keys(windows).forEach((key) => {
            const window = windows[key];
            if (window) {
                if (window.zIndex > highestZIndex)
                    highestZIndex = window.zIndex;
            }
        });
        return highestZIndex;
    }, [windows]);

    const toggleMinimize = useCallback(
        (key: string) => {
            const newWindows = { ...windows };
            if (!newWindows[key]) return;
            const highestIndex = getHighestZIndex();
            if (
                newWindows[key].minimized ||
                newWindows[key].zIndex === highestIndex
            ) {
                newWindows[key].minimized = !newWindows[key].minimized;
            }
            newWindows[key].zIndex = getHighestZIndex() + 1;
            setWindows(newWindows);
        },
        [windows, getHighestZIndex]
    );

    const onWindowInteract = useCallback(
        (key: string) => {
            setWindows((prevWindows) => ({
                ...prevWindows,
                [key]: {
                    ...prevWindows[key],
                    zIndex: 1 + getHighestZIndex(),
                },
            }));
        },
        [setWindows, getHighestZIndex]
    );

    const startShutdown = useCallback(() => {
        setTimeout(() => {
            setShutdown(true);
            setNumShutdowns(numShutdowns + 1);
        }, 600);
    }, [numShutdowns]);

    const addWindow = useCallback(
        (key: string, element: JSX.Element) => {
            setWindows((prevState) => ({
                ...prevState,
                [key]: {
                    zIndex: getHighestZIndex() + 1,
                    minimized: false,
                    component: element,
                    name: APPLICATIONS[key].name,
                    icon: APPLICATIONS[key].shortcutIcon,
                },
            }));
        },
        [getHighestZIndex]
    );

    // Open (or focus) the showcase window. Re-creates it if it was closed.
    const focusShowcase = useCallback(() => {
        setWindows((prev) => {
            const highest = Object.keys(prev).reduce(
                (max, k) => Math.max(max, prev[k]?.zIndex ?? 0),
                0
            );
            return {
                ...prev,
                [SHOWCASE_KEY]: prev[SHOWCASE_KEY]
                    ? { ...prev[SHOWCASE_KEY], minimized: false, zIndex: highest + 1 }
                    : showcaseEntry(highest + 1),
            };
        });
    }, []);

    // Navigate the showcase window to a path (used by "route" desktop apps such
    // as the blog) and bring it to the front. Next's router handles the URL;
    // the matched page renders into the layout's `children`.
    const openShowcaseAt = useCallback(
        (path: string) => {
            router.push(path);
            focusShowcase();
        },
        [router, focusShowcase]
    );

    useEffect(() => {
        const newShortcuts: DesktopShortcutProps[] = [];
        Object.keys(APPLICATIONS).forEach((key) => {
            const app = APPLICATIONS[key];
            newShortcuts.push({
                shortcutName: app.name,
                icon: app.shortcutIcon,
                onOpen: () => {
                    // The showcase is always present — its shortcut just focuses it.
                    if (app.key === SHOWCASE_KEY) {
                        focusShowcase();
                        return;
                    }
                    // Route apps navigate the showcase window to a path.
                    if (app.route) {
                        openShowcaseAt(app.route);
                        return;
                    }
                    const Component = app.component;
                    if (!Component) return;
                    addWindow(
                        app.key,
                        <Component
                            onInteract={() => onWindowInteract(app.key)}
                            onMinimize={() => minimizeWindow(app.key)}
                            onClose={() => removeWindow(app.key)}
                            key={app.key}
                        />
                    );
                },
            });
        });

        setShortcuts(newShortcuts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return !shutdown ? (
        <div style={styles.desktop}>
            {/* For each window in windows, loop over and render  */}
            {Object.keys(windows).map((key) => {
                const win = windows[key];
                if (!win) return <div key={`win-${key}`}></div>;
                // The showcase window is rendered inline so it always reflects
                // the current route's content (`children`); other apps render
                // their stored component element.
                const content =
                    key === SHOWCASE_KEY ? (
                        <ShowcaseExplorer
                            key={key}
                            onInteract={() => onWindowInteract(key)}
                            onClose={() => removeWindow(key)}
                            onMinimize={() => minimizeWindow(key)}
                        >
                            {children}
                        </ShowcaseExplorer>
                    ) : (
                        React.cloneElement(win.component, {
                            key,
                            onInteract: () => onWindowInteract(key),
                            onClose: () => removeWindow(key),
                        })
                    );
                return (
                    <div
                        key={`win-${key}`}
                        style={Object.assign(
                            {},
                            { zIndex: win.zIndex },
                            win.minimized && styles.minimized
                        )}
                    >
                        {content}
                    </div>
                );
            })}
            <div style={styles.shortcuts}>
                {shortcuts.map((shortcut, i) => {
                    return (
                        <div
                            style={Object.assign({}, styles.shortcutContainer, {
                                top: i * 104,
                            })}
                            key={shortcut.shortcutName}
                        >
                            <DesktopShortcut
                                icon={shortcut.icon}
                                shortcutName={shortcut.shortcutName}
                                onOpen={shortcut.onOpen}
                            />
                        </div>
                    );
                })}
            </div>
            <Toolbar
                windows={windows}
                toggleMinimize={toggleMinimize}
                shutdown={startShutdown}
            />
        </div>
    ) : (
        <ShutdownSequence
            setShutdown={setShutdown}
            numShutdowns={numShutdowns}
        />
    );
};

const styles: StyleSheetCSS = {
    desktop: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: Colors.turquoise,
    },
    shutdown: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: '#1d2e2f',
    },
    shortcutContainer: {
        position: 'absolute',
    },
    shortcuts: {
        position: 'absolute',
        top: 16,
        left: 6,
    },
    minimized: {
        pointerEvents: 'none',
        opacity: 0,
    },
};

export default Desktop;
