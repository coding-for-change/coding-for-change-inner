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

/** A project has a case-study detail page once it has a slug + some case-study
 *  content (a headline, an impact highlight, or any body blocks). */
export const hasCaseStudy = (p: CmsProject): boolean =>
    !!p.slug &&
    !!(p.impactHeadline || p.impact || (p.layout && p.layout.length > 0));

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
 * card) and the rest as a logo wall below. Shared by the /projects page and the
 * homepage projects section so both read the same way.
 */
const ProjectShowcase: React.FC<{ projects: CmsProject[] }> = ({ projects }) => {
    const { t, locale } = useLanguage();
    const statusLabel = (s: string) =>
        (t.projects.status as Record<string, string>)[s] || s;
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
                            {statusLabel(featured.status)}
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
                <>
                    {featured && <h3 className="lp-subhead">{t.projects.more}</h3>}
                    <div className="lp-logowall">
                        {rest.map((project, i) => {
                            // Non-featured projects are logo tiles: the partner mark on
                            // its own plate plus a name/status caption, so a tile still
                            // reads as a project when the logo alone says nothing. The
                            // featured card above carries the full detail.
                            const img = mediaUrl(project.image);
                            const linked = hasCaseStudy(project);
                            const inner = (
                                <>
                                    <div className="lp-logotile__plate">
                                        {img ? (
                                            <img src={img} alt={project.title} />
                                        ) : (
                                            <span className="lp-logotile__mark">
                                                {project.title.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="lp-logotile__cap">
                                        <span
                                            className="lp-logotile__dot"
                                            style={{
                                                backgroundColor:
                                                    statusColors[project.status] ||
                                                    '#808080',
                                            }}
                                            title={statusLabel(project.status)}
                                        />
                                        <span className="lp-logotile__name">
                                            {project.title}
                                        </span>
                                    </div>
                                </>
                            );
                            return (
                                <motion.div
                                    key={project.id}
                                    className="lp-logotile__wrap"
                                    {...reveal}
                                    transition={{
                                        duration: 0.45,
                                        delay: Math.min(i * 0.05, 0.3),
                                    }}
                                >
                                    {linked ? (
                                        <Link
                                            className="lp-logotile"
                                            href={`/projects/${project.slug}`}
                                        >
                                            {inner}
                                        </Link>
                                    ) : (
                                        <div className="lp-logotile">{inner}</div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </>
            )}
        </>
    );
};

export default ProjectShowcase;
