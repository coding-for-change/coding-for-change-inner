'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useCmsCollection } from '../../api';
import { CmsProject } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import ProjectShowcase, { hasCaseStudy } from './ProjectShowcase';
import ClosingCta from './ClosingCta';
import './landing.css';

// Re-export so existing importers keep working.
export { hasCaseStudy };

export interface ProjectsListProps {
    projects?: CmsProject[] | null;
}

const ProjectsList: React.FC<ProjectsListProps> = (props) => {
    const { t } = useLanguage();
    const { data: projects, loading } = useCmsCollection<CmsProject>(
        'projects',
        { depth: '2' },
        props.projects
    );

    return (
        <div className="lp">
            <div className="lp-page">
                <div className="lp-inner">
                    <motion.div
                        className="lp-page__head"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="lp-kicker">{t.projects.subtitle}</p>
                        <h1 className="lp-page__title">{t.projects.title}</h1>
                        <p className="lp-lead">{t.projects.intro}</p>
                    </motion.div>

                    {loading ? (
                        <p className="lp-loading">Loading…</p>
                    ) : (
                        <ProjectShowcase projects={projects ?? []} />
                    )}
                </div>
            </div>
            <ClosingCta />
        </div>
    );
};

export default ProjectsList;
