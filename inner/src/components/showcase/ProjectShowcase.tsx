'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { mediaUrl } from '../../api';
import { CmsProject } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
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

/** A project has a case-study detail page once it has a slug + some narrative
 *  (technical or impact). */
export const hasCaseStudy = (p: CmsProject): boolean =>
    !!p.slug &&
    !!(
        p.problem ||
        p.approach ||
        p.outcome ||
        p.impactHeadline ||
        p.impactChallenge ||
        p.impactSolution ||
        p.impactResults
    );

const TechPills: React.FC<{ project: CmsProject }> = ({ project }) =>
    (project.technologies ?? []).length > 0 ? (
        <div className="lp-pills">
            {(project.technologies ?? []).map((tech) => (
                <span key={tech.name} className="lp-pill">
                    {tech.name}
                </span>
            ))}
        </div>
    ) : null;

/**
 * Projects laid out with the flagship dominant at the top (a large featured
 * card) and the rest in a grid below. Shared by the /projects page and the
 * homepage projects section so both read the same way.
 */
const ProjectShowcase: React.FC<{ projects: CmsProject[] }> = ({ projects }) => {
    const { t, locale } = useLanguage();
    const featured = projects.find((p) => p.featured) ?? null;
    const rest = projects.filter((p) => p !== featured);
    const featuredHero = featured ? mediaUrl(featured.image) : '';
    const caseStudyLabel = locale === 'de' ? 'Fallstudie lesen' : 'Read the case study';

    return (
        <>
            {featured && (
                <motion.article
                    className={
                        'lp-proj-feat' + (featuredHero ? ' lp-proj-feat--media' : '')
                    }
                    {...reveal}
                    transition={{ duration: 0.5 }}
                >
                    {featuredHero && (
                        <div className="lp-proj-feat__media">
                            <img src={featuredHero} alt={featured.title} />
                        </div>
                    )}
                    <div className="lp-proj-feat__body">
                        <span
                            className="lp-status"
                            style={{
                                backgroundColor:
                                    statusColors[featured.status] || '#808080',
                            }}
                        >
                            {featured.status}
                        </span>
                        <h2 className="lp-proj-feat__title">{featured.title}</h2>
                        <span className="lp-card__sub">
                            {t.common.partner} {featured.ngoPartner}
                        </span>
                        <p className="lp-card__text">{featured.description}</p>
                        {featured.impact && (
                            <p className="lp-proj-feat__impact">{featured.impact}</p>
                        )}
                        <TechPills project={featured} />
                        {hasCaseStudy(featured) && (
                            <Link
                                className="lp-btn lp-btn--primary lp-proj-feat__cta"
                                href={`/projects/${featured.slug}`}
                            >
                                {caseStudyLabel} →
                            </Link>
                        )}
                    </div>
                </motion.article>
            )}

            {rest.length > 0 && (
                <div className="lp-grid lp-grid--projects">
                    {rest.map((project, i) => (
                        <motion.div
                            key={project.id}
                            className="lp-card"
                            {...reveal}
                            transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
                        >
                            <div className="lp-card__row">
                                <h3 className="lp-card__title">{project.title}</h3>
                                <span
                                    className="lp-status"
                                    style={{
                                        backgroundColor:
                                            statusColors[project.status] || '#808080',
                                    }}
                                >
                                    {project.status}
                                </span>
                            </div>
                            <span className="lp-card__sub">
                                {t.common.partner} {project.ngoPartner}
                            </span>
                            <p className="lp-card__text">{project.description}</p>
                            <TechPills project={project} />
                            {hasCaseStudy(project) && (
                                <Link
                                    className="lp-card__link"
                                    href={`/projects/${project.slug}`}
                                >
                                    {caseStudyLabel} →
                                </Link>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    );
};

export default ProjectShowcase;
