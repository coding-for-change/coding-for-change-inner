'use client';
import { useEffect } from 'react';

/**
 * When the desktop OS runs inside the 3D scene's monitor iframe, it relays
 * pointer/keyboard events up to the parent window so the 3D scene can drive
 * its camera. On the standalone site (not embedded) this does nothing.
 * Ported from the old CRA `public/index.html` inline script.
 */
export default function InputRelay() {
    useEffect(() => {
        if (window.self === window.top) return;
        const post = (msg: Record<string, unknown>) =>
            window.parent.postMessage(msg, '*');

        const onMouseMove = (e: MouseEvent) =>
            post({ type: 'mousemove', clientX: e.clientX, clientY: e.clientY });
        const onMouseDown = () => post({ type: 'mousedown' });
        const onMouseUp = () => post({ type: 'mouseup' });
        const onKeyDown = (e: KeyboardEvent) => post({ type: 'keydown', key: e.key });
        const onKeyUp = (e: KeyboardEvent) => post({ type: 'keyup', key: e.key });

        addEventListener('mousemove', onMouseMove);
        addEventListener('mousedown', onMouseDown);
        addEventListener('mouseup', onMouseUp);
        addEventListener('keydown', onKeyDown);
        addEventListener('keyup', onKeyUp);
        return () => {
            removeEventListener('mousemove', onMouseMove);
            removeEventListener('mousedown', onMouseDown);
            removeEventListener('mouseup', onMouseUp);
            removeEventListener('keydown', onKeyDown);
            removeEventListener('keyup', onKeyUp);
        };
    }, []);

    return null;
}
