'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCmsCollection, mediaUrl, useSiteConfig } from '../../api';
import {
    CmsEvent,
    CmsProject,
    CmsSponsor,
    CmsFaqItem,
} from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import BookingEmbed from '../general/BookingEmbed';
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

export interface LandingProps {
    events?: CmsEvent[] | null;
    projects?: CmsProject[] | null;
    sponsors?: CmsSponsor[] | null;
    faq?: CmsFaqItem[] | null;
}

const Landing: React.FC<LandingProps> = (props) => {
    const siteConfig = useSiteConfig();
    const { t } = useLanguage();
    const pathname = usePathname();
    const router = useRouter();

    const { data: events, loading: eventsLoading } =
        useCmsCollection<CmsEvent>('events', undefined, props.events);
    const { data: projects, loading: projectsLoading } =
        useCmsCollection<CmsProject>('projects', undefined, props.projects);
    const { data: sponsors, loading: sponsorsLoading } =
        useCmsCollection<CmsSponsor>('sponsors', undefined, props.sponsors);
    const { data: faq, loading: faqLoading } =
        useCmsCollection<CmsFaqItem>('faq', undefined, props.faq);

    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Deep-link / nav handling: scroll to the section named in the URL hash
    // (e.g. /#projects). Next's router doesn't expose the hash, so we read it
    // off `window.location` and also listen for `hashchange`. Re-runs after a
    // short delay so async CMS sections that grow taller after loading still
    // land in the right spot.
    const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        const scrollToHash = () => {
            if (scrollTimer.current) clearTimeout(scrollTimer.current);
            const id = window.location.hash.replace('#', '');
            if (!id) {
                document.getElementById('home')?.scrollIntoView({ block: 'start' });
                return;
            }
            const scroll = () =>
                document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            scroll();
            scrollTimer.current = setTimeout(scroll, 350);
        };
        scrollToHash();
        window.addEventListener('hashchange', scrollToHash);
        return () => {
            window.removeEventListener('hashchange', scrollToHash);
            if (scrollTimer.current) clearTimeout(scrollTimer.current);
        };
    }, [pathname]);

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
                            <Link className="lp-btn lp-btn--primary" href="/join">
                                {t.home.ctaPrimary}
                            </Link>
                            <a
                                className="lp-btn lp-btn--ghost"
                                href="#projects"
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push('/#projects');
                                }}
                            >
                                {t.home.ctaSecondary}
                            </a>
                        </div>
                        <span className="lp-scrollhint">{t.home.scrollHint}</span>
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
                        <Link
                            className="lp-card__link"
                            href="/about"
                            style={{ display: 'inline-block', marginTop: 18 }}
                        >
                            {t.common.learnMore} →
                        </Link>
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
                                        href="/contact"
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

            {/* ---- Book a meeting ---- */}
            <section id="book" className="lp-section lp-section--book">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block', width: '100%' }}
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="lp-kicker">{t.nav.contact}</p>
                        <h2 className="lp-h2">{t.book.title}</h2>
                        <p className="lp-lead">{t.book.intro}</p>
                        <div style={{ marginTop: 28, width: '100%' }}>
                            <BookingEmbed />
                        </div>
                    </motion.div>
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
                                href="/join"
                            >
                                {t.cta.join}
                            </Link>
                            <Link
                                className="lp-btn lp-btn--light"
                                href="/contact"
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
