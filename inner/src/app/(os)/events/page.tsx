import EventsContent from '@/components/showcase/Events'
import { fetchCollection } from '@/lib/cms'
import { CmsEvent } from '@/api/types'
export default async function EventsPage() {
  const events = await fetchCollection<CmsEvent>('events')
  return <EventsContent events={events} />
}
