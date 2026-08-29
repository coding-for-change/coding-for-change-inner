import Team from '@/components/showcase/TeamBubbles';
import { fetchCollection } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsTeamMember, CmsProject } from '@/api/types';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Team — Coding for Change',
    description: 'Meet the students behind Coding for Change.',
};

export default async function TeamPage() {
    const locale = await getServerLocale();
    // depth=2 so each member's `companies` relationship is populated to full
    // docs (and the companies' logos resolved) for the hover logo reveal.
    // sort by `_order` (the drag-and-drop position set in the CMS admin) so the
    // page reflects the editor's chosen order rather than newest-first.
    // depth=3 resolves each case study's `team` block down to full member docs,
    // which is where the Team page reads project affiliation from.
    const [team, projects] = await Promise.all([
        fetchCollection<CmsTeamMember>('team', locale, {
            depth: '2',
            sort: '_order',
        }),
        fetchCollection<CmsProject>('projects', locale, { depth: '3' }),
    ]);
    return <Team team={team} projects={projects} />;
}
