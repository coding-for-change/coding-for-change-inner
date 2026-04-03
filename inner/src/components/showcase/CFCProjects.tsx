import React from 'react';
import { useCmsCollection } from '../../api';
import { CmsProject } from '../../api/types';
import { RetroLoader } from '../general';

const statusColors: Record<string, string> = {
    active: '#008000',
    completed: '#000080',
    recruiting: '#800000',
};

const CFCProjects: React.FC = () => {
    const { data: projects, loading } = useCmsCollection<CmsProject>('projects');

    if (loading) return <div className="site-page-content"><RetroLoader /></div>;

    return (
        <div className="site-page-content">
            <h1>Projects</h1>
            <h3>Building Tech for Social Good</h3>
            <br />
            <div className="text-block">
                <p>
                    We partner with NGOs to build software solutions that make a real difference.
                    Each project is led by student teams and developed in close collaboration with our partners.
                </p>
            </div>
            <br />
            <div style={styles.projectsGrid}>
                {(projects ?? []).map(project => (
                    <div key={project.id} className="big-button-container" style={styles.projectCard}>
                        <div style={styles.projectHeader}>
                            <h3>{project.title}</h3>
                            <div style={{
                                ...styles.statusBadge,
                                backgroundColor: statusColors[project.status] || '#808080',
                            }}>
                                {project.status}
                            </div>
                        </div>
                        <p style={styles.ngoPartner}>Partner: {project.ngoPartner}</p>
                        <br />
                        <p>{project.description}</p>
                        <br />
                        <div style={styles.techTags}>
                            {(project.technologies ?? []).map(tech => (
                                <span key={tech.name} style={styles.techTag}>{tech.name}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    projectsGrid: {
        flexDirection: 'column',
        width: '100%',
    },
    projectCard: {
        flexDirection: 'column',
        padding: 16,
        marginBottom: 16,
        width: '100%',
        boxSizing: 'border-box',
    },
    projectHeader: {
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    statusBadge: {
        color: 'white',
        padding: '2px 8px',
        fontSize: 12,
    },
    ngoPartner: {
        fontStyle: 'italic',
        marginTop: 4,
    },
    techTags: {
        flexWrap: 'wrap',
        gap: 4,
    },
    techTag: {
        backgroundColor: '#c0c0c0',
        border: '1px solid #808080',
        padding: '2px 8px',
        fontSize: 12,
        marginRight: 4,
        marginBottom: 4,
    },
};

export default CFCProjects;
