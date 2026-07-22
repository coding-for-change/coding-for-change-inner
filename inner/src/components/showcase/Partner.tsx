'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCmsGlobal, useSiteConfig, mediaUrl } from '../../api';
import { CmsPartner, CmsAbout, CmsHomepage } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import BookingEmbed from '../general/BookingEmbed';
import ClosingCta from './ClosingCta';
import './landing.css';

const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
} as const;

export interface PartnerProps {
    partner?: CmsPartner | null;
    about?: CmsAbout | null;
    homepage?: CmsHomepage | null;
}


const Partner: React.FC<PartnerProps> = (props) => {
    const { t } = useLanguage();
    const siteConfig = useSiteConfig();
    const { data: partner } = useCmsGlobal<CmsPartner>('partner', props.partner);
    const { data: about } = useCmsGlobal<CmsAbout>('about', props.about);
    const { data: hp } = useCmsGlobal<CmsHomepage>('homepage', props.homepage);

    const title = partner?.title || t.partner.fallbackTitle;
    const intro = partner?.intro || t.partner.fallbackLead;
    const heroImage = mediaUrl(partner?.heroImage);
    const email = partner?.contactEmail || siteConfig.email;
    const valuesTitle = about?.valuesTitle || t.aboutPage.valuesTitle;
    const values = about?.values?.length ? about.values : t.aboutPage.values;
    const steps = hp?.steps?.length ? hp.steps : t.about.steps;
    const processKicker = hp?.processKicker || t.process.kicker;
    const processHeading = hp?.processHeading || t.process.heading;
    const processIntro = hp?.processIntro || t.process.intro;

    return (
        <div className="lp">
            <div className="lp-page">
            <div className="lp-inner">
                <motion.div
                    className="lp-page__head"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="lp-kicker">{t.partner.kicker}</p>
                    <h1 className="lp-page__title">{title}</h1>
                    <p className="lp-lead">{intro}</p>
                    <div className="lp-cta__btns" style={{ marginTop: 28 }}>
                        <a className="lp-btn lp-btn--primary" href="#partner-book">
                            {t.partner.talkCta} →
                        </a>
                    </div>
                </motion.div>

                {heroImage && (
                    <motion.div
                        className="lp-page__hero"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <img src={heroImage} alt={title} />
                    </motion.div>
                )}

                {/* ---- What we care about (from the former /about page) ---- */}
                <motion.h2 className="lp-h2 lp-about-block" {...reveal} transition={{ duration: 0.5 }}>
                    {valuesTitle}
                </motion.h2>
                <div className="lp-grid lp-grid--values">
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

                {/* ---- How we work with NGOs (shared with the homepage) ---- */}
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
            </div>
            </div>

            {/* ---- Book a meeting (primary partner action) ---- */}
            <section id="partner-book" className="lp-section lp-section--book">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block', width: '100%' }}
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="lp-kicker">{t.partner.kicker}</p>
                        <h2 className="lp-h2">
                            {partner?.ctaHeading || t.cta.heading}
                        </h2>
                        <p className="lp-lead">{partner?.ctaText || t.cta.text}</p>
                        <div style={{ marginTop: 28, width: '100%' }}>
                            <BookingEmbed />
                        </div>
                        <p className="lp-form-note" style={{ marginTop: 16 }}>
                            {email && (
                                <>
                                    <a className="lp-social" href={`mailto:${email}`}>
                                        {email}
                                    </a>
                                    {'  ·  '}
                                </>
                            )}
                            <Link className="lp-social" href="/contact">
                                {t.contact.title}
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </section>

            <ClosingCta />
        </div>
    );
};

export default Partner;
