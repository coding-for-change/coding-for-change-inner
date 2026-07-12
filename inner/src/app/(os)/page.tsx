import Landing from '@/components/showcase/Landing';
import { fetchCollection } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsProject, CmsSponsor, CmsFaqItem } from '@/api/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const locale = await getServerLocale();
    const [projects, sponsors, faq] = await Promise.all([
        fetchCollection<CmsProject>('projects', locale),
        fetchCollection<CmsSponsor>('sponsors', locale),
        fetchCollection<CmsFaqItem>('faq', locale),
    ]);
    return (
        <Landing
            projects={projects}
            sponsors={sponsors}
            faq={faq}
        />
    );
}
