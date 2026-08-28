'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCmsCollection, useSiteConfig, mediaUrl } from '../../api';
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
    /** The project's `image` is the NGO partner's logo (Lebenshilfe, edunovo…). */
    logo?: string | null;
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
                        logo: mediaUrl(project.image),
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

/**
 * One member's circle in the simulation. Coordinates are "world units" where
 * 1 = a nominal bubble diameter, centred on the origin; the renderer maps them
 * to pixels against whatever width the container happens to have.
 */
interface Node {
    x: number;
    y: number;
    /** Position at the top of the frame, for measuring net movement. */
    px: number;
    py: number;
    /** Current radius, eased toward `targetR` so growth pushes neighbours. */
    r: number;
    targetR: number;
    baseR: number;
}

interface Seed {
    nodes: Node[];
    worldW: number;
    worldH: number;
}

/** Deterministic 0..1 from an index — the seed has to match on server and client. */
const noise = (i: number, salt: number) => {
    const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
    return x - Math.floor(x);
};

const STEP_X = 1.1;
const STEP_Y = 0.94;
/** How much a bubble grows when hovered / picked, which is what shoves the rest. */
const HOVER_GROWTH = 1.14;
const SELECT_GROWTH = 1.42;
/** Headroom around the resting cluster so a grown bubble has somewhere to go. */
const WORLD_PAD = 0.55;

const COLLIDE_PAD = 0.05;
/** Share of an overlap corrected per frame. Below 1 so separation eases in. */
const COLLIDE_STRENGTH = 0.42;
const CENTER_PULL = 0.022;
const RADIUS_EASE = 0.14;
/**
 * Below this net movement per frame the cluster is settled. It cannot go to
 * zero: at equilibrium the centre pull and the separation alternate, leaving a
 * residual around 0.004/frame, so the threshold sits above that floor. A grown
 * bubble drops under it about 75 frames (~1.2s) after it starts moving.
 */
const REST = 0.008;
/** Hard stop, so a parameter change can never leave the loop spinning. */
const MAX_FRAMES = 600;

/**
 * Row lengths tracing the chord of a circle at each height, so the cluster
 * starts out roughly round — 11 people seed as 2 / 4 / 3 / 2. This is only the
 * starting arrangement; the simulation loosens it from there.
 */
const discRows = (count: number): number[] => {
    if (count <= 3) return [count];
    const rows = Math.max(2, Math.round(Math.sqrt(count / 0.82)));
    const exact = Array.from({ length: rows }, (_, i) => {
        const y = ((i + 0.5) / rows) * 2 - 1;
        return Math.sqrt(Math.max(0, 1 - y * y));
    });
    const total = exact.reduce((a, b) => a + b, 0);
    for (let i = 0; i < rows; i++) exact[i] = (exact[i] / total) * count;

    const sizes = exact.map((v) => Math.max(1, Math.floor(v)));
    let left = count - sizes.reduce((a, b) => a + b, 0);
    const byRemainder = [...exact.keys()].sort(
        (a, b) =>
            exact[b] - Math.floor(exact[b]) - (exact[a] - Math.floor(exact[a]))
    );
    for (let i = 0; left > 0; i = (i + 1) % rows, left -= 1)
        sizes[byRemainder[i]] += 1;
    for (let i = 0; left < 0; i = (i + 1) % rows, left += 1) {
        const row = byRemainder[rows - 1 - (i % rows)];
        if (sizes[row] > 1) sizes[row] -= 1;
        else left -= 1;
    }
    return sizes;
};

/**
 * Seed the cluster: disc rows for the overall round shape, then per-bubble
 * jitter and a radius wobble so it reads as settled rather than set out. A
 * pure grid looked rigid; a pure scatter looked accidental — this is the grid
 * with the edges knocked off, and the simulation does the rest.
 */
const seedCluster = (count: number): Seed => {
    const rows = discRows(count);
    const widest = Math.max(...rows, 1);
    const restW = (widest - 1) * STEP_X + 1;
    const restH = (rows.length - 1) * STEP_Y + 1;
    const nodes: Node[] = [];
    let i = 0;
    rows.forEach((inRow, rowIndex) => {
        for (let col = 0; col < inRow; col++, i++) {
            const r = 0.5 * (0.88 + 0.24 * noise(i, 1));
            nodes.push({
                x:
                    (col - (inRow - 1) / 2) * STEP_X +
                    (noise(i, 2) - 0.5) * 0.22,
                y:
                    (rowIndex - (rows.length - 1) / 2) * STEP_Y +
                    (noise(i, 3) - 0.5) * 0.2,
                px: 0,
                py: 0,
                r,
                targetR: r,
                baseR: r,
            });
        }
    });
    return {
        nodes,
        worldW: restW + WORLD_PAD,
        worldH: restH + WORLD_PAD,
    };
};

/**
 * Advance the soft-body cluster one frame: ease each radius toward its target,
 * separate overlapping pairs, pull everything gently back to the centre.
 *
 * Corrections are applied straight to position rather than as impulses on a
 * velocity. Velocities gave every nudge a springy overshoot that read as the
 * whole cluster shivering; relaxing positions converges smoothly instead, and
 * the motion you see comes from the radius easing rather than from bounce.
 *
 * Returns the total movement, so the caller can stop once it settles.
 */
const stepCluster = (nodes: Node[]): number => {
    for (const n of nodes) {
        n.r += (n.targetR - n.r) * RADIUS_EASE;
        n.px = n.x;
        n.py = n.y;
    }

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            let dx = b.x - a.x;
            let dy = b.y - a.y;
            let dist = Math.hypot(dx, dy);
            if (dist < 1e-4) {
                dx = 1e-3;
                dy = 0;
                dist = 1e-3;
            }
            const min = a.r + b.r + COLLIDE_PAD;
            if (dist < min) {
                const shift = (((min - dist) / dist) * COLLIDE_STRENGTH) / 2;
                a.x -= dx * shift;
                a.y -= dy * shift;
                b.x += dx * shift;
                b.y += dy * shift;
            }
        }
    }

    // Net movement over the whole frame, not the size of the forces: at rest
    // the centre pull and the separation cancel each other exactly, so summing
    // force magnitudes never converges and the loop would spin forever.
    let motion = 0;
    for (const n of nodes) {
        n.x -= n.x * CENTER_PULL;
        // Slightly stronger vertically, which keeps the cluster from stretching
        // into a column as it grows.
        n.y -= n.y * CENTER_PULL * 1.15;
        motion +=
            Math.abs(n.x - n.px) +
            Math.abs(n.y - n.py) +
            Math.abs(n.targetR - n.r);
    }
    return motion;
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
                        {projects.map((project) => {
                            const inner = (
                                <>
                                    {project.logo && (
                                        <img
                                            className="lp-heap__pill-logo"
                                            src={project.logo}
                                            alt=""
                                        />
                                    )}
                                    <span>{project.title}</span>
                                </>
                            );
                            return project.slug ? (
                                <Link
                                    className="lp-heap__pill"
                                    href={`/projects/${project.slug}`}
                                    key={project.id}
                                    title={project.role ?? undefined}
                                >
                                    {inner}
                                </Link>
                            ) : (
                                <span
                                    className="lp-heap__pill"
                                    key={project.id}
                                    title={project.role ?? undefined}
                                >
                                    {inner}
                                </span>
                            );
                        })}
                    </div>
                )}
                {companies.length > 0 && (
                    <div className="lp-heap__card-companies">
                        <span className="lp-heap__card-label">
                            {t.team.experienceLabel}
                        </span>
                        <span className="lp-heap__logos">
                            {companies.map((company) => {
                                const logo = mediaUrl(company.logo);
                                return logo ? (
                                    <img
                                        className="lp-heap__logo"
                                        key={company.id}
                                        src={logo}
                                        alt={company.name}
                                        title={company.name}
                                    />
                                ) : (
                                    <span
                                        className="lp-heap__logo-name"
                                        key={company.id}
                                    >
                                        {company.name}
                                    </span>
                                );
                            })}
                        </span>
                    </div>
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
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const members = useMemo(
        () => (team ?? []).filter((m) => m.category !== 'adviser'),
        [team]
    );
    const projectIndex = useMemo(
        () => buildProjectIndex(projects ?? []),
        [projects]
    );
    // The resting arrangement. The simulation starts here and takes over on
    // mount; this is also what the server renders, so the markup is stable.
    const seed = useMemo(() => seedCluster(members.length), [members.length]);

    const heapRef = useRef<HTMLDivElement>(null);
    const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const simRef = useRef<Node[]>([]);
    const hoverRef = useRef<number | null>(null);
    const selectedIndexRef = useRef<number | null>(null);
    const frameRef = useRef<number | null>(null);

    const selected = members.find((m) => m.id === selectedId) ?? null;
    const cardRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!selectedId || !cardRef.current) return;
        cardRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    }, [selectedId]);

    // ---- Soft-body cluster -------------------------------------------------
    // Positions are written straight to the DOM rather than through state: at
    // 60fps a React render per frame would be pure waste, and nothing else on
    // the page needs to know where a bubble currently is.
    const paint = React.useCallback(() => {
        const box = heapRef.current;
        if (!box) return;
        const width = box.clientWidth;
        if (!width) return;
        const scale = width / seed.worldW;
        const originX = width / 2;
        const originY = (seed.worldH * scale) / 2;
        simRef.current.forEach((n, i) => {
            const el = slotRefs.current[i];
            if (!el) return;
            const size = n.r * 2 * scale;
            el.style.width = `${size}px`;
            el.style.left = `${originX + n.x * scale - size / 2}px`;
            el.style.top = `${originY + n.y * scale - size / 2}px`;
        });
    }, [seed.worldH, seed.worldW]);

    const settle = React.useCallback(() => {
        // Restart rather than bail out when a loop is already pending: bailing
        // meant one stale frame id (a cancelled frame, or a cleanup that ran
        // between React's double-invoked mounts) froze the cluster for good.
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
        // Reduced motion: jump straight to the settled arrangement rather than
        // animating the neighbours out of the way.
        if (
            typeof window !== 'undefined' &&
            window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        ) {
            for (let i = 0; i < 300; i++)
                if (stepCluster(simRef.current) <= REST) break;
            paint();
            return;
        }
        let frames = 0;
        const tick = () => {
            const motion = stepCluster(simRef.current);
            paint();
            frames += 1;
            if (motion > REST && frames < MAX_FRAMES) {
                frameRef.current = requestAnimationFrame(tick);
            } else {
                frameRef.current = null;
            }
        };
        frameRef.current = requestAnimationFrame(tick);
    }, [paint]);

    // Seed the simulation, then relax it once so the cluster is already settled
    // when it first paints instead of visibly shuffling into place.
    useEffect(() => {
        simRef.current = seed.nodes.map((n) => ({ ...n }));
        for (let i = 0; i < 300; i++)
            if (stepCluster(simRef.current) <= REST) break;
        paint();
        const box = heapRef.current;
        if (!box || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(paint);
        observer.observe(box);
        return () => observer.disconnect();
    }, [seed, paint]);

    useEffect(
        () => () => {
            if (frameRef.current !== null)
                cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        },
        []
    );

    // Growing a bubble is what pushes its neighbours out of the way, so hover
    // and selection are expressed as a change of radius, not a CSS transform.
    const retarget = React.useCallback(() => {
        simRef.current.forEach((n, i) => {
            const grow =
                selectedIndexRef.current === i
                    ? SELECT_GROWTH
                    : hoverRef.current === i
                      ? HOVER_GROWTH
                      : 1;
            n.targetR = n.baseR * grow;
        });
        settle();
    }, [settle]);

    useEffect(() => {
        const index = members.findIndex((m) => m.id === selectedId);
        selectedIndexRef.current = index >= 0 ? index : null;
        retarget();
    }, [selectedId, members, retarget]);

    // Edited in the CMS (SiteConfig → stats), not counted off this page. Only a
    // fraction of the club has a profile here, so a derived headcount would
    // under-report the club — it read 11 when there were 20 members.
    const stats = useSiteConfig().stats ?? [];

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
                                        key={stat.id ?? stat.label}
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
                                ref={heapRef}
                                className={`lp-heap${
                                    selected ? ' has-selection' : ''
                                }`}
                                style={{
                                    aspectRatio: String(
                                        seed.worldW / seed.worldH
                                    ),
                                    maxWidth: `${Math.min(
                                        560,
                                        Math.round(seed.worldW * 128)
                                    )}px`,
                                }}
                            >
                                {members.map((member, i) => {
                                    const node = seed.nodes[i];
                                    const img = mediaUrl(member.image);
                                    const isSelected = member.id === selectedId;
                                    // Server-rendered fallback position; the
                                    // simulation overwrites these on mount.
                                    const size =
                                        ((node.r * 2) / seed.worldW) * 100;
                                    return (
                                        <div
                                            key={member.id}
                                            ref={(el) => {
                                                slotRefs.current[i] = el;
                                            }}
                                            className="lp-heap__slot"
                                            style={{
                                                width: `${size}%`,
                                                left: `${
                                                    ((node.x + seed.worldW / 2) /
                                                        seed.worldW) *
                                                        100 -
                                                    size / 2
                                                }%`,
                                                top: `${
                                                    ((node.y + seed.worldH / 2) /
                                                        seed.worldH) *
                                                        100 -
                                                    (size * seed.worldW) /
                                                        seed.worldH /
                                                        2
                                                }%`,
                                            }}
                                            onMouseEnter={() => {
                                                hoverRef.current = i;
                                                retarget();
                                            }}
                                            onMouseLeave={() => {
                                                if (hoverRef.current === i)
                                                    hoverRef.current = null;
                                                retarget();
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
                                                onFocus={() => {
                                                    hoverRef.current = i;
                                                    retarget();
                                                }}
                                                onBlur={() => {
                                                    if (hoverRef.current === i)
                                                        hoverRef.current = null;
                                                    retarget();
                                                }}
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
                                        </div>
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
