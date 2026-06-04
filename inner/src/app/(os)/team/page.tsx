import Team from '@/components/showcase/Team';
import { fetchCollection } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsTeamMember, CmsCompany } from '@/api/types';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Team — Coding for Change',
    description: 'Meet the students behind Coding for Change.',
};

export default async function TeamPage() {
    const locale = await getServerLocale();
    const [team, companies] = await Promise.all([
        fetchCollection<CmsTeamMember>('team', locale),
        fetchCollection<CmsCompany>('companies', locale),
    ]);
    return <Team team={team} companies={companies} />;
}
