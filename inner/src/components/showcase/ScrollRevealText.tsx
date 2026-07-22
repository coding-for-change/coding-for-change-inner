'use client';
import React, { useEffect, useRef } from 'react';


const FAINT = 0.16;
const STAGGER = 0.5; // overlap between consecutive words

const ScrollRevealText: React.FC<{
    text: string;
    className?: string;
    as?: 'p' | 'h2' | 'h3';
    /** Viewport fraction the block's bottom must reach for the reveal to
     *  complete. Raise it for blocks that sit low in a centered section so
     *  they finish at the section's resting position. */
    end?: number;
}> = ({ text, className, as = 'p', end = 0.62 }) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const words = Array.from(
            el.querySelectorAll<HTMLElement>('[data-word]')
        );
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            words.forEach((w) => (w.style.opacity = '1'));
            return;
        }
        const scroller = el.closest('.site-scroll') as HTMLElement | null;
        const listenTarget: HTMLElement | Window = scroller ?? window;

        let raf = 0;
        const paint = () => {
            raf = 0;
            const viewTop = scroller
                ? scroller.getBoundingClientRect().top
                : 0;
            const viewH = scroller ? scroller.clientHeight : window.innerHeight;
            const rect = el.getBoundingClientRect();
            const top = rect.top - viewTop;

            const startY = viewH * 0.82;
            const endY = viewH * end - rect.height;
            const progress = Math.min(
                1,
                Math.max(0, (startY - top) / (startY - endY))
            );
            const span = (words.length - 1) * STAGGER + 1;
            words.forEach((w, i) => {
                const p = Math.min(
                    1,
                    Math.max(0, progress * span - i * STAGGER)
                );
                w.style.opacity = String(FAINT + p * (1 - FAINT));
            });
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(paint);
        };
        paint();
        listenTarget.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            listenTarget.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [text, end]);

    const Tag = as;
    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Tag ref={ref as any} className={className}>
            {text.split(' ').map((w, i) => (
                <React.Fragment key={i}>
                    <span data-word style={{ opacity: FAINT }}>
                        {w}
                    </span>{' '}
                </React.Fragment>
            ))}
        </Tag>
    );
};

export default ScrollRevealText;
