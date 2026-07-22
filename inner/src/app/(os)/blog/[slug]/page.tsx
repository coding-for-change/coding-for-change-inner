import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogArticle from '@/components/showcase/BlogArticle';
import { fetchPostBySlug } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const locale = await getServerLocale();
    const post = await fetchPostBySlug(slug, locale);
    if (!post) return { title: 'Article not found — Coding for Change' };
    return {
        title: `${post.title} — Coding for Change`,
        description: post.excerpt,
        openGraph: {
            type: 'article',
            title: post.title,
            description: post.excerpt,
            images: post.featuredImage?.url ? [post.featuredImage.url] : undefined,
        },
    };
}

// ponytail: blog is unlisted for now — flip to true to bring it back.
const BLOG_PUBLIC: boolean = false;

export default async function BlogArticlePage({ params }: Params) {
    if (!BLOG_PUBLIC) notFound();
    const { slug } = await params;
    const locale = await getServerLocale();
    const post = await fetchPostBySlug(slug, locale);
    if (!post) notFound();
    // `!`: the unconditional notFound() above makes this unreachable, which
    // stops TS narrowing `post` via the guard; harmless once it's reachable.
    return <BlogArticle post={post!} />;
}
