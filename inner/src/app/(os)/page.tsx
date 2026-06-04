import Landing from '@/components/showcase/Landing';
import { fetchCollection } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsEvent, CmsProject, CmsSponsor, CmsFaqItem } from '@/api/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const locale = await getServerLocale();
    const [events, projects, sponsors, faq] = await Promise.all([
        fetchCollection<CmsEvent>('events', locale),
        fetchCollection<CmsProject>('projects', locale),
        fetchCollection<CmsSponsor>('sponsors', locale),
        fetchCollection<CmsFaqItem>('faq', locale),
    ]);
    return (
        <Landing
            events={events}
            projects={projects}
            sponsors={sponsors}
            faq={faq}
        />
    );
}
