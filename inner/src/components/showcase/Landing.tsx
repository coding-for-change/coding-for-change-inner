'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useTransform,
    useReducedMotion,
    type MotionValue,
} from 'framer-motion';
import { useCmsCollection, useCmsGlobal, useSiteConfig } from '../../api';
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

// The fresco point the hero zoom centres on — the near-touching fingertips,
// as a fraction of the frame. The image's CSS object-position is set to this
// same point, so at scale 1 the fingertips sit at (FOCUS_X, FOCUS_Y) of the
// frame on every viewport; the zoom then only has to pan a small 10% to bring
// them to dead-centre, which never drags the frame off the stage. Keep these in
// sync with object-position / transform-origin in landing.css.
const HERO_FOCUS_X = 0.4;
const HERO_FOCUS_Y = 0.47;
const HERO_START_SCALE = 3.3;

/**
 * Drives the scroll-zoom hero and returns a 0→1 progress MotionValue (for the
 * headline crossfade). The section is tall; a sticky stage inside it stays
 * pinned while the section scrolls past.
 *
 * The frame transform is computed in JS rather than via CSS object-position,
 * because object-position can't hold an off-centre point (the fingertips sit at
 * ~40% — God's group fills the right half) dead-centre at scale 1. So we pan
 * *and* zoom: the touch is centred while zoomed in, then the frame pans back to
 * the balanced full fresco as progress → 1.
 *
 * It runs on a requestAnimationFrame loop that polls the scroll position rather
 * than listening for `scroll` events — the scroller differs by layout (desktop
 * scrolls the `.site-scroll` overflow:auto div; mobile scrolls the window) and
 * the shell can swap after mount, so we re-resolve it each frame; polling also
 * sidesteps `scroll` not bubbling from a nested scroller. Once fully zoomed out
 * the zoom *latches*: the tall runway collapses to a normal-height hero (scroll
 * compensated so nothing jumps — the stage is pinned) so scrolling back over it
 * is smooth instead of hitting a long pinned dead-zone, and the loop stops.
 * Reduced motion is a plain static full-fresco hero (no runway/zoom/pan/loop).
 */
function useHeroZoom(
    sectionRef: React.RefObject<HTMLElement | null>,
    frameRef: React.RefObject<HTMLElement | null>,
    reduced: boolean | null
): MotionValue<number> {
    const progress = useMotionValue(0);
    useEffect(() => {
        const section = sectionRef.current;
        const frame = frameRef.current;
        if (!section || !frame) return;

        // Desktop scrolls `.site-scroll`; mobile scrolls the window. The shell can
        // swap after mount, so resolve fresh on every read (never cache).
        const resolveScroller = (): HTMLElement | null =>
            section.closest<HTMLElement>('.site-scroll');
        const viewportH = (el: HTMLElement | null) =>
            el ? el.clientHeight : window.innerHeight;
        const scrollTopOf = (el: HTMLElement | null) =>
            el ? el.scrollTop : window.scrollY;

        // Reduced motion: a plain full-fresco hero — no tall runway, no zoom/pan,
        // no loop. Show the resting headline + CTAs (progress pinned at 1).
        if (reduced) {
            const applyStatic = () => {
                section.style.height = `${viewportH(resolveScroller())}px`;
                frame.style.transform = '';
                progress.set(1);
            };
            applyStatic();
            window.addEventListener('resize', applyStatic);
            return () => window.removeEventListener('resize', applyStatic);
        }

        const paintFrame = (p: number) => {
            const Wf = frame.clientWidth;
            const Hf = frame.clientHeight;
            if (!Wf || !Hf) return;
            // object-position (= transform-origin, in CSS) already puts the
            // fingertips at (FOCUS_X, FOCUS_Y) of the frame, so we only scale and
            // pan the small remaining distance to centre. k: 1 in → 0 out.
            const k = 1 - p;
            const s = 1 + (HERO_START_SCALE - 1) * k;
            const tx = (0.5 - HERO_FOCUS_X) * Wf * k;
            const ty = (0.5 - HERO_FOCUS_Y) * Hf * k;
            frame.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
        };

        let latched = false;
        const measureAndPaint = () => {
            const el = resolveScroller();
            const vh = viewportH(el);
            const rect = section.getBoundingClientRect();
            const scrollerTop = el ? el.getBoundingClientRect().top : 0;
            const travel = rect.height - vh;
            let p =
                travel <= 0
                    ? 0
                    : Math.min(1, Math.max(0, (scrollerTop - rect.top) / travel));
            // The first time it fully opens out, collapse the tall runway to a
            // normal-height hero and pull the scroll back by that distance — the
            // stage is pinned (full fresco fills the viewport either way), so
            // nothing on screen moves, but scrolling back over the hero is smooth
            // rather than a long pinned dead-zone.
            if (!latched && p >= 0.995) {
                latched = true;
                section.style.height = `${vh}px`;
                const scrollEl: HTMLElement =
                    el ??
                    (document.scrollingElement as HTMLElement | null) ??
                    document.documentElement;
                const prev = scrollEl.style.scrollBehavior;
                scrollEl.style.scrollBehavior = 'auto';
                scrollEl.scrollTop -= travel;
                scrollEl.style.scrollBehavior = prev;
            }
            if (latched) {
                p = 1;
                section.style.height = `${vh}px`; // stay synced on resize
            }
            progress.set(p);
            paintFrame(p);
        };

        // rAF loop: poll scroll directly (skip frames where it hasn't moved) and
        // self-stop once latched. Robust to `scroll` events not firing on a nested
        // scroller / programmatic scrolls.
        let rafId = 0;
        let lastScroll = NaN;
        const loop = () => {
            const s = scrollTopOf(resolveScroller());
            if (s !== lastScroll) {
                lastScroll = s;
                measureAndPaint();
            }
            rafId = latched ? 0 : requestAnimationFrame(loop);
        };
        const onResize = () => {
            lastScroll = NaN; // force a recompute at the new size
            if (latched) measureAndPaint();
            else if (!rafId) rafId = requestAnimationFrame(loop);
        };
        measureAndPaint();
        rafId = requestAnimationFrame(loop);
        window.addEventListener('resize', onResize);
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener('resize', onResize);
        };
    }, [sectionRef, frameRef, reduced, progress]);
    return progress;
}

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

    // --- Scroll-driven hero (Michelangelo, "The Creation of Adam") ---------
    // The hero <section> is intentionally tall; the stage inside it is `sticky`
    // so it stays pinned while the section scrolls past. useHeroZoom pans + zooms
    // the frame directly (see the hook) — opening on the centred fingertips under
    // "Tech meets Social Impact" and pulling back to the full fresco under
    // "A match made in heaven"; the headline crossfades on this progress value.
    const heroRef = useRef<HTMLDivElement>(null);
    const heroFrameRef = useRef<HTMLDivElement>(null);
    const reduceMotion = useReducedMotion();
    const heroProgress = useHeroZoom(heroRef, heroFrameRef, reduceMotion);
    const line1Opacity = useTransform(heroProgress, [0, 0.16, 0.32], [1, 1, 0]);
    const line2Opacity = useTransform(heroProgress, [0.44, 0.64], [0, 1]);
    // Keep the (invisible) resting-state CTAs unclickable until they've faded in.
    const line2Pointer = useTransform(line2Opacity, (o) =>
        o > 0.5 ? 'auto' : 'none'
    );
    const hintOpacity = useTransform(heroProgress, [0, 0.12], [1, 0]);

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
            {/* ---- Hero: scroll-zoom over "The Creation of Adam" ---- */}
            <section id="home" ref={heroRef} className="lp-zhero">
                <div className="lp-zhero__stage">
                    <div className="lp-zhero__frame" ref={heroFrameRef}>
                        <img
                            className="lp-zhero__img"
                            src="/images/creation-of-adam.jpg"
                            alt={
                                'Michelangelo’s “The Creation of Adam” — two ' +
                                'hands reaching toward one another'
                            }
                            draggable={false}
                        />
                    </div>
                    <div className="lp-zhero__scrim" />

                    {/* Zoomed-in headline: the spark between the fingertips. */}
                    <motion.div
                        className="lp-zhero__copy lp-zhero__copy--one"
                        style={{ opacity: line1Opacity }}
                    >
                        <p className="lp-zhero__kicker">{c.heroKicker}</p>
                        <h1 className="lp-zhero__title">{t.home.heroLineOne}</h1>
                    </motion.div>

                    {/* Zoomed-out headline: the whole fresco + the club's CTAs. */}
                    <motion.div
                        className="lp-zhero__copy lp-zhero__copy--two"
                        style={{ opacity: line2Opacity, pointerEvents: line2Pointer }}
                    >
                        <p className="lp-zhero__eyebrow">
                            {siteConfig.clubName || 'Coding for Change'}
                        </p>
                        <h2 className="lp-zhero__title">{t.home.heroLineTwo}</h2>
                        <p className="lp-zhero__lead">
                            {siteConfig.tagline || t.about.oneLiner}
                        </p>
                        <div className="lp-zhero__ctas">
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
                    </motion.div>

                    <motion.span
                        className="lp-zhero__hint"
                        style={{ opacity: reduceMotion ? 0 : hintOpacity }}
                    >
                        {c.heroScrollHint}
                    </motion.span>
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
