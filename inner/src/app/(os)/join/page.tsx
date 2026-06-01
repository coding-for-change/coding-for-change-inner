import BecomeAMember from '@/components/showcase/BecomeAMember'
import { fetchGlobal } from '@/lib/cms'
import { CmsMembership } from '@/api/types'
export default async function JoinPage() {
  const membership = await fetchGlobal<CmsMembership>('membership')
  return <BecomeAMember membership={membership} />
}
