'use client';
import React, { useEffect, useRef, useState } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { useSiteConfig } from '../../api';
import { trackEvent } from '../../lib/analytics';
import { trackAdsConversion } from '../../lib/googleAds';
import { useLanguage } from '../../contexts/LanguageContext';

export interface BookingEmbedProps {
    height?: number;
}

const ENV_BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || '';


const toEmbeddable = (raw: string): string => {
    if (!/calendar\.google\.com\/.*appointments\/schedules\//.test(raw)) return raw;
    if (/[?&]gv=true\b/.test(raw)) return raw;
    return raw + (raw.includes('?') ? '&' : '?') + 'gv=true';
};


const toCalLink = (url: string): string | null => {
    const m = url.match(/^https?:\/\/(?:www\.)?cal\.com\/([^?#]+)/);
    return m ? m[1].replace(/\/$/, '') : null;
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
    const calLink = url ? toCalLink(url) : null;

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

    // Funnel: the widget came into view. This is an *impression*, not intent —
    // almost everyone who scrolls this far triggers it — so it is never used as
    // an ad conversion. `booking_completed` below is the real signal.
    const bookingTracked = useRef(false);
    useEffect(() => {
        if (visible && url && !bookingTracked.current) {
            bookingTracked.current = true;
            trackEvent('booking_started', { label: 'calcom' });
        }
    }, [visible, url]);

    // A booking actually submitted. Cal's embed posts `bookingSuccessful` to the
    // parent frame, so no webhook or /thanks redirect is needed — but only on the
    // `<Cal>` path. When the configured URL isn't a cal.com link we fall back to
    // a plain cross-origin iframe (below), which emits nothing observable.
    //
    // Note it fires at submission, which for a host-confirmation event type is
    // before the meeting is confirmed. That's the right moment for an ad
    // conversion — the lead is captured — but it means Google's count can exceed
    // confirmed meetings.
    const bookedUids = useRef<Set<string>>(new Set());
    useEffect(() => {
        if (!visible || !calLink) return;
        let cancelled = false;

        (async () => {
            const cal = await getCalApi();
            if (cancelled || !cal) return;
            cal('on', {
                action: 'bookingSuccessful',
                callback: (e: unknown) => {
                    // Dedupe: a re-render or a duplicated event must not double
                    // count. `uid` is Cal's booking identifier.
                    const detail = (e as { detail?: { data?: { uid?: string } } })?.detail;
                    const uid = detail?.data?.uid;
                    if (uid) {
                        if (bookedUids.current.has(uid)) return;
                        bookedUids.current.add(uid);
                    }
                    trackEvent('booking_completed', {
                        label: 'calcom',
                        meta: uid ? { uid } : undefined,
                    });
                    trackAdsConversion('booking');
                },
            });
        })().catch(() => {
            // Cal's embed API unavailable — we keep the impression event and lose
            // only the completion signal.
        });

        return () => {
            cancelled = true;
        };
    }, [visible, calLink]);

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
            {calLink ? (
                visible ? (
                    <Cal
                        calLink={calLink}
                        config={{ theme: 'light' }}
                        style={{ width: '100%' }}
                    />
                ) : (
                    <div className="lp-booking__scale" style={{ height }} aria-hidden />
                )
            ) : (   
                <div className="lp-booking__scale" style={{ height }}>
                    {visible ? (
                        <iframe
                            className="lp-booking__frame"
                            src={url}
                            title={t.book.title}
                            frameBorder={0}
                            loading="lazy"
                        />
                    ) : (
                        <div className="lp-booking__frame" aria-hidden />
                    )}
                </div>
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
