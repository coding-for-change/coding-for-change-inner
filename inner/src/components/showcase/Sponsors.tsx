'use client'
import React, { useState, useEffect, useRef } from 'react';
import { mediaUrl } from '../../api';
import { CmsSponsor } from '../../api/types';

const MAX_VISIBLE = 4;
const MIN_SLIDE_WIDTH = 200;
const AUTO_INTERVAL = 3000;

interface SponsorsProps { sponsors: CmsSponsor[] }

const Sponsors: React.FC<SponsorsProps> = ({ sponsors }) => {
    const list = sponsors ?? [];

    // Duplicate the list for seamless infinite scroll.
    const items = [...list, ...list, ...list];
    const startOffset = list.length;

    const [index, setIndex] = useState(startOffset);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const trackRef = useRef<HTMLDivElement>(null);

    // The carousel measures the width it actually has and sizes its slides
    // to fit — so it never overflows the window. That means full-width
    // single slides on a phone and up to MAX_VISIBLE slides on a wide
    // desktop, with no sponsors clipped at the edges.
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [available, setAvailable] = useState(MAX_VISIBLE * MIN_SLIDE_WIDTH);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const measure = () => setAvailable(el.clientWidth);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const slidesVisible = Math.max(
        1,
        Math.min(MAX_VISIBLE, Math.floor(available / MIN_SLIDE_WIDTH))
    );
    const slideWidth = available / slidesVisible;

    useEffect(() => {
        if (list.length <= 1) return;
        const timer = setInterval(() => {
            setIsTransitioning(true);
            setIndex((prev) => prev + 1);
        }, AUTO_INTERVAL);
        return () => clearInterval(timer);
    }, [list.length]);

    // When a transition ends, silently snap back if we've run past bounds.
    const handleTransitionEnd = () => {
        if (list.length === 0) return;
        if (index >= startOffset + list.length) {
            setIsTransitioning(false);
            setIndex(index - list.length);
        } else if (index < startOffset) {
            setIsTransitioning(false);
            setIndex(index + list.length);
        }
    };

    const translateX = -(index * slideWidth);

    return (
        <div className="site-page-content">
            <h1>Sponsors</h1>
            <h3>Our Supporters</h3>
            <br />
            <div className="text-block">
                <p>
                    We are grateful for the support of our sponsors who make
                    our work possible. Interested in sponsoring? Reach out to
                    us!
                </p>
            </div>
            <br />
            <div ref={wrapperRef} style={styles.carouselWrapper}>
                <div style={styles.carouselViewport}>
                    <div
                        ref={trackRef}
                        onTransitionEnd={handleTransitionEnd}
                        style={{
                            ...styles.track,
                            transform: `translateX(${translateX}px)`,
                            transition: isTransitioning
                                ? 'transform 0.6s ease-in-out'
                                : 'none',
                        }}
                    >
                        {items.map((sponsor, i) => {
                            const logoSrc = mediaUrl(sponsor.logo);
                            return (
                                <a
                                    key={`${sponsor.id}-${i}`}
                                    href={sponsor.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        ...styles.sponsorLink,
                                        width: slideWidth,
                                    }}
                                >
                                    <div style={styles.sponsorCard}>
                                        {logoSrc ? (
                                            <img
                                                src={logoSrc}
                                                alt={sponsor.name}
                                                style={styles.logoImage}
                                            />
                                        ) : (
                                            <p style={styles.sponsorName}>
                                                {sponsor.name}
                                            </p>
                                        )}
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    carouselWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    carouselViewport: {
        width: '100%',
        overflow: 'hidden',
    },
    track: {
        display: 'flex',
        flexDirection: 'row',
    },
    sponsorLink: {
        textDecoration: 'none',
        color: 'inherit',
        flexShrink: 0,
        justifyContent: 'center',
    },
    sponsorCard: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        boxSizing: 'border-box',
        minHeight: 100,
        width: '100%',
    },
    logoImage: {
        maxWidth: 180,
        maxHeight: 80,
        objectFit: 'contain',
    },
    sponsorName: {
        fontSize: 16,
        fontFamily: 'MSSerif',
        textAlign: 'center',
    },
};

export default Sponsors;
