'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useCmsCollection } from '../../api';
import { CmsSponsor } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import SponsorTiers from './SponsorTiers';
import './landing.css';

export interface SponsorsListProps {
    sponsors?: CmsSponsor[] | null;
}

const SponsorsList: React.FC<SponsorsListProps> = (props) => {
    const { t } = useLanguage();
    const { data: sponsors, loading } = useCmsCollection<CmsSponsor>(
        'sponsors',
        { depth: '1' },
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
                    <SponsorTiers sponsors={sponsors} />
                )}
            </div>
        </div>
    );
};

export default SponsorsList;
