import QAContent from '@/components/showcase/QA'
import { fetchCollection } from '@/lib/cms'
import { CmsFaqItem } from '@/api/types'
export default async function QAPage() {
  const faq = await fetchCollection<CmsFaqItem>('faq')
  return <QAContent faq={faq} />
}
