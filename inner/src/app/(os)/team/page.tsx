import TeamContent from '@/components/showcase/Team'
import { fetchCollection } from '@/lib/cms'
import { CmsTeamMember } from '@/api/types'
export default async function TeamPage() {
  const members = await fetchCollection<CmsTeamMember>('team')
  return <TeamContent members={members} />
}
