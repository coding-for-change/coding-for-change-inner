'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCmsGlobal } from '../../api';
import { CmsAbout, CmsFaqItem, CmsProject } from '../../api/types';
import RichText from '../RichText';
import './landing.css';
import './about.css';

const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
} as const;

interface StatItem {
    value: string;
    label: string;
    id?: string;
}

export interface AboutProps {
    about?: CmsAbout | null;
    faqs?: CmsFaqItem[] | null;
    stats?: StatItem[];
    projects?: CmsProject[] | null;
}

// Single FAQ row with a local open/close toggle, reusing the landing FAQ styles.
const AboutFaqItem: React.FC<{ item: CmsFaqItem }> = ({ item }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="lp-faq__item">
            <button
                className="lp-faq__q"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
            >
                {item.question}
                <span className="lp-faq__sign">{open ? '–' : '+'}</span>
            </button>
            {open && (
                <motion.div
                    className="lp-faq__a"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <p>{item.answer}</p>
                </motion.div>
            )}
        </div>
    );
};

const About: React.FC<AboutProps> = (props) => {
    // SSR-seeded from the server page; re-fetches only on locale change.
    const { data: about } = useCmsGlobal<CmsAbout>('about', props.about);

    const stats = props.stats ?? [];
    const projects = props.projects ?? [];
    // Defensive: keep only About-category items even if the fetch wasn't filtered.
    const faqs = (props.faqs ?? []).filter((f) => f.category === 'about');

    if (!about) {
        return (
            <div className="lp lp-page">
                <div className="lp-inner">
                    <p className="lp-loading">Loading…</p>
                </div>
            </div>
        );
    }

    const facts = about.facts ?? [];
    const steps = about.steps ?? [];
    const media = about.media ?? [];
    const doors = about.doors ?? [];

    return (
        <div className="lp lp-page">
            <div className="lp-inner">
                {/* Hero — kicker, title, and the answer-first canonical definition */}
                <motion.div
                    className="lp-page__head"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {about.kicker && <p className="lp-kicker">{about.kicker}</p>}
                    <h1 className="lp-page__title">{about.title}</h1>
                    <div className="lp-lead lp-about__definition">
                        <RichText content={about.definition} />
                    </div>
                    {about.tagline && (
                        <p className="lp-about__tagline">{about.tagline}</p>
                    )}
                </motion.div>

                {/* Impact stats (reused from site-config) */}
                {stats.length > 0 && (
                    <div className="lp-stats lp-stats--four">
                        {stats.map((s, i) => (
                            <div className="lp-stat" key={s.id ?? i}>
                                <span className="lp-stat__value">{s.value}</span>
                                <span className="lp-stat__label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Fact box — the structured identity table */}
                {facts.length > 0 && (
                    <motion.div
                        className="lp-facts"
                        {...reveal}
                        transition={{ duration: 0.45 }}
                    >
                        {facts.map((f, i) => (
                            <div className="lp-facts__row" key={f.id ?? i}>
                                <span className="lp-facts__label">{f.label}</span>
                                <span className="lp-facts__value">{f.value}</span>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* How it works */}
                {(about.howTitle || steps.length > 0) && (
                    <section className="lp-about__section">
                        {about.howTitle && <h2 className="lp-h2">{about.howTitle}</h2>}
                        {about.howIntro && <p className="lp-lead">{about.howIntro}</p>}
                        {steps.length > 0 && (
                            <div className="lp-steps">
                                {steps.map((step, i) => (
                                    <motion.div
                                        className="lp-step"
                                        key={step.id ?? i}
                                        {...reveal}
                                        transition={{
                                            duration: 0.4,
                                            delay: Math.min(i * 0.06, 0.24),
                                        }}
                                    >
                                        <span className="lp-step__num">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className="lp-step__title">{step.title}</h3>
                                        <p className="lp-step__text">
                                            {step.description}
                                        </p>
                                        {i < steps.length - 1 && (
                                            <span className="lp-step__connector" />
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* The people */}
                {(about.peopleTitle || about.peopleBody) && (
                    <section className="lp-about__section">
                        {about.peopleTitle && (
                            <h2 className="lp-h2">{about.peopleTitle}</h2>
                        )}
                        {about.peopleBody && (
                            <div className="lp-about__prose">
                                <RichText content={about.peopleBody} />
                            </div>
                        )}
                        <a className="lp-card__link" href="/team">
                            Meet the team →
                        </a>
                    </section>
                )}

                {/* Our work — project cards from the Projects collection */}
                {(about.workTitle || projects.length > 0) && (
                    <section className="lp-about__section">
                        {about.workTitle && <h2 className="lp-h2">{about.workTitle}</h2>}
                        {about.workIntro && <p className="lp-lead">{about.workIntro}</p>}
                        {projects.length > 0 && (
                            <div className="lp-grid">
                                {projects.map((p, i) => (
                                    <motion.div
                                        className="lp-card"
                                        key={p.id ?? i}
                                        {...reveal}
                                        transition={{
                                            duration: 0.4,
                                            delay: Math.min(i * 0.05, 0.2),
                                        }}
                                    >
                                        <span className="lp-card__meta">
                                            {p.ngoPartner}
                                        </span>
                                        <h3 className="lp-card__title">{p.title}</h3>
                                        <p className="lp-card__text">{p.description}</p>
                                        {p.technologies &&
                                            p.technologies.length > 0 && (
                                                <div className="lp-pills">
                                                    {p.technologies.map((t, ti) => (
                                                        <span
                                                            className="lp-pill"
                                                            key={t.id ?? ti}
                                                        >
                                                            {t.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                        <a
                            className="lp-card__link lp-about__inline-link"
                            href="/projects"
                        >
                            See all projects →
                        </a>
                    </section>
                )}

                {/* How we're funded */}
                {(about.fundingTitle || about.fundingBody) && (
                    <section className="lp-about__section">
                        {about.fundingTitle && (
                            <h2 className="lp-h2">{about.fundingTitle}</h2>
                        )}
                        {about.fundingBody && (
                            <div className="lp-about__prose">
                                <RichText content={about.fundingBody} />
                            </div>
                        )}
                    </section>
                )}

                {/* In the media */}
                {media.length > 0 && (
                    <section className="lp-about__section">
                        {about.mediaTitle && (
                            <h2 className="lp-h2">{about.mediaTitle}</h2>
                        )}
                        <div className="lp-media">
                            {media.map((m, i) => {
                                const inner = (
                                    <>
                                        <span className="lp-media__outlet">
                                            {m.outlet}
                                        </span>
                                        {m.description && (
                                            <span className="lp-media__desc">
                                                {m.description}
                                            </span>
                                        )}
                                    </>
                                );
                                return m.url ? (
                                    <a
                                        className="lp-media__item"
                                        key={m.id ?? i}
                                        href={m.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {inner}
                                    </a>
                                ) : (
                                    <span className="lp-media__item" key={m.id ?? i}>
                                        {inner}
                                    </span>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Identity FAQ (also emitted as FAQPage JSON-LD by the server page) */}
                {faqs.length > 0 && (
                    <section className="lp-about__section">
                        {about.faqTitle && <h2 className="lp-h2">{about.faqTitle}</h2>}
                        {about.faqIntro && <p className="lp-lead">{about.faqIntro}</p>}
                        <div className="lp-faq">
                            {faqs.map((item) => (
                                <AboutFaqItem key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Get involved — the three doors */}
                {doors.length > 0 && (
                    <section className="lp-about__section">
                        {about.ctaTitle && <h2 className="lp-h2">{about.ctaTitle}</h2>}
                        <div className="lp-grid">
                            {doors.map((d, i) => (
                                <motion.div
                                    className="lp-card lp-about__door"
                                    key={d.id ?? i}
                                    {...reveal}
                                    transition={{
                                        duration: 0.4,
                                        delay: Math.min(i * 0.06, 0.24),
                                    }}
                                >
                                    <span className="lp-card__meta">{d.audience}</span>
                                    <h3 className="lp-card__title">{d.title}</h3>
                                    <p className="lp-card__text">{d.description}</p>
                                    <a
                                        className="lp-btn lp-btn--primary lp-about__door-btn"
                                        href={d.ctaHref}
                                    >
                                        {d.ctaLabel}
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default About;
