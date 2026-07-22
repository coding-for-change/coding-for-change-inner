import { notFound } from 'next/navigation';
import Blog from '@/components/showcase/Blog';
import { fetchCollection } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsBlogPost } from '@/api/types';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Blog — Coding for Change',
    description: 'News and stories from Coding for Change.',
};

// ponytail: blog is unlisted for now — flip to true to bring it back.
const BLOG_PUBLIC: boolean = false;

export default async function BlogPage() {
    if (!BLOG_PUBLIC) notFound();
    const locale = await getServerLocale();
    const posts = await fetchCollection<CmsBlogPost>('blog-posts', locale, {
        depth: '2',
    });
    return <Blog posts={posts} />;
}
