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

export default async function BlogArticlePage({ params }: Params) {
    const { slug } = await params;
    const locale = await getServerLocale();
    const post = await fetchPostBySlug(slug, locale);
    if (!post) notFound();
    return <BlogArticle post={post} />;
}
