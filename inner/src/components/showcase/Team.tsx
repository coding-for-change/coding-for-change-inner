'use client';
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCmsCollection, useSiteConfig, mediaUrl } from '../../api';
import {
    CmsTeamMember,
    CmsCompany,
    CmsTeamGroup,
    CmsProject,
} from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import { buildProjectIndex } from '../../lib/projects';
import type { MemberProject } from '../../lib/projects';
import ClosingCta from './ClosingCta';
import './landing.css';

/* Social marks are inlined (rather than the raster icons used elsewhere) so
   they inherit `currentColor`. Both are solid-mass glyphs at the same optical
   weight — the bare LinkedIn lettermark reads far too light beside the octocat,
   and the stock LinkedIn PNG is a bright blue block that outshouts the name. */
const LinkedInMark: React.FC = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
            fill="currentColor"
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
        />
    </svg>
);

const GitHubMark: React.FC = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
            fill="currentColor"
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        />
    </svg>
);

const linkMarkMap: Record<string, React.FC> = {
    LinkedIn: LinkedInMark,
    GitHub: GitHubMark,
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

interface TeamSection {
    group: CmsTeamGroup;
    members: { member: CmsTeamMember; role: string }[];
}

/**
 * Build the per-team sections from every member's `teamMemberships`. A member
 * appears once under each team they're assigned to, with their per-team role
 * (falling back to their main role). Sections are ordered by the team's
 * `order`; members keep the incoming order (the CMS `_order`). Returns [] when
 * no one is assigned to a team, so the caller falls back to a flat list.
 */
const buildTeamSections = (all: CmsTeamMember[]): TeamSection[] => {
    const byId = new Map<number, TeamSection>();
    for (const member of all) {
        for (const m of member.teamMemberships ?? []) {
            // Guard against unpopulated relationships (bare id / null).
            if (!m.team || typeof m.team !== 'object') continue;
            const group = m.team;
            const role = m.role && m.role.trim() ? m.role : member.role;
            const section = byId.get(group.id);
            if (section) section.members.push({ member, role });
            else byId.set(group.id, { group, members: [{ member, role }] });
        }
    }
    return [...byId.values()].sort(
        (a, b) => (a.group.order ?? 100) - (b.group.order ?? 100)
    );
};

const MemberCard: React.FC<{
    member: CmsTeamMember;
    index: number;
    // Per-team role (when grouped); falls back to the member's main role.
    role?: string;
    projects: MemberProject[];
    open: boolean;
    onToggle: () => void;
}> = ({ member, index, role, projects, open, onToggle }) => {
    const { t } = useLanguage();
    const imgSrc = mediaUrl(member.image);
    const companies = populatedCompanies(member);
    const detailId = `member-detail-${member.id}`;
    const links = member.links ?? [];
    return (
        <motion.div
            className={`lp-member${open ? ' is-open' : ''}`}
            {...reveal}
            transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.32) }}
        >
            <div className="lp-member__portrait">
                {/* The trigger wraps only the photo, so the detail panel's own
                    links are never nested inside a button. On a pointer device
                    CSS `:hover` / `:focus-within` opens the panel and this is
                    just the keyboard affordance; on touch it does the work. */}
                <button
                    type="button"
                    className="lp-member__trigger"
                    aria-expanded={open}
                    aria-controls={detailId}
                    aria-label={member.name}
                    onClick={onToggle}
                >
                    {imgSrc ? (
                        <img
                            className="lp-member__avatar"
                            src={imgSrc}
                            alt={member.name}
                            loading="lazy"
                        />
                    ) : (
                        <span className="lp-member__avatar-ph">
                            {initials(member.name)}
                        </span>
                    )}
                </button>
                {/* Sibling of the trigger, not a child: once open it sits above
                    and takes the pointer events, so the links inside work and a
                    tap on the backdrop closes it again. */}
                <div
                    className="lp-member__detail"
                    id={detailId}
                    onClick={onToggle}
                >
                    <p className="lp-member__bio">{member.bio}</p>
                    <div className="lp-member__meta">
                        {projects.length > 0 && (
                            <div
                                className="lp-member__projects"
                                aria-label={t.team.projectsLabel}
                            >
                                {/* Title only. With the per-project role
                                    appended these ran to three wrapped lines
                                    and read as a panel, not a badge — and the
                                    role is already under the person's name. */}
                                {projects.map((project) =>
                                    project.slug ? (
                                        <Link
                                            className="lp-member__project"
                                            href={`/projects/${project.slug}`}
                                            key={project.id}
                                            title={project.role ?? undefined}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {project.title}
                                        </Link>
                                    ) : (
                                        <span
                                            className="lp-member__project"
                                            key={project.id}
                                            title={project.role ?? undefined}
                                        >
                                            {project.title}
                                        </span>
                                    )
                                )}
                            </div>
                        )}
                        {/* Names, not logos. In a tile-width panel a logo caps
                            out around 20px, where a wide wordmark like PICUS
                            CAPITAL is unreadable and a crest is a smudge; set
                            in type they all read at the same weight. */}
                        {companies.length > 0 && (
                            <div className="lp-member__companies">
                                <span className="lp-member__companies-label">
                                    {t.team.experienceLabel}
                                </span>
                                <span className="lp-member__company-names">
                                    {companies
                                        .map((company) => company.name)
                                        .join(' · ')}
                                </span>
                            </div>
                        )}
                        {links.length > 0 && (
                            <div className="lp-member__links">
                                {links.map((link) => {
                                    const Mark = linkMarkMap[link.label];
                                    return (
                                        <a
                                            key={link.label}
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`${member.name} on ${link.label}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {Mark ? (
                                                <Mark />
                                            ) : (
                                                <span>{link.label}</span>
                                            )}
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <span className="lp-member__name">{member.name}</span>
            <span className="lp-member__role">{role ?? member.role}</span>
        </motion.div>
    );
};

/**
 * Closing tile in the roster grid. It fills the ragged last row and puts the
 * recruiting message where a visitor is already counting heads, which is the
 * one moment the roster's size is on their mind.
 */
const JoinTile: React.FC<{ index: number }> = ({ index }) => {
    const { t } = useLanguage();
    return (
        <motion.div
            className="lp-member lp-member--join"
            {...reveal}
            transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.32) }}
        >
            <Link className="lp-member__join" href="/join">
                <span className="lp-member__join-mark" aria-hidden="true">
                    +
                </span>
                <span className="lp-member__join-hint">
                    {t.team.joinTileHint}
                </span>
            </Link>
            <span className="lp-member__name">{t.team.joinTileTitle}</span>
            <span className="lp-member__role">{t.nav.join}</span>
        </motion.div>
    );
};

export interface TeamProps {
    team?: CmsTeamMember[] | null;
    projects?: CmsProject[] | null;
}

const Team: React.FC<TeamProps> = (props) => {
    // Keep `sort` in step with the server fetch in app/(os)/team/page.tsx so the
    // client re-fetch preserves the admin's drag-and-drop order (`_order`).
    const { data: team, loading } = useCmsCollection<CmsTeamMember>(
        'team',
        { depth: '2', sort: '_order' },
        props.team
    );
    // depth=3 so each case study's `team` block resolves to full member docs;
    // the page reads project affiliation straight out of them.
    const { data: projects } = useCmsCollection<CmsProject>(
        'projects',
        { depth: '3' },
        props.projects
    );
    const { t } = useLanguage();
    const siteConfig = useSiteConfig();
    const teamHero = mediaUrl(siteConfig.teamHeroImage);
    // Only one tile is expanded at a time, so the grid never fills with panels.
    const [openId, setOpenId] = useState<number | null>(null);

    const all = team ?? [];
    const projectIndex = useMemo(
        () => buildProjectIndex(projects ?? []),
        [projects]
    );
    // When any member is assigned to a team, group the page into a section per
    // team; otherwise fall back to the flat member / adviser listing.
    const sections = buildTeamSections(all);
    const grouped = sections.length > 0;
    const members = all.filter((m) => m.category !== 'adviser');
    const advisers = all.filter((m) => m.category === 'adviser');
    const toggle = (id: number) =>
        setOpenId((current) => (current === id ? null : id));

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

                {teamHero && (
                    <motion.div
                        className="lp-team__hero"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <img src={teamHero} alt={t.team.title} />
                    </motion.div>
                )}

                {loading ? (
                    <p className="lp-loading">Loading…</p>
                ) : grouped ? (
                    sections.map(({ group, members: people }) => {
                        const logo = mediaUrl(group.logo);
                        return (
                            <div className="lp-team__group" key={group.id}>
                                <div className="lp-team__group-head-row">
                                    {logo && (
                                        <img
                                            className="lp-team__group-logo"
                                            src={logo}
                                            alt={group.name}
                                        />
                                    )}
                                    <h2 className="lp-team__group-head">
                                        {group.name}
                                    </h2>
                                </div>
                                <div className="lp-team">
                                    {people.map(({ member, role }, i) => (
                                        <MemberCard
                                            key={`${group.id}-${member.id}`}
                                            member={member}
                                            index={i}
                                            role={role}
                                            projects={
                                                projectIndex.get(member.id) ?? []
                                            }
                                            open={openId === member.id}
                                            onToggle={() => toggle(member.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <>
                        <div className="lp-team">
                            {members.map((member, i) => (
                                <MemberCard
                                    key={member.id}
                                    member={member}
                                    index={i}
                                    projects={projectIndex.get(member.id) ?? []}
                                    open={openId === member.id}
                                    onToggle={() => toggle(member.id)}
                                />
                            ))}
                            {members.length > 0 && (
                                <JoinTile index={members.length} />
                            )}
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
                                        projects={
                                            projectIndex.get(member.id) ?? []
                                        }
                                        open={openId === member.id}
                                        onToggle={() => toggle(member.id)}
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
