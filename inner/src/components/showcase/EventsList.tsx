'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCmsCollection } from '../../api';
import { CmsEvent } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import './landing.css';

const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
} as const;

export interface EventsListProps {
    events?: CmsEvent[] | null;
}

const EventsList: React.FC<EventsListProps> = (props) => {
    const { t } = useLanguage();
    const { data: events, loading } = useCmsCollection<CmsEvent>(
        'events',
        undefined,
        props.events
    );

    const upcoming = (events ?? []).filter((e) => e.isUpcoming);
    const past = (events ?? []).filter((e) => !e.isUpcoming);
    const isEmpty = !loading && upcoming.length === 0 && past.length === 0;

    const card = (event: CmsEvent, i: number) => (
        <motion.div
            key={event.id}
            className="lp-card"
            {...reveal}
            transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
        >
            <span className="lp-badge">{event.type}</span>
            <h3 className="lp-card__title">{event.title}</h3>
            <span className="lp-card__meta">
                {event.date} {t.common.at} {event.time}
            </span>
            <span className="lp-card__sub">{event.location}</span>
            <p className="lp-card__text">{event.description}</p>
            {event.link?.url && (
                <a
                    className="lp-card__link"
                    href={event.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {event.link.label || t.common.learnMore} →
                </a>
            )}
        </motion.div>
    );

    return (
        <div className="lp lp-page">
            <div className="lp-inner">
                <motion.div
                    className="lp-page__head"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="lp-kicker">{t.events.subtitle}</p>
                    <h1 className="lp-page__title">{t.events.title}</h1>
                    <p className="lp-lead">{t.events.intro}</p>
                </motion.div>

                {loading ? (
                    <p className="lp-loading">Loading…</p>
                ) : isEmpty ? (
                    <motion.div
                        className="lp-card lp-event-empty"
                        {...reveal}
                        transition={{ duration: 0.45 }}
                    >
                        <h3 className="lp-card__title">{t.events.emptyTitle}</h3>
                        <p className="lp-card__text">{t.events.emptyText}</p>
                        <Link className="lp-card__link" href="/contact">
                            {t.events.emptyCta} →
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {upcoming.length > 0 && (
                            <>
                                <h2 className="lp-subhead">{t.events.upcoming}</h2>
                                <div className="lp-grid">{upcoming.map(card)}</div>
                            </>
                        )}
                        {past.length > 0 && (
                            <>
                                <h2 className="lp-subhead">{t.events.past}</h2>
                                <div className="lp-grid">{past.map(card)}</div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EventsList;
