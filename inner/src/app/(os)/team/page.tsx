import Team from '@/components/showcase/Team';
import { fetchCollection } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsTeamMember } from '@/api/types';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Team — Coding for Change',
    description: 'Meet the students behind Coding for Change.',
};

export default async function TeamPage() {
    const locale = await getServerLocale();
    // depth=2 so each member's `companies` relationship is populated to full
    // docs (and the companies' logos resolved) for the hover logo reveal.
    const team = await fetchCollection<CmsTeamMember>('team', locale, {
        depth: '2',
    });
    return <Team team={team} />;
}
