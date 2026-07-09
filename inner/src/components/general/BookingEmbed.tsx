'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSiteConfig } from '../../api';
import { trackEvent } from '../../lib/analytics';
import { useLanguage } from '../../contexts/LanguageContext';

export interface BookingEmbedProps {
    height?: number;
}

// Build-time fallback so the booking page works without the CMS running.
// Set NEXT_PUBLIC_BOOKING_URL in the inner app's environment; the CMS
// Site Configuration → "Booking page URL" field overrides it when present.
const ENV_BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || '';

// Cal.com booking links (cal.com/<user>/<event>) are iframeable as-is, so the
// URL is used unchanged. The legacy Google Appointment Schedule URL needs
// `?gv=true` to be iframeable, so add it defensively if such a URL is still
// configured (e.g. an old value lingering in the CMS).
const toEmbeddable = (raw: string): string => {
    if (!/calendar\.google\.com\/.*appointments\/schedules\//.test(raw)) return raw;
    if (/[?&]gv=true\b/.test(raw)) return raw;
    return raw + (raw.includes('?') ? '&' : '?') + 'gv=true';
};

/**
 * Embeds the club's Cal.com booking page as an iframe.
 *
 * The URL comes from the CMS (Site Configuration → "Booking page URL"), or from
 * the NEXT_PUBLIC_BOOKING_URL env var as a fallback. A direct "open in new tab"
 * link is always shown so visitors can still book even if the provider declines
 * to be iframed. Falls back to an email prompt when no URL is configured at all.
 *
 * To get the URL: copy the Cal.com event link (cal.com/<user>/<event>).
 */
const BookingEmbed: React.FC<BookingEmbedProps> = ({ height = 700 }) => {
    const siteConfig = useSiteConfig();
    const { t } = useLanguage();
    const rawUrl = (siteConfig.bookingUrl?.trim() || ENV_BOOKING_URL) || '';
    const url = rawUrl ? toEmbeddable(rawUrl) : '';

    const containerRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (visible || !url) return;
        const el = containerRef.current;
        if (!el) return;
        // No IntersectionObserver (very old browsers) → load immediately.
        if (typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            // Start loading a little before it enters the viewport.
            { rootMargin: '400px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [visible, url]);

    // Funnel: record that the booking widget was reached. True completion
    // happens on cal.com (cross-origin iframe) and isn't observable here — that
    // needs a cal.com webhook or a success-redirect (a later phase).
    const bookingTracked = useRef(false);
    useEffect(() => {
        if (visible && url && !bookingTracked.current) {
            bookingTracked.current = true;
            trackEvent('booking_started', { label: 'calcom' });
        }
    }, [visible, url]);

    if (!url) {
        return (
            <div className="lp-booking">
                <div className="lp-booking__fallback">
                    <span>{t.book.fallback}</span>
                    {siteConfig.email && (
                        <a className="lp-social" href={`mailto:${siteConfig.email}`}>
                            {siteConfig.email}
                        </a>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="lp-booking" ref={containerRef}>
            {visible ? (
                <iframe
                    className="lp-booking__frame"
                    src={url}
                    style={{ minHeight: height }}
                    title={t.book.title}
                    frameBorder={0}
                    loading="lazy"
                />
            ) : (
                <div
                    className="lp-booking__frame"
                    style={{ minHeight: height }}
                    aria-hidden
                />
            )}
            <a
                className="lp-booking__link"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
            >
                {t.book.openInNewTab} ↗
            </a>
        </div>
    );
};

export default BookingEmbed;
