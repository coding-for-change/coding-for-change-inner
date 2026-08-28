'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCmsCollection, mediaUrl } from '../../api';
import {
    CmsTeamMember,
    CmsCompany,
    CmsProject,
} from '../../api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import ClosingCta from './ClosingCta';
import './landing.css';

/* Social marks are inlined so they inherit `currentColor`. */
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

const initials = (name: string) =>
    name
        .split(' ')
        .map((n) => n[0])
        .join('');

const populatedCompanies = (member: CmsTeamMember): CmsCompany[] =>
    (member.companies ?? []).filter(
        (c): c is CmsCompany => typeof c === 'object' && c !== null
    );

interface MemberProject {
    id: number;
    title: string;
    slug?: string | null;
    role?: string | null;
}

/** Invert the case studies' `team` blocks into `memberId -> projects`. */
const buildProjectIndex = (
    projects: CmsProject[]
): Map<number, MemberProject[]> => {
    const byMember = new Map<number, MemberProject[]>();
    for (const project of projects) {
        for (const block of project.layout ?? []) {
            if (block.blockType !== 'team') continue;
            for (const row of block.members ?? []) {
                if (!row.member || typeof row.member !== 'object') continue;
                const list = byMember.get(row.member.id) ?? [];
                if (!list.some((x) => x.id === project.id))
                    list.push({
                        id: project.id,
                        title: project.title,
                        slug: project.slug,
                        role: row.role,
                    });
                byMember.set(row.member.id, list);
            }
        }
    }
    return byMember;
};

/* ------------------------------------------------------------------ */
/* Heap layout                                                         */
/* ------------------------------------------------------------------ */

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Deterministic 0..1 from an index. The layout is computed during render, so
 * it must come out identical on the server and the client — `Math.random`
 * here would mean a different heap in the HTML than in the hydrated tree.
 */
const noise = (i: number) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
};

interface Placed {
    /** Percent of container width / height, for absolute positioning. */
    left: number;
    top: number;
    size: number;
}

/**
 * Pack `count` circles into an organic heap.
 *
 * Seeded on a phyllotaxis spiral, which spreads points evenly with no
 * clumping, then relaxed: overlapping pairs push each other apart while a
 * weak pull toward the centre keeps the cluster tight. Gravity is stronger
 * vertically than horizontally, which is what makes the heap settle wide on
 * desktop and rounder on a phone.
 */
const packHeap = (
    count: number,
    gravityY: number
): { placed: Placed[]; aspect: number } => {
    const nodes = Array.from({ length: count }, (_, i) => {
        const angle = i * GOLDEN_ANGLE;
        const radius = Math.sqrt(i + 0.5);
        return {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
            // Varied radii are what read as a heap rather than a diagram.
            r: 0.42 + 0.26 * noise(i),
        };
    });

    for (let step = 0; step < 260; step++) {
        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const a = nodes[i];
                const b = nodes[j];
                let dx = b.x - a.x;
                let dy = b.y - a.y;
                let dist = Math.hypot(dx, dy);
                if (dist === 0) {
                    dx = 0.01;
                    dy = 0;
                    dist = 0.01;
                }
                const min = a.r + b.r + 0.085;
                if (dist < min) {
                    const push = (min - dist) / dist / 2;
                    a.x -= dx * push;
                    a.y -= dy * push;
                    b.x += dx * push;
                    b.y += dy * push;
                }
            }
        }
        for (const n of nodes) {
            n.x *= 0.997;
            n.y *= gravityY;
        }
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const n of nodes) {
        minX = Math.min(minX, n.x - n.r);
        maxX = Math.max(maxX, n.x + n.r);
        minY = Math.min(minY, n.y - n.r);
        maxY = Math.max(maxY, n.y + n.r);
    }
    const width = maxX - minX;
    const height = maxY - minY;
    return {
        aspect: width / height,
        placed: nodes.map((n) => ({
            left: ((n.x - n.r - minX) / width) * 100,
            top: ((n.y - n.r - minY) / height) * 100,
            size: ((n.r * 2) / width) * 100,
        })),
    };
};

/** SSR-safe narrow-viewport check at the heap's own breakpoint. */
const useNarrow = (): boolean => {
    const [narrow, setNarrow] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia('(max-width: 760px)');
        const onChange = () => setNarrow(mql.matches);
        onChange();
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, []);
    return narrow;
};

/* ------------------------------------------------------------------ */

const DetailCard: React.FC<{
    member: CmsTeamMember;
    projects: MemberProject[];
    onClose: () => void;
    cardRef: React.RefObject<HTMLDivElement>;
}> = ({ member, projects, onClose, cardRef }) => {
    const { t } = useLanguage();
    const companies = populatedCompanies(member);
    const links = member.links ?? [];
    return (
        <motion.div
            ref={cardRef}
            className="lp-heap__card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
        >
            <div className="lp-heap__card-head">
                <div className="lp-heap__card-ident">
                    <span className="lp-heap__card-name">{member.name}</span>
                    <span className="lp-heap__card-role">{member.role}</span>
                </div>
                <button
                    type="button"
                    className="lp-heap__close"
                    onClick={onClose}
                    aria-label={t.common.close}
                >
                    ×
                </button>
            </div>
            <p className="lp-heap__card-bio">{member.bio}</p>
            <div className="lp-heap__card-meta">
                {projects.length > 0 && (
                    <div
                        className="lp-heap__pills"
                        aria-label={t.team.projectsLabel}
                    >
                        {projects.map((project) =>
                            project.slug ? (
                                <Link
                                    className="lp-heap__pill"
                                    href={`/projects/${project.slug}`}
                                    key={project.id}
                                    title={project.role ?? undefined}
                                >
                                    {project.title}
                                </Link>
                            ) : (
                                <span
                                    className="lp-heap__pill"
                                    key={project.id}
                                    title={project.role ?? undefined}
                                >
                                    {project.title}
                                </span>
                            )
                        )}
                    </div>
                )}
                {companies.length > 0 && (
                    <p className="lp-heap__card-companies">
                        <span className="lp-heap__card-label">
                            {t.team.experienceLabel}
                        </span>
                        {companies.map((c) => c.name).join(' · ')}
                    </p>
                )}
                {links.length > 0 && (
                    <div className="lp-heap__card-links">
                        {links.map((link) => {
                            const Mark = linkMarkMap[link.label];
                            return (
                                <a
                                    key={link.label}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`${member.name} on ${link.label}`}
                                >
                                    {Mark ? <Mark /> : <span>{link.label}</span>}
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export interface TeamBubblesProps {
    team?: CmsTeamMember[] | null;
    projects?: CmsProject[] | null;
}

const TeamBubbles: React.FC<TeamBubblesProps> = (props) => {
    const { data: team, loading } = useCmsCollection<CmsTeamMember>(
        'team',
        { depth: '2', sort: '_order' },
        props.team
    );
    const { data: projects } = useCmsCollection<CmsProject>(
        'projects',
        { depth: '3' },
        props.projects
    );
    const { t } = useLanguage();
    const narrow = useNarrow();
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const members = useMemo(
        () => (team ?? []).filter((m) => m.category !== 'adviser'),
        [team]
    );
    const projectIndex = useMemo(
        () => buildProjectIndex(projects ?? []),
        [projects]
    );
    // A phone gets a rounder heap; a wide screen gets a flatter one, so the
    // cluster fills the column it is given instead of leaving big gutters.
    const heap = useMemo(
        () => packHeap(members.length, narrow ? 0.995 : 0.972),
        [members.length, narrow]
    );

    const selected = members.find((m) => m.id === selectedId) ?? null;
    const cardRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!selectedId || !cardRef.current) return;
        cardRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    }, [selectedId]);

    // Numbers that come straight out of the CMS — no new fields, nothing to
    // keep in sync by hand.
    const companyCount = useMemo(() => {
        const ids = new Set<number>();
        for (const m of members)
            for (const c of populatedCompanies(m)) ids.add(c.id);
        return ids.size;
    }, [members]);
    const stats = [
        { value: String(members.length), label: t.team.statMembers },
        { value: String((projects ?? []).length), label: t.team.statProjects },
        { value: String(companyCount), label: t.team.statCompanies },
    ];

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

                    {!loading && members.length > 0 && (
                        <>
                            <motion.div
                                className="lp-heap__stats"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: 0.08 }}
                            >
                                {stats.map((stat) => (
                                    <div
                                        className="lp-heap__stat"
                                        key={stat.label}
                                    >
                                        <span className="lp-heap__stat-value">
                                            {stat.value}
                                        </span>
                                        <span className="lp-heap__stat-label">
                                            {stat.label}
                                        </span>
                                    </div>
                                ))}
                                <Link className="lp-heap__join" href="/join">
                                    {t.team.joinTileHint} →
                                </Link>
                            </motion.div>

                            <div
                                className={`lp-heap${
                                    selected ? ' has-selection' : ''
                                }`}
                                style={{ aspectRatio: String(heap.aspect) }}
                            >
                                {members.map((member, i) => {
                                    const spot = heap.placed[i];
                                    const img = mediaUrl(member.image);
                                    const isSelected = member.id === selectedId;
                                    return (
                                        <motion.div
                                            key={member.id}
                                            className="lp-heap__slot"
                                            style={{
                                                left: `${spot.left}%`,
                                                top: `${spot.top}%`,
                                                width: `${spot.size}%`,
                                            }}
                                            initial={{ opacity: 0, scale: 0.6 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                duration: 0.4,
                                                delay: Math.min(i * 0.04, 0.4),
                                            }}
                                        >
                                            <button
                                                type="button"
                                                className={`lp-heap__bubble${
                                                    isSelected
                                                        ? ' is-selected'
                                                        : ''
                                                }`}
                                                aria-pressed={isSelected}
                                                onClick={() =>
                                                    setSelectedId(
                                                        isSelected
                                                            ? null
                                                            : member.id
                                                    )
                                                }
                                            >
                                                {img ? (
                                                    <img
                                                        src={img}
                                                        alt={member.name}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <span className="lp-heap__initials">
                                                        {initials(member.name)}
                                                    </span>
                                                )}
                                                <span className="lp-heap__caption">
                                                    {member.name}
                                                </span>
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {selected && (
                                <DetailCard
                                    key={selected.id}
                                    cardRef={cardRef}
                                    member={selected}
                                    projects={
                                        projectIndex.get(selected.id) ?? []
                                    }
                                    onClose={() => setSelectedId(null)}
                                />
                            )}
                        </>
                    )}
                    {loading && <p className="lp-loading">Loading…</p>}
                </div>
            </div>
            <ClosingCta />
        </div>
    );
};

export default TeamBubbles;
