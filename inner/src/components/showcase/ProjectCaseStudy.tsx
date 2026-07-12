'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { mediaUrl } from '../../api';
import { CmsProject } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import BookingEmbed from '../general/BookingEmbed';
import './landing.css';

const statusColors: Record<string, string> = {
    active: '#2f8f90',
    completed: '#246b6c',
    recruiting: '#b5651d',
};

type View = 'choose' | 'technical' | 'impact';
const STORE_KEY = 'cfc-casestudy-view';

const hasImpactContent = (p: CmsProject): boolean =>
    !!(p.impactHeadline || p.impactChallenge || p.impactSolution || p.impactResults);
const hasTechnicalContent = (p: CmsProject): boolean =>
    !!(p.problem || p.approach || p.outcome);

const Paragraphs: React.FC<{ text?: string | null }> = ({ text }) =>
    text ? (
        <>
            {text
                .split('\n')
                .filter(Boolean)
                .map((p, i) => (
                    <p key={i} className="lp-cs__p">
                        {p}
                    </p>
                ))}
        </>
    ) : null;

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
    const { t } = useLanguage();
    const label = (t.projects.status as Record<string, string>)[status] || status;
    return (
        <span
            className="lp-status"
            style={{ backgroundColor: statusColors[status] || '#808080' }}
        >
            {label}
        </span>
    );
};

type Shot = NonNullable<CmsProject['gallery']>[number];

/**
 * Full-screen, keyboard-navigable image viewer for the gallery. Rendered in a
 * portal on <body> so it covers the whole viewport regardless of the
 * transformed page shell (`.site-page` has a transform → new containing block).
 * ← / → navigate (wrapping), Esc closes, backdrop click closes.
 */
const Lightbox: React.FC<{
    shots: Shot[];
    index: number;
    title: string;
    onClose: () => void;
    onNavigate: (index: number) => void;
}> = ({ shots, index, title, onClose, onNavigate }) => {
    const count = shots.length;
    const go = useCallback(
        (delta: number) => onNavigate((index + delta + count) % count),
        [index, count, onNavigate]
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            else if (e.key === 'ArrowRight') go(1);
            else if (e.key === 'ArrowLeft') go(-1);
        };
        window.addEventListener('keydown', onKey);
        // Lock background scroll (the desktop scroller is `.site-scroll`, not
        // <body>, so lock both) and restore on close.
        const scroller = document.querySelector<HTMLElement>('.site-scroll');
        const prevBody = document.body.style.overflow;
        const prevScroller = scroller?.style.overflow ?? '';
        document.body.style.overflow = 'hidden';
        if (scroller) scroller.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevBody;
            if (scroller) scroller.style.overflow = prevScroller;
        };
    }, [go, onClose]);

    if (typeof document === 'undefined') return null;

    const shot = shots[index];
    const src = mediaUrl(shot.image) || '';

    return createPortal(
        <div
            className="lp-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={shot.caption || title}
            onClick={onClose}
        >
            <button
                type="button"
                className="lp-lightbox__close"
                aria-label="Close"
                onClick={onClose}
            >
                ×
            </button>
            {count > 1 && (
                <button
                    type="button"
                    className="lp-lightbox__nav lp-lightbox__nav--prev"
                    aria-label="Previous image"
                    onClick={(e) => {
                        e.stopPropagation();
                        go(-1);
                    }}
                >
                    ‹
                </button>
            )}
            <figure
                className="lp-lightbox__figure"
                onClick={(e) => e.stopPropagation()}
            >
                <img className="lp-lightbox__img" src={src} alt={shot.caption ?? title} />
                {(shot.caption || count > 1) && (
                    <figcaption className="lp-lightbox__cap">
                        {shot.caption && <span>{shot.caption}</span>}
                        {count > 1 && (
                            <span className="lp-lightbox__count">
                                {index + 1} / {count}
                            </span>
                        )}
                    </figcaption>
                )}
            </figure>
            {count > 1 && (
                <button
                    type="button"
                    className="lp-lightbox__nav lp-lightbox__nav--next"
                    aria-label="Next image"
                    onClick={(e) => {
                        e.stopPropagation();
                        go(1);
                    }}
                >
                    ›
                </button>
            )}
        </div>,
        document.body
    );
};

const Gallery: React.FC<{
    project: CmsProject;
    shots?: CmsProject['gallery'];
}> = ({ project, shots }) => {
    const items = (shots ?? project.gallery ?? []).filter((g) => mediaUrl(g.image));
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    if (items.length === 0) return null;
    return (
        <>
            <div className="lp-cs__gallery">
                {items.map((g, i) => (
                    <figure className="lp-cs__shot" key={g.id ?? i}>
                        <button
                            type="button"
                            className="lp-cs__shot-btn"
                            onClick={() => setOpenIndex(i)}
                            aria-label={
                                g.caption ? `View image: ${g.caption}` : `View image ${i + 1}`
                            }
                        >
                            <img src={mediaUrl(g.image) || ''} alt={g.caption ?? project.title} />
                        </button>
                        {g.caption && <figcaption className="lp-cs__caption">{g.caption}</figcaption>}
                    </figure>
                ))}
            </div>
            {openIndex !== null && (
                <Lightbox
                    shots={items}
                    index={openIndex}
                    title={project.title}
                    onClose={() => setOpenIndex(null)}
                    onNavigate={setOpenIndex}
                />
            )}
        </>
    );
};

const Quote: React.FC<{ project: CmsProject }> = ({ project }) =>
    project.quote?.text ? (
        <blockquote className="lp-cs__quote">
            <p className="lp-cs__quote-text">“{project.quote.text}”</p>
            {(project.quote.author || project.quote.role) && (
                <footer className="lp-cs__quote-by">
                    {project.quote.author}
                    {project.quote.author && project.quote.role && ', '}
                    {project.quote.role}
                </footer>
            )}
        </blockquote>
    ) : null;

/* ---- Technical deep-dive (for prospective members) ---- */
const TechnicalView: React.FC<{ project: CmsProject }> = ({ project }) => {
    const { t } = useLanguage();
    const hero = mediaUrl(project.image);
    return (
        <motion.article
            className="lp-cs"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="lp-cs__head">
                <StatusPill status={project.status} />
                <h1 className="lp-cs__title">{project.title}</h1>
                <span className="lp-card__sub">
                    {t.common.partner} {project.ngoPartner}
                </span>
                <p className="lp-lead lp-cs__lead">{project.description}</p>
                {project.impact && <p className="lp-cs__impact">{project.impact}</p>}
            </div>

            {hero && (
                <div className="lp-cs__hero">
                    <img src={hero} alt={project.title} />
                </div>
            )}

            <div className="lp-cs__body">
                <section className="lp-cs__block">
                    <h2 className="lp-cs__h">{t.projectDetail.problem}</h2>
                    <Paragraphs text={project.problem} />
                </section>
                <section className="lp-cs__block">
                    <h2 className="lp-cs__h">{t.projectDetail.approach}</h2>
                    <Paragraphs text={project.approach} />
                </section>
                <section className="lp-cs__block">
                    <h2 className="lp-cs__h">{t.projectDetail.outcome}</h2>
                    <Paragraphs text={project.outcome} />
                </section>
            </div>

            <Quote project={project} />
            <Gallery project={project} />

            <div className="lp-cs__meta">
                {(project.technologies ?? []).length > 0 && (
                    <div className="lp-cs__meta-col">
                        <h3 className="lp-cs__meta-h">{t.projectDetail.stack}</h3>
                        <div className="lp-pills">
                            {(project.technologies ?? []).map((tech) => (
                                <span key={tech.name} className="lp-pill">
                                    {tech.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {(project.links ?? []).length > 0 && (
                    <div className="lp-cs__meta-col">
                        <h3 className="lp-cs__meta-h">{t.projectDetail.links}</h3>
                        <div className="lp-cs__links">
                            {(project.links ?? []).map((link) => (
                                <a
                                    key={link.url}
                                    className="lp-social"
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.label} →
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Targeted recruiting CTA for students who just read how we build. */}
            <div className="lp-cs-cta lp-cs-cta--join">
                <h2 className="lp-cs-cta__heading">{t.caseStudy.joinHeading}</h2>
                <p className="lp-cs-cta__text">{t.caseStudy.joinText}</p>
                <Link className="lp-btn lp-btn--light" href="/join">
                    {t.caseStudy.joinButton} →
                </Link>
            </div>
        </motion.article>
    );
};

/* ---- Impact story (for prospective NGO partners) ---- */
const ImpactView: React.FC<{ project: CmsProject }> = ({ project }) => {
    const { t } = useLanguage();
    const hero = mediaUrl(project.image);
    return (
        <motion.article
            className="lp-cs"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="lp-cs__head">
                <StatusPill status={project.status} />
                <h1 className="lp-cs__title">
                    {project.impactHeadline || project.title}
                </h1>
                <span className="lp-card__sub">
                    {t.common.partner} {project.ngoPartner}
                </span>
                {project.impact && <p className="lp-cs__impact">{project.impact}</p>}
            </div>

            {hero && (
                <div className="lp-cs__hero">
                    <img src={hero} alt={project.title} />
                </div>
            )}

            <div className="lp-cs__body">
                {project.impactChallenge && (
                    <section className="lp-cs__block">
                        <h2 className="lp-cs__h">{t.caseStudy.challengeHeading}</h2>
                        <Paragraphs text={project.impactChallenge} />
                    </section>
                )}
                {project.impactSolution && (
                    <section className="lp-cs__block">
                        <h2 className="lp-cs__h">{t.caseStudy.solutionHeading}</h2>
                        <Paragraphs text={project.impactSolution} />
                    </section>
                )}
            </div>

            <Gallery
                project={project}
                shots={
                    project.impactGallery?.length
                        ? project.impactGallery
                        : project.gallery
                }
            />

            {project.impactResults && (
                <div className="lp-cs__body">
                    <section className="lp-cs__block">
                        <h2 className="lp-cs__h">{t.caseStudy.resultsHeading}</h2>
                        <Paragraphs text={project.impactResults} />
                    </section>
                </div>
            )}

            <Quote project={project} />

            {/* Reassurance: how partnering works. Full pitch lives at /partner. */}
            <div className="lp-cs-working">
                <h2 className="lp-cs__h">{t.caseStudy.workingHeading}</h2>
                <ul className="lp-list">
                    {t.caseStudy.workingPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                    ))}
                </ul>
                <Link className="lp-card__link" href="/partner">
                    {t.caseStudy.partnerLink} →
                </Link>
            </div>

            {(project.ngoFaq ?? []).length > 0 && (
                <div className="lp-cs-faq">
                    <h2 className="lp-cs__h">{t.caseStudy.faqHeading}</h2>
                    {(project.ngoFaq ?? []).map((item, i) => (
                        <div className="lp-cs-faq__item" key={item.id ?? i}>
                            <h3 className="lp-cs-faq__q">{item.question}</h3>
                            <p className="lp-cs-faq__a">{item.answer}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Book-a-meeting — the primary action for a nonprofit reading this. */}
            <div className="lp-cs-cta lp-cs-cta--book">
                <h2 className="lp-cs-cta__heading lp-cs-cta__heading--dark">
                    {t.caseStudy.bookHeading}
                </h2>
                <p className="lp-cs-cta__text lp-cs-cta__text--dark">
                    {t.caseStudy.bookText}
                </p>
                <div style={{ marginTop: 24, width: '100%' }}>
                    <BookingEmbed />
                </div>
            </div>
        </motion.article>
    );
};

/* ---- Chooser: branch on open ---- */
const Chooser: React.FC<{ project: CmsProject; onPick: (v: View) => void }> = ({
    project,
    onPick,
}) => {
    const { t } = useLanguage();
    return (
        <motion.div
            className="lp-cs-choose"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="lp-cs-choose__head">
                <p className="lp-kicker">{t.caseStudy.chooseKicker}</p>
                <h1 className="lp-cs__title">{project.title}</h1>
                <span className="lp-card__sub">
                    {t.common.partner} {project.ngoPartner}
                </span>
                <p className="lp-lead" style={{ marginTop: 12 }}>
                    {project.description}
                </p>
            </div>
            <div className="lp-cs-choose__grid">
                <button
                    type="button"
                    className="lp-cs-choice"
                    onClick={() => onPick('impact')}
                >
                    <span className="lp-cs-choice__tag">{t.caseStudy.impactCardTitle}</span>
                    <span className="lp-cs-choice__text">{t.caseStudy.impactCardText}</span>
                    <span className="lp-cs-choice__go">{t.caseStudy.impactLabel} →</span>
                </button>
                <button
                    type="button"
                    className="lp-cs-choice"
                    onClick={() => onPick('technical')}
                >
                    <span className="lp-cs-choice__tag">
                        {t.caseStudy.technicalCardTitle}
                    </span>
                    <span className="lp-cs-choice__text">
                        {t.caseStudy.technicalCardText}
                    </span>
                    <span className="lp-cs-choice__go">
                        {t.caseStudy.technicalLabel} →
                    </span>
                </button>
            </div>
        </motion.div>
    );
};

/* ---- Wrapper: chooser → view, with a toggle to switch ---- */
const ProjectCaseStudy: React.FC<{ project: CmsProject }> = ({ project }) => {
    const { t } = useLanguage();
    const hasImpact = hasImpactContent(project);
    const hasTechnical = hasTechnicalContent(project);
    const both = hasImpact && hasTechnical;

    // Initial view is derived from the data (SSR-safe → no hydration mismatch):
    // offer the chooser only when both variants exist.
    const initial: View = both ? 'choose' : hasImpact ? 'impact' : 'technical';
    const [view, setView] = useState<View>(initial);

    // Returning visitors skip the chooser (remembered choice).
    useEffect(() => {
        if (!both) return;
        try {
            const stored = localStorage.getItem(STORE_KEY);
            if (stored === 'impact' || stored === 'technical') setView(stored);
        } catch {
            /* ignore */
        }
    }, [both]);

    const pick = (v: View) => {
        setView(v);
        try {
            localStorage.setItem(STORE_KEY, v);
        } catch {
            /* ignore */
        }
    };

    return (
        <div className="lp lp-page">
            <div className="lp-inner">
                <Link className="lp-back" href="/projects">
                    ← {t.projectDetail.back}
                </Link>

                {both && view !== 'choose' && (
                    <div className="lp-cs-toggle" role="tablist">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={view === 'impact'}
                            className={
                                'lp-cs-toggle__btn' +
                                (view === 'impact' ? ' lp-cs-toggle__btn--active' : '')
                            }
                            onClick={() => pick('impact')}
                        >
                            {t.caseStudy.impactLabel}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={view === 'technical'}
                            className={
                                'lp-cs-toggle__btn' +
                                (view === 'technical' ? ' lp-cs-toggle__btn--active' : '')
                            }
                            onClick={() => pick('technical')}
                        >
                            {t.caseStudy.technicalLabel}
                        </button>
                    </div>
                )}

                {view === 'choose' && <Chooser project={project} onPick={pick} />}
                {view === 'technical' && <TechnicalView project={project} />}
                {view === 'impact' && <ImpactView project={project} />}
            </div>
        </div>
    );
};

export default ProjectCaseStudy;
