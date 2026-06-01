'use client'
import React from 'react';
import { mediaUrl } from '../../api';
import { CmsTeamMember } from '../../api/types';
import linkedinIcon from '../../assets/icons/linkedin.png';
import githubIcon from '../../assets/icons/git.png';

const linkIconMap: Record<string, string> = {
    LinkedIn: (linkedinIcon as any).src ?? String(linkedinIcon),
    GitHub: (githubIcon as any).src ?? String(githubIcon),
}

interface TeamProps { members: CmsTeamMember[] }

const Team: React.FC<TeamProps> = ({ members }) => {
    return (
        <div className="site-page-content">
            <h1>Our Team</h1>
            <h3>The People Behind CFC</h3>
            <br />
            <div className="text-block">
                <p>
                    Meet the team that drives Coding for Change. We are a diverse group of students
                    passionate about using technology for social good.
                </p>
            </div>
            <br />
            <div style={styles.teamGrid}>
                {(members ?? []).map(member => {
                    const imgSrc = mediaUrl(member.image);
                    return (
                        <div key={member.id} className="big-button-container" style={styles.memberCard}>
                            {imgSrc ? (
                                <img src={imgSrc} alt={member.name} style={styles.avatarImage} />
                            ) : (
                                <div style={styles.avatarPlaceholder}>
                                    <p style={styles.avatarText}>{member.name.split(' ').map(n => n[0]).join('')}</p>
                                </div>
                            )}
                            <h3>{member.name}</h3>
                            <p style={styles.role}>{member.role}</p>
                            <br />
                            <p style={styles.bio}>{member.bio}</p>
                            {member.links && member.links.length > 0 && (
                                <div style={styles.linkRow}>
                                    {member.links.map(link => (
                                        <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
                                            {linkIconMap[link.label] ? (
                                                <img src={linkIconMap[link.label]} alt={link.label} style={styles.linkIcon} />
                                            ) : (
                                                <span>{link.label}</span>
                                            )}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    teamGrid: {
        flexWrap: 'wrap',
        gap: 16,
    },
    memberCard: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 16,
        width: 220,
        boxSizing: 'border-box',
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: 12,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: '50%',
        backgroundColor: '#008080',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    role: {
        fontStyle: 'italic',
        fontSize: 14,
        marginTop: 4,
    },
    bio: {
        fontSize: 13,
        textAlign: 'center',
    },
    linkRow: {
        marginTop: 8,
        gap: 12,
        justifyContent: 'center',
    },
    linkIcon: {
        width: 20,
        height: 20,
        cursor: 'pointer',
    },
};

export default Team;
