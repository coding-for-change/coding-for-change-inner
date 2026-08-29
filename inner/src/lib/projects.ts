import { mediaUrl } from '../api/client';
import type {
    CmsProject,
    CmsProjectTeamRow,
    CmsTeamMember,
} from '../api/types';

/** A person on a project, with the role they hold on it. */
export interface ProjectMember {
    member: CmsTeamMember;
    /** Role on this project; blank means "use the member's main role". */
    role?: string | null;
    /** Stable key for lists (the CMS row id). */
    id?: string | null;
}

/**
 * A project has a case-study detail page once it has a slug *and* some
 * case-study content (a headline, an impact highlight, or any body blocks).
 * A slug on its own isn't enough: a project can carry a team long before
 * anyone writes the case study, and linking to the empty page is worse than
 * not linking at all.
 */
export const hasCaseStudy = (p: CmsProject): boolean =>
    !!p.slug &&
    !!(p.impactHeadline || p.impact || (p.layout && p.layout.length > 0));

/** A project a person works on, seen from that person's side. */
export interface MemberProject {
    id: number;
    title: string;
    /** Set only when the project has a case study to link to. */
    slug?: string | null;
    role?: string | null;
    /** The project's `image` is the NGO partner's logo (Lebenshilfe, edunovo…). */
    logo?: string | null;
}

/** Keep only rows whose relationship actually populated (object, not a bare ID). */
const populated = (rows?: CmsProjectTeamRow[] | null): ProjectMember[] =>
    (rows ?? [])
        .filter((row) => row.member && typeof row.member === 'object')
        .map((row) => ({
            member: row.member as CmsTeamMember,
            role: row.role,
            id: row.id,
        }));

/**
 * Who works on a project.
 *
 * The assignment lives on the project itself (`team`), so a project carries its
 * team whether or not a case study has been written for it. Case studies
 * authored before that field existed kept their people inside the `team`
 * *block* instead — those still count, as a fallback, so nobody drops off the
 * Team page. A project-level list, once set, wins outright: it is the one place
 * an editor maintains.
 */
export const projectTeam = (project: CmsProject): ProjectMember[] => {
    const own = populated(project.team);
    if (own.length > 0) return own;
    for (const block of project.layout ?? []) {
        if (block.blockType !== 'team') continue;
        const legacy = populated(block.members);
        if (legacy.length > 0) return legacy;
    }
    return [];
};

/**
 * Invert the projects' team assignments into `memberId -> projects`, so the
 * Team page can show what each person works on without anyone maintaining a
 * second list.
 */
export const buildProjectIndex = (
    projects: CmsProject[]
): Map<number, MemberProject[]> => {
    const byMember = new Map<number, MemberProject[]>();
    for (const project of projects) {
        for (const { member, role } of projectTeam(project)) {
            const list = byMember.get(member.id) ?? [];
            if (!list.some((x) => x.id === project.id))
                list.push({
                    id: project.id,
                    title: project.title,
                    // Only a real case study gets a link; otherwise the badge
                    // is plain text (see `MemberProject.slug`).
                    slug: hasCaseStudy(project) ? project.slug : null,
                    role,
                    logo: mediaUrl(project.image),
                });
            byMember.set(member.id, list);
        }
    }
    return byMember;
};
