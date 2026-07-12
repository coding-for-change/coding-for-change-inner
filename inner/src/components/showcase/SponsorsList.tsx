'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useCmsCollection, mediaUrl } from '../../api';
import { CmsSponsor } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import './landing.css';

export interface SponsorsListProps {
    sponsors?: CmsSponsor[] | null;
}

const SponsorsList: React.FC<SponsorsListProps> = (props) => {
    const { t } = useLanguage();
    const { data: sponsors, loading } = useCmsCollection<CmsSponsor>(
        'sponsors',
        undefined,
        props.sponsors
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
                    <p className="lp-kicker">{t.sponsors.subtitle}</p>
                    <h1 className="lp-page__title">{t.sponsors.title}</h1>
                    <p className="lp-lead">{t.sponsors.intro}</p>
                </motion.div>

                {loading ? (
                    <p className="lp-loading">Loading…</p>
                ) : (
                    (sponsors?.length ?? 0) > 0 && (
                        <div className="lp-sponsors">
                            {(sponsors ?? []).map((sponsor) => {
                                const logo = mediaUrl(sponsor.logo);
                                const inner = logo ? (
                                    <img src={logo} alt={sponsor.name} />
                                ) : (
                                    <span className="lp-sponsor__name">
                                        {sponsor.name}
                                    </span>
                                );
                                return sponsor.url ? (
                                    <a
                                        key={sponsor.id}
                                        className="lp-sponsor"
                                        href={sponsor.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {inner}
                                    </a>
                                ) : (
                                    <div key={sponsor.id} className="lp-sponsor">
                                        {inner}
                                    </div>
                                );
                            })}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default SponsorsList;
