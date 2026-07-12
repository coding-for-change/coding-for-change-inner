'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useCmsCollection, mediaUrl } from '../../api';
import { CmsTeamMember, CmsCompany } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import linkedinIcon from '../../assets/icons/linkedin.png';
import githubIcon from '../../assets/icons/git.png';
import ClosingCta from './ClosingCta';
import './landing.css';

const linkIconMap: Record<string, string> = {
    LinkedIn: linkedinIcon.src,
    GitHub: githubIcon.src,
};

const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
} as const;

const initials = (name: string) =>
    name
        .split(' ')
        .map((n) => n[0])
        .join('');

// The companies relationship is populated to full docs at depth >= 2; guard
// against bare IDs (insufficient depth) by keeping only object entries.
const populatedCompanies = (member: CmsTeamMember): CmsCompany[] =>
    (member.companies ?? []).filter(
        (c): c is CmsCompany => typeof c === 'object' && c !== null
    );

const MemberCard: React.FC<{ member: CmsTeamMember; index: number }> = ({
    member,
    index,
}) => {
    const { t } = useLanguage();
    const imgSrc = mediaUrl(member.image);
    const companies = populatedCompanies(member);
    return (
        <motion.div
            className="lp-member"
            {...reveal}
            transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3) }}
        >
            {imgSrc ? (
                <img className="lp-member__avatar" src={imgSrc} alt={member.name} />
            ) : (
                <div className="lp-member__avatar-ph">{initials(member.name)}</div>
            )}
            <span className="lp-member__name">{member.name}</span>
            <span className="lp-member__role">{member.role}</span>
            <p className="lp-member__bio">{member.bio}</p>
            {member.links && member.links.length > 0 && (
                <div className="lp-member__links">
                    {member.links.map((link) => (
                        <a
                            key={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {linkIconMap[link.label] ? (
                                <img
                                    src={linkIconMap[link.label]}
                                    alt={link.label}
                                />
                            ) : (
                                <span>{link.label}</span>
                            )}
                        </a>
                    ))}
                </div>
            )}
            {companies.length > 0 && (
                <div
                    className="lp-member__companies"
                    aria-label={t.team.experienceLabel}
                >
                    <span className="lp-member__companies-label">
                        {t.team.experienceLabel}
                    </span>
                    {companies.map((company) => {
                        const logo = mediaUrl(company.logo);
                        return (
                            <span className="lp-member__company" key={company.id}>
                                {logo ? (
                                    <img src={logo} alt={company.name} />
                                ) : (
                                    <span className="lp-member__company-name">
                                        {company.name}
                                    </span>
                                )}
                            </span>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
};

export interface TeamProps {
    team?: CmsTeamMember[] | null;
}

const Team: React.FC<TeamProps> = (props) => {
    // Keep `sort` in step with the server fetch in app/(os)/team/page.tsx so the
    // client re-fetch preserves the admin's drag-and-drop order (`_order`).
    const { data: team, loading } = useCmsCollection<CmsTeamMember>(
        'team',
        { depth: '2', sort: '_order' },
        props.team
    );
    const { t } = useLanguage();

    const all = team ?? [];
    const members = all.filter((m) => m.category !== 'adviser');
    const advisers = all.filter((m) => m.category === 'adviser');

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
                    <p className="lp-kicker">{t.team.subtitle}</p>
                    <h1 className="lp-page__title">{t.team.title}</h1>
                    <p className="lp-lead">{t.team.intro}</p>
                </motion.div>

                {loading ? (
                    <p className="lp-loading">Loading…</p>
                ) : (
                    <>
                        <div className="lp-team">
                            {members.map((member, i) => (
                                <MemberCard
                                    key={member.id}
                                    member={member}
                                    index={i}
                                />
                            ))}
                        </div>

                        {advisers.length > 0 && (
                            <div className="lp-team">
                                <h2 className="lp-team__group-head">
                                    {t.team.advisersTitle}
                                </h2>
                                {advisers.map((member, i) => (
                                    <MemberCard
                                        key={member.id}
                                        member={member}
                                        index={i}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            </div>
            <ClosingCta />
        </div>
    );
};

export default Team;
