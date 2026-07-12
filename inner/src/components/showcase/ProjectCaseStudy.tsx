'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { mediaUrl } from '../../api';
import { CmsProject } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import './landing.css';

const statusColors: Record<string, string> = {
    active: '#2f8f90',
    completed: '#246b6c',
    recruiting: '#b5651d',
};

/** A labelled narrative block (problem / approach / outcome). */
const Block: React.FC<{ label: string; text?: string | null }> = ({ label, text }) =>
    text ? (
        <section className="lp-cs__block">
            <h2 className="lp-cs__h">{label}</h2>
            {text.split('\n').filter(Boolean).map((p, i) => (
                <p key={i} className="lp-cs__p">
                    {p}
                </p>
            ))}
        </section>
    ) : null;

const ProjectCaseStudy: React.FC<{ project: CmsProject }> = ({ project }) => {
    const { t } = useLanguage();
    const hero = mediaUrl(project.image);
    const gallery = (project.gallery ?? []).filter((g) => mediaUrl(g.image));

    return (
        <div className="lp lp-page">
            <div className="lp-inner">
                <Link className="lp-back" href="/projects">
                    ← {t.projectDetail.back}
                </Link>

                <motion.article
                    className="lp-cs"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="lp-cs__head">
                        <span
                            className="lp-status"
                            style={{
                                backgroundColor:
                                    statusColors[project.status] || '#808080',
                            }}
                        >
                            {project.status}
                        </span>
                        <h1 className="lp-cs__title">{project.title}</h1>
                        <span className="lp-card__sub">
                            {t.common.partner} {project.ngoPartner}
                        </span>
                        <p className="lp-lead lp-cs__lead">{project.description}</p>
                        {project.impact && (
                            <p className="lp-cs__impact">{project.impact}</p>
                        )}
                    </div>

                    {hero && (
                        <div className="lp-cs__hero">
                            <img src={hero} alt={project.title} />
                        </div>
                    )}

                    <div className="lp-cs__body">
                        <Block label={t.projectDetail.problem} text={project.problem} />
                        <Block label={t.projectDetail.approach} text={project.approach} />
                        <Block label={t.projectDetail.outcome} text={project.outcome} />
                    </div>

                    {project.quote?.text && (
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
                    )}

                    {gallery.length > 0 && (
                        <div className="lp-cs__gallery">
                            {gallery.map((g, i) => (
                                <figure className="lp-cs__shot" key={g.id ?? i}>
                                    <img src={mediaUrl(g.image) || ''} alt={g.caption ?? project.title} />
                                    {g.caption && (
                                        <figcaption className="lp-cs__caption">
                                            {g.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            ))}
                        </div>
                    )}

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
                </motion.article>
            </div>
        </div>
    );
};

export default ProjectCaseStudy;
