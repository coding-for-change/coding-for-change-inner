'use client';
import React from 'react';
import { useSiteConfig } from '../../api';
import { useLanguage } from '../../contexts/LanguageContext';

export interface BookingEmbedProps {
    height?: number;
}

// Build-time fallback so the booking page works without the CMS running.
// Set NEXT_PUBLIC_BOOKING_URL in the inner app's environment; the CMS
// Site Configuration → "Booking page URL" field overrides it when present.
const ENV_BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || '';

// Google's embeddable appointment-schedule URL needs `?gv=true`. The plain
// schedule URL (and the calendar.google.com/calendar/... variant) is iframeable
// only with that param, so add it defensively when it's missing.
const toEmbeddable = (raw: string): string => {
    if (!/calendar\.google\.com\/.*appointments\/schedules\//.test(raw)) return raw;
    if (/[?&]gv=true\b/.test(raw)) return raw;
    return raw + (raw.includes('?') ? '&' : '?') + 'gv=true';
};

/**
 * Embeds the club's Google Appointment Schedule booking page as an iframe.
 *
 * The URL comes from the CMS (Site Configuration → "Booking page URL"), or from
 * the NEXT_PUBLIC_BOOKING_URL env var as a fallback. A direct "open in new tab"
 * link is always shown so visitors can still book even if Google declines to be
 * iframed (some share links set X-Frame-Options). Falls back to an email prompt
 * when no URL is configured at all.
 *
 * To get the URL: Google Calendar → Create → Appointment schedule → set
 * availability → Share → copy the booking-page link (or the "Embed" URL, which
 * ends in `?gv=true` and is the most reliable to iframe).
 */
const BookingEmbed: React.FC<BookingEmbedProps> = ({ height = 700 }) => {
    const siteConfig = useSiteConfig();
    const { t } = useLanguage();
    const rawUrl = (siteConfig.bookingUrl?.trim() || ENV_BOOKING_URL) || '';
    const url = rawUrl ? toEmbeddable(rawUrl) : '';

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
        <div className="lp-booking">
            <iframe
                className="lp-booking__frame"
                src={url}
                style={{ minHeight: height }}
                title={t.book.title}
                frameBorder={0}
            />
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
