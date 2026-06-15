import { useEffect, useState } from 'react';

// Below this width the Windows-95 desktop metaphor (a 300px sidebar plus
// a content column) gets too cramped, so the site switches to its mobile
// layout (collapsed navbar, full-screen windows, no 3D experience). It is
// set where the desktop layout still has comfortable room, so the switch
// happens before anything looks broken — not at an arbitrary phone size.
export const MOBILE_BREAKPOINT = 1024;
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`;

/**
 * Synchronous viewport check — for state initializers and non-React code
 * (e.g. a one-shot check in an effect) where a hook can't be used.
 */
export const isMobileViewport = (): boolean => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(MOBILE_QUERY).matches;
};

/**
 * Tracks whether the viewport is mobile-sized, updating on resize and
 * orientation change.
 *
 * Layout decisions key off the viewport (this hook), not the User-Agent.
 * The only User-Agent check lives in the outer Express server, where the
 * /3d redirect has no viewport information to work with.
 */
export default function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const mql = window.matchMedia(MOBILE_QUERY);
        const onChange = () => setIsMobile(mql.matches);
        onChange();
        // Safari < 14 only exposes the deprecated addListener API.
        if (mql.addEventListener) {
            mql.addEventListener('change', onChange);
            return () => mql.removeEventListener('change', onChange);
        }
        mql.addListener(onChange);
        return () => mql.removeListener(onChange);
    }, []);

    return isMobile;
}
