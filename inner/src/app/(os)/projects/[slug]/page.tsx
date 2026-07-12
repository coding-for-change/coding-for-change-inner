import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectCaseStudy from '@/components/showcase/ProjectCaseStudy';
import { fetchProjectBySlug } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const locale = await getServerLocale();
    const project = await fetchProjectBySlug(slug, locale);
    if (!project) return { title: 'Project not found — Coding for Change' };
    return {
        title: `${project.title} — Coding for Change`,
        description: project.impact || project.description,
        openGraph: {
            type: 'article',
            title: project.title,
            description: project.impact || project.description,
            images: project.image?.url ? [project.image.url] : undefined,
        },
    };
}

export default async function ProjectDetailPage({ params }: Params) {
    const { slug } = await params;
    const locale = await getServerLocale();
    const project = await fetchProjectBySlug(slug, locale);
    if (!project) notFound();
    return <ProjectCaseStudy project={project} />;
}
