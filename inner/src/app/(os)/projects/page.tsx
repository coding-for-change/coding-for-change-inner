import ProjectsList from '@/components/showcase/ProjectsList';
import { fetchCollection } from '@/lib/cms';
import { getServerLocale } from '@/lib/locale';
import type { CmsProject } from '@/api/types';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Projects — Coding for Change',
    description:
        'Real, production software built by student teams for Munich non-profits. Explore our case studies.',
};

export default async function ProjectsPage() {
    const locale = await getServerLocale();
    const projects = await fetchCollection<CmsProject>('projects', locale, {
        depth: '2',
    });
    return <ProjectsList projects={projects} />;
}
