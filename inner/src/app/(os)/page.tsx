import Landing from '@/components/showcase/Landing';
import { fetchCollection, fetchGlobal } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type {
    CmsEvent,
    CmsProject,
    CmsSponsor,
    CmsFaqItem,
    CmsBlogPost,
    CmsHomepage,
} from '@/api/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const locale = await getServerLocale();
    const [events, projects, sponsors, faq, blog, homepage] = await Promise.all([
        fetchCollection<CmsEvent>('events', locale),
        fetchCollection<CmsProject>('projects', locale),
        fetchCollection<CmsSponsor>('sponsors', locale, { depth: '1' }),
        fetchCollection<CmsFaqItem>('faq', locale),
        fetchCollection<CmsBlogPost>('blog-posts', locale, {
            depth: '2',
            sort: '-publishedAt',
            limit: '3',
        }),
        fetchGlobal<CmsHomepage>('homepage', locale),
    ]);
    return (
        <Landing
            events={events}
            projects={projects}
            sponsors={sponsors}
            faq={faq}
            blog={blog}
            homepage={homepage}
        />
    );
}
