'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCmsGlobal, useSiteConfig, mediaUrl } from '../../api';
import { CmsPartner, CmsProject } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import { hasCaseStudy } from './ProjectShowcase';
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
    projects?: CmsProject[] | null;
}

const Partner: React.FC<PartnerProps> = (props) => {
    const { t } = useLanguage();
    const siteConfig = useSiteConfig();
    const { data: partner } = useCmsGlobal<CmsPartner>('partner', props.partner);

    const title = partner?.title || t.partner.fallbackTitle;
    const intro = partner?.intro || t.partner.fallbackLead;
    const valueProps = partner?.valueProps ?? [];
    const process = partner?.process ?? [];
    const heroImage = mediaUrl(partner?.heroImage);
    const email = partner?.contactEmail || siteConfig.email;
    const projects = (props.projects ?? []).slice(0, 3);

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

                {/* ---- What we bring ---- */}
                {valueProps.length > 0 && (
                    <>
                        <motion.h2 className="lp-h2 lp-about-block" {...reveal} transition={{ duration: 0.5 }}>
                            {t.partner.bring}
                        </motion.h2>
                        <div className="lp-grid">
                            {valueProps.map((v, i) => (
                                <motion.div
                                    key={v.id ?? i}
                                    className="lp-card"
                                    {...reveal}
                                    transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
                                >
                                    <h3 className="lp-card__title">{v.title}</h3>
                                    <p className="lp-card__text">{v.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}

                {/* ---- How it works ---- */}
                {process.length > 0 && (
                    <>
                        <motion.h2 className="lp-h2 lp-about-block" {...reveal} transition={{ duration: 0.5 }}>
                            {t.partner.how}
                        </motion.h2>
                        <div className="lp-steps lp-steps--wrap">
                            {process.map((step, i) => (
                                <motion.div
                                    key={step.id ?? i}
                                    className="lp-step"
                                    {...reveal}
                                    transition={{ duration: 0.45, delay: i * 0.12 }}
                                >
                                    <span className="lp-step__num">{i + 1}</span>
                                    <span className="lp-step__title">{step.title}</span>
                                    <span className="lp-step__text">{step.description}</span>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}

                {partner?.commitment && (
                    <motion.div className="lp-about-teaser" {...reveal} transition={{ duration: 0.5 }}>
                        <p className="lp-lead">{partner.commitment}</p>
                    </motion.div>
                )}

                {/* ---- Recent work ---- */}
                {projects.length > 0 && (
                    <>
                        <motion.h2 className="lp-h2 lp-about-block" {...reveal} transition={{ duration: 0.5 }}>
                            {t.partner.pastWork}
                        </motion.h2>
                        <div className="lp-grid">
                            {projects.map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    className="lp-card"
                                    {...reveal}
                                    transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
                                >
                                    <span className="lp-card__sub">
                                        {t.common.partner} {project.ngoPartner}
                                    </span>
                                    <h3 className="lp-card__title">{project.title}</h3>
                                    <p className="lp-card__text">{project.description}</p>
                                    {hasCaseStudy(project) && (
                                        <Link className="lp-card__link" href={`/projects/${project.slug}`}>
                                            {t.common.learnMore} →
                                        </Link>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
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
