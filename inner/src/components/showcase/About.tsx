'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCmsGlobal } from '../../api';
import { CmsAbout, CmsHomepage } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import './landing.css';

const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
} as const;

export interface AboutProps {
    about?: CmsAbout | null;
    homepage?: CmsHomepage | null;
}

/**
 * Standalone /about page. Content comes from the CMS `about` global (and the
 * `homepage` global for the shared process/stats/CTA), falling back to the i18n
 * copy for any field left blank — so an empty CMS is safe.
 */
const About: React.FC<AboutProps> = (props) => {
    const { t } = useLanguage();
    const { data: a } = useCmsGlobal<CmsAbout>('about', props.about);
    const { data: hp } = useCmsGlobal<CmsHomepage>('homepage', props.homepage);

    const kicker = a?.kicker || t.aboutPage.kicker;
    const title = a?.title || t.aboutPage.title;
    const lead = a?.lead || t.aboutPage.lead;
    const story = a?.story?.length ? a.story.map((s) => s.text) : t.aboutPage.story;
    const valuesTitle = a?.valuesTitle || t.aboutPage.valuesTitle;
    const values = a?.values?.length ? a.values : t.aboutPage.values;
    const teamTeaser = a?.teamTeaser || t.aboutPage.teamTeaser;
    const teamCta = a?.teamCta || t.aboutPage.teamCta;

    const stats = hp?.stats?.length ? hp.stats : t.about.stats;
    const steps = hp?.steps?.length ? hp.steps : t.about.steps;
    const processKicker = hp?.processKicker || t.process.kicker;
    const processHeading = hp?.processHeading || t.process.heading;
    const processIntro = hp?.processIntro || t.process.intro;
    const ctaHeading = hp?.ctaHeading || t.cta.heading;
    const ctaText = hp?.ctaText || t.cta.text;
    const ctaJoin = hp?.ctaJoin || t.cta.join;
    const ctaContact = hp?.ctaContact || t.cta.contact;

    return (
        <div className="lp">
            <div className="lp-page">
                <div className="lp-inner">
                    {/* ---- Head ---- */}
                    <motion.div
                        className="lp-page__head"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="lp-kicker">{kicker}</p>
                        <h1 className="lp-page__title">{title}</h1>
                        <p className="lp-lead">{lead}</p>
                    </motion.div>

                    {/* ---- Story ---- */}
                    <motion.div className="lp-prose" {...reveal} transition={{ duration: 0.5 }}>
                        {story.map((para, i) => (
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
                        <p className="lp-kicker">{processKicker}</p>
                        <h2 className="lp-h2">{processHeading}</h2>
                        <p className="lp-lead">{processIntro}</p>
                    </motion.div>
                    <div className="lp-steps">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                className="lp-step"
                                {...reveal}
                                transition={{ duration: 0.45, delay: i * 0.12 }}
                            >
                                {i < steps.length - 1 && <span className="lp-step__connector" />}
                                <span className="lp-step__num">{i + 1}</span>
                                <span className="lp-step__title">{step.title}</span>
                                <span className="lp-step__text">{step.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* ---- Values ---- */}
                    <motion.div {...reveal} transition={{ duration: 0.5 }} className="lp-about-block">
                        <h2 className="lp-h2">{valuesTitle}</h2>
                    </motion.div>
                    <div className="lp-grid">
                        {values.map((v, i) => (
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
                        <p className="lp-lead">{teamTeaser}</p>
                        <Link className="lp-btn lp-btn--ghost" href="/team">
                            {teamCta} →
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* ---- Closing CTA ---- */}
            <section className="lp-cta">
                <div className="lp-inner">
                    <motion.div style={{ display: 'block' }} {...reveal} transition={{ duration: 0.5 }}>
                        <h2 className="lp-cta__heading">{ctaHeading}</h2>
                        <p className="lp-cta__text">{ctaText}</p>
                        <div className="lp-cta__btns">
                            <Link className="lp-btn lp-btn--light" href="/join">
                                {ctaJoin}
                            </Link>
                            <Link className="lp-btn lp-btn--light" href="/partner">
                                {ctaContact}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
