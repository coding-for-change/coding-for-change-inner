import SponsorsContent from '@/components/showcase/Sponsors'
import { fetchCollection } from '@/lib/cms'
import { CmsSponsor } from '@/api/types'
export default async function SponsorsPage() {
  const sponsors = await fetchCollection<CmsSponsor>('sponsors')
  return <SponsorsContent sponsors={sponsors} />
}
