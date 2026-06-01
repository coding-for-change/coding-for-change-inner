import ProjectsContent from '@/components/showcase/CFCProjects'
import { fetchCollection } from '@/lib/cms'
import { CmsProject } from '@/api/types'
export default async function ProjectsPage() {
  const projects = await fetchCollection<CmsProject>('projects')
  return <ProjectsContent projects={projects} />
}
