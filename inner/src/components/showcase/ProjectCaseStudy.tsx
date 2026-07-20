'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { mediaUrl } from '../../api';
import {
    CmsProject,
    CmsTeamMember,
    CmsGalleryImage,
    CmsTextBlock,
    CmsQuoteBlock,
    CmsGalleryBlock,
    CmsTimelineBlock,
    CmsTeamBlock,
    CmsFaqBlock,
} from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import BookingEmbed from '../general/BookingEmbed';
import './landing.css';

const statusColors: Record<string, string> = {
    active: '#2f8f90',
    completed: '#246b6c',
    recruiting: '#b5651d',
};

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

type Shot = CmsGalleryImage;

/**
 * Full-screen, keyboard-navigable image viewer for a gallery block. Rendered in
 * a portal on <body> so it covers the whole viewport regardless of the
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

/* ---- Content blocks (rendered in the CMS-defined order) ---- */

const TextBlock: React.FC<{ block: CmsTextBlock }> = ({ block }) =>
    block.body ? (
        <section className="lp-cs__block">
            {block.heading && <h2 className="lp-cs__h">{block.heading}</h2>}
            <Paragraphs text={block.body} />
        </section>
    ) : null;

const QuoteBlock: React.FC<{ block: CmsQuoteBlock }> = ({ block }) =>
    block.text ? (
        <blockquote className="lp-cs__quote">
            <p className="lp-cs__quote-text">“{block.text}”</p>
            {(block.author || block.role) && (
                <footer className="lp-cs__quote-by">
                    {block.author}
                    {block.author && block.role && ', '}
                    {block.role}
                </footer>
            )}
        </blockquote>
    ) : null;

const GalleryBlock: React.FC<{ block: CmsGalleryBlock; title: string }> = ({
    block,
    title,
}) => {
    const items = (block.images ?? []).filter((g) => mediaUrl(g.image));
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
                            <img src={mediaUrl(g.image) || ''} alt={g.caption ?? title} />
                        </button>
                        {g.caption && <figcaption className="lp-cs__caption">{g.caption}</figcaption>}
                    </figure>
                ))}
            </div>
            {openIndex !== null && (
                <Lightbox
                    shots={items}
                    index={openIndex}
                    title={title}
                    onClose={() => setOpenIndex(null)}
                    onNavigate={setOpenIndex}
                />
            )}
        </>
    );
};

const TimelineBlock: React.FC<{ block: CmsTimelineBlock }> = ({ block }) => {
    const points = (block.points ?? []).filter((p) => p.title);
    if (points.length === 0) return null;
    return (
        <section className="lp-cs__block lp-cs__timeline">
            {block.heading && <h2 className="lp-cs__h">{block.heading}</h2>}
            <ol className="lp-cs-tl">
                {points.map((p, i) => (
                    <li className="lp-cs-tl__item" key={p.id ?? i}>
                        {/* Marker: the editor's number/symbol, or the position as a fallback. */}
                        <span className="lp-cs-tl__marker">{p.marker?.trim() || i + 1}</span>
                        <div className="lp-cs-tl__content">
                            <h3 className="lp-cs-tl__title">{p.title}</h3>
                            {p.subtitle && <p className="lp-cs-tl__sub">{p.subtitle}</p>}
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
};

const TeamBlock: React.FC<{ block: CmsTeamBlock; fallbackHeading: string }> = ({
    block,
    fallbackHeading,
}) => {
    // Keep only rows whose relationship actually populated (object, not an ID).
    const members = (block.members ?? []).filter(
        (m) => m.member && typeof m.member === 'object'
    );
    if (members.length === 0) return null;
    return (
        <section className="lp-cs__block lp-cs__team">
            <h2 className="lp-cs__h">{block.heading || fallbackHeading}</h2>
            <ul className="lp-cs-team">
                {members.map((m, i) => {
                    const person = m.member as CmsTeamMember;
                    const photo = mediaUrl(person.image);
                    return (
                        <li className="lp-cs-team__card" key={m.id ?? i}>
                            {photo ? (
                                <img
                                    className="lp-cs-team__photo"
                                    src={photo}
                                    alt={person.name}
                                    loading="lazy"
                                />
                            ) : (
                                <span
                                    className="lp-cs-team__photo lp-cs-team__photo--empty"
                                    aria-hidden
                                />
                            )}
                            <span className="lp-cs-team__name">{person.name}</span>
                            {/* Project role overrides the member's default role. */}
                            <span className="lp-cs-team__role">{m.role || person.role}</span>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

const FaqBlock: React.FC<{ block: CmsFaqBlock; heading: string }> = ({ block, heading }) => {
    const items = (block.items ?? []).filter((it) => it.question && it.answer);
    if (items.length === 0) return null;
    return (
        <div className="lp-cs-faq">
            <h2 className="lp-cs__h">{heading}</h2>
            {items.map((item, i) => (
                <div className="lp-cs-faq__item" key={item.id ?? i}>
                    <h3 className="lp-cs-faq__q">{item.question}</h3>
                    <p className="lp-cs-faq__a">{item.answer}</p>
                </div>
            ))}
        </div>
    );
};

/** Renders the project's `layout` blocks in order, dispatching on block type. */
const CaseStudyBlocks: React.FC<{ project: CmsProject }> = ({ project }) => {
    const { t } = useLanguage();
    const blocks = project.layout ?? [];
    if (blocks.length === 0) return null;
    return (
        <>
            {blocks.map((b, i) => {
                const key = b.id ?? `${b.blockType}-${i}`;
                switch (b.blockType) {
                    case 'text':
                        return <TextBlock key={key} block={b} />;
                    case 'quote':
                        return <QuoteBlock key={key} block={b} />;
                    case 'gallery':
                        return <GalleryBlock key={key} block={b} title={project.title} />;
                    case 'timeline':
                        return <TimelineBlock key={key} block={b} />;
                    case 'team':
                        return (
                            <TeamBlock key={key} block={b} fallbackHeading={t.projectDetail.team} />
                        );
                    case 'faq':
                        return <FaqBlock key={key} block={b} heading={t.caseStudy.faqHeading} />;
                    default:
                        return null;
                }
            })}
        </>
    );
};

/* ---- The case-study page: a fixed head + hero, a freely-ordered block body,
   then the reassurance + booking call-to-action. ---- */
const ProjectCaseStudy: React.FC<{ project: CmsProject }> = ({ project }) => {
    const { t } = useLanguage();
    const hero = mediaUrl(project.image);

    return (
        <div className="lp lp-page">
            <div className="lp-inner">
                <Link className="lp-back" href="/projects">
                    ← {t.projectDetail.back}
                </Link>

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

                    <CaseStudyBlocks project={project} />

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
            </div>
        </div>
    );
};

export default ProjectCaseStudy;
