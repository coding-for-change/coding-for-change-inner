import Landing from '@/components/showcase/Landing';
import { fetchCollection } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type {
    CmsEvent,
    CmsProject,
    CmsSponsor,
    CmsFaqItem,
    CmsBlogPost,
} from '@/api/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const locale = await getServerLocale();
    const [events, projects, sponsors, faq, blog] = await Promise.all([
        fetchCollection<CmsEvent>('events', locale),
        fetchCollection<CmsProject>('projects', locale),
        fetchCollection<CmsSponsor>('sponsors', locale),
        fetchCollection<CmsFaqItem>('faq', locale),
        fetchCollection<CmsBlogPost>('blog-posts', locale, {
            depth: '2',
            sort: '-publishedAt',
            limit: '3',
        }),
    ]);
    return (
        <Landing
            events={events}
            projects={projects}
            sponsors={sponsors}
            faq={faq}
            blog={blog}
        />
    );
}
