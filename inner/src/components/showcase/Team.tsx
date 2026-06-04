'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useCmsCollection, mediaUrl } from '../../api';
import { CmsTeamMember, CmsCompany } from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import linkedinIcon from '../../assets/icons/linkedin.png';
import githubIcon from '../../assets/icons/git.png';
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

export interface TeamProps {
    team?: CmsTeamMember[] | null;
    companies?: CmsCompany[] | null;
}

const Team: React.FC<TeamProps> = (props) => {
    const { data: team, loading } = useCmsCollection<CmsTeamMember>(
        'team',
        undefined,
        props.team
    );
    const { data: companies } = useCmsCollection<CmsCompany>(
        'companies',
        undefined,
        props.companies
    );
    const { t } = useLanguage();

    return (
        <div className="lp lp-page">
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
                    <div className="lp-team">
                        {(team ?? []).map((member, i) => {
                            const imgSrc = mediaUrl(member.image);
                            return (
                                <motion.div
                                    key={member.id}
                                    className="lp-member"
                                    {...reveal}
                                    transition={{
                                        duration: 0.45,
                                        delay: Math.min(i * 0.05, 0.3),
                                    }}
                                >
                                    {imgSrc ? (
                                        <img
                                            className="lp-member__avatar"
                                            src={imgSrc}
                                            alt={member.name}
                                        />
                                    ) : (
                                        <div className="lp-member__avatar-ph">
                                            {initials(member.name)}
                                        </div>
                                    )}
                                    <span className="lp-member__name">
                                        {member.name}
                                    </span>
                                    <span className="lp-member__role">
                                        {member.role}
                                    </span>
                                    <p className="lp-member__bio">{member.bio}</p>
                                    {member.links &&
                                        member.links.length > 0 && (
                                            <div className="lp-member__links">
                                                {member.links.map((link) => (
                                                    <a
                                                        key={link.label}
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {linkIconMap[
                                                            link.label
                                                        ] ? (
                                                            <img
                                                                src={
                                                                    linkIconMap[
                                                                        link
                                                                            .label
                                                                    ]
                                                                }
                                                                alt={link.label}
                                                            />
                                                        ) : (
                                                            <span>
                                                                {link.label}
                                                            </span>
                                                        )}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {(companies ?? []).length > 0 && (
                    <motion.div
                        className="lp-companies"
                        {...reveal}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="lp-companies__head">
                            {t.team.companiesHeading}
                        </h2>
                        <div className="lp-sponsors">
                            {(companies ?? []).map((company) => {
                                const logo = mediaUrl(company.logo);
                                const inner = logo ? (
                                    <img src={logo} alt={company.name} />
                                ) : (
                                    <span className="lp-sponsor__name">
                                        {company.name}
                                    </span>
                                );
                                return company.url ? (
                                    <a
                                        key={company.id}
                                        className="lp-sponsor"
                                        href={company.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {inner}
                                    </a>
                                ) : (
                                    <div key={company.id} className="lp-sponsor">
                                        {inner}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Team;
