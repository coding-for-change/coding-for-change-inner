import Landing from '@/components/showcase/Landing';
import { fetchCollection, fetchGlobal } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type {
    CmsEvent,
    CmsProject,
    CmsSponsor,
    CmsFaqItem,
    CmsHomepage,
} from '@/api/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const locale = await getServerLocale();
    const [events, projects, sponsors, faq, homepage] = await Promise.all([
        fetchCollection<CmsEvent>('events', locale),
        fetchCollection<CmsProject>('projects', locale),
        fetchCollection<CmsSponsor>('sponsors', locale, { depth: '1' }),
        fetchCollection<CmsFaqItem>('faq', locale),
        fetchGlobal<CmsHomepage>('homepage', locale),
    ]);
    return (
        <Landing
            events={events}
            projects={projects}
            sponsors={sponsors}
            faq={faq}
            homepage={homepage}
        />
    );
}
