// import { useState, useCallback } from 'react';

export default function useInitialWindowSize({ margin }: { margin?: number }) {
    let m = margin || 0;

    // Return a deterministic default rather than reading `window` here: this
    // value is used for the *initial* render, which must be identical on the
    // server and on the client's first paint to avoid a hydration mismatch.
    // The real viewport size is applied right after mount by the Window's
    // `trackViewport` resize effect.
    const initWidth = 1280 - m;
    const initHeight = 800 - m;

    return { initWidth, initHeight };
}
