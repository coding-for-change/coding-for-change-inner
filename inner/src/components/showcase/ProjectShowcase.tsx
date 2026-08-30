'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { mediaUrl } from '../../api';
import { CmsProject } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import { hasCaseStudy } from '../../lib/projects';
import './landing.css';

const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
} as const;

const statusColors: Record<string, string> = {
    active: '#2f8f90',
    completed: '#246b6c',
    recruiting: '#b5651d',
};

// Defined in lib/projects.ts (the Team page needs it too); re-exported here
// because this is where callers have always imported it from.
export { hasCaseStudy };

/**
 * Projects laid out as one editorial feature for the flagship and a quiet
 * partner strip for the rest. Deliberately low-chrome: the partner mark is a
 * contained logo (as on the sponsors wall), not a full-bleed hero, so the
 * typography carries the block instead of a big slab of brand colour.
 * Shared by the /projects page and the homepage projects section.
 */
const ProjectShowcase: React.FC<{ projects: CmsProject[] }> = ({ projects }) => {
    const { t, locale } = useLanguage();
    const statusLabel = (s: string) =>
        (t.projects.status as Record<string, string>)[s] || s;
    const featured = projects.find((p) => p.featured) ?? null;
    const rest = projects.filter((p) => p !== featured);
    const featuredMark = featured ? mediaUrl(featured.image) : '';
    const featuredHasCaseStudy = !!featured && hasCaseStudy(featured);
    const caseStudyLabel = locale === 'de' ? 'Fallstudie lesen' : 'Read the case study';

    return (
        <>
            {featured && (
                <motion.article
                    className={
                        'lp-feature' + (featuredMark ? '' : ' lp-feature--nomark')
                    }
                    {...reveal}
                    transition={{ duration: 0.5 }}
                >
                    {featuredMark && (
                        <div className="lp-feature__mark">
                            <img src={featuredMark} alt={featured.title} />
                        </div>
                    )}
                    <div className="lp-feature__body">
                        <p className="lp-feature__eyebrow">
                            <span
                                className="lp-dot"
                                style={{
                                    backgroundColor:
                                        statusColors[featured.status] || '#808080',
                                }}
                            />
                            {statusLabel(featured.status)}
                            <span className="lp-feature__sep">·</span>
                            {featured.ngoPartner}
                        </p>
                        <h2 className="lp-feature__title">{featured.title}</h2>
                        {/* The impact sentence and the description say the same
                            thing at different lengths, and the partner is already
                            in the eyebrow — so show the impact when there is one
                            and fall back to the description only when there is
                            not, rather than stacking both.
                            The copy is editor-written and unbounded, so the teaser
                            is capped at three lines — but only when the case-study
                            link is there to carry the rest. Without somewhere to
                            read on, an ellipsis would just swallow content. */}
                        <p
                            className={
                                'lp-feature__lead' +
                                (featuredHasCaseStudy ? ' lp-feature__lead--clamp' : '')
                            }
                        >
                            {featured.impact || featured.description}
                        </p>
                        {(featured.technologies ?? []).length > 0 && (
                            <p className="lp-feature__stack">
                                {(featured.technologies ?? [])
                                    .map((tech) => tech.name)
                                    .join(' · ')}
                            </p>
                        )}
                        {featuredHasCaseStudy && (
                            <Link
                                className="lp-feature__cta"
                                href={`/projects/${featured.slug}`}
                            >
                                {caseStudyLabel} →
                            </Link>
                        )}
                    </div>
                </motion.article>
            )}

            {rest.length > 0 && (
                <div className="lp-projstrip">
                    {featured && (
                        <p className="lp-projstrip__head">{t.projects.more}</p>
                    )}
                    <div className="lp-projstrip__row">
                        {rest.map((project, i) => {
                            // The non-flagship projects stay quiet: the partner mark
                            // contained in a hairline frame (same treatment as the
                            // sponsors wall) with the name beneath it. The feature
                            // above carries the full story.
                            const img = mediaUrl(project.image);
                            const linked = hasCaseStudy(project);
                            const inner = (
                                <>
                                    <span className="lp-projstrip__mark">
                                        {img ? (
                                            <img src={img} alt={project.title} />
                                        ) : (
                                            <span className="lp-projstrip__initial">
                                                {project.title.charAt(0)}
                                            </span>
                                        )}
                                    </span>
                                    <span className="lp-projstrip__name">
                                        <span
                                            className="lp-dot"
                                            style={{
                                                backgroundColor:
                                                    statusColors[project.status] ||
                                                    '#808080',
                                            }}
                                            title={statusLabel(project.status)}
                                        />
                                        <span className="lp-projstrip__label">
                                            {project.title}
                                        </span>
                                    </span>
                                </>
                            );
                            return (
                                <motion.div
                                    key={project.id}
                                    className="lp-projstrip__cell"
                                    {...reveal}
                                    transition={{
                                        duration: 0.45,
                                        delay: Math.min(i * 0.05, 0.3),
                                    }}
                                >
                                    {linked ? (
                                        <Link
                                            className="lp-projstrip__item"
                                            href={`/projects/${project.slug}`}
                                        >
                                            {inner}
                                        </Link>
                                    ) : (
                                        <span className="lp-projstrip__item">
                                            {inner}
                                        </span>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProjectShowcase;
