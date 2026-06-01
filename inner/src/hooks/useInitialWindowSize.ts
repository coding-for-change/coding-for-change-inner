// import { useState, useCallback } from 'react';

// During server-side rendering there is no `window`, so fall back to
// sensible default dimensions. The client re-renders with the real
// viewport size on hydration.
const SSR_FALLBACK_WIDTH = 1280;
const SSR_FALLBACK_HEIGHT = 800;

export default function useInitialWindowSize({ margin }: { margin?: number }) {
    let m = margin || 0;

    const winW =
        typeof window !== 'undefined' ? window.innerWidth : SSR_FALLBACK_WIDTH;
    const winH =
        typeof window !== 'undefined' ? window.innerHeight : SSR_FALLBACK_HEIGHT;

    let initWidth = winW - m;
    let initHeight = winH - m;

    return { initWidth, initHeight };
}
