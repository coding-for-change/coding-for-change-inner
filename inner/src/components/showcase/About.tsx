'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import './landing.css';

const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
} as const;

/**
 * Standalone /about page. Copy lives in the i18n table (t.aboutPage) and reuses
 * the shared process/stats/cta strings so the story stays consistent with the
 * homepage. Same visual language as the landing page (.lp-* classes).
 */
const About: React.FC = () => {
    const { t } = useLanguage();
    // Use the same impact stats as the homepage so the two never diverge.
    const stats = t.about.stats;

    return (
        <div className="lp lp-page">
            <div className="lp-inner">
                {/* ---- Head ---- */}
                <motion.div
                    className="lp-page__head"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="lp-kicker">{t.aboutPage.kicker}</p>
                    <h1 className="lp-page__title">{t.aboutPage.title}</h1>
                    <p className="lp-lead">{t.aboutPage.lead}</p>
                </motion.div>

                {/* ---- Story ---- */}
                <motion.div className="lp-prose" {...reveal} transition={{ duration: 0.5 }}>
                    {t.aboutPage.story.map((para, i) => (
                        <p key={i} className="lp-prose__p">
                            {para}
                        </p>
                    ))}
                </motion.div>

                {/* ---- Impact stats ---- */}
                <div className="lp-stats lp-stats--about">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            className="lp-stat"
                            {...reveal}
                            transition={{ duration: 0.45, delay: i * 0.1 }}
                        >
                            <span className="lp-stat__value">{s.value}</span>
                            <span className="lp-stat__label">{s.label}</span>
                        </motion.div>
                    ))}
                </div>

                {/* ---- How we work ---- */}
                <motion.div {...reveal} transition={{ duration: 0.5 }} className="lp-about-block">
                    <p className="lp-kicker">{t.process.kicker}</p>
                    <h2 className="lp-h2">{t.process.heading}</h2>
                    <p className="lp-lead">{t.process.intro}</p>
                </motion.div>
                <div className="lp-steps">
                    {t.about.steps.map((step, i) => (
                        <motion.div
                            key={step.title}
                            className="lp-step"
                            {...reveal}
                            transition={{ duration: 0.45, delay: i * 0.12 }}
                        >
                            {i < t.about.steps.length - 1 && (
                                <span className="lp-step__connector" />
                            )}
                            <span className="lp-step__num">{i + 1}</span>
                            <span className="lp-step__title">{step.title}</span>
                            <span className="lp-step__text">{step.text}</span>
                        </motion.div>
                    ))}
                </div>

                {/* ---- Values ---- */}
                <motion.div {...reveal} transition={{ duration: 0.5 }} className="lp-about-block">
                    <h2 className="lp-h2">{t.aboutPage.valuesTitle}</h2>
                </motion.div>
                <div className="lp-grid">
                    {t.aboutPage.values.map((v, i) => (
                        <motion.div
                            key={v.title}
                            className="lp-card"
                            {...reveal}
                            transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
                        >
                            <h3 className="lp-card__title">{v.title}</h3>
                            <p className="lp-card__text">{v.text}</p>
                        </motion.div>
                    ))}
                </div>

                {/* ---- Team teaser ---- */}
                <motion.div {...reveal} transition={{ duration: 0.5 }} className="lp-about-teaser">
                    <p className="lp-lead">{t.aboutPage.teamTeaser}</p>
                    <Link className="lp-btn lp-btn--ghost" href="/team">
                        {t.aboutPage.teamCta} →
                    </Link>
                </motion.div>
            </div>

            {/* ---- Closing CTA (shared teal band) ---- */}
            <section className="lp-cta">
                <div className="lp-inner">
                    <motion.div style={{ display: 'block' }} {...reveal} transition={{ duration: 0.5 }}>
                        <h2 className="lp-cta__heading">{t.cta.heading}</h2>
                        <p className="lp-cta__text">{t.cta.text}</p>
                        <div className="lp-cta__btns">
                            <Link className="lp-btn lp-btn--light" href="/join">
                                {t.cta.join}
                            </Link>
                            <Link className="lp-btn lp-btn--light" href="/partner">
                                {t.cta.contact}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
