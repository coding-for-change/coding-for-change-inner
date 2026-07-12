'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import '../components/showcase/landing.css';

/**
 * Global 404 boundary. Rendered inside the root layout only (not the `(os)`
 * site shell), so it brings its own centred layout while reusing the modern
 * `.lp-*` design language — colours, fonts and buttons — from the rest of the
 * site. `'use client'` lets it read the visitor's locale via `useLanguage()`.
 */
export default function NotFound() {
    const { t } = useLanguage();

    return (
        <div className="lp">
            <div
                className="lp-page"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '100vh',
                }}
            >
                <div className="lp-inner">
                    <motion.div
                        className="lp-page__head"
                        style={{ marginBottom: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="lp-kicker">{t.notFound.kicker}</p>
                        <h1 className="lp-page__title">{t.notFound.title}</h1>
                        <p className="lp-lead">{t.notFound.lead}</p>

                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 14,
                                marginTop: 32,
                            }}
                        >
                            <Link className="lp-btn lp-btn--primary" href="/">
                                {t.notFound.backHome}
                            </Link>
                        </div>

                        <p
                            className="lp-kicker"
                            style={{ margin: '44px 0 16px' }}
                        >
                            {t.notFound.helpfulLinks}
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 14,
                            }}
                        >
                            <Link className="lp-btn lp-btn--ghost" href="/projects">
                                {t.notFound.projects}
                            </Link>
                            <Link className="lp-btn lp-btn--ghost" href="/about">
                                {t.notFound.about}
                            </Link>
                            <Link className="lp-btn lp-btn--ghost" href="/join">
                                {t.notFound.join}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
