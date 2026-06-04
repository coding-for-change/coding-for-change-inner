import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCmsCollection, mediaUrl, useSiteConfig } from '../../api';
import {
    CmsEvent,
    CmsProject,
    CmsSponsor,
    CmsFaqItem,
} from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import './landing.css';

// Shared scroll-reveal animation. Sections fade/slide in once on first view.
const reveal = {
    initial: { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
} as const;

const statusColors: Record<string, string> = {
    active: '#2f8f90',
    completed: '#246b6c',
    recruiting: '#b5651d',
};

const Landing: React.FC = () => {
    const siteConfig = useSiteConfig();
    const { t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();

    const { data: events, loading: eventsLoading } =
        useCmsCollection<CmsEvent>('events');
    const { data: projects, loading: projectsLoading } =
        useCmsCollection<CmsProject>('projects');
    const { data: sponsors, loading: sponsorsLoading } =
        useCmsCollection<CmsSponsor>('sponsors');
    const { data: faq, loading: faqLoading } =
        useCmsCollection<CmsFaqItem>('faq');

    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Deep-link / nav handling: scroll to the section named in the URL hash
    // (e.g. /#projects). Re-runs after a short delay so async CMS sections
    // that grow taller after loading still land in the right spot.
    useEffect(() => {
        const id = location.hash.replace('#', '');
        if (!id) {
            document
                .getElementById('home')
                ?.scrollIntoView({ block: 'start' });
            return;
        }
        const scroll = () =>
            document
                .getElementById(id)
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        scroll();
        const timer = setTimeout(scroll, 350);
        return () => clearTimeout(timer);
    }, [location.hash, location.pathname]);

    const upcoming = (events ?? []).filter((e) => e.isUpcoming);
    const past = (events ?? []).filter((e) => !e.isUpcoming);

    const renderEventCard = (event: CmsEvent, i: number) => (
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
        <div className="lp lp--landing">
            {/* ---- Hero ---- */}
            <section id="home" className="lp-hero">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block' }}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                    >
                        <p className="lp-kicker">{t.home.kicker}</p>
                        <h1 className="lp-hero__title">
                            {siteConfig.clubName || 'Coding for Change'}
                        </h1>
                        <p className="lp-hero__lead">
                            {siteConfig.tagline || t.about.oneLiner}
                        </p>
                        <div className="lp-hero__ctas">
                            <Link className="lp-btn lp-btn--primary" to="/join">
                                {t.home.ctaPrimary}
                            </Link>
                            <a
                                className="lp-btn lp-btn--ghost"
                                href="#projects"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/#projects');
                                }}
                            >
                                {t.home.ctaSecondary}
                            </a>
                        </div>
                        <span className="lp-scrollhint">↓ scroll to explore</span>
                    </motion.div>
                </div>
            </section>

            {/* ---- About + stats ---- */}
            <section id="about" className="lp-section">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block' }}
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="lp-kicker">{t.about.kicker}</p>
                        <h2 className="lp-h2">{t.about.oneLiner}</h2>
                        <p className="lp-lead">{t.about.pitch}</p>
                    </motion.div>
                    <div className="lp-stats">
                        {t.about.stats.map((s, i) => (
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
                </div>
            </section>

            {/* ---- Process: how we work with NGOs ---- */}
            <section id="process" className="lp-section lp-section--alt">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block' }}
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
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
                                <span className="lp-step__title">
                                    {step.title}
                                </span>
                                <span className="lp-step__text">{step.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---- Events ---- */}
            <section id="events" className="lp-section">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block' }}
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="lp-kicker">{t.events.subtitle}</p>
                        <h2 className="lp-h2">{t.events.title}</h2>
                        <p className="lp-lead">{t.events.intro}</p>
                    </motion.div>
                    {eventsLoading ? (
                        <p className="lp-loading">Loading…</p>
                    ) : (
                        <>
                            {upcoming.length > 0 && (
                                <>
                                    <h3 className="lp-subhead">
                                        {t.events.upcoming}
                                    </h3>
                                    <div className="lp-grid">
                                        {upcoming.map(renderEventCard)}
                                    </div>
                                </>
                            )}
                            {past.length > 0 && (
                                <>
                                    <h3 className="lp-subhead">
                                        {t.events.past}
                                    </h3>
                                    <div className="lp-grid">
                                        {past.map(renderEventCard)}
                                    </div>
                                </>
                            )}
                            {upcoming.length === 0 && past.length === 0 && (
                                <motion.div
                                    className="lp-card lp-event-empty"
                                    {...reveal}
                                    transition={{ duration: 0.45 }}
                                >
                                    <h3 className="lp-card__title">
                                        {t.events.emptyTitle}
                                    </h3>
                                    <p className="lp-card__text">
                                        {t.events.emptyText}
                                    </p>
                                    <Link
                                        className="lp-card__link"
                                        to="/contact"
                                    >
                                        {t.events.emptyCta} →
                                    </Link>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* ---- Projects ---- */}
            <section id="projects" className="lp-section lp-section--alt">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block' }}
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="lp-kicker">{t.projects.subtitle}</p>
                        <h2 className="lp-h2">{t.projects.title}</h2>
                        <p className="lp-lead">{t.projects.intro}</p>
                    </motion.div>
                    {projectsLoading ? (
                        <p className="lp-loading">Loading…</p>
                    ) : (
                        <div className="lp-grid">
                            {(projects ?? []).map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    className="lp-card"
                                    {...reveal}
                                    transition={{
                                        duration: 0.45,
                                        delay: Math.min(i * 0.05, 0.3),
                                    }}
                                >
                                    <div className="lp-card__row">
                                        <h3 className="lp-card__title">
                                            {project.title}
                                        </h3>
                                        <span
                                            className="lp-status"
                                            style={{
                                                backgroundColor:
                                                    statusColors[
                                                        project.status
                                                    ] || '#808080',
                                            }}
                                        >
                                            {project.status}
                                        </span>
                                    </div>
                                    <span className="lp-card__sub">
                                        {t.common.partner} {project.ngoPartner}
                                    </span>
                                    <p className="lp-card__text">
                                        {project.description}
                                    </p>
                                    {(project.technologies ?? []).length > 0 && (
                                        <div className="lp-pills">
                                            {(project.technologies ?? []).map(
                                                (tech) => (
                                                    <span
                                                        key={tech.name}
                                                        className="lp-pill"
                                                    >
                                                        {tech.name}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ---- Sponsors ---- */}
            <section id="sponsors" className="lp-section">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block' }}
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="lp-kicker">{t.sponsors.subtitle}</p>
                        <h2 className="lp-h2">{t.sponsors.title}</h2>
                        <p className="lp-lead">{t.sponsors.intro}</p>
                    </motion.div>
                    {sponsorsLoading ? (
                        <p className="lp-loading">Loading…</p>
                    ) : (
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
                                    <div
                                        key={sponsor.id}
                                        className="lp-sponsor"
                                    >
                                        {inner}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* ---- FAQ ---- */}
            <section id="qa" className="lp-section lp-section--alt">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block' }}
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="lp-kicker">{t.qa.subtitle}</p>
                        <h2 className="lp-h2">{t.qa.title}</h2>
                        <p className="lp-lead">{t.qa.intro}</p>
                    </motion.div>
                    {faqLoading ? (
                        <p className="lp-loading">Loading…</p>
                    ) : (
                        <div className="lp-faq">
                            {(faq ?? []).map((item) => {
                                const isOpen = openFaq === item.id;
                                return (
                                    <div key={item.id} className="lp-faq__item">
                                        <button
                                            className="lp-faq__q"
                                            onClick={() =>
                                                setOpenFaq(
                                                    isOpen ? null : item.id
                                                )
                                            }
                                        >
                                            <span>{item.question}</span>
                                            <span className="lp-faq__sign">
                                                {isOpen ? '−' : '+'}
                                            </span>
                                        </button>
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    className="lp-faq__a"
                                                    initial={{
                                                        height: 0,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        height: 'auto',
                                                        opacity: 1,
                                                    }}
                                                    exit={{
                                                        height: 0,
                                                        opacity: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.28,
                                                        ease: 'easeInOut',
                                                    }}
                                                >
                                                    <p>{item.answer}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* ---- Closing CTA ---- */}
            <section className="lp-cta">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block' }}
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="lp-cta__heading">{t.cta.heading}</h2>
                        <p className="lp-cta__text">{t.cta.text}</p>
                        <div className="lp-cta__btns">
                            <Link
                                className="lp-btn lp-btn--light"
                                to="/join"
                            >
                                {t.cta.join}
                            </Link>
                            <Link
                                className="lp-btn lp-btn--light"
                                to="/contact"
                            >
                                {t.cta.contact}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
