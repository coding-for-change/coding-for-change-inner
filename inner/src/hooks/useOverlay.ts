'use client';
import { useEffect } from 'react';

/**
 * Shared plumbing for a portal-rendered overlay (lightbox, booking modal):
 * Esc closes, and the page behind it stops scrolling.
 *
 * The scroll lock has to touch two elements: on desktop the scroller is the
 * `.site-scroll` div (see the note in `index.css`), on mobile it's <body>.
 * Locking only one leaves the background scrolling on the other layout.
 *
 * `onKey` runs for every keydown while the overlay is open, so a caller can add
 * its own shortcuts (the gallery uses ← / →) without a second listener.
 */
export function useOverlay(
    onClose: () => void,
    onKey?: (e: KeyboardEvent) => void
): void {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            else onKey?.(e);
        };
        window.addEventListener('keydown', handler);

        const scroller = document.querySelector<HTMLElement>('.site-scroll');
        const prevBody = document.body.style.overflow;
        const prevScroller = scroller?.style.overflow ?? '';
        document.body.style.overflow = 'hidden';
        if (scroller) scroller.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handler);
            document.body.style.overflow = prevBody;
            if (scroller) scroller.style.overflow = prevScroller;
        };
    }, [onClose, onKey]);
}

export default useOverlay;
