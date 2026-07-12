'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCmsCollection, useCmsGlobal, useSiteConfig, mediaUrl } from '../../api';
import {
    CmsEvent,
    CmsProject,
    CmsSponsor,
    CmsFaqItem,
    CmsBlogPost,
    CmsHomepage,
} from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import BookingEmbed from '../general/BookingEmbed';
import ProjectShowcase from './ProjectShowcase';
import SponsorTiers from './SponsorTiers';
import ClosingCta from './ClosingCta';
import './landing.css';

// Shared scroll-reveal animation. Sections fade/slide in once on first view.
const reveal = {
    initial: { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
} as const;

export interface LandingProps {
    events?: CmsEvent[] | null;
    projects?: CmsProject[] | null;
    sponsors?: CmsSponsor[] | null;
    faq?: CmsFaqItem[] | null;
    blog?: CmsBlogPost[] | null;
    homepage?: CmsHomepage | null;
}

const Landing: React.FC<LandingProps> = (props) => {
    const siteConfig = useSiteConfig();
    const { t } = useLanguage();
    const pathname = usePathname();
    const router = useRouter();

    // True when running inside the 3D scene's monitor iframe — resolved after
    // mount to avoid a hydration mismatch (window.top is unreadable server-side).
    const [embedded, setEmbedded] = useState(false);
    useEffect(() => {
        try {
            setEmbedded(window.self !== window.top);
        } catch {
            setEmbedded(true);
        }
    }, []);
    const exitThreeD = () => {
        try {
            if (window.top) {
                window.top.location.href = window.location.pathname || '/';
                return;
            }
        } catch {
            /* cross-origin parent — fall through */
        }
        window.location.href = '/';
    };

    const { data: events } = useCmsCollection<CmsEvent>(
        'events',
        undefined,
        props.events
    );
    const { data: blog } = useCmsCollection<CmsBlogPost>(
        'blog-posts',
        { depth: '2', sort: '-publishedAt', limit: '3' },
        props.blog
    );
    const { data: projects, loading: projectsLoading } =
        useCmsCollection<CmsProject>('projects', undefined, props.projects);
    const { data: sponsors, loading: sponsorsLoading } =
        useCmsCollection<CmsSponsor>('sponsors', { depth: '1' }, props.sponsors);
    const { data: faq, loading: faqLoading } =
        useCmsCollection<CmsFaqItem>('faq', undefined, props.faq);
    const { data: hp } = useCmsGlobal<CmsHomepage>('homepage', props.homepage);
    const heroImage = mediaUrl(hp?.heroImage);

    // Homepage copy: CMS value if set, else the built-in i18n string.
    const c = {
        heroKicker: hp?.heroKicker || t.home.kicker,
        heroCtaPrimary: hp?.heroCtaPrimary || t.home.ctaPrimary,
        heroCtaSecondary: hp?.heroCtaSecondary || t.home.ctaSecondary,
        heroScrollHint: hp?.heroScrollHint || t.home.scrollHint,
        aboutKicker: hp?.aboutKicker || t.about.kicker,
        aboutOneLiner: hp?.aboutOneLiner || t.about.oneLiner,
        aboutPitch: hp?.aboutPitch || t.about.pitch,
        processKicker: hp?.processKicker || t.process.kicker,
        processHeading: hp?.processHeading || t.process.heading,
        processIntro: hp?.processIntro || t.process.intro,
        projectsSubtitle: hp?.projectsSubtitle || t.projects.subtitle,
        projectsTitle: hp?.projectsTitle || t.projects.title,
        projectsIntro: hp?.projectsIntro || t.projects.intro,
        eventsSubtitle: hp?.eventsSubtitle || t.events.subtitle,
        eventsTitle: hp?.eventsTitle || t.events.title,
        eventsIntro: hp?.eventsIntro || t.events.intro,
        sponsorsSubtitle: hp?.sponsorsSubtitle || t.sponsors.subtitle,
        sponsorsTitle: hp?.sponsorsTitle || t.sponsors.title,
        sponsorsIntro: hp?.sponsorsIntro || t.sponsors.intro,
        qaSubtitle: hp?.qaSubtitle || t.qa.subtitle,
        qaTitle: hp?.qaTitle || t.qa.title,
        qaIntro: hp?.qaIntro || t.qa.intro,
        threedKicker: hp?.threedKicker || t.threed.kicker,
        threedTitle: hp?.threedTitle || t.threed.title,
        threedText: hp?.threedText || t.threed.text,
        threedCta: hp?.threedCta || t.threed.cta,
        ctaHeading: hp?.ctaHeading || t.cta.heading,
        ctaText: hp?.ctaText || t.cta.text,
        ctaJoin: hp?.ctaJoin || t.cta.join,
        ctaContact: hp?.ctaContact || t.cta.contact,
    };
    const stats = hp?.stats?.length ? hp.stats : t.about.stats;
    const steps = hp?.steps?.length ? hp.steps : t.about.steps;

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

    // Events are only shown when the collection has content (the /events page
    // exists regardless). Split into upcoming / past for the homepage teaser.
    const upcoming = (events ?? []).filter((e) => e.isUpcoming);
    const past = (events ?? []).filter((e) => !e.isUpcoming);
    const hasEvents = (events?.length ?? 0) > 0;
    const hasSponsors = (sponsors?.length ?? 0) > 0;
    const recentPosts = (blog ?? []).slice(0, 3);
    const hasBlog = recentPosts.length > 0;

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
            <section
                id="home"
                className={'lp-hero' + (heroImage ? ' lp-hero--media' : '')}
            >
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block' }}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                    >
                        <p className="lp-kicker">{c.heroKicker}</p>
                        <h1 className="lp-hero__title">
                            {siteConfig.clubName || 'Coding for Change'}
                        </h1>
                        <p className="lp-hero__lead">
                            {siteConfig.tagline || t.about.oneLiner}
                        </p>
                        <div className="lp-hero__ctas">
                            <Link className="lp-btn lp-btn--primary" href="/join">
                                {c.heroCtaPrimary}
                            </Link>
                            <a
                                className="lp-btn lp-btn--ghost"
                                href="#projects"
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push('/#projects');
                                }}
                            >
                                {c.heroCtaSecondary}
                            </a>
                        </div>
                        <span className="lp-scrollhint">{c.heroScrollHint}</span>
                    </motion.div>
                    {heroImage && (
                        <motion.div
                            className="lp-hero__media"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                        >
                            <img
                                src={heroImage}
                                alt={siteConfig.clubName || 'Coding for Change'}
                            />
                        </motion.div>
                    )}
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
                        <p className="lp-kicker">{c.aboutKicker}</p>
                        <h2 className="lp-h2">{c.aboutOneLiner}</h2>
                        <p className="lp-lead">{c.aboutPitch}</p>
                    </motion.div>
                    <div className="lp-stats">
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
                        <p className="lp-kicker">{c.processKicker}</p>
                        <h2 className="lp-h2">{c.processHeading}</h2>
                        <p className="lp-lead">{c.processIntro}</p>
                    </motion.div>
                    <div className="lp-steps">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                className="lp-step"
                                {...reveal}
                                transition={{ duration: 0.45, delay: i * 0.12 }}
                            >
                                {i < steps.length - 1 && (
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

            {/* ---- Projects ---- */}
            <section id="projects" className="lp-section">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block' }}
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="lp-kicker">{c.projectsSubtitle}</p>
                        <h2 className="lp-h2">{c.projectsTitle}</h2>
                        <p className="lp-lead">{c.projectsIntro}</p>
                    </motion.div>
                    {projectsLoading ? (
                        <p className="lp-loading">Loading…</p>
                    ) : (
                        <ProjectShowcase projects={projects ?? []} />
                    )}
                    <div className="lp-section__more">
                        <Link className="lp-btn lp-btn--ghost" href="/projects">
                            {t.projects.viewAll} →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ---- Events (homepage teaser; only shown when events exist) ---- */}
            {hasEvents && (
                <section id="events" className="lp-section lp-section--alt">
                    <div className="lp-inner">
                        <motion.div style={{ display: 'block' }} {...reveal} transition={{ duration: 0.5 }}>
                            <p className="lp-kicker">{c.eventsSubtitle}</p>
                            <h2 className="lp-h2">{c.eventsTitle}</h2>
                            <p className="lp-lead">{c.eventsIntro}</p>
                        </motion.div>
                        {upcoming.length > 0 && (
                            <>
                                <h3 className="lp-subhead">{t.events.upcoming}</h3>
                                <div className="lp-grid">{upcoming.map(renderEventCard)}</div>
                            </>
                        )}
                        {past.length > 0 && (
                            <>
                                <h3 className="lp-subhead">{t.events.past}</h3>
                                <div className="lp-grid">{past.map(renderEventCard)}</div>
                            </>
                        )}
                        <div className="lp-section__more">
                            <Link className="lp-btn lp-btn--ghost" href="/events">
                                {c.eventsTitle} →
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ---- News / blog teaser (only when posts exist) ---- */}
            {hasBlog && (
                <section id="news" className="lp-section">
                    <div className="lp-inner">
                        <motion.div style={{ display: 'block' }} {...reveal} transition={{ duration: 0.5 }}>
                            <p className="lp-kicker">{t.blog.subtitle}</p>
                            <h2 className="lp-h2">{t.blog.title}</h2>
                        </motion.div>
                        <div className="lp-grid">
                            {recentPosts.map((post, i) => (
                                <motion.div
                                    key={post.id}
                                    className="lp-card"
                                    {...reveal}
                                    transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
                                >
                                    <h3 className="lp-card__title">{post.title}</h3>
                                    <p className="lp-card__text">{post.excerpt}</p>
                                    <Link className="lp-card__link" href={`/blog/${post.slug}`}>
                                        {t.common.learnMore} →
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <div className="lp-section__more">
                            <Link className="lp-btn lp-btn--ghost" href="/blog">
                                {t.blog.title} →
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ---- 3D experience (hidden on mobile). Inside the 3D scene it
                 flips to a "back to the standard site" prompt. ---- */}
            <section className="lp-3d">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block' }}
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="lp-kicker lp-3d__kicker">
                            {embedded ? t.threed.backKicker : c.threedKicker}
                        </p>
                        <h2 className="lp-3d__title">
                            {embedded ? t.threed.backTitle : c.threedTitle}
                        </h2>
                        <p className="lp-3d__text">
                            {embedded ? t.threed.backText : c.threedText}
                        </p>
                        {embedded ? (
                            <button
                                type="button"
                                className="lp-btn lp-btn--light"
                                onClick={exitThreeD}
                            >
                                {t.threed.backCta} →
                            </button>
                        ) : (
                            <a className="lp-btn lp-btn--light" href="/3d">
                                {c.threedCta} →
                            </a>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* ---- Sponsors (only shown when there are sponsors) ---- */}
            {hasSponsors && (
            <section id="sponsors" className="lp-section lp-section--alt">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block' }}
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="lp-kicker">{c.sponsorsSubtitle}</p>
                        <h2 className="lp-h2">{c.sponsorsTitle}</h2>
                        <p className="lp-lead">{c.sponsorsIntro}</p>
                    </motion.div>
                    {sponsorsLoading ? (
                        <p className="lp-loading">Loading…</p>
                    ) : (
                        <SponsorTiers sponsors={sponsors} />
                    )}
                </div>
            </section>
            )}

            {/* ---- FAQ ---- */}
            <section id="qa" className="lp-section">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block' }}
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="lp-kicker">{c.qaSubtitle}</p>
                        <h2 className="lp-h2">{c.qaTitle}</h2>
                        <p className="lp-lead">{c.qaIntro}</p>
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

            {/* ---- Talk to us: dual-audience (NGO → book · student → join) ---- */}
            <section id="book" className="lp-section lp-section--book">
                <div className="lp-inner">
                    <motion.div
                        style={{ display: 'block', width: '100%' }}
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="lp-talk">
                            <div className="lp-talk__panel">
                                <p className="lp-kicker">{t.talk.ngoKicker}</p>
                                <h2 className="lp-h2">{t.talk.ngoHeading}</h2>
                                <p className="lp-lead">{t.talk.ngoText}</p>
                            </div>
                            <div className="lp-talk__panel">
                                <p className="lp-kicker">{t.talk.studentKicker}</p>
                                <h2 className="lp-h2">{t.talk.studentHeading}</h2>
                                <p className="lp-lead">{t.talk.studentText}</p>
                                <Link
                                    className="lp-btn lp-btn--primary"
                                    href="/join"
                                    style={{ marginTop: 20 }}
                                >
                                    {t.talk.studentCta} →
                                </Link>
                            </div>
                        </div>
                        <div style={{ marginTop: 32, width: '100%' }}>
                            <BookingEmbed />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ---- Closing CTA ---- */}
            <ClosingCta homepage={props.homepage} />
        </div>
    );
};

export default Landing;
